import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  z: number; // depth scale 0.6 - 1.2
  vx: number;
  vy: number;
  angle: number;
  targetAngle: number;
  wingAngle: number;
  wingSpeed: number;
  wingColorFore: string;
  wingColorHind: string;
  wingColorEdge: string;
  glowColor: string;
  size: number;
  orbitCenter?: { x: number; y: number; radius: number; angle: number; speed: number };
  behavior: 'circling' | 'sweeping' | 'fluttering' | 'gliding';
  flightTime: number;
  departureDir: { x: number; y: number };
  departureDelay: number;
}

export const ButterflyEntrance: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Respect reduced-motion accessibility preference
    if (typeof window !== 'undefined') {
      try {
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          return;
        }

        // 2. Play once per browsing session
        let alreadyShown: string | null = null;
        try {
          alreadyShown = sessionStorage.getItem('tbc_butterfly_entrance_shown');
        } catch {
          alreadyShown = null;
        }
        if (alreadyShown === 'true') {
          return;
        }

        // Mark as shown for this browsing session
        try {
          sessionStorage.setItem('tbc_butterfly_entrance_shown', 'true');
        } catch {
          // Ignore storage restrictions in embedded previews
        }
        setIsVisible(true);
      } catch {
        // Ignore matchMedia / storage errors
      }
    }
  }, []);

  // Allow manual replay through custom window event if ever needed for demonstration
  useEffect(() => {
    const handleReplay = () => {
      try {
        sessionStorage.removeItem('tbc_butterfly_entrance_shown');
      } catch {
        // Ignore storage errors
      }
      setIsVisible(true);
    };
    window.addEventListener('replay-butterfly-entrance', handleReplay);
    return () => window.removeEventListener('replay-butterfly-entrance', handleReplay);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    const particles: Particle[] = [];

    // Distinct palette matching The Book Clique branding:
    // Cream, soft champagne gold, brushed gold, warm amber, and subtle natural forest vein undertones
    const colors = [
      { fore: '#FDFBF7', hind: '#EFE5D0', edge: '#C5A059', glow: 'rgba(212, 175, 55, 0.45)' }, // Warm Champagne & Gold
      { fore: '#FAF6F0', hind: '#E8D4B4', edge: '#8C6D23', glow: 'rgba(197, 160, 89, 0.5)' },  // Cream & Warm Gold
      { fore: '#FFFDF9', hind: '#F5E6C8', edge: '#D4AF37', glow: 'rgba(245, 230, 200, 0.6)' }, // Soft Ivory & Radiant Gold
      { fore: '#F7F3E9', hind: '#DBC392', edge: '#143826', glow: 'rgba(197, 160, 89, 0.4)' },  // Cream & Forest Accent
      { fore: '#FFF8EC', hind: '#E8D19F', edge: '#B38B3F', glow: 'rgba(232, 209, 159, 0.55)' }, // Golden Amber Monarch
      { fore: '#FAF5ED', hind: '#DFCEAA', edge: '#8C6D23', glow: 'rgba(223, 206, 170, 0.45)' }, // Soft Silk Moth
      { fore: '#FDF8F0', hind: '#EAD7BA', edge: '#A88438', glow: 'rgba(212, 175, 55, 0.5)' },  // Warm Vanilla Gold
    ];

    // Initial butterfly configurations: 7 distinct butterflies
    // Butterfly 1 & 2: Pair circling around each other in a graceful spiral
    // Butterfly 3: Sweeping across mid-screen
    // Butterfly 4: High altitude, fast flutter
    // Butterfly 5: Graceful swooping glide
    // Butterfly 6: Fluttering loop & ascent
    // Butterfly 7: Large foreground butterfly crossing with depth
    const butterflies: Butterfly[] = [
      {
        id: 1,
        x: width * 0.2,
        y: height * 0.5,
        z: 1.0,
        vx: 1.8,
        vy: -0.5,
        angle: 0,
        targetAngle: 0,
        wingAngle: 0,
        wingSpeed: 0.22,
        wingColorFore: colors[0].fore,
        wingColorHind: colors[0].hind,
        wingColorEdge: colors[0].edge,
        glowColor: colors[0].glow,
        size: 32,
        behavior: 'circling',
        orbitCenter: { x: width * 0.45, y: height * 0.42, radius: 110, angle: 0, speed: 0.028 },
        flightTime: 0,
        departureDir: { x: 1.8, y: -1.2 },
        departureDelay: 4.6
      },
      {
        id: 2,
        x: width * 0.25,
        y: height * 0.55,
        z: 0.9,
        vx: 1.6,
        vy: -0.4,
        angle: 0,
        targetAngle: 0,
        wingAngle: Math.PI * 0.5,
        wingSpeed: 0.25,
        wingColorFore: colors[1].fore,
        wingColorHind: colors[1].hind,
        wingColorEdge: colors[1].edge,
        glowColor: colors[1].glow,
        size: 28,
        behavior: 'circling',
        orbitCenter: { x: width * 0.45, y: height * 0.42, radius: 95, angle: Math.PI, speed: 0.028 },
        flightTime: 0,
        departureDir: { x: 1.5, y: -1.6 },
        departureDelay: 4.8
      },
      {
        id: 3,
        x: -40,
        y: height * 0.75,
        z: 1.15,
        vx: 3.2,
        vy: -1.8,
        angle: -0.4,
        targetAngle: -0.4,
        wingAngle: 0.2,
        wingSpeed: 0.28,
        wingColorFore: colors[2].fore,
        wingColorHind: colors[2].hind,
        wingColorEdge: colors[2].edge,
        glowColor: colors[2].glow,
        size: 36,
        behavior: 'sweeping',
        flightTime: 0,
        departureDir: { x: 2.5, y: -2.0 },
        departureDelay: 4.2
      },
      {
        id: 4,
        x: width * 0.1,
        y: -30,
        z: 0.75,
        vx: 2.2,
        vy: 1.5,
        angle: 0.5,
        targetAngle: 0.5,
        wingAngle: 0.7,
        wingSpeed: 0.32,
        wingColorFore: colors[3].fore,
        wingColorHind: colors[3].hind,
        wingColorEdge: colors[3].edge,
        glowColor: colors[3].glow,
        size: 24,
        behavior: 'fluttering',
        flightTime: 0,
        departureDir: { x: 2.0, y: 1.8 },
        departureDelay: 4.0
      },
      {
        id: 5,
        x: width + 50,
        y: height * 0.35,
        z: 1.05,
        vx: -2.8,
        vy: 0.8,
        angle: Math.PI + 0.3,
        targetAngle: Math.PI + 0.3,
        wingAngle: 0.4,
        wingSpeed: 0.24,
        wingColorFore: colors[4].fore,
        wingColorHind: colors[4].hind,
        wingColorEdge: colors[4].edge,
        glowColor: colors[4].glow,
        size: 33,
        behavior: 'gliding',
        flightTime: 0,
        departureDir: { x: -2.8, y: -1.4 },
        departureDelay: 4.5
      },
      {
        id: 6,
        x: width * 0.85,
        y: height + 40,
        z: 0.85,
        vx: -1.5,
        vy: -2.5,
        angle: -2.0,
        targetAngle: -2.0,
        wingAngle: 0.9,
        wingSpeed: 0.27,
        wingColorFore: colors[5].fore,
        wingColorHind: colors[5].hind,
        wingColorEdge: colors[5].edge,
        glowColor: colors[5].glow,
        size: 27,
        behavior: 'fluttering',
        flightTime: 0,
        departureDir: { x: -1.8, y: -2.2 },
        departureDelay: 4.4
      },
      {
        id: 7,
        x: width * 0.05,
        y: height * 0.6,
        z: 1.25,
        vx: 2.0,
        vy: -0.8,
        angle: -0.3,
        targetAngle: -0.3,
        wingAngle: 0.1,
        wingSpeed: 0.21,
        wingColorFore: colors[6].fore,
        wingColorHind: colors[6].hind,
        wingColorEdge: colors[6].edge,
        glowColor: colors[6].glow,
        size: 38,
        behavior: 'gliding',
        flightTime: 0,
        departureDir: { x: 2.8, y: 0.6 },
        departureDelay: 5.0
      }
    ];

    // Helper: draw single butterfly
    const drawButterfly = (b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.scale(b.z, b.z);

      // Flap factor: between 0.1 (folded) and 1.0 (flat open)
      const flap = Math.abs(Math.sin(b.wingAngle));
      const wingScaleX = 0.15 + 0.85 * flap;

      // Soft magical glow aura
      ctx.shadowBlur = 12 * b.z;
      ctx.shadowColor = b.glowColor;

      // Wing dimensions
      const span = b.size;
      const length = b.size * 0.85;

      // Draw Left Wings
      ctx.save();
      ctx.scale(-wingScaleX, 1);
      drawWingSet(ctx, span, length, b.wingColorFore, b.wingColorHind, b.wingColorEdge);
      ctx.restore();

      // Draw Right Wings
      ctx.save();
      ctx.scale(wingScaleX, 1);
      drawWingSet(ctx, span, length, b.wingColorFore, b.wingColorHind, b.wingColorEdge);
      ctx.restore();

      // Draw Butterfly Body & Antennae
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(20, 56, 38, 0.4)';
      ctx.fillStyle = '#1D2A21'; // Deep forest bronze body

      // Thorax & Abdomen
      ctx.beginPath();
      ctx.ellipse(0, 0, 2.2, length * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0, -length * 0.44, 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Delicate Antennae with golden tips
      ctx.strokeStyle = '#8C6D23';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-0.5, -length * 0.44);
      ctx.quadraticCurveTo(-4, -length * 0.65, -6, -length * 0.68);
      ctx.moveTo(0.5, -length * 0.44);
      ctx.quadraticCurveTo(4, -length * 0.65, 6, -length * 0.68);
      ctx.stroke();

      // Antenna tips
      ctx.fillStyle = '#C5A059';
      ctx.beginPath();
      ctx.arc(-6, -length * 0.68, 1.2, 0, Math.PI * 2);
      ctx.arc(6, -length * 0.68, 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: draw realistic layered forewing & hindwing
    const drawWingSet = (
      c: CanvasRenderingContext2D,
      span: number,
      len: number,
      foreColor: string,
      hindColor: string,
      edgeColor: string
    ) => {
      // 1. Forewing (Upper large wing)
      c.beginPath();
      c.moveTo(0, -len * 0.2);
      c.bezierCurveTo(span * 0.4, -len * 0.9, span * 0.95, -len * 0.75, span * 0.95, -len * 0.2);
      c.bezierCurveTo(span * 0.95, len * 0.15, span * 0.45, len * 0.25, 0, 0);
      c.closePath();

      const foreGrad = c.createRadialGradient(span * 0.3, -len * 0.3, 2, span * 0.4, -len * 0.2, span);
      foreGrad.addColorStop(0, foreColor);
      foreGrad.addColorStop(0.7, hindColor);
      foreGrad.addColorStop(1, edgeColor);
      c.fillStyle = foreGrad;
      c.fill();

      c.strokeStyle = edgeColor;
      c.lineWidth = 0.8;
      c.stroke();

      // Subtle wing vein tracery
      c.strokeStyle = 'rgba(140, 109, 35, 0.35)';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(0, -len * 0.2);
      c.quadraticCurveTo(span * 0.4, -len * 0.3, span * 0.85, -len * 0.5);
      c.moveTo(0, -len * 0.1);
      c.quadraticCurveTo(span * 0.5, -len * 0.1, span * 0.85, -len * 0.15);
      c.moveTo(0, 0);
      c.quadraticCurveTo(span * 0.4, len * 0.1, span * 0.7, len * 0.15);
      c.stroke();

      // 2. Hindwing (Lower rounded wing)
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(span * 0.5, len * 0.15, span * 0.8, len * 0.5, span * 0.6, len * 0.85);
      c.bezierCurveTo(span * 0.4, len * 1.05, span * 0.15, len * 0.85, 0, len * 0.35);
      c.closePath();

      const hindGrad = c.createRadialGradient(span * 0.25, len * 0.4, 1, span * 0.3, len * 0.5, span * 0.8);
      hindGrad.addColorStop(0, foreColor);
      hindGrad.addColorStop(0.65, hindColor);
      hindGrad.addColorStop(1, edgeColor);
      c.fillStyle = hindGrad;
      c.fill();

      c.strokeStyle = edgeColor;
      c.lineWidth = 0.8;
      c.stroke();

      // Hindwing inner vein
      c.strokeStyle = 'rgba(140, 109, 35, 0.3)';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(0, len * 0.1);
      c.quadraticCurveTo(span * 0.3, len * 0.4, span * 0.5, len * 0.7);
      c.stroke();
    };

    // Helper: spawn sparkling dust particle from butterfly wingtips
    const spawnSparkles = (b: Butterfly) => {
      // Spawn 1-2 particles per frame per butterfly with probability
      if (Math.random() < 0.65) {
        const spread = b.size * 0.45;
        const offsetX = (Math.random() - 0.5) * spread;
        const offsetY = (Math.random() - 0.5) * spread;
        const sparkColors = [
          'rgba(245, 230, 200, ', // Champagne cream
          'rgba(197, 160, 89, ',  // Warm gold
          'rgba(212, 175, 55, ',  // Sunlit gold
          'rgba(255, 253, 245, '  // Pure shimmer
        ];
        const chosenColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];

        particles.push({
          x: b.x + offsetX,
          y: b.y + offsetY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.8 + 0.2, // gentle drift downwards
          size: (Math.random() * 2.2 + 1.0) * b.z,
          alpha: 0.9,
          maxAlpha: 0.9,
          decay: Math.random() * 0.02 + 0.015,
          color: chosenColor
        });
      }
    };

    let animationComplete = false;

    // Main Animation Loop
    const render = (now: number) => {
      const elapsedSeconds = (now - startTime) / 1000;

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      // Phase 1 (0s to 3.5s): Soft entrance & graceful flight around the screen
      // Phase 2 (3.5s to 5.5s): Butterflies begin dispersing gracefully in different directions
      // Phase 3 (5.5s to 7.0s): All butterflies have exited; fade trails & unmount
      const isDeparting = elapsedSeconds >= 3.2;

      let allOffscreen = true;

      // Update & Draw Butterflies
      butterflies.forEach((b) => {
        b.flightTime += 0.016;
        b.wingAngle += b.wingSpeed;

        if (isDeparting && elapsedSeconds >= b.departureDelay) {
          // Departure Phase: Fly away rapidly and smoothly in distinct trajectories
          b.vx += (b.departureDir.x * 3.8 - b.vx) * 0.04;
          b.vy += (b.departureDir.y * 3.8 - b.vy) * 0.04;
          b.targetAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        } else if (b.behavior === 'circling' && b.orbitCenter) {
          // Circular / spiral dancing around one another
          b.orbitCenter.angle += b.orbitCenter.speed;
          // Radius oscillates gently
          const currentRadius = b.orbitCenter.radius + Math.sin(b.flightTime * 2) * 20;
          const targetX = b.orbitCenter.x + Math.cos(b.orbitCenter.angle) * currentRadius;
          const targetY = b.orbitCenter.y + Math.sin(b.orbitCenter.angle) * (currentRadius * 0.65);

          // Center drifts slowly across screen
          b.orbitCenter.x += 0.4;
          b.orbitCenter.y += Math.sin(b.flightTime) * 0.3;

          const dx = targetX - b.x;
          const dy = targetY - b.y;
          b.vx += dx * 0.05;
          b.vy += dy * 0.05;
          b.vx *= 0.88;
          b.vy *= 0.88;
          b.targetAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        } else if (b.behavior === 'sweeping') {
          // Long sweeping arc across the screen
          b.vx += Math.sin(b.flightTime * 1.5) * 0.15;
          b.vy += Math.cos(b.flightTime * 1.2) * 0.12;
          b.targetAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        } else if (b.behavior === 'gliding') {
          // Smooth glide with occasional gentle flutter dips
          b.vx += Math.cos(b.flightTime) * 0.1;
          b.vy += Math.sin(b.flightTime * 1.4) * 0.18;
          b.targetAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        } else {
          // Natural fluttering wobble
          b.vx += (Math.random() - 0.5) * 0.6;
          b.vy += (Math.random() - 0.5) * 0.6;
          b.vx *= 0.94;
          b.vy *= 0.94;
          b.targetAngle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        }

        // Smooth angle interpolation towards velocity direction
        // Normalize angle differences
        let diff = b.targetAngle - b.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        b.angle += diff * 0.12;

        // Apply natural fluttering bobbing movement (perpendicular to flight path)
        const flutterBob = Math.sin(b.wingAngle * 2) * (1.2 * b.z);
        b.x += b.vx + Math.cos(b.angle) * flutterBob;
        b.y += b.vy + Math.sin(b.angle) * flutterBob;

        // Spawn glittering spark trail
        spawnSparkles(b);

        // Check if still visible on screen
        const margin = 120;
        if (
          b.x >= -margin &&
          b.x <= width + margin &&
          b.y >= -margin &&
          b.y <= height + margin
        ) {
          allOffscreen = false;
          drawButterfly(b);
        }
      });

      // Update & Draw Sparkling Trail Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
        ctx.fill();

        // Little diamond star sparkle on brightest particles
        if (p.alpha > 0.5 && p.size > 1.6) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.lineWidth = 0.6;
          const cross = p.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(p.x - cross, p.y);
          ctx.lineTo(p.x + cross, p.y);
          ctx.moveTo(p.x, p.y - cross);
          ctx.lineTo(p.x, p.y + cross);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Auto-cleanup condition:
      // If elapsed > 7s and all offscreen, or hard safety limit reached (15 seconds)
      if ((elapsedSeconds > 6.0 && allOffscreen && particles.length === 0) || elapsedSeconds >= 14.5) {
        animationComplete = true;
        setIsVisible(false);
        return;
      }

      if (!animationComplete) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    // Hard fallback timer: always cleanly close after 15 seconds
    const safetyTimer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      clearTimeout(safetyTimer);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none"
      style={{
        // Smooth transition out as animation completes
        transition: 'opacity 1.2s ease-out'
      }}
    >
      {/* Soft ethereal ambient glow backdrop that dissolves into the homepage */}
      <div className="absolute inset-0 bg-radial from-[#C5A059]/10 via-[#FAF6F0]/20 to-transparent pointer-events-none animate-in fade-in duration-1000" />

      {/* High performance 60fps Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Delicate literary branding watermarks during entrance */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-0 animate-[fadeInOut_5s_ease-in-out_forwards]">
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#8C6D23]/70 font-semibold drop-shadow-xs">
          Welcome to The Book Clique
        </span>
      </div>

      {/* Discrete Skip Option (accessible, non-intrusive) */}
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute bottom-4 right-4 pointer-events-auto px-3 py-1 rounded bg-[#143826]/75 hover:bg-[#143826] text-[#FAF6F0] text-[11px] font-sans font-semibold tracking-wider transition-opacity opacity-75 hover:opacity-100 backdrop-blur-xs shadow-xs cursor-pointer"
        aria-label="Skip entrance animation"
      >
        Skip &rarr;
      </button>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -8px); }
          25% { opacity: 0.85; transform: translate(-50%, 0); }
          75% { opacity: 0.85; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 6px); }
        }
      `}</style>
    </div>
  );
};

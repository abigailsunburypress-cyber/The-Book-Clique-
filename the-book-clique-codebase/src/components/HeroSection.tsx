import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookMarked, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

// High-quality collection of book-related photographs:
// Elegant libraries, beautiful bookshelves, stacks of books, readers enjoying books, cosy reading corners, and literary spaces.
const HERO_ROTATING_IMAGES = [
  {
    url: '/src/assets/images/hero_literary_atmosphere_1793101459242.jpg',
    alt: 'Quiet atmospheric library with warm oak bookshelves and reading armchair',
    title: 'Historic Archive & Library'
  },
  {
    url: '/src/assets/images/reading_community_gathering_1793101460233.jpg',
    alt: 'Engaged readers enjoying book discussions in a warm literary salon',
    title: 'Reading Community Salon'
  },
  {
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80',
    alt: 'Magnificent grand classical library with vaulted book archways and warm light',
    title: 'Grand Classical Library'
  },
  {
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1920&q=80',
    alt: 'Cosy reading nook with an open hardcover book and soft ambient reading lamp',
    title: 'Cosy Literary Nook'
  },
  {
    url: 'https://images.unsplash.com/photo-1507842229451-7f01be777a26?auto=format&fit=crop&w=1920&q=80',
    alt: 'Rich vintage bookshelves filled with classic leather-bound manuscripts and volumes',
    title: 'Antiquarian Bookshelf'
  },
  {
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1920&q=80',
    alt: 'Tall stacks of timeless hardcover books bathed in gentle morning window light',
    title: 'Stacks of Classic Books'
  },
  {
    url: '/assets/aistudio/Cozy_Bookshelf_with_The_Book_Clique_Logo_b2394018.png',
    alt: 'Cozy Bookshelf with The Book Clique Logo surrounded by ivy and books',
    title: 'The Book Clique Bookshelf'
  }
];

export const HeroSection: React.FC = () => {
  const { setActiveView } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Preload all rotating images to guarantee zero flickering or blank gaps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      HERO_ROTATING_IMAGES.forEach((img, idx) => {
        const imageObj = new Image();
        imageObj.src = img.url;
        imageObj.onerror = () => {
          setFailedImages((prev) => ({ ...prev, [idx]: true }));
        };
      });
    }
  }, []);

  // Automatic smooth transition every 6 seconds (between 5–7 seconds)
  useEffect(() => {
    if (prefersReducedMotion) return;

    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_ROTATING_IMAGES.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion]);

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="relative overflow-hidden bg-[#0F291E] text-[#FBF9F5]">
      
      {/* ============================================================== */}
      {/* ROTATING BACKGROUND SLIDESHOW — NATURAL, FULL-COLOUR PHOTOS     */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {HERO_ROTATING_IMAGES.map((img, index) => {
          const isActive = index === currentIdx;
          const isFailed = failedImages[index];
          // If a remote image fails, smoothly fallback to our verified local library asset
          const resolvedSrc = isFailed
            ? '/src/assets/images/hero_literary_atmosphere_1793101459242.jpg'
            : img.url;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                willChange: 'opacity'
              }}
            >
              <img
                src={resolvedSrc}
                alt={img.alt}
                onError={() => handleImageError(index)}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}

        {/* Natural contrast gradient strictly on text side (no green tints, no color washes, no multiply filters) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent pointer-events-none" />

        {/* Subtle Slide Indicator Dots for visual polish */}
        {!prefersReducedMotion && (
          <div className="absolute bottom-4 right-6 sm:right-10 z-10 flex items-center gap-1.5 pointer-events-auto">
            {HERO_ROTATING_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === currentIdx
                    ? 'w-6 h-1.5 bg-[#E8D4B4]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to background slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* PRESERVED HERO CONTENT & TYPOGRAPHY */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D4AF37] mb-4">
            <span>Literary Community &amp; Author Services</span>
            <span aria-hidden="true">|</span>
            <span>Est. 2026</span>
          </div>

          <h1
            style={{ textWrap: 'balance' }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FFFDF9] leading-[1.15] mb-6 drop-shadow-xs"
          >
            Discover Stories. Connect Through Books. Give Every Book a Chance to Be Seen.
          </h1>

          <p className="text-base sm:text-lg text-[#D1DDD6] leading-relaxed mb-8 max-w-2xl font-normal">
            Welcome to <strong className="text-white font-medium">The Book Clique</strong>, a literary community dedicated to discovering remarkable books, bringing readers together, and helping authors connect their stories with wider audiences.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveView('catalogue')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F291E] bg-[#E8D4B4] hover:bg-[#F3E5CF] active:bg-[#D5BF9D] rounded transition-colors shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E8D4B4]"
            >
              <span>Explore Our Catalogue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={() => setActiveView('services')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#FBF9F5] border border-[#A4C2B2]/40 hover:bg-[#1A4533] active:bg-[#143826] rounded transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FBF9F5]"
            >
              <span>Discover Our Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Pillar Value Strip */}
      <div className="relative z-10 border-t border-[#1D4A36] bg-[#0A1B14]/85 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <BookMarked className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-[#FBF9F5]">Curated Discovery</h2>
                <p className="text-xs text-[#A9BDB2] mt-0.5">Fiction &amp; nonfiction titles categorized across 28+ specific genres.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-[#FBF9F5]">Welcoming Community</h2>
                <p className="text-xs text-[#A9BDB2] mt-0.5">Monthly reading selections, discussion prompts, and reader challenges.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-[#FBF9F5]">Author Promotion</h2>
                <p className="text-xs text-[#A9BDB2] mt-0.5">Book trailers, launch campaigns, audiobook coordination, and spotlights.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-[#FBF9F5]">Verified Integrity</h2>
                <p className="text-xs text-[#A9BDB2] mt-0.5">Transparent package scopes and official email verification safeguards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

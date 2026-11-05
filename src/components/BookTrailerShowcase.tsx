import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Clock,
  Award,
  Quote,
  X,
  Tv,
  ListVideo,
  Layers,
  ExternalLink,
  AlertCircle,
  FastForward,
  Rewind
} from 'lucide-react';
import { BookTrailerWork, FEATURED_BOOK_TRAILERS } from '../data/bookTrailersData';
import { useApp } from '../context/AppContext';

interface BookTrailerShowcaseProps {
  onOrderTrailer?: (trailerTitle: string) => void;
}

export const BookTrailerShowcase: React.FC<BookTrailerShowcaseProps> = ({ onOrderTrailer }) => {
  const { openEnquiryModal } = useApp();
  const [activeTrailer, setActiveTrailer] = useState<BookTrailerWork | null>(null);

  // Video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRequested = useRef<boolean>(false);

  const [playerMode, setPlayerMode] = useState<'mp4' | 'youtube'>('mp4');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scenes' | 'transcript' | 'deliverables'>('scenes');
  const [useNativeControls, setUseNativeControls] = useState<boolean>(false);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Update volume and mute on video element when changed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Open modal and initialize video
  const openTrailerModal = (trailer: BookTrailerWork, autoPlayDirectly = true) => {
    setActiveTrailer(trailer);
    setCurrentTime(0);
    setDuration(trailer.durationSeconds);
    setHasError(false);
    setIsLoading(true);
    setPlayerMode('mp4');
    setActiveTab('scenes');
    autoPlayRequested.current = autoPlayDirectly;
  };

  const closeTrailerModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveTrailer(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDuration = videoRef.current.duration;
      if (vidDuration && !isNaN(vidDuration) && isFinite(vidDuration)) {
        setDuration(vidDuration);
      }
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setHasError(false);
          })
          .catch((err) => {
            console.warn('Play error, fallback to muted playback:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSec = parseFloat(e.target.value);
    setCurrentTime(targetSec);
    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSkip = (deltaSeconds: number) => {
    if (videoRef.current) {
      const maxDuration = duration || activeTrailer?.durationSeconds || 999;
      const target = Math.max(0, Math.min(maxDuration, videoRef.current.currentTime + deltaSeconds));
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.8;
        setVolume(0.8);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {
          const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
          if (v?.webkitEnterFullscreen) {
            v.webkitEnterFullscreen();
          }
        });
      } else {
        const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
        if (v?.webkitEnterFullscreen) {
          v.webkitEnterFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleJumpToScene = (sceneTime: string) => {
    const [m, s] = sceneTime.split(':').map(Number);
    const targetSec = (m || 0) * 60 + (s || 0);
    setCurrentTime(targetSec);
    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatSec = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOrder = (trailerTitle: string) => {
    if (onOrderTrailer) {
      onOrderTrailer(trailerTitle);
    } else {
      openEnquiryModal('Book Trailer Production', `Inspired by ${trailerTitle}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-[#FAF7F2] border border-[#E6DFD5] rounded-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Film className="w-4 h-4 text-[#8C6D23]" />
              <span>Work We Have Done · Production Portfolio</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
              Featured Client Book Trailers
            </h3>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1.5 max-w-2xl leading-relaxed">
              Explore authentic book trailers produced by The Book Clique for award-winning titles across leading publishers, independent authors, and literary imprints.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="px-3 py-1.5 rounded-sm bg-[#143826] text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider">
              3 Featured Releases
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 3 Featured Trailers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {FEATURED_BOOK_TRAILERS.map((trailer) => (
          <div
            key={trailer.id}
            className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#143826]/50 transition-all shadow-2xs hover:shadow-md group"
          >
            {/* Thumbnail with Visible Play Button Overlay */}
            <div className="relative aspect-video overflow-hidden bg-[#0A1A11]">
              <img
                src={trailer.thumbnail}
                alt={`${trailer.title} by ${trailer.author} Book Trailer`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

              {/* Client / Publisher Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#143826]/90 backdrop-blur-xs text-[#FAF6F0] px-2.5 py-1 rounded-xs text-[11px] font-semibold border border-[#C5A059]/40">
                <Award className="w-3 h-3 text-[#D4AF37]" />
                <span>{trailer.clientBadge}</span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-[#FAF6F0] px-2 py-0.5 rounded-xs text-[11px] font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                <span>{trailer.durationFormatted}</span>
              </div>

              {/* Prominent Visible Center Play Button */}
              <button
                type="button"
                onClick={() => openTrailerModal(trailer, true)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#143826]/90 hover:bg-[#1E4D35] text-[#FAF6F0] flex items-center justify-center transition-all transform hover:scale-110 shadow-xl border-2 border-[#C5A059] cursor-pointer group/btn"
                aria-label={`Play ${trailer.title} trailer`}
              >
                <Play className="w-6 h-6 text-[#E8D4B4] fill-[#E8D4B4] ml-1 group-hover/btn:scale-110 transition-transform" />
              </button>

              {/* Bottom Tagline on Thumbnail */}
              <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
                <span className="text-[11px] font-medium text-[#FAF6F0]/95 italic drop-shadow-md line-clamp-1">
                  {trailer.tagline}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#8C6D23] font-semibold uppercase tracking-wider mb-1">
                  <span>{trailer.genre}</span>
                  <span className="text-[#6D7771] font-mono">{trailer.aspectRatio}</span>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#143826] group-hover:text-[#8C6D23] transition-colors">
                  {trailer.title}
                </h4>
                <p className="text-xs text-[#525B55] font-medium">
                  by <strong className="text-[#143826]">{trailer.author}</strong> · {trailer.publisher}
                </p>

                <p className="text-xs text-[#464F4A] mt-2.5 line-clamp-3 leading-relaxed">
                  {trailer.synopsis}
                </p>

                {/* Key Deliverables */}
                <div className="mt-3.5 pt-3 border-t border-[#F0EBE1] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#143826] block">
                    Production Inclusions:
                  </span>
                  <ul className="space-y-1">
                    {trailer.productionDeliverables.slice(0, 2).map((item, i) => (
                      <li key={i} className="text-[11px] text-[#556059] flex items-start gap-1.5 leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-[#143826] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client Review Quote */}
                <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#E6DFD5] rounded-xs text-[11px] text-[#525B55] italic">
                  <div className="flex items-start gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-[#8C6D23] shrink-0 mt-0.5" />
                    <p className="line-clamp-2">“{trailer.clientReview.quote}”</p>
                  </div>
                  <span className="block text-[10px] font-semibold text-[#143826] not-italic text-right mt-1">
                    — {trailer.clientReview.affiliation}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F0EBE1] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openTrailerModal(trailer, true)}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xs bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] uppercase tracking-wider transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Trailer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOrder(trailer.title)}
                  className="py-2 px-3 text-xs font-semibold rounded-xs bg-[#FAF6F0] hover:bg-[#EFECE4] text-[#143826] border border-[#D5CDBD] uppercase tracking-wider transition-colors cursor-pointer"
                  title="Enquire about a trailer in this style"
                >
                  Order Style
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE TRAILER MODAL WITH REAL VIDEO PLAYER */}
      {/* ============================================================== */}
      {activeTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTrailerModal();
          }}
        >
          <div className="bg-[#143826] text-[#FAF6F0] border border-[#C5A059]/40 rounded-sm shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Top Bar */}
            <div className="p-4 bg-[#0D2418] border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#E8D4B4] text-[#143826] flex items-center justify-center shadow-xs shrink-0">
                  <Film className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FFFDF9] line-clamp-1">
                    {activeTrailer.title} — Official Book Trailer
                  </h3>
                  <p className="text-[11px] text-[#D4AF37]">
                    {activeTrailer.author} · {activeTrailer.publisher} ({activeTrailer.genre})
                  </p>
                </div>
              </div>

              {/* Source Switcher & Close Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/40 p-0.5 rounded border border-[#C5A059]/40 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setPlayerMode('mp4');
                      if (videoRef.current) {
                        videoRef.current.currentTime = currentTime;
                      }
                    }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      playerMode === 'mp4'
                        ? 'bg-[#C5A059] text-[#143826] font-bold shadow-xs'
                        : 'text-[#FAF6F0]/75 hover:text-white'
                    }`}
                    title="Play original high-definition video master directly"
                  >
                    🎬 Master Video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) videoRef.current.pause();
                      setIsPlaying(false);
                      setPlayerMode('youtube');
                    }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      playerMode === 'youtube'
                        ? 'bg-[#C5A059] text-[#143826] font-bold shadow-xs'
                        : 'text-[#FAF6F0]/75 hover:text-white'
                    }`}
                    title="Watch through YouTube embed player"
                  >
                    📺 YouTube Embed
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closeTrailerModal}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close trailer modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* VIDEO PLAYER SCREEN */}
              <div
                ref={videoContainerRef}
                className="relative aspect-video rounded-sm overflow-hidden bg-black border border-[#C5A059]/40 shadow-2xl group select-none"
              >
                {/* 1. YOUTUBE EMBED MODE */}
                {playerMode === 'youtube' && activeTrailer.youtubeId ? (
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeTrailer.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={`${activeTrailer.title} Book Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <a
                        href={activeTrailer.watchUrl || `https://www.youtube.com/watch?v=${activeTrailer.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 hover:bg-black text-[#FAF6F0] text-xs border border-white/20 shadow-md transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                        <span>Open on YouTube ↗</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  /* 2. DIRECT HTML5 VIDEO MODE (ORIGINAL MP4) */
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      key={activeTrailer.id}
                      ref={videoRef}
                      poster={activeTrailer.thumbnail}
                      playsInline
                      crossOrigin="anonymous"
                      preload="auto"
                      onLoadedMetadata={handleLoadedMetadata}
                      onCanPlay={() => {
                        setIsLoading(false);
                        if (autoPlayRequested.current && videoRef.current) {
                          autoPlayRequested.current = false;
                          const p = videoRef.current.play();
                          if (p !== undefined) {
                            p.then(() => {
                              setIsPlaying(true);
                            }).catch((err) => {
                              console.warn('Autoplay prevented by browser:', err);
                              setIsPlaying(false);
                            });
                          }
                        }
                      }}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => {
                        setIsPlaying(false);
                      }}
                      onError={() => {
                        const mediaErr = videoRef.current?.error;
                        if (mediaErr && mediaErr.code !== 1) {
                          console.error('Video playback error:', mediaErr);
                          setHasError(true);
                        }
                      }}
                      onWaiting={() => setIsLoading(true)}
                      onPlaying={() => {
                        setIsLoading(false);
                        setIsPlaying(true);
                      }}
                      controls={useNativeControls}
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={togglePlay}
                    >
                      <source src={activeTrailer.videoSrc} type="video/mp4" />
                      Your browser does not support HTML5 video playback.
                    </video>

                    {/* Error Banner Fallback */}
                    {hasError && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-30">
                        <AlertCircle className="w-8 h-8 text-[#E68A8A] mb-2" />
                        <h4 className="font-bold text-sm text-white mb-1">Playback Error</h4>
                        <p className="text-xs text-white/80 max-w-md mb-3">
                          Unable to stream this video directly in your current browser configuration.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setHasError(false);
                              if (videoRef.current) {
                                videoRef.current.load();
                                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                              }
                            }}
                            className="px-3 py-1.5 bg-[#C5A059] text-[#143826] text-xs font-bold rounded cursor-pointer hover:bg-[#D4AF37]"
                          >
                            Retry Playback
                          </button>
                          <button
                            type="button"
                            onClick={() => setPlayerMode('youtube')}
                            className="px-3 py-1.5 bg-white/20 text-white text-xs font-bold rounded hover:bg-white/30 cursor-pointer"
                          >
                            Switch to YouTube Embed
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Buffering Indicator */}
                    {isLoading && !hasError && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="w-12 h-12 rounded-full border-3 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
                      </div>
                    )}

                    {/* Center Big Play Button (when paused and not using native controls) */}
                    {!useNativeControls && !isPlaying && !isLoading && !hasError && (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#143826]/90 hover:bg-[#1E4D35] text-[#FAF6F0] flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl border-2 border-[#C5A059] cursor-pointer z-20"
                        aria-label="Play video"
                      >
                        <Play className="w-7 h-7 text-[#E8D4B4] fill-[#E8D4B4] ml-1" />
                      </button>
                    )}

                    {/* Ambient Subtitle / Narration Banner (synchronized with actual video time) */}
                    {!useNativeControls && (
                      <div className="absolute bottom-16 sm:bottom-14 left-4 right-4 text-center pointer-events-none z-20">
                        {(() => {
                          const lines = activeTrailer.fullTranscript;
                          let activeLine = lines[0]?.text;
                          for (const l of lines) {
                            const [m, s] = l.time.split(':').map(Number);
                            const sec = (m || 0) * 60 + (s || 0);
                            if (currentTime >= sec) {
                              activeLine = l.text;
                            }
                          }
                          if (!activeLine) return null;
                          return (
                            <div className="inline-block bg-black/85 backdrop-blur-md px-4 py-2 rounded-xs border border-white/20 text-xs sm:text-sm font-medium text-white max-w-xl shadow-lg">
                              <span className="text-[#D4AF37] font-serif italic mr-1">“</span>
                              {activeLine}
                              <span className="text-[#D4AF37] font-serif italic ml-1">”</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* CUSTOM PLAYER CONTROLS BAR (hidden when native controls enabled) */}
                    {!useNativeControls && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-2 z-20 transition-opacity">
                        {/* Seek Scrubber Bar */}
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={duration || activeTrailer.durationSeconds}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-white/25 hover:bg-white/40 rounded-lg appearance-none cursor-pointer accent-[#C5A059] transition-all"
                            aria-label="Seek video"
                          />
                          <span className="font-mono text-[11px] text-[#FAF6F0] shrink-0 tabular-nums">
                            {formatSec(currentTime)} / {formatSec(duration || activeTrailer.durationSeconds)}
                          </span>
                        </div>

                        {/* Controls Toolbar */}
                        <div className="flex items-center justify-between text-xs text-[#FAF6F0] gap-2">
                          {/* Left: Play/Pause, Rewind, Replay, Skip, Volume */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={togglePlay}
                              className="p-1.5 rounded hover:bg-white/10 text-[#E8D4B4] hover:text-white transition-colors cursor-pointer"
                              title={isPlaying ? 'Pause' : 'Play'}
                              aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5 fill-current" />
                              ) : (
                                <Play className="w-5 h-5 fill-current" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSkip(-10)}
                              className="p-1 rounded hover:bg-white/10 text-[#FAF6F0]/80 hover:text-white transition-colors cursor-pointer"
                              title="Rewind 10 seconds"
                              aria-label="Rewind 10 seconds"
                            >
                              <Rewind className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={handleReplay}
                              className="p-1 rounded hover:bg-white/10 text-[#FAF6F0]/80 hover:text-white transition-colors cursor-pointer"
                              title="Replay from start"
                              aria-label="Replay from start"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSkip(10)}
                              className="p-1 rounded hover:bg-white/10 text-[#FAF6F0]/80 hover:text-white transition-colors cursor-pointer"
                              title="Fast forward 10 seconds"
                              aria-label="Fast forward 10 seconds"
                            >
                              <FastForward className="w-4 h-4" />
                            </button>

                            {/* Volume & Mute */}
                            <div className="flex items-center gap-1 group/vol">
                              <button
                                type="button"
                                onClick={handleToggleMute}
                                className="p-1 rounded hover:bg-white/10 text-[#FAF6F0]/80 hover:text-white transition-colors cursor-pointer"
                                title={isMuted ? 'Unmute' : 'Mute'}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                              >
                                {isMuted ? (
                                  <VolumeX className="w-4 h-4 text-[#E68A8A]" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C5A059] hidden sm:inline-block"
                                aria-label="Volume"
                              />
                            </div>

                            <span className="text-[11px] text-[#A4C2B2] hidden md:inline ml-1">
                              {activeTrailer.formatDescription}
                            </span>
                          </div>

                          {/* Right: Aspect ratio, Native controls toggle, Fullscreen */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setUseNativeControls(true)}
                              className="text-[10px] text-white/70 hover:text-white underline underline-offset-2 hidden sm:inline cursor-pointer"
                              title="Switch to browser's native video controls"
                            >
                              Native Controls
                            </button>

                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#8C6D23]/30 text-[#D4AF37] border border-[#8C6D23]/50">
                              {activeTrailer.aspectRatio}
                            </span>

                            <button
                              type="button"
                              onClick={handleToggleFullscreen}
                              className="p-1.5 rounded hover:bg-white/10 text-[#FAF6F0]/90 hover:text-white transition-colors cursor-pointer"
                              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                              {isFullscreen ? (
                                <Minimize2 className="w-4 h-4" />
                              ) : (
                                <Maximize2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Button to revert from native controls back to custom */}
                    {useNativeControls && (
                      <button
                        type="button"
                        onClick={() => setUseNativeControls(false)}
                        className="absolute top-2 left-2 z-20 px-2 py-1 bg-black/80 hover:bg-black text-[#FAF6F0] text-[10px] font-semibold rounded border border-white/20 cursor-pointer"
                      >
                        ← Use Custom Aesthetic Player
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Tabs for Scenes / Transcript / Production Specifications */}
              <div className="bg-[#0D2418] rounded-sm border border-[#C5A059]/20 p-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => setActiveTab('scenes')}
                    className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'scenes'
                        ? 'bg-[#E8D4B4] text-[#143826]'
                        : 'text-[#FAF6F0]/80 hover:bg-white/5'
                    }`}
                  >
                    <ListVideo className="w-3.5 h-3.5" />
                    <span>Key Scenes ({activeTrailer.keyScenes.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('transcript')}
                    className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'transcript'
                        ? 'bg-[#E8D4B4] text-[#143826]'
                        : 'text-[#FAF6F0]/80 hover:bg-white/5'
                    }`}
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Narration Script</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('deliverables')}
                    className={`px-3 py-1.5 rounded-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'deliverables'
                        ? 'bg-[#E8D4B4] text-[#143826]'
                        : 'text-[#FAF6F0]/80 hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Production Specs</span>
                  </button>
                </div>

                {/* Tab 1: Key Scenes interactive timeline jumps */}
                {activeTab === 'scenes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {activeTrailer.keyScenes.map((scene, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleJumpToScene(scene.time)}
                        className="text-left p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono font-bold text-[#D4AF37] group-hover:underline flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-current inline" />
                            {scene.time}
                          </span>
                          <span className="text-[10px] text-[#A4C2B2] uppercase">Scene {i + 1}</span>
                        </div>
                        <h5 className="font-semibold text-xs text-[#FAF6F0] mb-1">
                          {scene.title}
                        </h5>
                        <p className="text-[11px] text-[#C2D6CB] leading-tight line-clamp-2">
                          {scene.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab 2: Full Narration Script with live sync highlighting and click-to-seek */}
                {activeTab === 'transcript' && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 text-xs">
                    {activeTrailer.fullTranscript.map((t, i) => {
                      const [m, s] = t.time.split(':').map(Number);
                      const sec = (m || 0) * 60 + (s || 0);
                      const isActive =
                        currentTime >= sec &&
                        (i === activeTrailer.fullTranscript.length - 1 ||
                          currentTime < (() => {
                            const [nextM, nextS] = activeTrailer.fullTranscript[i + 1].time.split(':').map(Number);
                            return (nextM || 0) * 60 + (nextS || 0);
                          })());

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (playerMode === 'mp4') {
                              handleJumpToScene(t.time);
                            }
                          }}
                          className={`p-2.5 rounded transition-colors cursor-pointer flex items-start gap-3 ${
                            isActive
                              ? 'bg-[#8C6D23]/35 border-l-2 border-[#D4AF37] text-white shadow-xs'
                              : 'text-[#C2D6CB] hover:bg-white/5'
                          }`}
                          title="Click to jump to this narration timestamp"
                        >
                          <span className="font-mono text-[11px] text-[#D4AF37] shrink-0 font-bold">{t.time}</span>
                          <div className="flex-1">
                            <span className="font-semibold text-[11px] text-[#E8D4B4] mr-2">{t.speaker}:</span>
                            <span className="leading-relaxed">{t.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 3: Production Specs */}
                {activeTab === 'deliverables' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeTrailer.productionDeliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 bg-white/5 rounded border border-white/10">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="text-[#FAF6F0] text-xs">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-white/5 rounded border border-white/10 flex items-start gap-2.5">
                      <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">Official Client Reference:</strong>
                        <p className="text-[11px] text-[#C2D6CB] mt-0.5">
                          {activeTrailer.clientReview.quote}
                        </p>
                        <span className="block text-[10px] text-[#D4AF37] mt-1 font-semibold">
                          — {activeTrailer.clientReview.reviewer}, {activeTrailer.clientReview.affiliation}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Call-to-Action */}
              <div className="p-4 bg-[#0D2418] border border-[#C5A059]/30 rounded flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Want an atmospheric book trailer crafted for your manuscript?
                  </span>
                  <span className="text-[11px] text-[#A4C2B2]">
                    Packages range from social teasers (15–30s) to flagship cinematic productions with voice acting.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      closeTrailerModal();
                      handleOrder(activeTrailer.title);
                    }}
                    className="px-4 py-2.5 bg-[#E8D4B4] hover:bg-[#F3E5CF] text-[#143826] text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-sm"
                  >
                    Request Similar Trailer Quote
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

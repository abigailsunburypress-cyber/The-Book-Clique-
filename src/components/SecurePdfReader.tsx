import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Search,
  BookOpen,
  ArrowLeft,
  Home,
  Lock,
  List,
  Sun,
  Moon,
  Coffee,
  RotateCw,
  X,
  AlertCircle,
  ShieldCheck,
  Star,
  MessageSquare
} from 'lucide-react';
import { Manuscript } from '../types';
import { useApp } from '../context/AppContext';
import { calculateBatchSchedule } from '../utils/chapterBatch';

// Set up PDF.js local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface SecurePdfReaderProps {
  manuscript: Manuscript;
  token: string | null;
  onBackToLibrary: () => void;
}

type ReadingTheme = 'cream' | 'white' | 'dark';

export const SecurePdfReader: React.FC<SecurePdfReaderProps> = ({
  manuscript,
  token,
  onBackToLibrary
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  const { bookClubSession, activeReaderInitialPage, setActiveView, closeReader } = useApp();
  const schedule = calculateBatchSchedule(manuscript, bookClubSession);
  const maxUnlockedPage = schedule.maxUnlockedPage;
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (activeReaderInitialPage && activeReaderInitialPage >= 1) {
      return activeReaderInitialPage;
    }
    try {
      const saved = localStorage.getItem(`tbc_read_page_${manuscript.id}`);
      const parsed = saved ? parseInt(saved, 10) || 1 : 1;
      return maxUnlockedPage > 0 ? Math.min(parsed, maxUnlockedPage) : parsed;
    } catch {
      return 1;
    }
  });
  const [totalPages, setTotalPages] = useState<number>(manuscript.pageCount || 1);
  const [scale, setScale] = useState<number>(1.2);
  const [fitMode, setFitMode] = useState<'custom' | 'width' | 'page'>('width');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ReadingTheme>('cream');
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);

  // Sync with activeReaderInitialPage and clamp currentPage if exceeds maxUnlockedPage
  useEffect(() => {
    if (activeReaderInitialPage && activeReaderInitialPage >= 1) {
      setCurrentPage(Math.min(activeReaderInitialPage, maxUnlockedPage));
    } else if (maxUnlockedPage > 0 && currentPage > maxUnlockedPage) {
      setCurrentPage(maxUnlockedPage);
    }
  }, [activeReaderInitialPage, maxUnlockedPage]);

  // In-document text search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ page: number; preview: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const pageTextsCache = useRef<Map<number, string>>(new Map());

  // Save reading progress to local storage
  useEffect(() => {
    if (currentPage > 0) {
      try {
        localStorage.setItem(`tbc_read_page_${manuscript.id}`, String(currentPage));
      } catch {
        // Ignore storage restrictions
      }
    }
  }, [currentPage, manuscript.id]);

  // Anti-download keyboard deterrents (suppress Ctrl+S, Ctrl+P, Cmd+S, Cmd+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Load PDF Document bytes via authorized stream endpoint
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const streamUrl = `/api/manuscripts/${manuscript.id}/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        const response = await fetch(streamUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Authorized reading token expired. Please return to the reading library to establish a fresh session.');
          }
          throw new Error(`Failed to load manuscript (HTTP ${response.status}).`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: '/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/standard_fonts/'
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Secure PDF Reader load error:', err);
        if (!isCancelled) {
          setErrorMsg(err.message || 'Unable to render manuscript in secure browser reader.');
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [manuscript.id, token]);

  // Render current page onto Canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || currentPage < 1 || currentPage > totalPages) {
      return;
    }

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      // Calculate scale based on container width if fit mode is active
      let targetScale = scale;
      const unscaledViewport = page.getViewport({ scale: 1 });

      if (fitMode === 'width' && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // padding
        targetScale = Math.max(0.6, containerWidth / unscaledViewport.width);
      } else if (fitMode === 'page' && containerRef.current) {
        const containerHeight = containerRef.current.clientHeight - 80;
        targetScale = Math.max(0.6, containerHeight / unscaledViewport.height);
      }

      const viewport = page.getViewport({ scale: targetScale });
      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      const renderContext = {
        canvasContext: context,
        viewport,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
      }
    }
  }, [pdfDoc, currentPage, scale, fitMode, totalPages]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Window resize listener to recompute fit-to-width
  useEffect(() => {
    const handleResize = () => {
      if (fitMode === 'width' || fitMode === 'page') {
        renderCurrentPage();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitMode, renderCurrentPage]);

  // Page navigation enforcing daily batch lock
  const goToNextPage = () => {
    if (currentPage >= maxUnlockedPage) {
      const nextBatchInfo = schedule.nextBatch;
      const msg = nextBatchInfo
        ? `You have reached the end of today's unlocked chapters (up to page ${maxUnlockedPage}). The next batch (Day ${nextBatchInfo.dayNumber} · ${nextBatchInfo.chapters.map(c => c.title).join(' & ')}) will unlock on ${nextBatchInfo.releaseDateFormatted}.`
        : `You have reached the final released page of ${manuscript.title}.`;
      setLockedNotice(msg);
      return;
    }
    if (currentPage < totalPages) {
      setLockedNotice(null);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setLockedNotice(null);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageJump = (pageStr: string) => {
    const p = parseInt(pageStr, 10);
    if (!isNaN(p)) {
      if (p > maxUnlockedPage) {
        setCurrentPage(maxUnlockedPage);
        const nextBatchInfo = schedule.nextBatch;
        setLockedNotice(
          `Page ${p} is currently locked. Today's reading batch unlocks through page ${maxUnlockedPage}. ${nextBatchInfo ? `Day ${nextBatchInfo.dayNumber} unlocks on ${nextBatchInfo.releaseDateFormatted}.` : ''}`
        );
      } else if (p >= 1 && p <= totalPages) {
        setLockedNotice(null);
        setCurrentPage(p);
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Document Text Search
  const handleSearch = async () => {
    if (!pdfDoc || !searchQuery.trim()) return;
    setIsSearching(true);
    setSearchAttempted(true);
    const query = searchQuery.toLowerCase().trim();
    const results: { page: number; preview: string }[] = [];

    try {
      for (let i = 1; i <= totalPages; i++) {
        let text = pageTextsCache.current.get(i);
        if (!text) {
          const page = await pdfDoc.getPage(i);
          const content = await page.getTextContent();
          const extractedText = content.items.map((item: any) => item.str || '').join(' ');
          text = extractedText;
          pageTextsCache.current.set(i, extractedText);
        }

        const currentText = text || '';
        const idx = currentText.toLowerCase().indexOf(query);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(currentText.length, idx + query.length + 40);
          results.push({
            page: i,
            preview: `...${currentText.substring(start, end).replace(/\s+/g, ' ')}...`
          });
        }
      }
      setSearchResults(results);
    } catch (e) {
      console.warn('Text search encountered an error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Background theme styles
  const themeBgClasses = {
    cream: 'bg-[#F5EFE6] text-[#2C2926]',
    white: 'bg-[#FFFFFF] text-[#1C1E1D]',
    dark: 'bg-[#181C1A] text-[#E0E7E3]'
  }[theme];

  const themeCanvasWrapClasses = {
    cream: 'bg-[#FCF9F3] shadow-md border border-[#E4DC CE]/60',
    white: 'bg-[#FFFFFF] shadow-md border border-[#E5E7EB]',
    dark: 'bg-[#222724] shadow-xl border border-[#333C37]'
  }[theme];

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
      className={`min-h-screen flex flex-col ${themeBgClasses} select-none transition-colors duration-200 relative`}
    >
      {/* Top Reading Toolbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#143826] text-[#FAF6F0] shadow-sm shrink-0 border-b border-[#C5A059]/30">
        
        {/* Left: Back to Home & Library buttons & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => {
              closeReader();
              setActiveView('home');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold bg-[#E8D4B4] hover:bg-[#F3E5CF] text-[#143826] transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Return to The Book Clique Homepage"
          >
            <Home className="w-4 h-4" />
            <span className="font-bold whitespace-nowrap">Back to Home</span>
          </button>

          <button
            onClick={onBackToLibrary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-[#FAF6F0]/10 hover:bg-[#FAF6F0]/20 text-[#FAF6F0] transition-colors cursor-pointer shrink-0"
            title="Return to Online Reading Library"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="min-w-0 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0" />
            <div className="truncate">
              <h1 className="font-serif text-sm sm:text-base font-semibold truncate text-[#FAF6F0]">
                {manuscript.title}
              </h1>
              <p className="text-[11px] text-[#C5A059] truncate font-sans">
                {manuscript.author} · {manuscript.genre}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Page Navigation Controls & Daily Batch Indicator */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 rounded hover:bg-[#FAF6F0]/15 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-[#FAF6F0]"
            title="Previous Page (Left Arrow)"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 text-xs font-mono font-medium">
            <label htmlFor="jump-page-input" className="sr-only">Jump to page number</label>
            <input
              id="jump-page-input"
              type="text"
              value={currentPage}
              onChange={(e) => handlePageJump(e.target.value)}
              className="w-10 sm:w-12 text-center py-0.5 bg-[#FAF6F0]/15 rounded border border-[#FAF6F0]/30 text-[#FAF6F0] font-mono text-xs focus:outline-hidden focus:border-[#C5A059]"
            />
            <span className="text-[#C5A059]/80 font-normal">/</span>
            <span className="tabular-nums text-[#FAF6F0]">{totalPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className={`p-1.5 rounded transition-colors cursor-pointer text-[#FAF6F0] ${
              currentPage >= maxUnlockedPage && maxUnlockedPage < totalPages
                ? 'hover:bg-amber-500/20 text-[#E8D4B4]'
                : 'hover:bg-[#FAF6F0]/15 disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
            title={currentPage >= maxUnlockedPage && maxUnlockedPage < totalPages ? `Today's batch limit reached (p. ${maxUnlockedPage}). Next batch unlocks on ${schedule.nextReleaseDateFormatted || 'schedule'}.` : 'Next Page (Right Arrow)'}
            aria-label="Next page"
          >
            {currentPage >= maxUnlockedPage && maxUnlockedPage < totalPages ? (
              <Lock className="w-4 h-4 text-[#E8D4B4]" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {/* Daily Chapter Batch Status Pill */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F2B1D] border border-[#C5A059]/40 text-[11px] font-sans text-[#E8D4B4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold">Day {schedule.currentDay} Batch</span>
            <span className="text-[#A4B5AC]">•</span>
            <span className="text-[10px] text-[#C5A059]">Unlocked to p. {maxUnlockedPage}</span>
          </div>
        </div>

        {/* Right: View Controls, Zoom, Themes, Search, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          
          {/* Zoom Out */}
          <button
            onClick={() => {
              setFitMode('custom');
              setScale((prev) => Math.max(0.6, prev - 0.15));
            }}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-[#FAF6F0]/15 text-[#FAF6F0] transition-colors cursor-pointer hidden md:flex"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => {
              setFitMode('custom');
              setScale((prev) => Math.min(2.5, prev + 0.15));
            }}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-[#FAF6F0]/15 text-[#FAF6F0] transition-colors cursor-pointer hidden md:flex"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Fit Width toggle */}
          <button
            onClick={() => {
              setFitMode(fitMode === 'width' ? 'custom' : 'width');
              if (fitMode !== 'width') setScale(1.2);
            }}
            className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer hidden lg:inline-flex ${
              fitMode === 'width' ? 'bg-[#C5A059] text-[#143826]' : 'hover:bg-[#FAF6F0]/15 text-[#FAF6F0]'
            }`}
            title="Fit to Width"
          >
            Fit Width
          </button>

          {/* Fit Page toggle */}
          <button
            onClick={() => {
              setFitMode(fitMode === 'page' ? 'custom' : 'page');
            }}
            className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer hidden lg:inline-flex ${
              fitMode === 'page' ? 'bg-[#C5A059] text-[#143826]' : 'hover:bg-[#FAF6F0]/15 text-[#FAF6F0]'
            }`}
            title="Fit Full Page"
          >
            Fit Page
          </button>

          {/* Reading Background Themes */}
          <div className="flex items-center border border-[#FAF6F0]/20 rounded p-0.5 ml-1">
            <button
              onClick={() => setTheme('cream')}
              className={`p-1 rounded text-xs cursor-pointer ${theme === 'cream' ? 'bg-[#C5A059] text-[#143826]' : 'text-[#FAF6F0] hover:bg-[#FAF6F0]/10'}`}
              title="Warm Cream Paper Theme"
              aria-label="Warm cream paper theme"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('white')}
              className={`p-1 rounded text-xs cursor-pointer ${theme === 'white' ? 'bg-[#FAF6F0] text-[#143826]' : 'text-[#FAF6F0] hover:bg-[#FAF6F0]/10'}`}
              title="Studio Crisp White Theme"
              aria-label="Studio white theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded text-xs cursor-pointer ${theme === 'dark' ? 'bg-[#1C1E1D] text-[#C5A059]' : 'text-[#FAF6F0] hover:bg-[#FAF6F0]/10'}`}
              title="Midnight Dark Theme"
              aria-label="Midnight dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search in document */}
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${isSearchOpen ? 'bg-[#C5A059] text-[#143826]' : 'hover:bg-[#FAF6F0]/15 text-[#FAF6F0]'}`}
            title="Search within manuscript"
            aria-label="Search within manuscript"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Table of Contents Drawer Toggle */}
          {manuscript.tableOfContents && manuscript.tableOfContents.length > 0 && (
            <button
              onClick={() => setIsTocOpen((prev) => !prev)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${isTocOpen ? 'bg-[#C5A059] text-[#143826]' : 'hover:bg-[#FAF6F0]/15 text-[#FAF6F0]'}`}
              title="Table of Contents"
              aria-label="Table of contents"
            >
              <List className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-[#FAF6F0]/15 text-[#FAF6F0] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reading Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Rate & Discuss Quick Action */}
          <button
            onClick={() => {
              onBackToLibrary();
              setTimeout(() => {
                const el = document.getElementById('book-reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#143826] text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Rate this book and share your thoughts"
          >
            <Star className="w-3.5 h-3.5 fill-[#143826]" />
            <span>Rate & Discuss</span>
          </button>

          {/* Dedicated Top-Right Corner Close Reader Button */}
          <button
            onClick={onBackToLibrary}
            className="ml-1.5 sm:ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF6F0]/15 hover:bg-[#9E2B22] text-[#FAF6F0] text-xs font-semibold border border-[#FAF6F0]/25 transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Close Reader and return to library"
            aria-label="Close Reader"
          >
            <X className="w-4 h-4 text-[#C5A059]" />
            <span className="font-bold whitespace-nowrap">Close Reader</span>
          </button>
        </div>
      </header>

      {/* Daily Batch Schedule Locked Alert Notification Banner */}
      {lockedNotice && (
        <div className="bg-[#FEF3C7] border-b border-[#F59E0B]/40 px-4 sm:px-6 py-2.5 text-xs text-[#92400E] flex items-center justify-between gap-3 shadow-xs animate-in fade-in z-30 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D97706] shrink-0" />
            <span className="font-medium">{lockedNotice}</span>
          </div>
          <button
            onClick={() => setLockedNotice(null)}
            className="p-1 text-[#92400E] hover:text-[#78350F] rounded cursor-pointer shrink-0"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Reading Stage Area */}
      <div className="flex-grow flex relative overflow-hidden">
        
        {/* Table of Contents Sidebar / Drawer with Daily Chapter Batches */}
        {isTocOpen && manuscript.tableOfContents && (
          <aside className="w-72 sm:w-84 bg-[#FAF8F5] border-r border-[#E6DFD5] p-4 shrink-0 flex flex-col z-20 shadow-lg text-[#1C1E1D]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
              <div>
                <h2 className="font-serif text-sm font-semibold flex items-center gap-1.5 text-[#143826]">
                  <List className="w-4 h-4 text-[#C5A059]" />
                  <span>Table of Contents</span>
                </h2>
                <p className="text-[11px] text-[#636E67] mt-0.5">
                  Day {schedule.currentDay} Batch active ({schedule.chaptersPerDay} ch/day)
                </p>
              </div>
              <button
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded hover:bg-[#ECE6DC] text-[#7A857F] hover:text-[#1C1E1D] cursor-pointer"
                aria-label="Close table of contents"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow py-3 space-y-1.5">
              {manuscript.tableOfContents.map((item, idx) => {
                const isLocked = item.page > maxUnlockedPage;
                const batch = schedule.batches.find((b) =>
                  b.chapters.some((c) => c.startPage === item.page || (item.page >= c.startPage && item.page <= c.endPage))
                );
                const isCurrent = currentPage === item.page;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        setLockedNotice(
                          `"${item.title}" (page ${item.page}) is locked. It is scheduled for Day ${batch?.dayNumber || '?'} (${batch?.releaseDateFormatted || 'upcoming'}). Today's batch unlocks through page ${maxUnlockedPage}.`
                        );
                      } else {
                        setLockedNotice(null);
                        setCurrentPage(item.page);
                        setIsTocOpen(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-[#143826] text-[#FAF6F0] font-semibold'
                        : isLocked
                        ? 'bg-[#F2EDE4]/60 text-[#8E9992] hover:bg-[#EAE4D8]/80'
                        : 'hover:bg-[#EFECE4] text-[#383D39]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-[#B91C1C] shrink-0" />
                      ) : batch?.isCurrentDay ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D23]/40 shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isLocked ? (
                        <span className="text-[10px] font-semibold text-[#B91C1C] bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                          Day {batch?.dayNumber || '?'}
                        </span>
                      ) : batch?.isCurrentDay ? (
                        <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] opacity-75">p. {item.page}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Search Drawer */}
        {isSearchOpen && (
          <aside className="w-72 sm:w-80 bg-[#FAF8F5] border-r border-[#E6DFD5] p-4 shrink-0 flex flex-col z-20 shadow-lg text-[#1C1E1D]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD5]">
              <h2 className="font-serif text-sm font-semibold flex items-center gap-1.5 text-[#143826]">
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Find in Manuscript</span>
              </h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded hover:bg-[#ECE6DC] text-[#7A857F] hover:text-[#1C1E1D] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter word or phrase..."
                  className="w-full text-xs px-3 py-2 bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-3 py-2 bg-[#143826] text-[#FAF6F0] rounded text-xs font-semibold hover:bg-[#1E4D35] disabled:opacity-40 cursor-pointer"
                >
                  {isSearching ? '...' : 'Find'}
                </button>
              </div>

              {searchAttempted && (
                <div className="text-xs text-[#525B55]">
                  Found <strong className="text-[#143826]">{searchResults.length}</strong> occurrences
                </div>
              )}
            </div>

            <div className="overflow-y-auto flex-grow space-y-2 pt-2 border-t border-[#E6DFD5]">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(res.page);
                  }}
                  className={`w-full text-left p-2.5 rounded text-xs transition-colors border cursor-pointer ${
                    currentPage === res.page
                      ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#78350F]'
                      : 'bg-[#FFFFFF] border-[#E6DFD5] hover:bg-[#F6F2EA] text-[#383D39]'
                  }`}
                >
                  <div className="font-bold text-[10px] text-[#143826] mb-0.5">Page {res.page}</div>
                  <div className="text-[11px] leading-snug line-clamp-2">{res.preview}</div>
                </button>
              ))}

              {searchAttempted && searchResults.length === 0 && (
                <div className="text-center py-6 text-xs text-[#7A857F]">
                  No matching text found in this manuscript.
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Center: Interactive Page Canvas Reader */}
        <div className="flex-grow flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-8 relative">
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="my-auto flex flex-col items-center justify-center p-8 bg-[#FAF6F0]/90 rounded border border-[#C5A059]/30 shadow-md">
              <RotateCw className="w-8 h-8 text-[#143826] animate-spin mb-3" />
              <p className="font-serif text-lg font-semibold text-[#143826]">
                Rendering Authentic Manuscript...
              </p>
              <p className="text-xs text-[#525B55] mt-1">
                Decrypting authorized stream buffer through PDF.js engine
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="my-auto max-w-md p-6 bg-[#FEF2F2] border border-[#F87171] rounded text-left shadow-md">
              <div className="flex items-center gap-2 text-[#991B1B] font-bold text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Reading Session Error</span>
              </div>
              <p className="text-xs text-[#7F1D1D] leading-relaxed mb-4">
                {errorMsg}
              </p>
              <button
                onClick={onBackToLibrary}
                className="px-4 py-2 bg-[#991B1B] text-[#FFFFFF] text-xs font-semibold rounded hover:bg-[#7F1D1D] transition-colors cursor-pointer"
              >
                Return to Reading Library
              </button>
            </div>
          )}

          {/* Rendered Canvas Paper */}
          {!isLoading && !errorMsg && (
            <div className={`transition-all duration-150 rounded-sm my-auto ${themeCanvasWrapClasses}`}>
              <canvas
                ref={canvasRef}
                className="block mx-auto select-none pointer-events-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Reader Footer Watermark & Security Guard */}
      <footer className="py-2 px-4 bg-[#143826]/95 border-t border-[#C5A059]/20 text-[11px] text-[#FAF6F0]/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>The Book Clique Secure Reader · Authorized Stream View</span>
          <span className="hidden md:inline">· Original Layout &amp; Typographical Architecture Preserved</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#C5A059]">No Download Available (Protected Archive)</span>
          <span className="tabular-nums">Page {currentPage} of {totalPages}</span>
        </div>
      </footer>
    </div>
  );
};

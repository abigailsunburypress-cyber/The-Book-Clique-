import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Award,
  AlertCircle,
  Eye,
  Heart,
  Lock,
  BookMarked,
  ShieldCheck,
  ArrowRight,
  Clock,
  RotateCw,
  ArrowLeft,
  Home,
  Mail,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Manuscript } from '../types';
import { SecurePdfReader } from './SecurePdfReader';
import { BookReviewsSection } from './BookReviewsSection';
import { calculateBatchSchedule } from '../utils/chapterBatch';

export const BookClubView: React.FC = () => {
  const {
    readingChallenges,
    submitBookClubSignup,
    manuscripts,
    isLoadingManuscripts,
    activeReaderManuscript,
    activeReaderToken,
    openReader,
    closeReader,
    likeManuscript,
    bookClubSession,
    activeBookClubManuscript,
    setActiveView,
    currentReader,
    openReaderAuthModal,
    logoutReader
  } = useApp();

  // Signup form state for regular book club
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(['Memoir / Inspirational']);
  const [readingGoal, setReadingGoal] = useState('2 books per month');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Local state for which manuscripts this client has liked
  const [likedManuscripts, setLikedManuscripts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('tbc_liked_manuscripts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [likeFeedback, setLikeFeedback] = useState<Record<string, string>>({});

  // If reader is active, render full SecurePdfReader right within Book Club!
  if (activeReaderManuscript) {
    return (
      <SecurePdfReader
        manuscript={activeReaderManuscript}
        token={activeReaderToken}
        onBackToLibrary={closeReader}
      />
    );
  }

  // Official author manuscripts exclusively supplied by user
  const officialManuscripts = manuscripts.filter((m) => m.isPublished);

  // Split manuscripts into active book and upcoming locked books based on the one-book-at-a-time system
  const activeManuscript = activeBookClubManuscript;
  const lockedUpcomingManuscripts = officialManuscripts.filter(
    (m) => !activeManuscript || m.id !== activeManuscript.id
  );

  const batchSchedule = React.useMemo(() => {
    return calculateBatchSchedule(activeManuscript, bookClubSession);
  }, [activeManuscript, bookClubSession]);

  const [showAllBatches, setShowAllBatches] = useState(false);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const handleGenreToggle = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      if (favoriteGenres.length > 1) {
        setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
      }
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !email.includes('@')) {
      setSignupStatus('error');
      setErrorMsg('Please supply a complete name and valid email address.');
      return;
    }

    try {
      submitBookClubSignup({
        fullName: fullName.trim(),
        email: email.trim(),
        favoriteGenres,
        readingGoal
      });
      setSignupStatus('success');
      setFullName('');
      setEmail('');
      setErrorMsg('');
    } catch {
      setSignupStatus('error');
      setErrorMsg('Could not process book club registration.');
    }
  };

  // Handle manuscript like
  const handleLike = async (msId: string) => {
    const res = await likeManuscript(msId);
    if (res.success) {
      const updated = { ...likedManuscripts, [msId]: true };
      setLikedManuscripts(updated);
      try {
        localStorage.setItem('tbc_liked_manuscripts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      setLikeFeedback((prev) => ({
        ...prev,
        [msId]: res.alreadyLiked ? 'Already recorded!' : '♥ Liked!'
      }));
      setTimeout(() => {
        setLikeFeedback((prev) => {
          const next = { ...prev };
          delete next[msId];
          return next;
        });
      }, 2500);
    }
  };

  return (
    <div className="bg-[#FBF9F5] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb: Back to Home */}
        <div className="mb-6">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold bg-[#FFFFFF] hover:bg-[#FAF6F0] text-[#143826] border border-[#D5CDBD] shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8C6D23]" />
            <Home className="w-3.5 h-3.5 text-[#143826]" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Curated Literary Fellowship · Sequential Reading Programme
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
              The Book Club Community
            </h1>
            <p className="text-sm sm:text-base text-[#525B55] mt-2 leading-relaxed">
              An attentive reading fellowship dedicated to genuine author manuscripts. Under our one-book-at-a-time reading system, our community focuses on a single active manuscript per session with 100% free in-browser reading.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: ACTIVE BOOK CLUB SELECTION (THE ONLY ACTIVE BOOK)  */}
        {/* ============================================================== */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#143826]/10 text-[#143826] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#143826]/20">
                <BookMarked className="w-3.5 h-3.5 text-[#8C6D23]" />
                <span>Current Reading Session</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
                Active Book Club Selection
              </h2>
              <p className="text-xs sm:text-sm text-[#525B55] mt-1 max-w-2xl leading-relaxed">
                The only manuscript currently unlocked for community reading. Read the complete authentic author work directly in your browser with zero fees.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-[#15803D] bg-[#DCFCE7]/60 px-3.5 py-2 rounded border border-[#86EFAC] shadow-2xs font-medium">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>Free In-Browser Access · One Book at a Time</span>
              </div>

              {currentReader ? (
                <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#C5A059]/40 px-3 py-1.5 rounded text-xs shadow-2xs">
                  <span>{currentReader.countryFlag || '🇬🇧'}</span>
                  <span className="font-semibold text-[#143826]">{currentReader.fullName}</span>
                  <button
                    type="button"
                    onClick={logoutReader}
                    className="text-[10px] text-[#717C76] hover:text-rose-600 underline ml-1 cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openReaderAuthModal(undefined, 'Register to Read Online', 'register')}
                  className="px-3 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                >
                  Register as Reader
                </button>
              )}
            </div>
          </div>

          {isLoadingManuscripts ? (
            <div className="p-12 text-center bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-2xs">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#143826] border-t-transparent" />
              <p className="text-xs text-[#525B55] mt-3">Loading Book Club manuscript...</p>
            </div>
          ) : activeManuscript && bookClubSession?.sessionStatus === 'active' ? (
            <>
              {/* Active Manuscript Card */}
              <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded shadow-md overflow-hidden">
              <div className="p-4 sm:p-6 pb-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                    {activeManuscript.genre}
                  </span>
                  <span className="text-[#A4B5AC]">•</span>
                  <span className="text-xs text-[#525B55] font-medium">
                    {activeManuscript.category}
                  </span>
                </div>
                
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active Session Book · Free to Read</span>
                </span>
              </div>

              {/* Main Content Body */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Cover */}
                  <div className="lg:col-span-4 flex justify-center">
                    <div className="w-full max-w-[260px] aspect-[3/4] bg-[#EFE9DE] rounded border border-[#DFD7CA] overflow-hidden shadow-md relative group">
                      <img
                        src={activeManuscript.coverImage}
                        alt={activeManuscript.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-[#143826]/90 text-[#FAF6F0] px-2.5 py-1.5 rounded text-[11px] font-semibold text-center backdrop-blur-xs">
                        {activeManuscript.pageCount} Pages · Authentic PDF
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143826] leading-tight">
                        {activeManuscript.title}
                      </h3>
                      {activeManuscript.subtitle && (
                        <p className="text-sm italic text-[#525B55] mt-1">
                          {activeManuscript.subtitle}
                        </p>
                      )}
                      <p className="text-base font-semibold text-[#143826] mt-2">
                        By {activeManuscript.author}
                      </p>
                    </div>

                    <p className="text-sm text-[#3E4642] leading-relaxed">
                      {activeManuscript.description}
                    </p>

                    {/* Scheduled Meeting Info */}
                    <div className="bg-[#FAF7F2] border border-[#EAE4D8] rounded p-4 text-xs space-y-2 text-[#464F4A]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#143826]">
                        <Calendar className="w-4 h-4 text-[#8C6D23]" />
                        <span>Scheduled Reading Session Discussion:</span>
                      </div>
                      <div className="font-medium text-[#1C1E1D] pl-6 text-sm">
                        {bookClubSession.discussionMeetingDate || 'Last Thursday of the Month · 7:00 PM EST'}
                      </div>
                      <div className="text-[#6D7771] pl-6">
                        Format: {bookClubSession.discussionMeetingFormat || 'Virtual Salon & Community Annotation Board'}
                      </div>
                    </div>

                    {/* Discussion Prompts */}
                    {bookClubSession.discussionPrompts && bookClubSession.discussionPrompts.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#143826]" />
                          <span>Discussion Prompts for Annotations</span>
                        </h4>
                        <ul className="space-y-2">
                          {bookClubSession.discussionPrompts.map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-[#3A423E] leading-relaxed">
                              <span className="font-mono text-[10px] font-bold text-[#8C6D23] mt-0.5">Q{idx + 1}.</span>
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Independent Views & Likes Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F0EAE1]">
                      <div className="flex items-center gap-4 text-xs text-[#525B55]">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-[#8C6D23]" />
                          <span className="font-bold text-[#143826]">{Math.min(980, activeManuscript.views || 842)}</span>
                          <span>Verified Readers</span>
                        </div>

                        <div className="h-4 w-px bg-[#E6DFD5]" />

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLike(activeManuscript.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                              likedManuscripts[activeManuscript.id]
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-[#FAF8F5] text-[#464F4A] border-[#D5CDBD] hover:bg-rose-50/50 hover:text-rose-600'
                            }`}
                            title="Like this manuscript"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                likedManuscripts[activeManuscript.id] ? 'text-rose-600 fill-rose-600' : 'text-[#717C76]'
                              }`}
                            />
                            <span>{activeManuscript.likes || 267}</span>
                          </button>
                          {likeFeedback[activeManuscript.id] && (
                            <span className="text-[11px] font-semibold text-rose-600">
                              {likeFeedback[activeManuscript.id]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Primary Reading Action: 100% Free Access */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                          onClick={() => openReader(activeManuscript, batchSchedule.currentBatch?.startPage)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                        >
                          <BookOpen className="w-4 h-4 text-[#C5A059]" />
                          <span>Read Online (Free In-Browser Access)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ============================================================== */}
                {/* DAILY CHAPTER BATCH RELEASE SYSTEM CONSOLE                      */}
                {/* ============================================================== */}
                <div className="mt-8 pt-8 border-t border-[#F0EAE1]">
                  <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 sm:p-7 space-y-6">
                    
                    {/* Console Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE4D8] pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#143826]/10 text-[#143826] text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-[#143826]/15">
                          <Calendar className="w-3 h-3 text-[#8C6D23]" />
                          <span>Sequential Reading Schedule</span>
                        </div>
                        <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#143826]">
                          Daily Chapter Batch Release System
                        </h4>
                        <p className="text-xs text-[#525B55] mt-0.5 max-w-2xl leading-relaxed">
                          Readers receive chapters in daily batches (default: {batchSchedule.chaptersPerDay} consecutive chapters per day). Only today’s scheduled batch is newly accessible, while all previously released chapters may be revisited at any time.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded bg-[#FAF6F0] text-[#143826] border border-[#C5A059]/40 shadow-2xs">
                          Pacing: <strong>{batchSchedule.chaptersPerDay} Chapters / Day</strong>
                        </span>
                      </div>
                    </div>

                    {/* Notice Toast if user clicks locked batch */}
                    {batchNotice && (
                      <div className="p-3 bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] text-xs rounded flex items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-[#D97706] shrink-0" />
                          <span>{batchNotice}</span>
                        </div>
                        <button
                          onClick={() => setBatchNotice(null)}
                          className="p-1 text-[#92400E] hover:text-[#78350F] rounded cursor-pointer shrink-0"
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    {/* Three-Card Status & Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Card 1: Today's Active Batch */}
                      <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded p-4 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                            Active Today · Day {batchSchedule.currentDay}
                          </span>
                          <span className="text-[11px] text-[#717C76] font-mono">
                            Pages {batchSchedule.currentBatch?.startPage}–{batchSchedule.currentBatch?.endPage}
                          </span>
                        </div>
                        <div className="pt-1">
                          <div className="text-xs text-[#717C76] uppercase tracking-wider font-semibold">Today's Batch</div>
                          <h5 className="font-serif text-base font-bold text-[#143826] line-clamp-2 mt-0.5">
                            {batchSchedule.currentBatch?.chapters.map((c) => `Ch. ${c.index}`).join(' & ')}
                          </h5>
                          <p className="text-xs text-[#525B55] truncate mt-0.5">
                            {batchSchedule.currentBatch?.chapters.map((c) => c.title).join(' • ')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openReader(activeManuscript, batchSchedule.currentBatch?.startPage)}
                          className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Read Today's Chapters</span>
                        </button>
                      </div>

                      {/* Card 2: Community Reading Progress */}
                      <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-4 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#8C6D23] bg-[#FEF3C7]/60 px-2 py-0.5 rounded border border-[#FCD34D]/60">
                            Reading Progress
                          </span>
                          <span className="font-bold text-[#143826] font-mono">
                            {batchSchedule.progressPercentage}%
                          </span>
                        </div>
                        
                        <div className="pt-1">
                          <div className="text-sm font-semibold text-[#143826]">
                            {batchSchedule.releasedChaptersCount} of {batchSchedule.totalChapters} Chapters Released
                          </div>
                          <div className="w-full bg-[#EAE4D8] h-2 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-gradient-to-r from-[#143826] to-[#C5A059] h-full rounded-full transition-all duration-500"
                              style={{ width: `${batchSchedule.progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-[#717C76] mt-2">
                            <span>{batchSchedule.releasedBatchesCount} batches available</span>
                            <span>{batchSchedule.totalBatches - batchSchedule.releasedBatchesCount} upcoming</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#636E67] pt-1 border-t border-[#F0EAE1]">
                          Unlocked through page <strong>{batchSchedule.maxUnlockedPage}</strong>
                        </div>
                      </div>

                      {/* Card 3: Next Batch Unlock */}
                      <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-4 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#4A534E] bg-[#F3EFEA] px-2 py-0.5 rounded border border-[#E2DBD0]">
                            Next Release Date
                          </span>
                          <Lock className="w-3.5 h-3.5 text-[#8C6D23]" />
                        </div>
                        
                        <div className="pt-1">
                          {batchSchedule.nextBatch ? (
                            <>
                              <div className="text-xs text-[#717C76] uppercase tracking-wider font-semibold">
                                Day {batchSchedule.nextBatch.dayNumber} Batch
                              </div>
                              <div className="text-base font-bold text-[#143826] mt-0.5">
                                {batchSchedule.nextReleaseDateFormatted}
                              </div>
                              <p className="text-xs text-[#525B55] truncate mt-0.5">
                                {batchSchedule.nextBatch.chapters.map((c) => `Ch. ${c.index}: ${c.title}`).join(' & ')}
                              </p>
                              <div className="text-[11px] text-[#8C6D23] font-medium mt-2 bg-[#FAF6F0] p-1.5 rounded border border-[#EAE4D8] flex items-center gap-1.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span>Unlocks at 12:00 AM for all readers</span>
                              </div>
                            </>
                          ) : (
                            <div className="py-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                                <span>All chapter batches released!</span>
                              </span>
                              <p className="text-xs text-[#525B55] mt-1">
                                Complete manuscript is now fully readable online.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Batch-by-Batch Reading Schedule List */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif text-sm sm:text-base font-semibold text-[#143826] flex items-center gap-2">
                          <BookMarked className="w-4 h-4 text-[#8C6D23]" />
                          <span>Sequential Daily Batch Breakdown</span>
                        </h5>

                        {batchSchedule.batches.length > 5 && (
                          <button
                            type="button"
                            onClick={() => setShowAllBatches(!showAllBatches)}
                            className="text-xs text-[#143826] hover:text-[#8C6D23] font-semibold underline cursor-pointer"
                          >
                            {showAllBatches ? 'Show Active & Next' : `View All ${batchSchedule.batches.length} Batches`}
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {(showAllBatches ? batchSchedule.batches : batchSchedule.batches.slice(0, 5)).map((batch) => {
                          return (
                            <div
                              key={batch.batchNumber}
                              className={`p-3.5 sm:p-4 rounded border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                batch.isCurrentDay
                                  ? 'bg-[#FFFFFF] border-2 border-[#143826] shadow-xs'
                                  : batch.isReleased
                                  ? 'bg-[#FAF8F5] border-[#E6DFD5]'
                                  : 'bg-[#F5F2EB]/50 border-[#E8E2D7] opacity-80'
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded flex items-center justify-center shrink-0 font-bold text-xs ${
                                    batch.isCurrentDay
                                      ? 'bg-[#143826] text-[#FAF6F0]'
                                      : batch.isReleased
                                      ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                                      : 'bg-[#ECE5D8] text-[#717C76]'
                                  }`}
                                >
                                  {batch.isLocked ? <Lock className="w-4 h-4" /> : `D${batch.dayNumber}`}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-serif text-sm font-bold text-[#143826]">
                                      Day {batch.dayNumber}: {batch.chapters.map((c) => `Chapter ${c.index}`).join(' & ')}
                                    </span>
                                    {batch.isCurrentDay && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                                        Available Today
                                      </span>
                                    )}
                                    {batch.isReleased && !batch.isCurrentDay && (
                                      <span className="text-[10px] font-semibold text-[#525B55] bg-[#EFEBE4] px-1.5 py-0.5 rounded">
                                        Released · Revisit Anytime
                                      </span>
                                    )}
                                    {batch.isLocked && (
                                      <span className="text-[10px] font-semibold text-[#8C6D23] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FCD34D]/60 flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>Unlocks {batch.releaseDateFormatted}</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-xs text-[#525B55] mt-1 space-y-0.5">
                                    {batch.chapters.map((ch) => (
                                      <div key={ch.index} className="truncate">
                                        <span className="font-medium text-[#1C1E1D]">Ch. {ch.index}:</span> {ch.title}{' '}
                                        <span className="text-[#8C6D23] font-mono text-[11px]">(p. {ch.startPage}–{ch.endPage})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                                {batch.isCurrentDay ? (
                                  <button
                                    type="button"
                                    onClick={() => openReader(activeManuscript, batch.startPage)}
                                    className="px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs flex items-center gap-1.5"
                                  >
                                    <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                                    <span>Read Batch</span>
                                  </button>
                                ) : batch.isReleased ? (
                                  <button
                                    type="button"
                                    onClick={() => openReader(activeManuscript, batch.startPage)}
                                    className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#EAE4D8] text-[#143826] border border-[#D5CDBD] rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                                  >
                                    <RotateCw className="w-3.5 h-3.5 text-[#8C6D23]" />
                                    <span>Revisit Chapters</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBatchNotice(
                                        `Day ${batch.dayNumber} (${batch.chapters.map((c) => c.title).join(' & ')}) unlocks on ${batch.releaseDateFormatted}. Readers cannot skip ahead.`
                                      );
                                    }}
                                    className="px-3 py-1.5 bg-[#ECE7DC] text-[#7A857F] rounded text-xs font-medium cursor-not-allowed flex items-center gap-1.5"
                                  >
                                    <Lock className="w-3.5 h-3.5 text-[#8C6D23]" />
                                    <span>Locked until {batch.releaseDateFormatted}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {batchSchedule.batches.length > 5 && !showAllBatches && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAllBatches(true)}
                            className="text-xs text-[#143826] hover:text-[#8C6D23] font-semibold underline cursor-pointer"
                          >
                            + Show all {batchSchedule.batches.length} reading batches ({batchSchedule.totalChapters} chapters)
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Community Reading Covenant Footer Notice */}
                    <div className="pt-4 border-t border-[#EAE4D8] flex items-start gap-2.5 text-xs text-[#525B55]">
                      <ShieldCheck className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Shared Reading Pace:</strong> To preserve the integrity of literary discussions, all readers advance through the manuscript on the same schedule. Readers are welcome to revisit previously released chapters at any time. Skipping ahead to future chapter groups is not permitted.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Rate This Book & Share Your Thoughts About This Story */}
            <BookReviewsSection
              manuscriptId={activeManuscript.id}
              bookTitle={activeManuscript.title}
            />
          </>
        ) : (
            /* No Active Session State */
            <div className="p-8 sm:p-12 bg-[#FFFFFF] border border-[#E6DFD5] rounded text-center max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#8C6D23]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143826]">
                Our next Book Club selection will be announced soon
              </h3>
              <p className="text-xs sm:text-sm text-[#525B55] leading-relaxed">
                The administrator has concluded the previous reading session. The next manuscript will be selected and unlocked shortly for our community reading programme.
              </p>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: REMAINING MANUSCRIPTS (LOCKED — AWAITING NEXT TURN) */}
        {/* ============================================================== */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FAF6F0] text-[#8C6D23] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#C5A059]/40">
                <Lock className="w-3.5 h-3.5" />
                <span>One-At-A-Time Reading System</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
                Upcoming Manuscripts (Locked — Awaiting Next Turn)
              </h2>
              <p className="text-xs sm:text-sm text-[#525B55] mt-1 max-w-2xl leading-relaxed">
                To foster focused, shared discussions, our club moves sequentially through one author manuscript at a time. The titles below will unlock in future reading sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedUpcomingManuscripts.map((ms) => {
              const isLiked = !!likedManuscripts[ms.id];
              const feedback = likeFeedback[ms.id];

              return (
                <div
                  key={ms.id}
                  className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-2xs flex flex-col justify-between overflow-hidden opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div>
                    {/* Locked Badge Header */}
                    <div className="p-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D23]">
                        {ms.genre}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F3EFEA] text-[#636E67] border border-[#D5CDBD]">
                        <Lock className="w-3 h-3 text-[#A4B5AC]" />
                        <span>Awaiting Next Turn</span>
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex gap-4">
                      <div className="w-24 h-32 bg-[#EFE9DE] rounded border border-[#DFD7CA] overflow-hidden shrink-0 shadow-2xs relative">
                        <img
                          src={ms.coverImage}
                          alt={ms.title}
                          className="w-full h-full object-cover grayscale-30"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[#0A1B14]/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#FAF6F0] drop-shadow-sm" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base font-bold text-[#143826] leading-tight line-clamp-2">
                          {ms.title}
                        </h4>
                        {ms.subtitle && (
                          <p className="text-[11px] italic text-[#525B55] mt-0.5 line-clamp-1">
                            {ms.subtitle}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-[#143826] mt-1">
                          By {ms.author}
                        </p>
                        <p className="text-[11px] text-[#717C76] mt-1">
                          {ms.pageCount} Pages · Authentic Manuscript
                        </p>
                        <p className="text-xs text-[#525B55] mt-2 line-clamp-2 leading-relaxed">
                          {ms.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer with locked action and like */}
                  <div className="p-4 pt-3 border-t border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLike(ms.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-[#FFFFFF] text-[#464F4A] border-[#D5CDBD] hover:bg-rose-50/50'
                        }`}
                        title="Express excitement for this upcoming manuscript"
                      >
                        <Heart
                          className={`w-3 h-3 ${isLiked ? 'text-rose-600 fill-rose-600' : 'text-[#717C76]'}`}
                        />
                        <span className="text-[11px] font-bold">{ms.likes || 194}</span>
                      </button>
                      {feedback && (
                        <span className="text-[10px] font-semibold text-rose-600">
                          {feedback}
                        </span>
                      )}
                    </div>

                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ECE6DC] text-[#7A857F] text-xs font-semibold cursor-not-allowed border border-[#D5CDBD]"
                      title="This manuscript will unlock when selected by the administrator as the next active Book Club book"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#8C6D23]" />
                      <span>Locked Awaiting Turn</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: READING HISTORY / COMPLETED SESSIONS */}
        {/* ============================================================== */}
        {bookClubSession?.readingHistory && bookClubSession.readingHistory.length > 0 && (
          <div className="mb-14 bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-4">
              <Clock className="w-4 h-4 text-[#8C6D23]" />
              <span>Book Club Reading History</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#143826] mb-4">
              Completed Reading Sessions
            </h3>
            <div className="divide-y divide-[#F0EAE1]">
              {bookClubSession.readingHistory.map((historyItem, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-[#143826] font-serif text-sm">
                      {historyItem.sessionTitle || historyItem.manuscriptId}
                    </strong>
                    {historyItem.author && (
                      <span className="text-[#525B55] ml-2">by {historyItem.author}</span>
                    )}
                  </div>
                  <div className="text-[#7A857F] text-[11px]">
                    Completed on {new Date(historyItem.completedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3b: 2026 READING CHALLENGE AUTHOR PARTICIPATION PACKAGE */}
        {/* ============================================================== */}
        <div id="author-challenge-package" className="mb-14 bg-[#FFFFFF] border-2 border-[#C5A059] rounded-lg shadow-md overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-[#143826] text-[#FAF6F0] p-6 sm:p-8 border-b-2 border-[#C5A059]/40 relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E8D4B4]/20 text-[#E8D4B4] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#E8D4B4]/30 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Author Opportunity · 2026 Literary Programme</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFFDF9]">
                2026 Reading Challenge Author Participation Package
              </h2>

              <p className="mt-2 text-sm sm:text-base text-[#D1DDD6] leading-relaxed">
                This package is designed for authors who want their books featured in The Book Clique&apos;s Reading Challenge and receive additional promotional support.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#E8D4B4] bg-[#0A1B14]/80 px-3 py-1.5 rounded border border-[#C5A059]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Notice: This fee applies strictly to participating authors. Community reading of active books in the Book Club remains 100% free for all readers.</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            
            {/* Prominent Participation Fee Display */}
            <div className="bg-[#FAF8F5] border-2 border-[#143826] rounded-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] block">
                  Official Author Participation Fee
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#143826]">
                    $213
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-[#8C6D23]">
                    – One-Time Registration Fee
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-[#4A534E] leading-relaxed max-w-xl">
                  The $213 registration fee is a one-time participation payment. All promotional benefits listed in this package are included at no additional cost. There are no additional charges for the promotional benefits listed below.
                </p>
              </div>

              {/* Prominent "Reserve Your Place" Button */}
              <div className="shrink-0 flex flex-col sm:items-end gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('thebookclique.official@gmail.com')}&su=${encodeURIComponent('2026 Reading Challenge Registration Enquiry – The Book Clique')}&body=${encodeURIComponent("Hello The Book Clique Team,\n\nI am interested in reserving a place for my book in The Book Clique's 2026 Reading Challenge.\n\nPlease provide me with the registration details and the next steps for participation.\n\nBook Title:\nAuthor's Full Name:\nAuthor's Email Address:\n\nI look forward to hearing from you.\n\nKind regards,")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md text-center"
                >
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span>Reserve Your Place</span>
                  <ExternalLink className="w-4 h-4 text-[#FAF6F0]/80" />
                </a>

                <div className="text-[11px] text-[#717C76] flex items-center gap-1 sm:justify-end">
                  <span>Alternative mail client:</span>
                  <a
                    href={`mailto:thebookclique.official@gmail.com?subject=${encodeURIComponent('2026 Reading Challenge Registration Enquiry – The Book Clique')}&body=${encodeURIComponent("Hello The Book Clique Team,\n\nI am interested in reserving a place for my book in The Book Clique's 2026 Reading Challenge.\n\nPlease provide me with the registration details and the next steps for participation.\n\nBook Title:\nAuthor's Full Name:\nAuthor's Email Address:\n\nI look forward to hearing from you.\n\nKind regards,")}`}
                    className="font-medium text-[#143826] underline hover:text-[#8C6D23]"
                  >
                    Open Default Email App
                  </a>
                </div>
              </div>
            </div>

            {/* What Authors Receive: All 7 Specific Benefits in Polished Cards */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                  Package Inclusions
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143826] mt-0.5">
                  What Authors Receive
                </h3>
                <p className="text-xs sm:text-sm text-[#525B55] mt-1">
                  Registration includes the following seven dedicated visibility and promotional assets:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                
                {/* 1. Reading Challenge Book Placement */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Reading Challenge Book Placement
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    Placement of the author&apos;s book in The Book Clique&apos;s 2026 Reading Challenge, giving it an opportunity to be presented to our reading community.
                  </p>
                </div>

                {/* 2. Six Months of Free Visibility in 2027 */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Six Months of Free Visibility in 2027
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    Continued visibility for the book for six months during 2027 to sustain reader discovery into the following year.
                  </p>
                </div>

                {/* 3. Free Marketing Support */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Free Marketing Support
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    Additional promotional assistance to help increase awareness of the book across our network and literary channels.
                  </p>
                </div>

                {/* 4. WTO Support */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    WTO Support
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    WTO Support included as a named package benefit, retaining the wording supplied by the website owner.
                  </p>
                </div>

                {/* 5. Amazon Page Optimization */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Amazon Page Optimization
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    Support to improve the presentation and discoverability of the book&apos;s Amazon page for potential readers.
                  </p>
                </div>

                {/* 6. Free Book Mockup */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    6
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Free Book Mockup
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    A professional promotional mockup of the author&apos;s book designed for publishing-grade presentation.
                  </p>
                </div>

                {/* 7. Amazon Page Visibility Support */}
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 space-y-2 hover:border-[#143826] transition-colors shadow-2xs md:col-span-2 lg:col-span-1">
                  <div className="w-9 h-9 rounded bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-bold text-xs">
                    7
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#143826]">
                    Amazon Page Visibility Support
                  </h4>
                  <p className="text-xs text-[#4A534E] leading-relaxed">
                    Additional support aimed at increasing the book&apos;s visibility on Amazon.
                  </p>
                </div>

              </div>
            </div>

            {/* Transparency, Terms & Reservation Note */}
            <div className="p-4 sm:p-5 bg-[#FAF6F0] border border-[#EAE4D8] rounded text-xs text-[#525B55] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#143826]">
                <ShieldCheck className="w-4 h-4 text-[#8C6D23]" />
                <span>Enquiry &amp; Registration Safeguards</span>
              </div>
              <p className="leading-relaxed">
                Clicking <strong>&ldquo;Reserve Your Place&rdquo;</strong> initiates an email correspondence enquiry with our team at <code className="text-[#143826] font-mono">thebookclique.official@gmail.com</code>. We do not automatically charge visitors or process payments online, nor is a place reserved merely by clicking the button. Registration is confirmed only after our team has reviewed the enquiry and completed the registration process.
              </p>
              <p className="leading-relaxed text-[#717C76]">
                * The Book Clique does not describe this participation package as a guarantee of sales, reviews, rankings, publication or specific marketing results.
              </p>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* SECTION 4: 2-COLUMN READING CHALLENGES & SIGNUP FORM */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Reading Challenges & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-4">
                <Award className="w-4 h-4 text-[#8C6D23]" />
                <span>Reading Challenge &amp; Milestones</span>
              </div>

              <div className="space-y-4">
                {readingChallenges.map((rc) => (
                  <div key={rc.id} className="p-4 bg-[#FAF7F2] rounded border border-[#EAE4D8]">
                    <span className="text-[10px] font-semibold text-[#717C76] uppercase tracking-wider">
                      {rc.period}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-[#143826] mt-0.5">
                      {rc.title}
                    </h4>
                    <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                      {rc.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#143826] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Target: {rc.targetCount} books completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EAE4D8] rounded p-6 text-xs text-[#525B55] space-y-2">
              <h4 className="font-serif text-base font-semibold text-[#143826]">
                Our Literary Community Code
              </h4>
              <p className="leading-relaxed">
                We believe in thoughtful discourse, respectful critique, and welcoming readers of all backgrounds. Discussion sessions focus on thematic discovery and respectful literary appreciation.
              </p>
            </div>
          </div>

          {/* Right: Join Club Form */}
          <div id="join-club-form" className="lg:col-span-7 bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Users className="w-4 h-4 text-[#8C6D23]" />
              <span>Membership Registration</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#143826]">
              Join The Book Club Community
            </h3>
            <p className="text-xs text-[#525B55] mt-1 mb-6 leading-relaxed">
              Register to receive invitations to our salon discussions, discussion reading prompts, and announcements whenever a new manuscript is unlocked for reading.
            </p>

            {signupStatus === 'success' && (
              <div className="mb-6 p-4 bg-[#DCFCE7] border border-[#86EFAC] rounded text-xs text-[#15803D] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You have been registered for The Book Club! Welcome to our literary salon.</span>
              </div>
            )}

            {signupStatus === 'error' && (
              <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded text-xs text-[#991B1B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. eleanor@example.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Reading Goal
                </label>
                <select
                  value={readingGoal}
                  onChange={(e) => setReadingGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                >
                  <option value="1 book per month">1 book per month</option>
                  <option value="2 books per month">2 books per month (Recommended)</option>
                  <option value="3+ books per month">3+ books per month</option>
                  <option value="Casual reader">Casual reader</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Register for Book Club (Free)
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

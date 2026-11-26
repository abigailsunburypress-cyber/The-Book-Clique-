import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Users,
  CheckCircle2,
  MessageSquare,
  Award,
  AlertCircle,
  BookMarked,
  ArrowLeft,
  Home,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookReviewsSection } from './BookReviewsSection';

export const BookClubView: React.FC = () => {
  const {
    bookClubSelection,
    readingChallenges,
    submitBookClubSignup,
    setActiveView,
    currentReader,
    openReaderAuthModal,
    logoutReader
  } = useApp();

  // Signup form state for regular book club
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(['Productivity & Nonfiction']);
  const [readingGoal, setReadingGoal] = useState('2 books per month');
  const [signupStatus, setSignupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const amazonUrl =
    bookClubSelection.amazonUrl ||
    'https://www.amazon.com/Slow-Productivity-Accomplishment-Without-Burnout-ebook/dp/B0C7716FW1';
  const authorAmazonUrl =
    bookClubSelection.authorAmazonUrl ||
    'https://www.amazon.com/Cal-Newport/e/B001IGNR0U/';
  const authorEmail = bookClubSelection.authorEmail || 'calnewport.novel@gmail.com';
  const coverImage = bookClubSelection.coverImage;

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
        <div className="border-b border-[#E6DFD5] pb-8 mb-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Curated Literary Fellowship · Book Club
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
              The Book Club Community
            </h1>
            <p className="text-sm sm:text-base text-[#525B55] mt-2 leading-relaxed">
              An attentive reading fellowship uniting readers around thoughtful books, honest discussion, and shared literary discovery.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OFFICIAL BOOK CLUB SELECTION                                   */}
        {/* ============================================================== */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#143826]/10 text-[#143826] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#143826]/20">
                <BookMarked className="w-3.5 h-3.5 text-[#8C6D23]" />
                <span>Current Book Club Selection</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
                Official Book Club Selection
              </h2>
              <p className="text-xs sm:text-sm text-[#525B55] mt-1 max-w-2xl leading-relaxed">
                Join our reading community as we explore this month&apos;s featured book, share five-star ratings, and discuss key takeaways below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
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
                  onClick={() => openReaderAuthModal(undefined, 'Register to Rate & Comment', 'register')}
                  className="px-3.5 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                >
                  Register as Reader
                </button>
              )}
            </div>
          </div>

          {/* Book Club Selection Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 pb-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                  {bookClubSelection.genre}
                </span>
                <span className="text-[#A4B5AC]">•</span>
                <span className="text-xs text-[#525B55] font-medium">
                  {bookClubSelection.month} {bookClubSelection.year} Selection
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Featured Book Club Pick</span>
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Book Cover */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-full max-w-[280px] aspect-[3/4] bg-[#FAF8F5] rounded border border-[#DFD7CA] overflow-hidden shadow-md relative group flex items-center justify-center">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={`Book cover for ${bookClubSelection.bookTitle} by ${bookClubSelection.author}`}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-3 flex flex-col items-center justify-center">
                        <BookOpen className="w-10 h-10 text-[#8C6D23]" />
                        <div className="font-serif text-lg font-semibold text-[#143826]">
                          {bookClubSelection.bookTitle}
                        </div>
                        <div className="text-xs text-[#525B55]">
                          by {bookClubSelection.author}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143826] leading-tight">
                      {bookClubSelection.bookTitle}
                    </h3>
                    {bookClubSelection.subtitle && (
                      <p className="font-serif text-base sm:text-lg text-[#4A534E] mt-1">
                        {bookClubSelection.subtitle}
                      </p>
                    )}
                    <p className="text-base font-semibold text-[#143826] mt-2">
                      by{' '}
                      <a
                        href={authorAmazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#8C6D23] underline decoration-[#C5A059] underline-offset-4"
                      >
                        {bookClubSelection.author}
                      </a>
                    </p>
                  </div>

                  <p className="text-sm text-[#3E4642] leading-relaxed">
                    {bookClubSelection.synopsis}
                  </p>

                  {/* Author Contact Email */}
                  {authorEmail && (
                    <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-xs text-[#4A534E] flex flex-wrap items-center gap-2">
                      <Mail className="w-4 h-4 text-[#8C6D23] shrink-0" />
                      <strong className="text-[#143826]">Author Contact:</strong>
                      <a
                        href={`mailto:${authorEmail}`}
                        className="font-mono font-semibold text-[#143826] hover:text-[#8C6D23] underline decoration-[#C5A059]"
                      >
                        {authorEmail}
                      </a>
                    </div>
                  )}

                  {/* Scheduled Meeting Info */}
                  {(bookClubSelection.meetingDate || bookClubSelection.meetingFormat) && (
                    <div className="bg-[#FAF7F2] border border-[#EAE4D8] rounded p-4 text-xs space-y-2 text-[#464F4A]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#143826]">
                        <Calendar className="w-4 h-4 text-[#8C6D23]" />
                        <span>Community Discussion Salon:</span>
                      </div>
                      {bookClubSelection.meetingDate && (
                        <div className="font-medium text-[#1C1E1D] pl-6 text-sm">
                          {bookClubSelection.meetingDate}
                        </div>
                      )}
                      {bookClubSelection.meetingFormat && (
                        <div className="text-[#6D7771] pl-6">
                          Format: {bookClubSelection.meetingFormat}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discussion Prompts */}
                  {bookClubSelection.discussionPrompts && bookClubSelection.discussionPrompts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#143826]" />
                        <span>Book Club Discussion Prompts</span>
                      </h4>
                      <ul className="space-y-2">
                        {bookClubSelection.discussionPrompts.map((prompt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#3A423E] leading-relaxed">
                            <span className="font-mono text-[10px] font-bold text-[#8C6D23] mt-0.5">Q{idx + 1}.</span>
                            <span>{prompt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prominent Read on Amazon & Amazon Author Page CTAs */}
                  <div className="pt-3 border-t border-[#F0EAE1] flex flex-wrap items-center gap-3">
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>Read on Amazon</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#FAF6F0]/80" />
                    </a>

                    <a
                      href={authorAmazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded bg-[#FAF6F0] hover:bg-[#EAE4D8] text-[#143826] border border-[#D5CDBD] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Amazon Author Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8C6D23]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Reader Ratings & Comments (Preserved 51 Comments + Live Submissions) */}
          <BookReviewsSection
            manuscriptId="slow-productivity"
            bookTitle={bookClubSelection.bookTitle}
          />
        </div>

        {/* ============================================================== */}
        {/* READING CHALLENGES & MEMBERSHIP SIGNUP FORM                    */}
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
              Register to receive invitations to our salon discussions, discussion reading prompts, and announcements whenever a new Book Club selection is announced.
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

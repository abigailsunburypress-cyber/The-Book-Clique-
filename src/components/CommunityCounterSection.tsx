import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunityCounterSection: React.FC = () => {
  const {
    communityStats,
    followCommunity,
    registerReaderAccount,
    unsubscribeCommunity,
    setActiveView
  } = useApp();

  // Modal states
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);

  // Follow form state
  const [followName, setFollowName] = useState('');
  const [followEmail, setFollowEmail] = useState('');
  const [updatesOptIn, setUpdatesOptIn] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'New Book Releases',
    'Author Spotlights'
  ]);
  const [followStatus, setFollowStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [followMsg, setFollowMsg] = useState('');

  // Reader registration form state
  const [readerName, setReaderName] = useState('');
  const [readerEmail, setReaderEmail] = useState('');
  const [readerStatus, setReaderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [readerMsg, setReaderMsg] = useState('');

  // Unsubscribe state
  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubStatus, setUnsubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [unsubMsg, setUnsubMsg] = useState('');

  // Format non-rounded numbers with thousands commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Toggle category checkbox
  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Handle Follow submission
  const handleFollowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followEmail.trim()) return;

    setFollowStatus('loading');
    setFollowMsg('');

    const res = await followCommunity({
      name: followName.trim(),
      email: followEmail.trim(),
      updatesOptIn,
      categories: selectedCategories
    });

    if (res.success) {
      setFollowStatus('success');
      setFollowMsg(res.message);
      setFollowName('');
      setFollowEmail('');
    } else {
      setFollowStatus('error');
      setFollowMsg(res.message || 'Unable to register follow. Please try again.');
    }
  };

  // Handle Reader registration submission
  const handleReaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerEmail.trim()) return;

    setReaderStatus('loading');
    setReaderMsg('');

    const res = await registerReaderAccount({
      name: readerName.trim(),
      email: readerEmail.trim()
    });

    if (res.success) {
      setReaderStatus('success');
      setReaderMsg(res.message);
      setReaderName('');
      setReaderEmail('');
    } else {
      setReaderStatus('error');
      setReaderMsg(res.message || 'Unable to register reader. Please try again.');
    }
  };

  // Handle Unsubscribe submission
  const handleUnsubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubEmail.trim()) return;

    setUnsubStatus('loading');
    setUnsubMsg('');

    const res = await unsubscribeCommunity(unsubEmail.trim());
    if (res.success) {
      setUnsubStatus('success');
      setUnsubMsg(res.message);
      setUnsubEmail('');
    } else {
      setUnsubStatus('error');
      setUnsubMsg(res.message || 'Could not process unsubscribe request.');
    }
  };

  return (
    <section className="relative py-16 sm:py-24 bg-[#143826] text-[#FAF6F0] overflow-hidden border-t border-b border-[#C5A059]/30">
      
      {/* Literary World Map & Constellation Dots Background */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle World Map Latitude/Longitude Curves */}
          <path
            d="M 100,300 Q 600,200 1100,300"
            stroke="#C5A059"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path
            d="M 100,180 Q 600,100 1100,180"
            stroke="#C5A059"
            strokeWidth="0.8"
            strokeDasharray="3 5"
          />
          <path
            d="M 100,420 Q 600,500 1100,420"
            stroke="#C5A059"
            strokeWidth="0.8"
            strokeDasharray="3 5"
          />
          <line x1="300" y1="50" x2="300" y2="550" stroke="#C5A059" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="600" y1="50" x2="600" y2="550" stroke="#C5A059" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="900" y1="50" x2="900" y2="550" stroke="#C5A059" strokeWidth="0.6" strokeDasharray="2 4" />

          {/* Connected Literary Reader Hubs (London, NY, Tokyo, Paris, Sydney, Lagos, etc.) */}
          <g stroke="#C5A059" strokeWidth="1" strokeOpacity="0.4">
            <line x1="280" y1="220" x2="520" y2="180" />
            <line x1="520" y1="180" x2="560" y2="200" />
            <line x1="560" y1="200" x2="980" y2="220" />
            <line x1="520" y1="180" x2="560" y2="340" />
            <line x1="980" y1="220" x2="1020" y2="450" />
            <line x1="280" y1="220" x2="320" y2="380" />
          </g>

          {/* Glowing Hub Nodes */}
          <circle cx="280" cy="220" r="5" fill="#C5A059" fillOpacity="0.8" />
          <circle cx="520" cy="180" r="6" fill="#FAF6F0" fillOpacity="0.9" />
          <circle cx="560" cy="200" r="4" fill="#C5A059" fillOpacity="0.8" />
          <circle cx="980" cy="220" r="5" fill="#FAF6F0" fillOpacity="0.9" />
          <circle cx="560" cy="340" r="4.5" fill="#C5A059" fillOpacity="0.8" />
          <circle cx="1020" cy="450" r="5" fill="#C5A059" fillOpacity="0.8" />
          <circle cx="320" cy="380" r="4" fill="#FAF6F0" fillOpacity="0.7" />
          <circle cx="700" cy="260" r="3.5" fill="#C5A059" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Decorative Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E271A]/70 via-transparent to-[#0E271A]/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge & Section Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#C5A059]/20 text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#C5A059]/40 backdrop-blur-xs">
          <Globe className="w-4 h-4 text-[#C5A059]" />
          <span>Global Literary Network · Across 42+ Countries</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#FAF6F0]">
          Our Growing Global Community
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[#E8D4B4] max-w-2xl mx-auto leading-relaxed font-sans">
          Bringing readers and book lovers together across countries and cultures.
        </p>

        {/* Counters Grid: Side by side on desktop, stacked neatly on mobile */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          
          {/* COUNTER 1: READERS */}
          <div className="bg-[#19442F]/90 border border-[#C5A059]/35 rounded-sm p-8 sm:p-10 backdrop-blur-sm shadow-xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-[#C5A059] transition-all">
            <div className="absolute -right-8 -bottom-8 opacity-10 text-[#C5A059] pointer-events-none group-hover:scale-110 transition-transform">
              <BookOpen className="w-44 h-44" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#143826] px-2.5 py-1 rounded border border-[#C5A059]/30">
                  Active Reader Directory
                </span>
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#E8D4B4] block">
                Registered Readers
              </span>

              {/* Large, Clear Non-Rounded Number */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#FAF6F0]">
                  {formatNumber(communityStats.totalReaders)}
                </span>
                <span className="text-xs text-[#C5A059] font-sans font-semibold">
                  Readers
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-[#E0D9CE] leading-relaxed">
                The number of people registered to read full-length books and manuscripts on The Book Clique online platform.
              </p>
            </div>

            {/* Readers Action Row */}
            <div className="mt-8 pt-5 border-t border-[#C5A059]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => setActiveView('bookclub')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#FAF6F0] hover:bg-[#FFFFFF] text-[#143826] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                <span>Read in Book Club</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <button
                onClick={() => {
                  setReaderStatus('idle');
                  setReaderMsg('');
                  setIsReaderModalOpen(true);
                }}
                className="text-xs text-[#E8D4B4] hover:text-[#FAF6F0] underline font-medium text-center sm:text-right cursor-pointer"
              >
                Register as a Reader
              </button>
            </div>
          </div>

          {/* COUNTER 2: FOLLOWERS */}
          <div className="bg-[#19442F]/90 border border-[#C5A059]/35 rounded-sm p-8 sm:p-10 backdrop-blur-sm shadow-xl flex flex-col justify-between text-left relative overflow-hidden group hover:border-[#C5A059] transition-all">
            <div className="absolute -right-8 -bottom-8 opacity-10 text-[#C5A059] pointer-events-none group-hover:scale-110 transition-transform">
              <Users className="w-44 h-44" />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#143826] px-2.5 py-1 rounded border border-[#C5A059]/30">
                  Literary Followers
                </span>
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#E8D4B4] block">
                Community Followers
              </span>

              {/* Large, Clear Non-Rounded Number */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#FAF6F0]">
                  {formatNumber(communityStats.totalFollowers)}
                </span>
                <span className="text-xs text-[#C5A059] font-sans font-semibold">
                  Followers
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-[#E0D9CE] leading-relaxed">
                The number of people following The Book Clique to receive updates about new books, authors, and reading opportunities.
              </p>
            </div>

            {/* Followers Action Row: Clear "Follow The Book Clique" Button */}
            <div className="mt-8 pt-5 border-t border-[#C5A059]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  setFollowStatus('idle');
                  setFollowMsg('');
                  setIsFollowModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF67] text-[#143826] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-[#143826]" />
                <span>Follow The Book Clique</span>
              </button>

              <span className="text-[11px] text-[#C5A059] font-sans text-center sm:text-right">
                Free updates &amp; discoveries
              </span>
            </div>
          </div>

        </div>

        {/* Accuracy transparency note and Privacy/Unsubscribe link */}
        <div className="mt-8 text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[11px] text-[#C5A059]/90 font-sans leading-relaxed">
            * Verified community counts. Combining baseline global readers with live, verified platform registrations in real time. Following the website is independent from reading a book.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-[#E8D4B4]/70 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Zero Spam Guarantee</span>
            </span>
            <span>·</span>
            <button
              onClick={() => {
                setUnsubStatus('idle');
                setUnsubMsg('');
                setIsUnsubscribeModalOpen(true);
              }}
              className="hover:text-[#FAF6F0] underline transition-colors cursor-pointer"
            >
              Unsubscribe or Manage Notification Preferences
            </button>
          </div>
        </div>

      </div>

      {/* --- MODAL 1: FOLLOW THE BOOK CLIQUE --- */}
      {isFollowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] text-[#1C1E1D] border border-[#E6DFD5] rounded shadow-2xl max-w-md w-full overflow-hidden text-left relative flex flex-col">
            
            {/* Header */}
            <div className="p-5 bg-[#143826] text-[#FAF6F0] flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-bold">
                  Follow The Book Clique
                </h3>
              </div>
              <button
                onClick={() => setIsFollowModalOpen(false)}
                className="text-[#FAF6F0]/70 hover:text-[#FAF6F0] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form */}
            <form onSubmit={handleFollowSubmit} className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                Follow The Book Clique to receive announcements about newly published books, author spotlights, community book club picks, and literary promotions.
              </p>

              {followStatus === 'success' && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{followMsg}</span>
                </div>
              )}

              {followStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{followMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={followName}
                  onChange={(e) => setFollowName(e.target.value)}
                  placeholder="e.g. Margaret Atwood"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={followEmail}
                  onChange={(e) => setFollowEmail(e.target.value)}
                  placeholder="reader@bookclique.com"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
              </div>

              {/* Preferences */}
              <div>
                <span className="block text-xs font-semibold text-[#143826] mb-1.5">
                  What updates would you like to receive?
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#4A534E]">
                  {[
                    'New Book Releases',
                    'Author Spotlights',
                    'Book Club Picks',
                    'Author Marketing Tips'
                  ].map((category) => (
                    <label key={category} className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleToggleCategory(category)}
                        className="rounded text-[#143826] focus:ring-[#143826]"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="inline-flex items-start gap-2 text-xs text-[#525B55] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updatesOptIn}
                    onChange={(e) => setUpdatesOptIn(e.target.checked)}
                    className="mt-0.5 rounded text-[#143826] focus:ring-[#143826]"
                  />
                  <span>
                    Opt in to receive email notifications when new books and author announcements are released.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={followStatus === 'loading'}
                  className="w-full py-3 px-4 bg-[#143826] hover:bg-[#1E4D35] disabled:opacity-60 text-[#FAF6F0] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  {followStatus === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                      <span>Registering Follow...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#C5A059]" />
                      <span>Follow The Book Clique</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#7A857F] text-center">
                We protect your privacy. You can unsubscribe at any time with one click.
              </p>
            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 2: REGISTER AS A READER --- */}
      {isReaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] text-[#1C1E1D] border border-[#E6DFD5] rounded shadow-2xl max-w-md w-full overflow-hidden text-left relative flex flex-col">
            
            <div className="p-5 bg-[#143826] text-[#FAF6F0] flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-bold">
                  Register as a Reader
                </h3>
              </div>
              <button
                onClick={() => setIsReaderModalOpen(false)}
                className="text-[#FAF6F0]/70 hover:text-[#FAF6F0] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReaderSubmit} className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                Join our verified reader directory to track reading progress, access curated online manuscripts, and participate in literary discussions.
              </p>

              {readerStatus === 'success' && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{readerMsg}</span>
                </div>
              )}

              {readerStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{readerMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Reader Full Name
                </label>
                <input
                  type="text"
                  required
                  value={readerName}
                  onChange={(e) => setReaderName(e.target.value)}
                  placeholder="e.g. Jonathan Swift"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  placeholder="reader@bookclique.com"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={readerStatus === 'loading'}
                  className="w-full py-3 px-4 bg-[#143826] hover:bg-[#1E4D35] disabled:opacity-60 text-[#FAF6F0] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  {readerStatus === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                      <span>Registering Reader Account...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <span>Complete Reader Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 3: UNSUBSCRIBE / PREFERENCES --- */}
      {isUnsubscribeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] text-[#1C1E1D] border border-[#E6DFD5] rounded shadow-2xl max-w-md w-full overflow-hidden text-left relative flex flex-col">
            
            <div className="p-5 bg-[#143826] text-[#FAF6F0] flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-bold">
                  Manage Email Updates
                </h3>
              </div>
              <button
                onClick={() => setIsUnsubscribeModalOpen(false)}
                className="text-[#FAF6F0]/70 hover:text-[#FAF6F0] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUnsubscribeSubmit} className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                If you no longer wish to receive updates regarding new book releases and author spotlights, enter your email below to be removed immediately.
              </p>

              {unsubStatus === 'success' && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{unsubMsg}</span>
                </div>
              )}

              {unsubStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{unsubMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#143826] mb-1">
                  Email Address to Unsubscribe
                </label>
                <input
                  type="email"
                  required
                  value={unsubEmail}
                  onChange={(e) => setUnsubEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={unsubStatus === 'loading'}
                  className="w-full py-3 px-4 bg-[#9E2B22] hover:bg-[#85231C] disabled:opacity-60 text-[#FAF6F0] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  {unsubStatus === 'loading' ? (
                    <span>Processing Unsubscribe...</span>
                  ) : (
                    <span>Unsubscribe from Updates</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-[#7A857F] text-center">
                Your privacy is guaranteed. You will not receive any further correspondence.
              </p>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

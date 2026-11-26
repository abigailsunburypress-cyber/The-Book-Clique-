import React from 'react';
import { ArrowRight, Sparkles, BookOpen, BookMarked, ShieldCheck, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateBatchSchedule } from '../utils/chapterBatch';

export const FeaturedBooksSection: React.FC = () => {
  const { activeBookClubManuscript, openReader, setActiveView, bookClubSession } = useApp();
  const schedule = calculateBatchSchedule(activeBookClubManuscript, bookClubSession);

  const handleReadNow = () => {
    if (activeBookClubManuscript) {
      openReader(activeBookClubManuscript, schedule.currentBatch?.startPage);
    } else {
      setActiveView('bookclub');
    }
  };

  const handleVisitBookClub = () => {
    setActiveView('bookclub');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E8E1D5]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Official Book Club Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
              Featured Book of the Month
            </h2>
            <p className="text-sm text-[#525B55] mt-1.5 max-w-xl leading-relaxed">
              Directly connected to The Book Club’s curated, one-manuscript-at-a-time reading programme. All reading is free and in-browser.
            </p>
          </div>

          <button
            onClick={handleVisitBookClub}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#143826] hover:text-[#285D40] transition-colors py-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
          >
            <span>Explore The Book Club</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Manuscript Display or Announcement when None Active */}
        {activeBookClubManuscript && bookClubSession?.sessionStatus === 'active' ? (
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-10 transition-all hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Cover Column */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-[3/4] bg-[#EFE9DE] rounded border border-[#DFD7CA] overflow-hidden shadow-md relative group">
                  <img
                    src={activeBookClubManuscript.coverImage}
                    alt={activeBookClubManuscript.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-[#143826]/90 text-[#FAF6F0] px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs">
                    Current Selection
                  </div>
                </div>
              </div>

              {/* Information Column */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FAF6F0] text-[#143826] text-xs font-semibold uppercase tracking-wider border border-[#C5A059]/40">
                      <BookMarked className="w-3.5 h-3.5 text-[#8C6D23]" />
                      <span>Active Reading Session · {activeBookClubManuscript.genre}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#DCFCE7] text-[#15803D] text-xs font-semibold uppercase tracking-wider border border-[#86EFAC]">
                      <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Day {schedule.currentDay} Active ({schedule.chaptersPerDay} Chapters / Day)</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#143826] leading-tight">
                    {activeBookClubManuscript.title}
                  </h3>
                  {activeBookClubManuscript.subtitle && (
                    <p className="text-sm italic text-[#525B55]">
                      {activeBookClubManuscript.subtitle}
                    </p>
                  )}
                  <p className="text-base font-semibold text-[#143826]">
                    By {activeBookClubManuscript.author}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#525B55]">
                  <span className="font-semibold text-[#143826]">
                    {activeBookClubManuscript.pageCount} Pages
                  </span>
                  <span>•</span>
                  <span>Authentic Author Manuscript</span>
                  <span>•</span>
                  <span className="text-[#15803D] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Free In-Browser Reading</span>
                  </span>
                </div>

                {activeBookClubManuscript.description && (
                  <p className="text-sm text-[#3E4642] leading-relaxed max-w-2xl line-clamp-4">
                    {activeBookClubManuscript.description}
                  </p>
                )}

                {/* Session Meeting Strip if configured */}
                {bookClubSession?.discussionMeetingDate && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-xs text-[#4A534E]">
                    <strong className="text-[#143826]">Scheduled Salon Discussion: </strong>
                    <span>{bookClubSession.discussionMeetingDate}</span>
                    {bookClubSession.discussionMeetingFormat && (
                      <span className="text-[#7A857F]"> ({bookClubSession.discussionMeetingFormat})</span>
                    )}
                  </div>
                )}

                {/* Action Buttons linking directly to Book Club Reading */}
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={handleReadNow}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Read in Book Club</span>
                  </button>

                  <button
                    onClick={handleVisitBookClub}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#EAE3D4] hover:bg-[#DDD5C4] text-[#143826] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Discussion &amp; Salon Notes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* Announced soon placeholder when no manuscript is active */
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-10 sm:p-14 text-center max-w-3xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#8C6D23]">
              <BookMarked className="w-7 h-7" />
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
              Our next Book Club selection will be announced soon
            </h3>
            
            <p className="text-sm text-[#525B55] leading-relaxed max-w-lg mx-auto">
              The previous Book Club reading session has concluded. Our administrator is preparing the next curated author manuscript for our community reading programme.
            </p>

            <div className="pt-2">
              <button
                onClick={handleVisitBookClub}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                <span>Visit The Book Club</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

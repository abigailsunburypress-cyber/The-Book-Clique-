import React from 'react';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookClubInviteSection: React.FC = () => {
  const { setActiveView, bookClubSelection, activeBookClubManuscript, bookClubSession } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-[#0F291E] text-[#FBF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Literary Community Image */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded overflow-hidden border border-[#1D4A36] shadow-xl relative">
              <img
                src="/src/assets/images/reading_community_gathering_1793101460233.jpg"
                alt="Readers engaged in an inspiring literary discussion around a wooden table in a sunlit conservatory"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0A1B14]/90 backdrop-blur-xs rounded border border-[#1D4A36]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Current Reading Selection</span>
                </div>
                <p className="font-serif text-lg font-semibold text-[#FFFDF9] mt-0.5">
                  {activeBookClubManuscript
                    ? `"${activeBookClubManuscript.title}" by ${activeBookClubManuscript.author}`
                    : 'Next Selection Coming Soon'}
                </p>
                <p className="text-xs text-[#A9BDB2] mt-0.5 line-clamp-1">
                  {bookClubSession?.discussionMeetingDate || 'One manuscript at a time · Free in-browser access'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Invitation Copy & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-2">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Readers & Thinkers Welcome</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#FFFDF9] tracking-tight leading-tight">
                Join The Book Clique Literary Salon
              </h2>
              <p className="text-sm sm:text-base text-[#C2D4C9] mt-3 leading-relaxed">
                Reading is an intimate journey, but the conversations that follow bring stories to life. Join our community for monthly curated reads, thought-provoking chapter annotations, and respectful literary exchange.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#D5E3DB]">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Monthly curated fiction and nonfiction selections with guided prompts.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Seasonal reading challenges designed to broaden your literary horizons.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Virtual salons and guest author Q&A discussions throughout the year.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView('bookclub')}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0F291E] bg-[#E8D4B4] hover:bg-[#F3E5CF] rounded transition-colors shadow-sm cursor-pointer"
              >
                <span>Explore The Book Club</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

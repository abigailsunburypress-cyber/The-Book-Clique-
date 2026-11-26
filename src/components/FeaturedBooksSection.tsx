import React from 'react';
import { ArrowRight, Sparkles, BookOpen, BookMarked, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeaturedBooksSection: React.FC = () => {
  const { bookClubSelection, setActiveView } = useApp();

  const handleVisitBookClub = () => {
    setActiveView('bookclub');
  };

  const amazonUrl =
    bookClubSelection.amazonUrl ||
    'https://www.amazon.com/Slow-Productivity-Accomplishment-Without-Burnout-ebook/dp/B0C7716FW1';
  const authorAmazonUrl =
    bookClubSelection.authorAmazonUrl ||
    'https://www.amazon.com/Cal-Newport/e/B001IGNR0U/';
  const authorEmail = bookClubSelection.authorEmail || 'calnewport.novel@gmail.com';
  const coverImage = bookClubSelection.coverImage;

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
              Directly connected to The Book Clique Book Club — read on Amazon and share your ratings and reflections with our community.
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

        {/* Single Featured Book Display */}
        <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-10 transition-all hover:shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Cover Column */}
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
                    <span>Book Club Selection · {bookClubSelection.genre}</span>
                  </div>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#143826] leading-tight">
                  {bookClubSelection.bookTitle}
                </h3>
                {bookClubSelection.subtitle && (
                  <p className="font-serif text-base sm:text-lg text-[#4A534E]">
                    {bookClubSelection.subtitle}
                  </p>
                )}
                <p className="text-base font-semibold text-[#143826]">
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

              {bookClubSelection.synopsis && (
                <p className="text-sm text-[#3E4642] leading-relaxed max-w-2xl">
                  {bookClubSelection.synopsis}
                </p>
              )}

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

              {/* Action Buttons: Prominent Read on Amazon + Author Page + Join Book Club Discussion */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Read on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FAF6F0]/80" />
                </a>

                <a
                  href={authorAmazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#FAF6F0] hover:bg-[#EAE4D8] text-[#143826] border border-[#D5CDBD] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Amazon Author Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C6D23]" />
                </a>

                <button
                  onClick={handleVisitBookClub}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#EAE3D4] hover:bg-[#DDD5C4] text-[#143826] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Ratings &amp; Reader Discussion</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

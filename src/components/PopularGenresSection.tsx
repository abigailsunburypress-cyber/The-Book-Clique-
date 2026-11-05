import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCategory } from '../types';

export const PopularGenresSection: React.FC = () => {
  const { setActiveView } = useApp();

  const curatedGenres: { name: string; category: BookCategory; count: string }[] = [
    { name: 'Mystery', category: 'Fiction', count: 'Classic & Modern' },
    { name: 'Memoir and Biography', category: 'Nonfiction', count: 'True Journeys' },
    { name: 'Historical Fiction', category: 'Fiction', count: 'Archival & Period' },
    { name: 'Science and Nature', category: 'Nonfiction', count: 'Ecological Wonder' },
    { name: 'Literary Fiction', category: 'Fiction', count: 'Award Contenders' },
    { name: 'Business and Entrepreneurship', category: 'Nonfiction', count: 'Creator Mindsets' },
    { name: 'Fantasy', category: 'Fiction', count: 'Mythic Worlds' },
    { name: 'Psychology', category: 'Nonfiction', count: 'Mind & Behavior' },
  ];

  const handleSelectGenre = (category: BookCategory, genre: string) => {
    setActiveView('catalogue', { category, genre });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E8E1D5]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Browse by Interest
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
              Popular Literary Genres
            </h2>
            <p className="text-sm text-[#525B55] mt-1.5 max-w-xl leading-relaxed">
              Explore diverse narrative horizons. Select any category to jump directly into filtered catalogue titles.
            </p>
          </div>

          <button
            onClick={() => setActiveView('catalogue')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#143826] hover:text-[#285D40] transition-colors py-2 cursor-pointer"
          >
            <span>Explore All 28+ Genres</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {curatedGenres.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSelectGenre(item.category, item.name)}
              className="text-left p-4 sm:p-5 rounded bg-[#FFFFFF] border border-[#E6DFD5] hover:border-[#143826] hover:bg-[#FAF7F2] transition-all cursor-pointer group shadow-2xs"
            >
              <span className="text-[11px] font-semibold text-[#8C6D23] uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#143826] group-hover:text-[#285D40] mt-1 leading-snug">
                {item.name}
              </h3>
              <p className="text-xs text-[#6B756F] mt-1 font-normal">
                {item.count}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

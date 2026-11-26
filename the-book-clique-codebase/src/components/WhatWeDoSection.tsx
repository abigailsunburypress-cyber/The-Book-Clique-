import React from 'react';
import {
  BookOpen,
  Users,
  Megaphone,
  Film,
  Headphones,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatWeDoSection: React.FC = () => {
  const { setActiveView, setServicePreselectId } = useApp();

  const activities = [
    {
      num: '01',
      title: 'Book Discovery & Catalogue Browsing',
      description: 'A thoughtfully catalogued library separating Fiction and Nonfiction into 28+ defined genres, allowing discerning readers to discover verified gems.',
      icon: BookOpen,
      action: () => setActiveView('catalogue'),
      actionLabel: 'Browse Catalogue'
    },
    {
      num: '02',
      title: 'Literary Community & Book Club Activities',
      description: 'Monthly reading selections, guided discussion prompts, seasonal challenges, and collaborative salons that bring book lovers together.',
      icon: Users,
      action: () => setActiveView('bookclub'),
      actionLabel: 'Explore Book Club'
    },
    {
      num: '03',
      title: 'Author & Book Promotion',
      description: 'Dedicated editorial author interviews, website spotlight placements, and newsletter features that introduce your creative voice to active readers.',
      icon: Sparkles,
      action: () => setActiveView('services'),
      actionLabel: 'Learn More'
    },
    {
      num: '04',
      title: 'Book Marketing Campaigns',
      description: 'Targeted multi-week promotional campaigns engineered to expand visibility, build reader momentum, and foster sustained engagement.',
      icon: Megaphone,
      action: () => setActiveView('services'),
      actionLabel: 'View Campaigns'
    },
    {
      num: '05',
      title: 'Book Trailer Production',
      description: 'Cinematic visual teasers and trailers with licensed scores, atmospheric pacing, and motion typography built for social media and retail listings.',
      icon: Film,
      action: () => {
        setServicePreselectId('service-02');
        setActiveView('services');
      },
      actionLabel: 'Watch Trailers & Packages'
    },
    {
      num: '06',
      title: 'Audiobook-Related Services',
      description: 'Narration coordination, chapter proofing, and strict ACX/Audible compliance audio mastering to bring spoken prose to global listeners.',
      icon: Headphones,
      action: () => setActiveView('services'),
      actionLabel: 'Audio Services'
    },
    {
      num: '07',
      title: 'Additional Author-Support Services',
      description: 'From manuscript line editing and proofreading to full author press kits, landing pages, and bespoke series rollouts.',
      icon: Layers,
      action: () => setActiveView('services'),
      actionLabel: 'Support Options'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
            Our Core Ecosystem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
            What We Do at The Book Clique
          </h2>
          <p className="text-sm sm:text-base text-[#525B55] mt-2 leading-relaxed">
            We bridge the gap between literary discovery and professional promotion—providing readers with a vibrant home for books and authors with the honest support they need to flourish.
          </p>
        </div>

        {/* Editorial Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-[#FFFFFF] rounded border border-[#E6DFD5] p-6 flex flex-col justify-between hover:border-[#143826]/30 transition-all shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-[#8C6D23] tabular-nums">
                      {item.num}
                    </span>
                    <div className="w-9 h-9 rounded-sm bg-[#F5F1E8] text-[#143826] flex items-center justify-center group-hover:bg-[#143826] group-hover:text-[#FAF6F0] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#143826] leading-snug group-hover:text-[#285D40] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#525B55] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#F0EBE1]">
                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143826] hover:text-[#285D40] transition-colors cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { BookMarked, Users, Sparkles, FileCheck, ShieldCheck } from 'lucide-react';

export const WhyTheBookClique: React.FC = () => {
  const values = [
    {
      title: 'A Growing, Curated Collection',
      description: 'We don’t treat books as algorithmic commodities. Every title in our catalogue is organized by specific sub-genre and presented with bibliographic dignity.',
      icon: BookMarked
    },
    {
      title: 'A Welcoming Literary Community',
      description: 'A genuine gathering place for readers who cherish insightful discussions, constructive book annotations, and thoughtful monthly reading challenges.',
      icon: Users
    },
    {
      title: 'Creative Promotional Opportunities',
      description: 'From atmospheric book trailers to author spotlights and launch blitzes, we offer modern multimedia avenues to showcase your literary voice.',
      icon: Sparkles
    },
    {
      title: 'Transparent Service Packages',
      description: 'Itemized deliverables, exact turnaround timelines, and honest pricing. No hidden fees, no opaque contracts, and no empty vanity guarantees.',
      icon: FileCheck
    },
    {
      title: 'Clear Official Contact Channels',
      description: 'We prioritize author and client security with strict verification protocols and a single, centrally authenticated official Gmail address.',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
            Our Foundational Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
            Why The Book Clique?
          </h2>
          <p className="text-sm text-[#525B55] mt-2 leading-relaxed">
            In an industry often clouded by hype and impersonal marketing, we anchor our work in literary respect, community engagement, and transparent integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="p-6 rounded bg-[#FFFFFF] border border-[#E6DFD5] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-sm bg-[#0F291E] text-[#D4AF37] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#143826] leading-snug">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#525B55] mt-2 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

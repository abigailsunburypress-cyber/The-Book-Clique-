import React from 'react';
import { Mail } from 'lucide-react';

const PORTFOLIO_URL = 'https://thebookcliqueportfolio.netlify.app/';
const OFFICIAL_EMAIL = 'thebookclique.official@gmail.com';

export const TopAnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Official Portfolio and Contact Announcement"
      className="w-full bg-[#0F291E] text-[#FAF6F0] border-b border-[#C5A059]/45 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] sm:text-xs relative z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 leading-tight">
        {/* Left: Official Portfolio Link */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 tracking-wide">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
            OFFICIAL PORTFOLIO
          </span>
          <span aria-hidden="true" className="text-[#C5A059]/70">
            ·
          </span>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FAF6F0] hover:text-[#E8D4B4] font-medium underline decoration-[#C5A059]/60 underline-offset-3 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            The Book Clique / Portfolio ↗
          </a>
        </div>

        {/* Right: Official Contact Email */}
        <div className="flex items-center justify-center sm:justify-end gap-1.5 shrink-0">
          <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
          <a
            href={`mailto:${OFFICIAL_EMAIL}`}
            className="text-[#FAF6F0] hover:text-[#E8D4B4] font-medium tracking-wide underline decoration-transparent hover:decoration-[#C5A059]/70 underline-offset-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            title="Email The Book Clique official contact address"
          >
            {OFFICIAL_EMAIL}
          </a>
        </div>
      </div>
    </aside>
  );
};

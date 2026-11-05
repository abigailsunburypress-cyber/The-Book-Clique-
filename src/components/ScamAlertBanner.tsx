import React from 'react';
import { AlertTriangle, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ScamAlertBanner: React.FC = () => {
  const { siteConfig } = useApp();

  return (
    <aside
      aria-label="Security and Official Communication Announcement"
      className="w-full bg-[#78231C] text-[#FFF7F5] border-b border-[#5C1B15] px-4 py-2.5 text-xs sm:text-sm font-medium tracking-wide shadow-xs relative z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
        <div className="flex items-start gap-2.5 leading-snug">
          <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-left">
            <strong className="font-bold tracking-normal uppercase text-[#FDE68A] mr-1.5">
              SCAM ALERT:
            </strong>
            Any outreach from any other Gmail address except the official Gmail address listed on this website is a scam. Always verify that you are communicating with us through our officially listed email address.
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-xs bg-[#5C1B15]/70 hover:bg-[#5C1B15] px-2.5 py-1 rounded transition-colors self-end md:self-auto">
          <Mail className="w-3.5 h-3.5 text-[#FDE68A]" aria-hidden="true" />
          <span className="text-[#F5E6E3] font-normal">Official:</span>
          <a
            href="mailto:thebookclique.official@gmail.com"
            className="text-[#FFF7F5] underline hover:text-[#FDE68A] font-semibold break-all focus-visible:outline-2 focus-visible:outline-[#FDE68A]"
            title="Click to email the verified official Book Clique address"
          >
            thebookclique.official@gmail.com
          </a>
          <span className="text-[11px] text-[#FDE68A] font-medium hidden sm:inline">
            (Official Contact Email — Owner Confirmed)
          </span>
        </div>
      </div>
    </aside>
  );
};

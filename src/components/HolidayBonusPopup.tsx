import React, { useEffect, useState } from 'react';
import { X, Sparkles, Star, Gift, Check, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HOLIDAY_SERVICES_LIST = [
  'Book Marketing Campaigns',
  'Book Trailer Production',
  'Audiobook Services',
  'Social Media Book Promotion',
  'Book Launch Campaigns',
  'Author and Book Spotlight',
  'Book Cover & Promotional Design',
  'Editing and Proofreading',
  'Author Branding and Website Services',
  'Custom Author & Publisher Services'
];

export const HolidayBonusPopup: React.FC = () => {
  const { activeView, openEnquiryModal, setActiveView } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeView === 'admin') return;
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 250);
    return () => window.clearTimeout(timer);
    // Intentionally run once per initial mount/page load/refresh so closing hides it for this page view only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleRegisterBook = () => {
    handleDismiss();
    openEnquiryModal('Holiday Book Club Registration', '$99 — Holiday Book Club Registration');
  };

  const handleExploreServices = () => {
    handleDismiss();
    setActiveView('services');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-[#06140D]/75 backdrop-blur-xs holiday-backdrop-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-bonus-heading"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FBF9F5] border-2 border-[#C5A059] rounded-lg shadow-2xl text-[#1C1E1D] holiday-card-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Festive Forest Emerald & Gold Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#16402B] via-[#0F2C1E] to-[#081A11] px-5 sm:px-8 pt-6 pb-7 text-[#FAF6F0] border-b-2 border-[#C5A059]">
          {/* Subtle Gold Corner Frame & Twinkling Holiday Stars */}
          <div className="pointer-events-none absolute inset-2.5 border border-[#C5A059]/25 rounded-sm" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-[#C5A059]/10 blur-2xl" />
            <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#D4AF37]/12 blur-2xl" />
            <Star className="holiday-twinkle absolute top-5 left-5 w-3.5 h-3.5 text-[#E8C56E] fill-[#E8C56E]/60" />
            <Sparkles className="holiday-twinkle-delayed absolute top-6 left-1/3 w-4 h-4 text-[#D4AF37]/60" />
            <Star className="holiday-twinkle-delayed absolute top-14 right-16 w-3 h-3 text-[#F3E5CF] fill-[#F3E5CF]/50" />
            <Star className="holiday-twinkle absolute bottom-5 right-8 w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]/60" />
            <Sparkles className="holiday-twinkle absolute bottom-6 left-10 w-3.5 h-3.5 text-[#E8D4B4]/55" />
          </div>

          {/* Close × Button in Top-Right Corner */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close holiday offer"
            className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-[#0A1E14]/80 hover:bg-[#C5A059] border border-[#C5A059]/70 flex items-center justify-center text-[#FAF6F0] hover:text-[#0B1E15] transition-colors cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <X className="w-4 h-4 stroke-[2.25]" />
          </button>

          <div className="relative z-10 pr-8 text-center space-y-2.5">
            <div className="inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8C56E]">
              <Gift className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>Holiday Edition · The Book Clique</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
            </div>

            <h2
              id="holiday-bonus-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#FFFDF9] tracking-tight leading-tight text-balance"
            >
              A HOLIDAY BONUS FROM THE BOOK CLIQUE
            </h2>

            <p className="text-xs sm:text-sm text-[#DCE7E0] leading-relaxed max-w-xl mx-auto">
              Celebrate the holiday season with special savings on your book and author services. Register your book for our Book Club holiday offer or enjoy discounts on other selected services.
            </p>
          </div>

          {/* Highlighted Book Club Registration Offer Inside Festive Banner */}
          <div className="relative z-10 mt-5 bg-gradient-to-r from-[#0A1F14]/95 via-[#123322]/95 to-[#0A1F14]/95 border border-[#D4AF37]/75 rounded-md px-4 py-4 sm:px-6 sm:py-5 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C56E] mb-1.5">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" aria-hidden="true" />
              <span>Featured Holiday Book Club Offer</span>
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
              <span className="font-serif text-lg sm:text-2xl font-bold text-[#FFFDF9] tracking-wide">
                BOOK CLUB REGISTRATION —{' '}
                <span className="text-2xl sm:text-3xl text-[#F5D37E] font-bold">
                  $99
                </span>
              </span>

              <span className="inline-flex items-center gap-2 text-sm sm:text-base text-[#A9C2B3] font-mono tabular-nums">
                <span className="line-through decoration-1 decoration-[#E8D4B4]/70">$150</span>
                <span className="line-through decoration-1 decoration-[#E8D4B4]/70">$213</span>
              </span>
            </div>
          </div>
        </div>

        {/* Cream Body: Discounts on Other Services + Complete Service List + Buttons */}
        <div className="p-5 sm:p-7 space-y-5 bg-[#FBF9F5]">
          {/* Other Services Discount Notice */}
          <div className="bg-[#FFFFFF] border border-[#E2D8C7] rounded-md p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="space-y-1.5 border-b border-[#EFE9DE] pb-3.5">
              <div className="flex items-start sm:items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B68D2C] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#143826] tracking-wide leading-snug">
                  HOLIDAY DISCOUNTS ARE ALSO AVAILABLE ON OUR OTHER SERVICES!
                </h3>
              </div>
              <p className="text-xs sm:text-[13px] text-[#4A534E] leading-relaxed">
                Holiday discounts may be available for selected author services below. Your final discounted quotation depends on the selected service and your individual project requirements.
              </p>
            </div>

            {/* Complete Untruncated Services List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-xs sm:text-[13px] text-[#1D2D25]">
              {HOLIDAY_SERVICES_LIST.map((serviceName) => (
                <li key={serviceName} className="flex items-start gap-2 leading-snug">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#143826] text-[#F5D37E] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
                  </span>
                  <span className="font-medium text-[#143826]">{serviceName}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Three Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={handleRegisterBook}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[#143826] hover:bg-[#1D4E35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#143826]"
            >
              <span>Register Your Book — $99</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8C56E]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handleExploreServices}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded bg-[#E8D4B4] hover:bg-[#DFC498] text-[#143826] border border-[#C5A059] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#143826]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#8C6D23]" aria-hidden="true" />
              <span>Explore Our Services</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center justify-center px-4 py-3 rounded bg-[#FFFFFF] hover:bg-[#EFEAE0] text-[#4A534E] border border-[#D5CDBD] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#143826]"
            >
              Continue to Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

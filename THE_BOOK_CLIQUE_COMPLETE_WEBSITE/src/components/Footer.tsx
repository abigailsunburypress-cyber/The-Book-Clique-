import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ArrowUp } from 'lucide-react';
import { useApp, PageView } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { siteConfig, setActiveView, setIsAdminOpen, setIsDonationModalOpen, setServicePreselectId } = useApp();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1B14] text-[#D1DDD6] border-t border-[#1D4A36] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Official Logo with Name */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => {
                setActiveView('home');
                scrollToTop();
              }}
              className="flex items-center gap-3 text-left group focus-visible:outline-2 focus-visible:outline-[#D4AF37] cursor-pointer"
              aria-label="The Book Clique - Return to Home"
            >
              <div className="bg-[#FAF8F5] p-1.5 rounded-sm border border-[#D4AF37]/40 shadow-sm inline-flex items-center justify-center transition-transform group-hover:scale-[1.03] shrink-0">
                <img
                  src="/assets/aistudio/The_Book_Clique_Emblem_d9f03a53.png"
                  alt="The Book Clique Emblem"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-semibold text-[#FFFDF9] group-hover:text-[#E8D4B4] transition-colors">
                The Book Clique
              </span>
            </button>

            <p className="text-xs text-[#A4B5AC] leading-relaxed max-w-sm">
              A welcoming literary community dedicated to discovering remarkable books, bringing readers together, and providing authors with transparent promotional advocacy.
            </p>

            <div className="pt-2 text-xs text-[#C5D5CC] flex flex-col gap-1">
              <span className="text-[#8FA196]">Official Correspondence:</span>
              <a
                href="mailto:thebookclique.official@gmail.com"
                className="font-mono text-[#E8D4B4] hover:underline break-all font-semibold"
              >
                thebookclique.official@gmail.com
              </a>
              <span className="text-[11px] text-[#D4AF37] font-medium">
                Official Contact Email — Owner Confirmed
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('team')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('bookclub')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  The Book Club
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('work-with-us')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer text-[#E8D4B4]"
                >
                  Work With Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('donation')}
                  className="text-[#E8D4B4] hover:text-[#FFFDF9] transition-colors cursor-pointer font-medium"
                >
                  Support &amp; Donations
                </button>
              </li>
            </ul>
          </div>

          {/* Catalogue Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Book Catalogue
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveView('catalogue', { category: 'Fiction' })}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Fiction Titles
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue', { category: 'Nonfiction' })}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Nonfiction Titles
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue', { category: 'Fiction', genre: 'Mystery' })}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Mystery & Suspense
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue', { category: 'Nonfiction', genre: 'Memoir and Biography' })}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Memoirs & Biographies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('catalogue', { category: 'Fiction', genre: 'Historical Fiction' })}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Historical Fiction
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Verification / Customer Support & Author Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
              Contact &amp; Verification
            </h4>
            <ul className="space-y-2 text-xs mb-5">
              <li>
                <button
                  onClick={() => {
                    setActiveView('identity-verification');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer flex items-center gap-1.5 text-[#E8D4B4] font-semibold text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Identity Verification &amp; Customer Care</span>
                </button>
              </li>
              <li>
                <a
                  href="mailto:thebookclique.official@gmail.com?subject=Identity%20Verification%20%2F%20Clarification%20%E2%80%93%20The%20Book%20Clique"
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer text-[#C5D5CC] block"
                >
                  Official Care: <span className="font-mono text-[#E8D4B4]">thebookclique.official@gmail.com</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('contact');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer text-[#C5D5CC]"
                >
                  General Contact &amp; Enquiries
                </button>
              </li>
            </ul>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
              Author Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveView('work-with-us');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer text-[#E8D4B4] font-medium"
                >
                  Work With Us (Author Form)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('services');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  All 10 Author Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('pricing');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Pricing &amp; Tier Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setServicePreselectId('service-02');
                    setActiveView('services');
                    scrollToTop();
                  }}
                  className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
                >
                  Book Trailer Production
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1 text-[#A4B5AC]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin &amp; CMS Console</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-[#1D4A36] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A9D92]">
          <div>
            &copy; {currentYear} The Book Clique. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                setActiveView('identity-verification');
                scrollToTop();
              }}
              className="text-[#D4AF37] hover:text-[#FFFDF9] font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Identity Verification &amp; Customer Care</span>
            </button>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#FFFDF9] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#D4AF37] hover:text-[#FFFDF9] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B14]/70 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] text-[#1C1E1D] p-6 sm:p-8 rounded border border-[#D5CDBD] max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#143826]">
              The Book Clique Privacy Policy
            </h3>
            <p className="text-xs text-[#525B55] leading-relaxed">
              The Book Clique respects your creative autonomy and personal privacy. We only collect details voluntarily submitted via our contact forms, newsletter subscription, and service booking modules.
            </p>
            <p className="text-xs text-[#525B55] leading-relaxed">
              We never sell, lease, or share author manuscript excerpts, contact details, or payment records with unauthorized third parties. All official communication is channeled exclusively through our verified official Gmail address.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase text-white bg-[#143826] rounded cursor-pointer"
            >
              Close Privacy Policy
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1B14]/70 backdrop-blur-xs">
          <div className="bg-[#FBF9F5] text-[#1C1E1D] p-6 sm:p-8 rounded border border-[#D5CDBD] max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#143826]">
              The Book Clique Terms of Service
            </h3>
            <p className="text-xs text-[#525B55] leading-relaxed">
              All promotional, editorial, video trailer, and audiobook services are governed by transparent scope descriptions and formal review gates.
            </p>
            <p className="text-xs text-[#525B55] leading-relaxed">
              Authors retain 100% of their intellectual property, copyright, and royalties. Prices and timelines presented on the website are representative and subject to mutual project confirmation.
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase text-white bg-[#143826] rounded cursor-pointer"
            >
              Close Terms of Service
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};

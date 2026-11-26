import React, { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { useApp, PageView } from '../context/AppContext';

const PORTFOLIO_URL = 'https://thebookcliqueportfolio.netlify.app/';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: PageView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About Us', view: 'about' },
    { label: 'Our Team', view: 'team' },
    { label: 'Book Catalogue', view: 'catalogue' },
    { label: 'Our Services', view: 'services' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'Book Club', view: 'bookclub' },
    { label: 'Work With Us', view: 'work-with-us' },
    { label: 'Contact Us', view: 'contact' },
  ];

  const handleNavClick = (view: PageView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E6DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 2xl:gap-6 h-20">
          
          {/* Zone 1: Official Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-[#143826] cursor-pointer shrink-0"
            aria-label="The Book Clique - Return to Home"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[50%] overflow-hidden bg-[#FAF8F5] p-0.5 border border-[#C5A059]/60 shadow-xs flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-[1.04] group-hover:border-[#C5A059]">
              <img
                src="/assets/aistudio/The_Book_Clique_Emblem_d9f03a53.png"
                alt="The Book Clique Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-xl sm:text-2xl 2xl:text-3xl font-semibold tracking-tight text-[#143826] whitespace-nowrap group-hover:text-[#23583C] transition-colors">
              The Book Clique
            </span>
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs 2xl:text-sm font-medium text-[#383D39]"
          >
            {navLinks.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#143826] font-semibold'
                      : 'text-[#4A524D] hover:text-[#143826]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#143826] rounded-full"
                    />
                  )}
                </button>
              );
            })}

            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative py-1 whitespace-nowrap shrink-0 text-[#4A524D] hover:text-[#143826] transition-colors inline-flex items-center gap-1"
            >
              <span>The Book Clique / Portfolio</span>
              <ExternalLink className="w-3 h-3 text-[#8C6D23]" aria-hidden="true" />
            </a>
          </nav>

          {/* Zone 3: Primary Action & Mobile Drawer Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('catalogue')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold tracking-wide uppercase text-[#FBF9F5] bg-[#143826] hover:bg-[#1D4F36] active:bg-[#0F2A1D] rounded transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
            >
              Explore Catalogue
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#383D39] hover:text-[#143826] focus-visible:outline-2 focus-visible:outline-[#143826] rounded"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E6DFD5] bg-[#FBF9F5] px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center justify-between text-left px-3 py-2.5 rounded text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#143826] text-[#FBF9F5]'
                      : 'text-[#2A302C] hover:bg-[#EFECE4]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-left px-3 py-2.5 rounded text-base font-medium text-[#2A302C] hover:bg-[#EFECE4] transition-colors"
            >
              <span>The Book Clique / Portfolio</span>
              <ExternalLink className="w-4 h-4 text-[#8C6D23]" />
            </a>
            <div className="pt-3 border-t border-[#E6DFD5] flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('catalogue')}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#FBF9F5] bg-[#143826] rounded shadow-xs"
              >
                Explore Book Catalogue
              </button>
              <button
                onClick={() => handleNavClick('identity-verification')}
                className="w-full text-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#FAF6F0] border border-[#C5A059]/50 rounded hover:bg-[#F0EBE1] flex items-center justify-center gap-1.5"
              >
                <span>Identity Verification &amp; Customer Care</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

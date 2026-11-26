import React, { useState } from 'react';
import {
  Heart,
  ArrowLeft,
  Home,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Home as HomeIcon,
  Globe,
  Sparkles,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DonationView: React.FC = () => {
  const { setActiveView } = useApp();
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const OFFICIAL_EMAIL = 'donations.thebookclique@gmail.com';
  const EMAIL_SUBJECT = 'Donation Enquiry – The Book Clique';

  const getGmailUrl = () => {
    let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(OFFICIAL_EMAIL)}&su=${encodeURIComponent(EMAIL_SUBJECT)}`;
    if (customMessage.trim()) {
      url += `&body=${encodeURIComponent(customMessage.trim())}`;
    }
    return url;
  };

  const getMailtoUrl = () => {
    let url = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`;
    if (customMessage.trim()) {
      url += `&body=${encodeURIComponent(customMessage.trim())}`;
    }
    return url;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="bg-[#FBF9F5] py-10 lg:py-16 text-[#1C1E1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb: Back to Home */}
        <div className="mb-8">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold bg-[#FFFFFF] hover:bg-[#FAF6F0] text-[#143826] border border-[#D5CDBD] shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8C6D23]" />
            <Home className="w-3.5 h-3.5 text-[#143826]" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="bg-[#143826] text-[#FAF6F0] rounded-lg p-8 sm:p-12 mb-12 border-2 border-[#C5A059]/40 shadow-md relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E8D4B4]/20 text-[#E8D4B4] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#E8D4B4]/30 backdrop-blur-xs">
              <Heart className="w-3.5 h-3.5 text-[#E8D4B4] fill-[#E8D4B4]" />
              <span>Compassionate Literary Mission</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
              Support The Book Clique
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#D1DDD6] leading-relaxed font-sans">
              Extending the power of literature into meaningful humanitarian initiatives that support children’s education, community shelter, and vulnerable families.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION: WHERE DOES YOUR SUPPORT GO?                           */}
        {/* ============================================================== */}
        <section id="where-support-goes" className="mb-14">
          
          <div className="border-b border-[#E6DFD5] pb-6 mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D23] mb-2">
              <Sparkles className="w-4 h-4 text-[#8C6D23]" />
              <span>Humanitarian Focus &amp; Purpose</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143826] tracking-tight">
              Where Does Your Support Go?
            </h2>
          </div>

          {/* Main Explanation Block */}
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg p-6 sm:p-10 shadow-xs mb-10 space-y-4">
            <p className="text-base sm:text-lg text-[#2A332E] leading-relaxed">
              At The Book Clique, we believe that the power of stories should extend beyond books and reading. Our mission is not only to support authors, encourage literacy and build a strong literary community, but also to make a meaningful difference in the lives of people who need help.
            </p>
            <p className="text-base sm:text-lg text-[#2A332E] leading-relaxed">
              Funds raised through donations and contributions from our literary activities, particularly participation in our Book Club Reading Challenges, are intended to support humanitarian initiatives focused on helping vulnerable children and homeless individuals.
            </p>
            <p className="text-base sm:text-lg text-[#2A332E] leading-relaxed">
              A significant part of our humanitarian focus is on communities across Africa, where access to education, safe accommodation and basic necessities can be challenging for many families.
            </p>
          </div>

          {/* How We Use the Funds: 3 Pillar Cards with Natural Imagery */}
          <div className="mb-12">
            <h3 className="font-serif text-2xl font-bold text-[#143826] mb-6">
              How We Use the Funds
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Pillar 1: Helping Children Access Education */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#143826] transition-colors">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#ECE6DC] relative">
                    <img
                      src="/images/unsplash/photo-1488521787991-ed7bbaae773c-w800.jpg"
                      alt="African schoolchildren smiling and learning in a classroom with notebooks"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#143826]/90 text-[#FAF6F0] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Education</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-serif text-xl font-bold text-[#143826] mb-2">
                      1. Helping Children Access Education
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                      We want to help children from disadvantaged backgrounds have better opportunities to attend school. Support may go towards school supplies, books, uniforms, educational materials and other essential needs that help children continue their education.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#F0EAE1] text-[11px] font-semibold text-[#8C6D23]">
                  School Supplies · Textbooks · Educational Access
                </div>
              </div>

              {/* Pillar 2: Supporting Homeless Individuals */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#143826] transition-colors">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#ECE6DC] relative">
                    <img
                      src="/images/unsplash/photo-1469571486292-0ba58a3f068b-w800.jpg"
                      alt="Volunteers and community members offering shelter, warm meals, and care"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#143826]/90 text-[#FAF6F0] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                      <HomeIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Shelter</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-serif text-xl font-bold text-[#143826] mb-2">
                      2. Supporting Homeless Individuals
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                      We also aim to assist people experiencing homelessness by supporting access to safe shelter, temporary accommodation and essential necessities. Our goal is to help vulnerable individuals find a safer and more stable place to live.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#F0EAE1] text-[11px] font-semibold text-[#8C6D23]">
                  Safe Shelter · Basic Necessities · Stability Support
                </div>
              </div>

              {/* Pillar 3: Supporting Vulnerable Communities in Africa */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#143826] transition-colors">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#ECE6DC] relative">
                    <img
                      src="/images/unsplash/photo-1509099836639-18ba1795216d-w800.jpg"
                      alt="Young African community learners gathered together with hope and dignity"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#143826]/90 text-[#FAF6F0] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Communities</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-serif text-xl font-bold text-[#143826] mb-2">
                      3. Supporting Vulnerable Communities in Africa
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
                      Our humanitarian efforts place particular emphasis on African communities. We want to support children and individuals facing difficult circumstances and contribute to practical initiatives that improve their opportunities and quality of life.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#F0EAE1] text-[11px] font-semibold text-[#8C6D23]">
                  Community Development · Quality of Life · Practical Aid
                </div>
              </div>

            </div>
          </div>

          {/* Highlighted Statement: The Connection Between Books and Giving */}
          <div className="bg-[#FAF6F0] border-2 border-[#C5A059] rounded-lg p-6 sm:p-8 mb-10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
              <BookOpen className="w-4 h-4 text-[#8C6D23]" />
              <span>The Connection Between Books and Giving</span>
            </div>

            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-[#143826] leading-relaxed italic">
              “Every reading challenge can represent an opportunity to do more than celebrate books. Through The Book Clique, literary participation and community support can also contribute to a wider humanitarian purpose: helping children access education and helping vulnerable people find shelter.”
            </blockquote>

            <p className="text-xs sm:text-sm text-[#4A534E] leading-relaxed">
              Participation fees, especially those associated with the Book Club Reading Challenges, are intended to help support these humanitarian objectives alongside voluntary donations.
            </p>
          </div>

          {/* Closing Message */}
          <div className="bg-[#143826] text-[#FAF6F0] rounded-lg p-8 sm:p-10 mb-12 shadow-sm border border-[#C5A059]/30 text-center max-w-4xl mx-auto space-y-3">
            <p className="font-serif text-lg sm:text-xl text-[#FFFDF9] leading-relaxed max-w-2xl mx-auto">
              “Your support helps us work towards a world where more children have the opportunity to learn, more vulnerable people have access to shelter, and the literary community can contribute to something bigger than books.”
            </p>
            <p className="text-sm font-semibold text-[#E8D4B4] uppercase tracking-wider">
              Together, we can make reading a force for positive change.
            </p>
          </div>

          {/* Official Contact & Direct Donation Outreach Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded-lg p-6 sm:p-10 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                Official Contribution Channel
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#143826]">
                Contact Our Team Directly
              </h3>
              <p className="text-xs sm:text-sm text-[#525B55] leading-relaxed">
                Would you like to support The Book Clique or make a donation? Please contact us directly through our official Gmail address. Our team will respond and provide the necessary information.
              </p>
            </div>

            {/* Official Gmail Address Box */}
            <div className="bg-[#FAF8F5] border border-[#D5CDBD] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href={getGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm sm:text-base font-bold text-[#143826] hover:text-[#8C6D23] underline decoration-[#C5A059] flex items-center gap-2 break-all"
              >
                <Mail className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>{OFFICIAL_EMAIL}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#717C76] shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#FAF6F0] text-[#143826] text-xs font-semibold border border-[#D5CDBD] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7A857F]" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Optional message input */}
            <div className="space-y-1.5">
              <label htmlFor="donation-page-message" className="block text-xs font-semibold text-[#143826] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#8C6D23]" />
                <span>Your Message or Specific Area of Interest (Optional)</span>
              </label>
              <textarea
                id="donation-page-message"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Share your enquiry, author sponsorship interest, or humanitarian focus..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826] transition-colors"
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={getGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>Email Us via Gmail</span>
                <ExternalLink className="w-4 h-4 text-[#FAF6F0]/80" />
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#717C76] px-1">
                <span>If Gmail is not available on your device:</span>
                <a
                  href={getMailtoUrl()}
                  className="font-semibold text-[#143826] hover:text-[#8C6D23] underline decoration-[#8C6D23]/50 transition-colors cursor-pointer"
                >
                  Open in Default Mail Application (mailto:) &rarr;
                </a>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="pt-4 border-t border-[#EAE4D8] text-[11px] text-[#717C76] space-y-1">
              <div className="flex items-center gap-1.5 text-[#143826] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Transparency &amp; Governance Statement</span>
              </div>
              <p className="leading-relaxed">
                The humanitarian initiatives described represent the organization’s intended charitable objectives and giving purpose. Participation fees and voluntary contributions are dedicated to advancing literacy, author development, and supporting humanitarian causes for vulnerable children and community shelter.
              </p>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

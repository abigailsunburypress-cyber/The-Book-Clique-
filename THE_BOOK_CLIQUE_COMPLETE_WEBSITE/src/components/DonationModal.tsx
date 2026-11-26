import React, { useState } from 'react';
import {
  Heart,
  X,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DonationModal: React.FC = () => {
  const { isDonationModalOpen, setIsDonationModalOpen, setActiveView } = useApp();

  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  if (!isDonationModalOpen) return null;

  const OFFICIAL_EMAIL = 'donations.thebookclique@gmail.com';
  const EMAIL_SUBJECT = 'Donation Enquiry – The Book Clique';

  // Gmail Compose Link with pre-filled recipient and subject
  const getGmailUrl = () => {
    let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(OFFICIAL_EMAIL)}&su=${encodeURIComponent(EMAIL_SUBJECT)}`;
    if (customMessage.trim()) {
      url += `&body=${encodeURIComponent(customMessage.trim())}`;
    }
    return url;
  };

  // Default mailto: fallback link
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsDonationModalOpen(false);
        }
      }}
    >
      <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded-md shadow-2xl max-w-lg w-full overflow-hidden text-left relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#143826] text-[#FAF6F0] flex items-center justify-between border-b border-[#C5A059]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#E8D4B4] text-[#143826] flex items-center justify-center shadow-xs shrink-0">
              <Heart className="w-5 h-5 text-[#143826] fill-[#143826]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8D4B4] block">
                Official Donor &amp; Community Outreach
              </span>
              <h3 id="support-modal-title" className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Support The Book Clique
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDonationModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#1C1E1D]">
          
          {/* Main Message from The Book Clique */}
          <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-4 sm:p-5 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Direct Official Contact</span>
            </div>
            <p className="font-serif text-base sm:text-lg text-[#143826] leading-relaxed italic">
              “Would you like to support The Book Clique or make a donation? Please contact us directly through our official Gmail address. Our team will respond and provide the necessary information.”
            </p>
            <div className="pt-2 border-t border-[#EAE4D8]">
              <button
                type="button"
                onClick={() => {
                  setIsDonationModalOpen(false);
                  setActiveView('donation');
                }}
                className="text-xs font-semibold text-[#143826] hover:text-[#8C6D23] underline cursor-pointer"
              >
                Learn more: Where Does Your Support Go? &rarr;
              </button>
            </div>
          </div>

          {/* Official Gmail Address Card */}
          <div className="bg-[#FAF6F0] border-2 border-[#C5A059]/50 rounded-md p-4 sm:p-5 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#636E67]">
              Official Gmail Address
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded border border-[#D5CDBD]">
              <a
                href={getGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm sm:text-base font-bold text-[#143826] hover:text-[#8C6D23] underline decoration-[#C5A059] underline-offset-4 transition-colors flex items-center gap-2 break-all"
                title="Open in Gmail"
              >
                <Mail className="w-4 h-4 text-[#8C6D23] shrink-0" />
                <span>{OFFICIAL_EMAIL}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#717C76] shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF6F0] hover:bg-[#EFEBE4] text-[#143826] text-xs font-semibold border border-[#D5CDBD] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                title="Copy email address"
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
          </div>

          {/* Optional Message Field: write your own note */}
          <div className="space-y-1.5">
            <label htmlFor="donation-custom-message" className="block text-xs font-semibold text-[#143826] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Your Message or Specific Question (Optional)</span>
            </label>
            <textarea
              id="donation-custom-message"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your note or question here (e.g. Inquiring about donation options, author sponsorship, or educational outreach support)..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826] transition-colors"
            />
            <p className="text-[11px] text-[#717C76]">
              Your note will be automatically pre-filled in your email message. You can also write or edit it directly in Gmail.
            </p>
          </div>

          {/* Primary Action Button: "Email Us" & Mailto Fallback */}
          <div className="space-y-2.5 pt-2 border-t border-[#EAE4D8]">
            <a
              href={getGmailUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span>Email Us</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FAF6F0]/80" />
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

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FAF8F5] border-t border-[#E6DFD5] flex items-center justify-between text-xs text-[#636E67] shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>The Book Clique Official Support Desk</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDonationModalOpen(false)}
            className="text-xs font-semibold text-[#143826] hover:text-[#8C6D23] cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

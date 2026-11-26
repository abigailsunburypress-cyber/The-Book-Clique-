import React, { useState, useEffect } from 'react';
import { X, BookOpen, ShieldCheck, Mail, User, Globe, Heart, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReaderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  initialMode?: 'register' | 'login';
}

const COUNTRIES = [
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Other / International', flag: '🌍' }
];

export const ReaderAuthModal: React.FC<ReaderAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title
}) => {
  const { registerReader } = useApp();

  // Form states: EXACTLY the 4 required fields for registration
  // 1. Name (Required)
  // 2. Email Address (Required)
  // 3. Country (Required, dropdown)
  // 4. Niche You Love (Optional)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [niche, setNiche] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const handleCancelAndClose = () => {
    // Closing the form must NOT submit incomplete information or create an account
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  // Keyboard shortcut: Escape key closes modal and cancels unfinished registration
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Backdrop click handler: clicking blurred/darkened area outside form closes modal immediately
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancelAndClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim();

      if (!cleanName) {
        setErrorMsg('Please enter your full name.');
        setIsLoading(false);
        return;
      }

      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setErrorMsg('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      const res = await registerReader({
        fullName: cleanName,
        email: cleanEmail,
        country,
        niche: niche.trim() || undefined
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed. Please check your details.');
        setIsLoading(false);
        return;
      }

      // Exact confirmation message required by prompt:
      // "Your registration is complete. Welcome to The Book Clique! You can now access the Book Club."
      setSuccessMsg('Your registration is complete. Welcome to The Book Clique! You can now access the Book Club.');

      // Automatically sign reader in and redirect to their original reading destination
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A1B14]/80 backdrop-blur-xs animate-fadeIn cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-registration-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#C5A059]/40 rounded-lg shadow-2xl overflow-hidden text-[#1C1E1D] cursor-default"
      >
        
        {/* Header with clearly visible Cancellation (×) Button at top-right */}
        <div className="bg-[#143826] text-[#FAF6F0] p-5 sm:p-6 border-b border-[#C5A059]/30 relative">
          
          {/* Working Top-Right Cancel (×) Button - accessible on mobile & desktop with high-contrast touch area */}
          <button
            type="button"
            onClick={handleCancelAndClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#FAF6F0] bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full border border-white/20 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            aria-label="Cancel and close registration"
            title="Cancel and return to previous page"
          >
            <X className="w-5 h-5 text-[#FAF6F0]" />
          </button>

          {/* Single Option Focus: NEW READER REGISTRATION */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E8D4B4] mb-2 pr-12">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span className="bg-[#0D2419] px-2.5 py-0.5 rounded border border-[#C5A059]/40 font-bold text-[#E8D4B4]">
              NEW READER REGISTRATION
            </span>
          </div>

          <h3 id="reader-registration-title" className="font-serif text-xl sm:text-2xl font-bold text-[#FFFDF9] pr-12 leading-snug">
            {title || 'Register for Book Club Access'}
          </h3>

          <p className="mt-1.5 text-xs text-[#D1DDD6] leading-relaxed pr-8">
            Complete this quick registration for automatic approval and immediate access to Book Club ratings and community discussions.
          </p>
        </div>

        {/* Form Body - Contains ONLY the 4 required fields */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Field 1: Name (Required) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143826] mb-1.5">
              1. Name <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-[#D5CDBD] rounded text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826]"
              />
            </div>
          </div>

          {/* Field 2: Email Address (Required) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143826] mb-1.5">
              2. Email Address <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-[#D5CDBD] rounded text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826]"
              />
            </div>
          </div>

          {/* Field 3: Country (Required, dropdown) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#143826] mb-1.5">
              3. Country <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3.5 pointer-events-none" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full pl-10 pr-8 py-2.5 bg-[#FFFFFF] border border-[#D5CDBD] rounded text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826] cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 4: Niche You Love (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#143826]">
                4. Niche You Love <span className="text-xs font-normal text-[#717C76] lowercase">(optional)</span>
              </label>
            </div>
            <div className="relative">
              <Heart className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3.5" />
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Mystery, Romance, Sci-Fi, Historical, Memoir"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-[#D5CDBD] rounded text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826]"
              />
            </div>
          </div>

          {/* Automatic Approval & Security Notice */}
          <div className="p-3 bg-[#FAF6F0] border border-[#E6DFD5] rounded text-xs text-[#525B55] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Automatic Approval:</strong> Access is granted immediately with zero waiting list. Your account keeps you signed in securely on this device so you can read available chapters seamlessly.
            </p>
          </div>

          {/* Action Buttons: Cancel and Complete Registration */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleCancelAndClose}
              className="w-full sm:w-1/3 py-2.5 px-4 rounded border border-[#D5CDBD] hover:bg-[#EAE4D8] text-[#4A534E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full sm:w-2/3 py-3 px-4 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isLoading ? 'Processing...' : 'Complete Registration & Access'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

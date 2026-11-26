import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerifiedDonation } from '../types';
import {
  INTENDED_COUNTRY_ROTATION_ORDER,
  formatDonationAmount,
  getCountryFlag
} from '../utils/donationUtils';

export const DonorNotificationToast: React.FC = () => {
  const {
    eligibleDonations,
    activeReaderManuscript,
    isPaymentModalOpen,
    setIsDonationModalOpen,
    setActiveView
  } = useApp();

  const [currentDonation, setCurrentDonation] = useState<VerifiedDonation | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // References to preserve rotation index and prevent duplicates / consecutive countries
  const lastCountryRef = useRef<string | null>(null);
  const countryIndexRef = useRef<number>(0);
  const shownIdsRef = useRef<Set<string>>(new Set());

  // Timer refs to prevent duplicate timers and memory leaks
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Group donations by country
  const getDonationsByCountry = useCallback(() => {
    const map = new Map<string, VerifiedDonation[]>();
    eligibleDonations.forEach((d) => {
      if (!d.country) return;
      const key = d.country.trim();
      const list = map.get(key) || [];
      list.push(d);
      map.set(key, list);
    });
    return map;
  }, [eligibleDonations]);

  // Select the next eligible donation following the specified country rotation:
  // 1. Kuwait, 2. Bahrain, 3. Oman, 4. Jordan, 5. UK, 6. Switzerland, 7. Germany,
  // 8. France, 9. Netherlands, 10. Ireland, 11. United States
  // Strictly enforces:
  // - Never show two consecutive notifications from the same country
  // - Never display consecutive United States donor entries
  const selectNextDonation = useCallback((): VerifiedDonation | null => {
    if (!eligibleDonations || eligibleDonations.length === 0) return null;

    const byCountry = getDonationsByCountry();
    const availableCountries = Array.from(byCountry.keys());
    if (availableCountries.length === 0) return null;

    const lastCountry = lastCountryRef.current;
    const totalRotationSteps = INTENDED_COUNTRY_ROTATION_ORDER.length;

    // Search sequentially along the intended country rotation order
    for (let attempts = 0; attempts < totalRotationSteps * 2; attempts++) {
      const targetCountry = INTENDED_COUNTRY_ROTATION_ORDER[countryIndexRef.current % totalRotationSteps];
      countryIndexRef.current = (countryIndexRef.current + 1) % totalRotationSteps;

      // Must not be consecutive with the previous notification's country
      if (lastCountry && targetCountry.toLowerCase() === lastCountry.toLowerCase()) {
        continue;
      }

      const countryCandidates = byCountry.get(targetCountry);
      if (countryCandidates && countryCandidates.length > 0) {
        // Find unshown candidates first
        const unshown = countryCandidates.filter((d) => !shownIdsRef.current.has(d.id));
        const pool = unshown.length > 0 ? unshown : countryCandidates;

        const selected = pool[Math.floor(Math.random() * pool.length)];
        shownIdsRef.current.add(selected.id);

        if (shownIdsRef.current.size >= eligibleDonations.length) {
          shownIdsRef.current.clear();
        }

        lastCountryRef.current = selected.country;
        return selected;
      }
    }

    // Fallback: Pick any country different from lastCountry
    const otherCountries = availableCountries.filter(
      (c) => !lastCountry || c.toLowerCase() !== lastCountry.toLowerCase()
    );
    const poolCountries = otherCountries.length > 0 ? otherCountries : availableCountries;
    const randomCountry = poolCountries[Math.floor(Math.random() * poolCountries.length)];
    const candidates = byCountry.get(randomCountry) || [];
    if (candidates.length === 0) return null;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    lastCountryRef.current = picked.country;
    return picked;
  }, [eligibleDonations, getDonationsByCountry]);

  // Clean timer helper
  const clearAllTimers = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
  };

  // Trigger a new notification presentation
  const showNextNotification = useCallback(() => {
    // Check pause safeguards: reading manuscript or completing payment
    if (activeReaderManuscript || isPaymentModalOpen) {
      // Re-check in 5 seconds
      clearAllTimers();
      nextTimerRef.current = setTimeout(() => {
        showNextNotification();
      }, 5000);
      return;
    }

    const next = selectNextDonation();
    if (!next) {
      // Retry in 10 seconds
      clearAllTimers();
      nextTimerRef.current = setTimeout(() => {
        showNextNotification();
      }, 10000);
      return;
    }

    setCurrentDonation(next);
    setIsVisible(true);

    // Visible for 5.5 seconds, then schedule next for 10 seconds later
    clearAllTimers();
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      nextTimerRef.current = setTimeout(() => {
        showNextNotification();
      }, 10000);
    }, 5500);
  }, [activeReaderManuscript, isPaymentModalOpen, selectNextDonation]);

  // Main lifecycle: Start first notification within 3 seconds of page load
  useEffect(() => {
    clearAllTimers();

    // Pause safeguards
    if (activeReaderManuscript || isPaymentModalOpen) {
      setIsVisible(false);
      return;
    }

    // Schedule initial appearance within 3 seconds
    nextTimerRef.current = setTimeout(() => {
      showNextNotification();
    }, 2800);

    return () => {
      clearAllTimers();
    };
  }, [activeReaderManuscript, isPaymentModalOpen, showNextNotification]);

  // When visitor clicks the × button:
  // Smoothly dismiss current notification and schedule next notification to appear 10 seconds later
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    clearAllTimers();
    nextTimerRef.current = setTimeout(() => {
      showNextNotification();
    }, 10000);
  };

  // When visitor clicks the toast card:
  // Automatically navigate directly to the dedicated Donation page
  const handleCardClick = () => {
    setIsVisible(false);
    clearAllTimers();
    setActiveView('donation');
    // Schedule next notification for 20 seconds later
    nextTimerRef.current = setTimeout(() => {
      showNextNotification();
    }, 20000);
  };

  if (!currentDonation || !isVisible || activeReaderManuscript || isPaymentModalOpen) {
    return null;
  }

  const formattedAmount = formatDonationAmount(
    currentDonation.amount,
    currentDonation.currency
  );
  const flag = getCountryFlag(currentDonation.country);

  return (
    <aside
      aria-live="polite"
      aria-label="Community Donor Contribution Notification"
      onClick={handleCardClick}
      className="fixed bottom-5 left-5 z-40 max-w-sm sm:max-w-md w-full transition-all duration-500 transform animate-in slide-in-from-bottom-5 fade-in cursor-pointer group"
    >
      <div className="bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] backdrop-blur-md border border-[#C5A059]/40 hover:border-[#143826] rounded-sm shadow-xl p-4 sm:p-4.5 text-[#1C1E1D] relative overflow-hidden transition-all duration-300">
        
        {/* Decorative subtle top heritage green line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#143826] via-[#C5A059] to-[#143826]" />

        {/* Dismiss Button (x) */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 text-[#8C968F] hover:text-[#143826] hover:bg-[#FAF6F0] rounded transition-colors cursor-pointer z-10"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* Heart Emblem */}
          <div className="w-9 h-9 rounded bg-[#143826] group-hover:bg-[#1E4D35] text-[#E8D4B4] flex items-center justify-center shrink-0 shadow-2xs mt-0.5 transition-colors">
            <Heart className="w-4.5 h-4.5 text-[#E8D4B4] fill-[#E8D4B4]" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row: Donor Name & Country */}
            <div className="flex items-center flex-wrap gap-1.5 leading-snug">
              <span className="font-serif font-bold text-sm sm:text-base text-[#143826] group-hover:underline">
                {currentDonation.donorName}
              </span>
              <span className="text-xs text-[#525B55] flex items-center gap-1 font-medium">
                <span>from {currentDonation.country}</span>
                <span className="text-sm" aria-hidden="true">{flag}</span>
              </span>
            </div>

            {/* Donation Amount in Verified Currency */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xs text-[#525B55]">contributed</span>
              <span className="font-serif font-bold text-sm sm:text-base text-[#143826] tracking-tight">
                {formattedAmount}
              </span>
              <span className="text-[11px] text-[#8C6D23] font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                <span>Verified</span>
              </span>
            </div>

            {/* Optional message if provided by donor */}
            {currentDonation.message && (
              <p className="mt-1 text-xs italic text-[#556059] line-clamp-2 leading-relaxed">
                “{currentDonation.message}”
              </p>
            )}


            {/* Footer row: Click prompt */}
            <div className="mt-2.5 pt-2 border-t border-[#EFEBE4] flex items-center justify-between text-[11px]">
              <span className="text-[#717C76]">
                Click to see where your support goes
              </span>
              <span className="font-semibold text-[#143826] group-hover:text-[#8C6D23] transition-colors">
                Where Your Support Goes →
              </span>
            </div>

          </div>
        </div>

      </div>
    </aside>
  );
};

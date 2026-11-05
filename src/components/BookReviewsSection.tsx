import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sparkles,
  LogIn,
  User,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookReview } from '../types';

interface BookReviewsSectionProps {
  manuscriptId: string;
  bookTitle?: string;
}

const STAR_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

export const BookReviewsSection: React.FC<BookReviewsSectionProps> = ({
  manuscriptId,
  bookTitle = "Ethan's Presence"
}) => {
  const {
    currentReader,
    openReaderAuthModal,
    logoutReader,
    isAdminOpen,
    reviews,
    ratingStats,
    userReview,
    isLoadingReviews,
    fetchBookReviews,
    submitBookReview,
    deleteReviewAsAdmin
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Load reviews on mount or manuscript change
  useEffect(() => {
    fetchBookReviews(manuscriptId);
  }, [manuscriptId, currentReader?.id]);

  // Sync selectedRating with user's existing review if any
  useEffect(() => {
    if (userReview?.rating) {
      setSelectedRating(userReview.rating);
    }
    if (userReview?.comment && !commentText) {
      setCommentText(userReview.comment);
    }
  }, [userReview]);

  const activeRating = hoverRating !== null ? hoverRating : selectedRating;

  // Handle star click for rating
  const handleStarClick = async (starValue: number) => {
    if (!currentReader) {
      openReaderAuthModal(
        () => handleStarClick(starValue),
        'Register to Rate This Book',
        'register'
      );
      return;
    }

    setSelectedRating(starValue);
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const res = await submitBookReview({
        manuscriptId,
        rating: starValue,
        comment: commentText.trim() || undefined
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `You rated this book ${starValue} Stars (${STAR_LABELS[starValue]}).`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to record rating.'
        });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Error recording rating.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle posting a comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your thoughts before posting.' });
      return;
    }

    if (!currentReader) {
      openReaderAuthModal(
        () => handlePostComment(e),
        'Register to Post Your Thoughts',
        'register'
      );
      return;
    }

    // Default to 5 stars if not rated yet or keep existing rating
    const ratingToSubmit = selectedRating > 0 ? selectedRating : 5;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await submitBookReview({
        manuscriptId,
        rating: ratingToSubmit,
        comment: commentText.trim()
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Thank you! Your thoughts and rating have been posted to the community board.'
        });
        setSelectedRating(ratingToSubmit);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to post comment.'
        });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Error posting comment.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter reviews
  const displayedReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const stats = ratingStats || {
    averageRating: 4.4,
    totalRatings: reviews.length || 78,
    distribution: { 5: 39, 4: 28, 3: 11, 2: 0, 1: 0 },
    distributionPercentages: { 5: 50, 4: 36, 3: 14, 2: 0, 1: 0 }
  };

  return (
    <section id="book-reviews-section" className="mt-12 space-y-10">
      
      {/* ============================================================== */}
      {/* 1. RATE THIS BOOK & COMMUNITY RATINGS SUMMARY                  */}
      {/* ============================================================== */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg shadow-xs overflow-hidden">
        <div className="bg-[#143826] text-[#FAF6F0] p-5 sm:p-6 border-b border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E8D4B4]/20 text-[#E8D4B4] text-[11px] font-semibold uppercase tracking-wider mb-1 border border-[#E8D4B4]/30">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Reader Ratings & Community Consensus</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9]">
              Rate This Book
            </h3>
            <p className="text-xs text-[#D1DDD6] mt-0.5">
              Share your honest rating from 1 to 5 stars for <em>{bookTitle}</em>.
            </p>
          </div>

          {currentReader ? (
            <div className="flex items-center gap-2 bg-[#0D2419] px-3.5 py-2 rounded border border-[#C5A059]/30 text-xs">
              <span className="text-base">{currentReader.countryFlag || '🇬🇧'}</span>
              <div>
                <span className="text-[#C5D2CB] text-[10px] block">Logged in reader</span>
                <span className="font-bold text-[#FAF6F0]">{currentReader.fullName}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openReaderAuthModal(undefined, 'Register or Log In', 'register')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FAF6F0] text-[#143826] hover:bg-[#EAE4D8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Register / Log In</span>
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Rating Console */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] block mb-1">
                  Your Rating
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5" role="group" aria-label="5 Star Rating Scale">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= activeRating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => handleStarClick(star)}
                          className="p-1 rounded-sm transition-transform hover:scale-110 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#8C6D23]"
                          title={`${star} Star: ${STAR_LABELS[star]}`}
                          aria-label={`${star} Star: ${STAR_LABELS[star]}`}
                        >
                          <Star
                            className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-150 ${
                              isFilled
                                ? 'text-[#D4AF37] fill-[#D4AF37] drop-shadow-xs'
                                : 'text-[#D5CDBD] hover:text-[#D4AF37]/60'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-sm font-bold text-[#143826] ml-2">
                    {activeRating > 0 ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#FAF6F0] px-3 py-1 rounded border border-[#E6DFD5]">
                        <span className="text-[#8C6D23] font-mono text-sm">{activeRating}/5</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#4A534E]">
                          — {STAR_LABELS[activeRating]}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#717C76] italic">Click a star to rate</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Star Scale Guide */}
              <div className="grid grid-cols-5 gap-1 pt-1 text-center text-[10px] text-[#525B55]">
                <div><span className="font-bold text-[#143826]">1★</span> Poor</div>
                <div><span className="font-bold text-[#143826]">2★</span> Fair</div>
                <div><span className="font-bold text-[#143826]">3★</span> Good</div>
                <div><span className="font-bold text-[#143826]">4★</span> Very Good</div>
                <div><span className="font-bold text-[#143826]">5★</span> Excellent</div>
              </div>

              {userReview && (
                <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded p-3 text-xs text-[#3E4642] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                    <span>
                      You rated this book <strong>{userReview.rating} Stars ({STAR_LABELS[userReview.rating]})</strong>.
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C6D23] font-semibold">Click any star to update</span>
                </div>
              )}

              {!currentReader && (
                <div className="bg-[#FAF6F0] border border-[#E8D4B4] rounded p-3 text-xs text-[#525B55] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#8C6D23] shrink-0" />
                  <span>
                    Register once to save your rating, unlock chapter reading, and post comments.
                  </span>
                </div>
              )}
            </div>

            {/* Community Rating Summary Display */}
            <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                  Community Ratings Breakdown
                </span>
                <span className="text-xs text-[#717C76] font-medium">
                  {stats.totalRatings} Verified Ratings
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Big Score Block */}
                <div className="flex flex-col items-center justify-center bg-[#FFFFFF] border border-[#E6DFD5] rounded-md p-4 min-w-[120px] shadow-2xs">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#143826]">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5 my-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(stats.averageRating)
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-[#D5CDBD]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#717C76] text-center">
                    out of 5 stars
                  </span>
                </div>

                {/* Star Progress Bars (5 down to 1) */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((ratingLevel) => {
                    const count = (stats.distribution as any)[ratingLevel] || 0;
                    const pct = (stats.distributionPercentages as any)[ratingLevel] || 0;
                    return (
                      <button
                        key={ratingLevel}
                        type="button"
                        onClick={() => setFilterRating(filterRating === ratingLevel ? 'all' : ratingLevel)}
                        className={`w-full flex items-center gap-2 text-xs transition-colors rounded px-1.5 py-0.5 text-left cursor-pointer ${
                          filterRating === ratingLevel ? 'bg-[#143826]/10 font-bold' : 'hover:bg-[#FFFFFF]'
                        }`}
                        title={`Filter by ${ratingLevel} stars (${count} reviews)`}
                      >
                        <span className="w-8 shrink-0 flex items-center gap-0.5 text-[#143826] font-semibold text-[11px]">
                          <span>{ratingLevel}</span>
                          <Star className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                        </span>

                        <div className="flex-1 bg-[#ECE5D8] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#143826] to-[#C5A059] h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <span className="w-10 text-right text-[11px] text-[#717C76] font-mono shrink-0">
                          {pct}%
                        </span>
                        <span className="w-8 text-right text-[11px] text-[#4A534E] font-medium shrink-0">
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {filterRating !== 'all' && (
                <div className="flex items-center justify-between pt-2 border-t border-[#EAE4D8] text-xs">
                  <span className="text-[#8C6D23] font-medium">
                    Showing only {filterRating}-star reviews
                  </span>
                  <button
                    type="button"
                    onClick={() => setFilterRating('all')}
                    className="text-[#143826] underline font-semibold cursor-pointer"
                  >
                    Reset Filter (Show All)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SHARE YOUR THOUGHTS ABOUT THIS STORY (READER COMMENTS)       */}
      {/* ============================================================== */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg shadow-xs overflow-hidden">
        
        <div className="bg-[#FAF8F5] p-5 sm:p-6 border-b border-[#E6DFD5]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Community Discussion & Reader Impressions</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#143826]">
            Share Your Thoughts About This Story
          </h3>
          <p className="text-xs text-[#525B55] mt-1 max-w-2xl leading-relaxed">
            Join the conversation! Share your reactions, thoughts on character developments, or personal reflections on <em>{bookTitle}</em> with fellow book club members.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Comment Form Box */}
          <form onSubmit={handlePostComment} className="space-y-4">
            
            {statusMessage && (
              <div
                className={`p-3 rounded text-xs flex items-start gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Author Indicator Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#525B55]">
              {currentReader ? (
                <div className="flex items-center gap-2">
                  <span className="text-base">{currentReader.countryFlag || '🇬🇧'}</span>
                  <span className="font-bold text-[#143826]">
                    Commenting as {currentReader.fullName}
                  </span>
                  <span className="text-[#8C6D23] text-[11px]">
                    ({currentReader.country || 'United Kingdom'})
                  </span>
                  {selectedRating > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6D23] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E6DFD5]">
                      <span>{selectedRating}★</span>
                      <span>({STAR_LABELS[selectedRating]})</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#717C76]">
                  <User className="w-4 h-4 text-[#8C6D23]" />
                  <span>Not logged in · You will be prompted to register before posting</span>
                </div>
              )}

              {currentReader && (
                <button
                  type="button"
                  onClick={logoutReader}
                  className="text-[11px] text-[#717C76] hover:text-rose-600 underline cursor-pointer"
                >
                  Switch account / Log out
                </button>
              )}
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What do you think about this part of the story?"
                className="w-full p-4 bg-[#FAF8F5] border border-[#D5CDBD] rounded-md text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826] leading-relaxed resize-y placeholder:text-[#8A958F]"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] text-[#717C76] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Verified community comments · Inappropriate spam is strictly moderated</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0B1E16] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>

          {/* ============================================================== */}
          {/* Community Comments List (All 78 Verified Reader Reviews)        */}
          {/* ============================================================== */}
          <div className="border-t border-[#EAE4D8] pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#143826] flex items-center gap-2">
                  <span>Community Reader Comments & Reactions</span>
                  <span className="text-xs font-sans font-bold px-2 py-0.5 rounded bg-[#FAF6F0] text-[#8C6D23] border border-[#E6DFD5]">
                    {displayedReviews.length}
                  </span>
                </h4>
                <p className="text-xs text-[#525B55] mt-0.5">
                  Real impressions from readers across 8 countries.
                </p>
              </div>

              {filterRating !== 'all' && (
                <span className="text-xs text-[#8C6D23] font-semibold">
                  Filtered: {filterRating} Stars
                </span>
              )}
            </div>

            {isLoadingReviews ? (
              <div className="py-12 text-center text-xs text-[#717C76]">
                Loading verified community comments...
              </div>
            ) : displayedReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#717C76] bg-[#FAF8F5] rounded border border-[#E6DFD5]">
                No comments found for this rating filter.
              </div>
            ) : (
              <div className="space-y-4">
                {displayedReviews.map((rev) => {
                  const isUserOwn = currentReader?.id === rev.readerId;
                  const dateFormatted = new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <article
                      key={rev.id}
                      className={`p-4 sm:p-5 rounded-md border transition-colors ${
                        isUserOwn
                          ? 'bg-[#FAF8F5] border-2 border-[#143826]/40 shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E6DFD5] hover:border-[#D5CDBD]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl" title={rev.country}>
                            {rev.countryFlag || '🇬🇧'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-bold text-[#143826]">
                                {rev.readerName}
                              </span>
                              {isUserOwn && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                                  Your Review
                                </span>
                              )}
                              <span className="text-[11px] text-[#717C76] hidden sm:inline">
                                · {rev.country}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#8A958F]">
                              {dateFormatted}
                            </span>
                          </div>
                        </div>

                        {/* Stars & Moderation */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-[#FAF6F0] px-2.5 py-1 rounded border border-[#EAE4D8]">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= rev.rating
                                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                                      : 'text-[#D5CDBD]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-[#143826] ml-1">
                              {rev.rating}/5
                            </span>
                          </div>

                          {/* Admin Trash Can for Moderation */}
                          {isAdminOpen && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Admin: Remove comment by "${rev.readerName}"?`)) {
                                  await deleteReviewAsAdmin(rev.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title="Admin: Remove this comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                        {rev.comment}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
};

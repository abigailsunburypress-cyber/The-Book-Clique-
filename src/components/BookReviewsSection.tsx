import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Send,
  Trash2,
  CheckCircle2,
  LogIn,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookReview } from '../types';
import {
  SAMPLE_COMMENTS_RAISING_THE_WHOLE_CHILD,
  SAMPLE_COMMENTS_STATS
} from '../data/raisingTheWholeChildSampleComments';

interface BookDiscussionComment {
  id: string;
  manuscriptId: string;
  readerId: string;
  readerName: string;
  country: string;
  countryFlag: string;
  comment: string;
  rating?: number | null;
  createdAt: string;
}

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

const getLocalFallbackKey = (kind: 'reviews' | 'comments', manuscriptId: string) =>
  `tbc_local_${kind}_${manuscriptId}`;

const readLocalFallback = <T,>(kind: 'reviews' | 'comments', manuscriptId: string): T[] => {
  try {
    const raw = window.localStorage.getItem(getLocalFallbackKey(kind, manuscriptId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalFallback = <T,>(kind: 'reviews' | 'comments', manuscriptId: string, items: T[]) => {
  try {
    window.localStorage.setItem(getLocalFallbackKey(kind, manuscriptId), JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
};

export const BookReviewsSection: React.FC<BookReviewsSectionProps> = ({
  manuscriptId,
  bookTitle = 'Slow Productivity'
}) => {
  const {
    currentReader,
    openReaderAuthModal,
    isAdminOpen,
    submitBookReview,
    deleteReviewAsAdmin
  } = useApp();

  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [discussionComments, setDiscussionComments] = useState<BookDiscussionComment[]>([]);
  const [userReview, setUserReview] = useState<BookReview | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);

  const [commentText, setCommentText] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const COMMENTS_PER_PAGE = 10;

  const isPrimaryBookClubBook =
    manuscriptId === 'slow-productivity' || manuscriptId === 'raising-the-whole-child';

  const loadLocalReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const reviewsUrl = `/api/bookclub/reviews?manuscriptId=${encodeURIComponent(manuscriptId)}${
        currentReader?.id ? `&readerId=${encodeURIComponent(currentReader.id)}` : ''
      }`;
      const [revRes, cmtRes] = await Promise.all([
        fetch(reviewsUrl),
        fetch(`/api/bookclub/comments?manuscriptId=${encodeURIComponent(manuscriptId)}`)
      ]);

      if (revRes.ok) {
        const data = await revRes.json();
        if (data.success) {
          const list = Array.isArray(data.reviews) ? data.reviews : [];
          setReviews(list);
          setUserReview(data.userReview || null);
          writeLocalFallback('reviews', manuscriptId, list);
        }
      } else {
        const cached = readLocalFallback<BookReview>('reviews', manuscriptId);
        setReviews(cached);
        if (currentReader?.id) {
          setUserReview(cached.find((r) => r.readerId === currentReader.id) || null);
        }
      }

      if (cmtRes.ok) {
        const cData = await cmtRes.json();
        if (cData.success) {
          const list = Array.isArray(cData.comments) ? cData.comments : [];
          setDiscussionComments(list);
          writeLocalFallback('comments', manuscriptId, list);
        }
      } else {
        setDiscussionComments(readLocalFallback<BookDiscussionComment>('comments', manuscriptId));
      }
    } catch {
      const cachedReviews = readLocalFallback<BookReview>('reviews', manuscriptId);
      setReviews(cachedReviews);
      if (currentReader?.id) {
        setUserReview(cachedReviews.find((r) => r.readerId === currentReader.id) || null);
      }
      setDiscussionComments(readLocalFallback<BookDiscussionComment>('comments', manuscriptId));
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadLocalReviews();
  }, [manuscriptId, currentReader?.id]);

  useEffect(() => {
    if (userReview?.rating) {
      setSelectedRating(userReview.rating);
    } else {
      setSelectedRating(0);
    }
  }, [userReview?.id, userReview?.rating]);

  const activeRating = hoverRating !== null ? hoverRating : selectedRating;

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
        await loadLocalReviews();
        setStatusMessage({
          type: 'success',
          text: `You rated this book ${starValue} Stars (${STAR_LABELS[starValue]}).`
        });
      } else {
        // Fallback persistence for static CDN preview/Netlify
        const localReviews = readLocalFallback<BookReview>('reviews', manuscriptId);
        const existingIdx = localReviews.findIndex((r) => r.readerId === currentReader.id);
        const updatedReview: BookReview = {
          id: existingIdx >= 0 ? localReviews[existingIdx].id : `rev-${Date.now()}`,
          manuscriptId,
          readerId: currentReader.id,
          readerName: currentReader.fullName,
          country: currentReader.country || 'United Kingdom',
          countryFlag: currentReader.countryFlag || '🇬🇧',
          rating: starValue,
          comment: commentText.trim() || (existingIdx >= 0 ? localReviews[existingIdx].comment : ''),
          createdAt: new Date().toISOString()
        };
        if (existingIdx >= 0) {
          localReviews[existingIdx] = updatedReview;
        } else {
          localReviews.unshift(updatedReview);
        }
        writeLocalFallback('reviews', manuscriptId, localReviews);
        setReviews(localReviews);
        setUserReview(updatedReview);
        setStatusMessage({
          type: 'success',
          text: `You rated this book ${starValue} Stars (${STAR_LABELS[starValue]}).`
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not save rating right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your thoughts before posting.' });
      return;
    }

    if (!currentReader) {
      openReaderAuthModal(
        () => handlePostComment(e),
        'Register to Share Your Thoughts',
        'register'
      );
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    const trimmed = commentText.trim();
    const ratingToSave = selectedRating > 0 ? selectedRating : userReview?.rating || 5;

    try {
      let postedViaApi = false;
      const cmtRes = await fetch('/api/bookclub/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manuscriptId,
          readerId: currentReader.id,
          readerName: currentReader.fullName,
          country: currentReader.country,
          countryFlag: currentReader.countryFlag,
          comment: trimmed,
          rating: ratingToSave
        })
      });

      if (cmtRes.ok) {
        const cData = await cmtRes.json();
        if (cData.success) {
          postedViaApi = true;
        }
      }

      if (selectedRating > 0 && !userReview) {
        await submitBookReview({
          manuscriptId,
          rating: selectedRating,
          comment: trimmed
        });
      }

      if (postedViaApi) {
        await loadLocalReviews();
      } else {
        const localComments = readLocalFallback<BookDiscussionComment>('comments', manuscriptId);
        const newComment: BookDiscussionComment = {
          id: `cmt-${Date.now()}`,
          manuscriptId,
          readerId: currentReader.id,
          readerName: currentReader.fullName,
          country: currentReader.country || 'United Kingdom',
          countryFlag: currentReader.countryFlag || '🇬🇧',
          comment: trimmed,
          rating: ratingToSave,
          createdAt: new Date().toISOString()
        };
        const updated = [newComment, ...localComments];
        writeLocalFallback('comments', manuscriptId, updated);
        setDiscussionComments(updated);
      }

      setCommentText('');
      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your comment has been posted to the Book Club discussion below.'
      });
    } catch {
      const localComments = readLocalFallback<BookDiscussionComment>('comments', manuscriptId);
      const newComment: BookDiscussionComment = {
        id: `cmt-${Date.now()}`,
        manuscriptId,
        readerId: currentReader.id,
        readerName: currentReader.fullName,
        country: currentReader.country || 'United Kingdom',
        countryFlag: currentReader.countryFlag || '🇬🇧',
        comment: trimmed,
        rating: ratingToSave,
        createdAt: new Date().toISOString()
      };
      const updated = [newComment, ...localComments];
      writeLocalFallback('comments', manuscriptId, updated);
      setDiscussionComments(updated);
      setCommentText('');
      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your comment has been posted to the Book Club discussion below.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine initial 51 ratings & live reader ratings for overall breakdown
  const baseDistribution = isPrimaryBookClubBook
    ? SAMPLE_COMMENTS_STATS.distribution
    : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const ratingDistribution = {
    5: (baseDistribution[5] || 0) + reviews.filter((r) => r.rating === 5).length,
    4: (baseDistribution[4] || 0) + reviews.filter((r) => r.rating === 4).length,
    3: (baseDistribution[3] || 0) + reviews.filter((r) => r.rating === 3).length,
    2: (baseDistribution[2] || 0) + reviews.filter((r) => r.rating === 2).length,
    1: (baseDistribution[1] || 0) + reviews.filter((r) => r.rating === 1).length
  };

  const totalReviewsCount =
    (isPrimaryBookClubBook ? SAMPLE_COMMENTS_STATS.totalCount : 0) + reviews.length;

  const totalStarsSum =
    ratingDistribution[5] * 5 +
    ratingDistribution[4] * 4 +
    ratingDistribution[3] * 3 +
    ratingDistribution[2] * 2 +
    ratingDistribution[1] * 1;

  const overallRating =
    totalReviewsCount > 0 ? Number((totalStarsSum / totalReviewsCount).toFixed(1)) : 0;

  const genuineReviewsCount = reviews.length;
  const genuineAverageRating =
    genuineReviewsCount > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / genuineReviewsCount).toFixed(1))
      : null;

  interface CombinedCommentItem {
    id: string;
    number?: number;
    name: string;
    rating: number;
    comment: string;
    country?: string;
    countryFlag?: string;
    createdAt?: string;
    isVerifiedReader: boolean;
    isPersistedEntry: boolean;
    sourceType?: 'comment' | 'review';
    readerId?: string;
  }

  const combinedComments: CombinedCommentItem[] = [];
  const seenCommentKeys = new Set<string>();

  // 1. Live discussion comments (newest first)
  for (const cmt of [...discussionComments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )) {
    const key = `${cmt.readerId}::${cmt.comment.trim()}`;
    seenCommentKeys.add(key);
    combinedComments.push({
      id: cmt.id,
      name: cmt.readerName,
      rating: cmt.rating && cmt.rating >= 1 && cmt.rating <= 5 ? cmt.rating : 5,
      comment: cmt.comment,
      country: cmt.country,
      countryFlag: cmt.countryFlag,
      createdAt: cmt.createdAt,
      isVerifiedReader: true,
      isPersistedEntry: true,
      sourceType: 'comment',
      readerId: cmt.readerId
    });
  }

  // 2. Live reader reviews with written comments
  for (const rev of reviews) {
    const trimmed = (rev.comment || '').trim();
    if (!trimmed) continue;
    const key = `${rev.readerId}::${trimmed}`;
    if (seenCommentKeys.has(key)) continue;
    seenCommentKeys.add(key);
    combinedComments.push({
      id: rev.id,
      name: rev.readerName,
      rating: rev.rating,
      comment: trimmed,
      country: rev.country,
      countryFlag: rev.countryFlag,
      createdAt: rev.createdAt,
      isVerifiedReader: true,
      isPersistedEntry: true,
      sourceType: 'review',
      readerId: rev.readerId
    });
  }

  // 3. The 51 preserved reader comments attached directly beneath the Book Club selection
  if (isPrimaryBookClubBook) {
    for (const item of SAMPLE_COMMENTS_RAISING_THE_WHOLE_CHILD) {
      combinedComments.push({
        id: `reader-comment-${item.number}`,
        number: item.number,
        name: item.name,
        rating: item.rating,
        comment: item.comment,
        isVerifiedReader: false,
        isPersistedEntry: false
      });
    }
  }

  const filteredComments = combinedComments.filter((item) => {
    if (filterRating !== 'all' && item.rating !== filterRating) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchText = item.comment.toLowerCase().includes(q);
      const matchNum = item.number ? `#${item.number}`.includes(q) || String(item.number) === q.trim() : false;
      return matchName || matchText || matchNum;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredComments.length / COMMENTS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedComments = showAllComments
    ? filteredComments
    : filteredComments.slice((safePage - 1) * COMMENTS_PER_PAGE, safePage * COMMENTS_PER_PAGE);

  return (
    <section id="book-reviews-section" className="mt-12 space-y-10">
      
      {/* ============================================================== */}
      {/* 1. RATE THIS BOOK & RATINGS BREAKDOWN CONSOLE                  */}
      {/* ============================================================== */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-sm shadow-xs overflow-hidden">
        <div className="bg-[#143826] text-[#FAF6F0] p-5 sm:p-6 border-b border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E8D4B4]/20 text-[#E8D4B4] text-[11px] font-semibold uppercase tracking-wider mb-1 border border-[#E8D4B4]/30">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Reader Ratings &amp; Community Reviews</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9]">
              Rate This Book
            </h3>
            <p className="text-xs text-[#D1DDD6] mt-0.5">
              Share your honest rating and thoughts for <em>{bookTitle}</em>.
            </p>
          </div>

          {currentReader ? (
            <div className="flex items-center gap-2 bg-[#0D2419] px-3.5 py-2 rounded border border-[#C5A059]/30 text-xs">
              <span className="text-base">{currentReader.countryFlag || '🇬🇧'}</span>
              <div>
                <span className="text-[#C5D2CB] text-[10px] block">Registered reader</span>
                <span className="font-bold text-[#FAF6F0]">{currentReader.fullName}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openReaderAuthModal(undefined, 'Register to Rate & Comment', 'register')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#FAF6F0] text-[#143826] hover:bg-[#EAE4D8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Register to Participate</span>
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive 5-Star Rating Selector */}
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
                    Register once to record your rating and post comments in the Book Club discussion.
                  </span>
                </div>
              )}
            </div>

            {/* Overall Rating & Ratings Breakdown */}
            <div className="lg:col-span-6 bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                  Overall Rating &amp; Ratings Breakdown
                </span>
                <span className="text-xs text-[#717C76] font-medium">
                  {totalReviewsCount} Total Reviews
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex flex-col items-center justify-center bg-[#FFFFFF] border border-[#E6DFD5] rounded-md p-4 min-w-[130px] shadow-2xs">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#143826]">
                    {overallRating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5 my-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(overallRating)
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-[#D5CDBD]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#525B55] font-medium text-center">
                    Overall Book Rating
                  </span>
                </div>

                <div className="flex-1 space-y-1.5 w-full">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingDistribution[stars as keyof typeof ratingDistribution] || 0;
                    const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs">
                        <span className="w-7 font-bold text-[#143826] flex items-center gap-0.5">
                          <span>{stars}</span>
                          <Star className="w-2.5 h-2.5 text-[#D4AF37] fill-[#D4AF37]" />
                        </span>

                        <div className="flex-1 h-2 bg-[#EAE4D8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#143826] rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <span className="w-12 text-right text-[11px] text-[#525B55] font-mono">
                          {count} ({percent}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8C6D23]" />
                  <span className="font-semibold text-[#143826]">
                    Member Ratings Recorded:
                  </span>
                </div>

                {genuineReviewsCount > 0 ? (
                  <span className="font-mono font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded border border-[#86EFAC]">
                    {genuineAverageRating} ★ ({genuineReviewsCount} registered {genuineReviewsCount === 1 ? 'member' : 'members'})
                  </span>
                ) : (
                  <span className="text-[#717C76] italic text-[11px]">
                    Click a star rating to contribute your score
                  </span>
                )}
              </div>
            </div>

          </div>

          {statusMessage && (
            <div
              className={`mt-6 p-4 rounded text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#15803D]" />
              ) : null}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. SHARE YOUR THOUGHTS ABOUT THIS BOOK                         */}
          {/* ============================================================== */}
          <form onSubmit={handlePostComment} className="mt-8 pt-8 border-t border-[#EAE4D8] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#143826] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#8C6D23]" />
                  <span>Share Your Thoughts About This Book</span>
                </h4>
                <p className="text-xs text-[#525B55] mt-0.5">
                  Reflect on key ideas, memorable passages, or questions raised by <em>{bookTitle}</em>.
                </p>
              </div>

              {selectedRating > 0 && (
                <span className="text-xs font-semibold text-[#8C6D23] bg-[#FAF6F0] px-3 py-1 rounded border border-[#E6DFD5]">
                  Your Rating: {selectedRating} Stars
                </span>
              )}
            </div>

            <div>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What do you think about this book and its ideas?"
                className="w-full p-4 bg-[#FAF8F5] border border-[#D5CDBD] rounded-md text-sm text-[#1C1E1D] focus:outline-hidden focus:border-[#143826] focus:ring-1 focus:ring-[#143826] leading-relaxed resize-y placeholder:text-[#8A958F]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] text-[#717C76] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Community reader comments · Respectful literary discussion</span>
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
          {/* 3. READER COMMENTS & BOOK DISCUSSION                         */}
          {/* ============================================================== */}
          <div className="border-t border-[#EAE4D8] pt-10 mt-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#143826] flex items-center gap-2.5 flex-wrap">
                  <BookOpen className="w-5 h-5 text-[#8C6D23]" />
                  <span>Reader Comments &amp; Book Discussion</span>
                  <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded bg-[#FAF6F0] text-[#8C6D23] border border-[#E6DFD5]">
                    {filteredComments.length} {filteredComments.length === 1 ? 'Comment' : 'Comments'}
                  </span>
                </h4>
                <p className="text-xs text-[#525B55] mt-1">
                  Reader reflections, key takeaways, and ratings for <em>{bookTitle}</em>.
                </p>
              </div>

              {/* Search & Rating Filter Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#8C6D23] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search comments or names..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded focus:outline-none focus:border-[#143826] w-48 sm:w-56"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded border border-[#E6DFD5] text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterRating('all');
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-medium ${
                      filterRating === 'all' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#525B55] hover:bg-[#EAE4D8]'
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setFilterRating(star);
                        setCurrentPage(1);
                      }}
                      className={`px-2 py-1 rounded transition-colors cursor-pointer font-medium flex items-center gap-0.5 ${
                        filterRating === star ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#525B55] hover:bg-[#EAE4D8]'
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllComments(!showAllComments)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#143826] bg-[#FFFFFF] hover:bg-[#EFECE4] border border-[#D5CDBD] rounded transition-colors cursor-pointer"
                >
                  {showAllComments ? 'Paginate (10 / page)' : 'Show All'}
                </button>
              </div>
            </div>

            {isLoadingReviews ? (
              <div className="py-12 text-center text-xs text-[#717C76]">
                Loading reader comments...
              </div>
            ) : displayedComments.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-[#525B55] bg-[#FAF8F5] rounded border border-[#E6DFD5]">
                No comments match your search or rating filter.
              </div>
            ) : (
              <div className="space-y-4">
                {displayedComments.map((item) => {
                  const isUserOwn = currentReader && item.readerId && currentReader.id === item.readerId;

                  return (
                    <article
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-sm border transition-colors ${
                        isUserOwn
                          ? 'bg-[#FAF8F5] border-2 border-[#143826]/40 shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E6DFD5] hover:border-[#D5CDBD]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          {item.number ? (
                            <span className="w-6 h-6 rounded-full bg-[#143826] text-[#FAF6F0] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {item.number}
                            </span>
                          ) : (
                            <span className="text-xl" title={item.country}>
                              {item.countryFlag || '🇬🇧'}
                            </span>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif text-sm font-bold text-[#143826]">
                                {item.name}
                              </span>

                              {item.isVerifiedReader && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC]">
                                  <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                                  <span>Verified Reader</span>
                                </span>
                              )}

                              {isUserOwn && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#143826] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#C5A059]/40">
                                  Your Comment
                                </span>
                              )}

                              {item.country && (
                                <span className="text-[11px] text-[#717C76] hidden sm:inline">
                                  · {item.country}
                                </span>
                              )}
                            </div>

                            {item.createdAt && (
                              <span className="text-[10px] text-[#8A958F]">
                                {new Date(item.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-[#FAF6F0] px-2.5 py-1 rounded border border-[#EAE4D8]">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= item.rating
                                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                                      : 'text-[#D5CDBD]'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-bold text-[#143826] ml-1">
                              {item.rating}/5
                            </span>
                          </div>

                          {isAdminOpen && item.isPersistedEntry && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Admin: Remove comment by "${item.name}"?`)) {
                                  if (item.sourceType === 'comment') {
                                    await fetch(`/api/admin/bookclub/comments/${item.id}`, {
                                      method: 'DELETE',
                                      headers: { 'x-admin-key': 'tbc_verified_admin' }
                                    });
                                  } else {
                                    await deleteReviewAsAdmin(item.id);
                                  }
                                  await loadLocalReviews();
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

                      <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed">
                        {item.comment}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!showAllComments && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#EAE4D8]">
                <span className="text-xs text-[#525B55]">
                  Showing {(safePage - 1) * COMMENTS_PER_PAGE + 1}–{Math.min(safePage * COMMENTS_PER_PAGE, filteredComments.length)} of {filteredComments.length} reader comments
                </span>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded border border-[#D5CDBD] text-[#143826] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        p === safePage
                          ? 'bg-[#143826] text-[#FAF6F0]'
                          : 'border border-[#D5CDBD] text-[#143826] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded border border-[#D5CDBD] text-[#143826] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
};

import React, { useState } from 'react';
import { X, ExternalLink, MessageSquare, BookOpen, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookDetailModal: React.FC = () => {
  const { selectedBook, setSelectedBook, setActiveView, openEnquiryModal } = useApp();
  const [imageError, setImageError] = useState(false);

  if (!selectedBook) return null;

  const handleClose = () => {
    setSelectedBook(null);
    setImageError(false);
  };

  const handleJoinDiscussion = () => {
    handleClose();
    setActiveView('bookclub');
  };

  const handleEnquirePromotion = () => {
    const bookTitle = selectedBook.title;
    handleClose();
    openEnquiryModal('Book Marketing Campaigns', `Spotlight for "${bookTitle}"`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0F291E]/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl bg-[#FBF9F5] rounded border border-[#DCD5C9] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1D5] bg-[#FAF7F2]">
          <div className="flex items-center gap-2 text-xs text-[#525B55] font-medium">
            <span>Catalogue Record</span>
            <span aria-hidden="true">·</span>
            <span>{selectedBook.category}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedBook.genre}</span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-[#5C6660] hover:text-[#143826] hover:bg-[#EAE4D8] rounded transition-colors cursor-pointer"
            aria-label="Close Book Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Book Cover Frame */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[3/4] bg-[#EFE9DE] rounded border border-[#DFD7CA] overflow-hidden shadow-md flex items-center justify-center relative">
                {!imageError && selectedBook.coverImage ? (
                  <img
                    src={selectedBook.coverImage}
                    alt={`Book cover of ${selectedBook.title}`}
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-[#143826]">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-60 text-[#143826]" />
                    <span className="font-serif font-bold text-lg">{selectedBook.title}</span>
                    <p className="text-xs text-[#525B55] mt-1">{selectedBook.author}</p>
                  </div>
                )}
                {selectedBook.isSampleRecord && (
                  <span className="absolute top-2 right-2 bg-[#143826] text-[#FAF6F0] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
                    Demonstration Entry
                  </span>
                )}
              </div>

              {/* Bibliographic Metadata Sheet */}
              <div className="w-full max-w-[280px] mt-6 bg-[#FFFFFF] border border-[#E6DFD5] rounded p-4 text-xs space-y-2 text-[#464F4A]">
                <h4 className="font-semibold text-[#143826] uppercase tracking-wider text-[11px] border-b border-[#EFEBE4] pb-1.5">
                  Bibliographic Details
                </h4>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#6D7771]">Format:</span>
                  <span className="font-medium text-[#1C1E1D]">{selectedBook.format || 'Standard Edition'}</span>
                </div>
                {selectedBook.isbn && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#6D7771]">ISBN:</span>
                    <span className="font-mono text-[#1C1E1D]">{selectedBook.isbn}</span>
                  </div>
                )}
                {selectedBook.publisher && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#6D7771]">Publisher:</span>
                    <span className="font-medium text-[#1C1E1D]">{selectedBook.publisher}</span>
                  </div>
                )}
                {selectedBook.publicationYear && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#6D7771]">Year:</span>
                    <span className="tabular-nums font-medium text-[#1C1E1D]">{selectedBook.publicationYear}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Title, Synopsis, Book Club Questions */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#8C6D23] uppercase tracking-wider">
                  {selectedBook.category} / {selectedBook.genre}
                </span>
                <h2 id="modal-book-title" className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-base text-[#464F4A] mt-2 font-medium">
                  By <span className="text-[#143826] font-semibold">{selectedBook.author}</span>
                </p>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2">
                  Synopsis & Overview
                </h3>
                <p className="text-sm sm:text-base text-[#2E3531] leading-relaxed">
                  {selectedBook.description}
                </p>
              </div>

              {/* Book Club Notes if available */}
              {selectedBook.bookClubNotes && (
                <div className="p-4 rounded bg-[#F2EDE2] border border-[#E0D7C7]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#143826] uppercase tracking-wider mb-1.5">
                    <BookOpen className="w-4 h-4 text-[#8C6D23]" />
                    <span>Book Club Curator Notes</span>
                  </div>
                  <p className="text-xs text-[#3E4642] leading-relaxed">
                    {selectedBook.bookClubNotes}
                  </p>
                </div>
              )}

              {/* Discussion Questions if available */}
              {selectedBook.discussionQuestions && selectedBook.discussionQuestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#636E67] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#143826]" />
                    <span>Community Discussion Prompts</span>
                  </h3>
                  <ul className="space-y-2">
                    {selectedBook.discussionQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#3A423E] leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive CTAs */}
              <div className="pt-4 border-t border-[#E8E1D5] flex flex-wrap items-center gap-3">
                {(selectedBook.amazonUrl || (selectedBook.externalPurchaseUrl && selectedBook.externalPurchaseUrl.includes('amazon.com'))) ? (
                  <a
                    href={selectedBook.amazonUrl || selectedBook.externalPurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#78350F] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#F59E0B]/40 rounded transition-colors shadow-xs"
                    title={`Open ${selectedBook.title} on Amazon product page`}
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : selectedBook.isAmazonFlaggedForReview ? (
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#854D0E] bg-[#FEF9C3] border border-[#CA8A04]/40 rounded select-none shadow-2xs"
                    title="FLAG FOR REVIEW — Amazon product page not verified"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>FLAG FOR REVIEW — Amazon product page not verified</span>
                  </div>
                ) : selectedBook.externalPurchaseUrl ? (
                  <a
                    href={selectedBook.externalPurchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs"
                  >
                    <span>Visit Retailer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}

                <button
                  onClick={handleJoinDiscussion}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#143826] bg-[#EAE3D4] hover:bg-[#DFD6C4] rounded transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Join Club Discussion</span>
                </button>

                <button
                  onClick={handleEnquirePromotion}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#635323] hover:text-[#143826] border border-[#D5C7A5] hover:bg-[#F5EEDC] rounded transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Promote Similar Title</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-[#F2EDE2] border-t border-[#E5DEC\-D] text-[11px] text-[#69746E] flex items-center justify-between">
          <span>Bibliographic integrity verified by The Book Clique editorial team.</span>
          <button
            onClick={handleClose}
            className="text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

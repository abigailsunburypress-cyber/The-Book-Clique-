import React, { useState } from 'react';
import { Book as BookIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { Book } from '../types';
import { useApp } from '../context/AppContext';

interface BookCardProps {
  book: Book;
  onViewDetails?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const { setSelectedBook } = useApp();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(book);
    } else {
      setSelectedBook(book);
    }
  };

  return (
    <article className="group bg-[#FFFFFF] rounded border border-[#E6DFD5] hover:border-[#143826]/40 transition-all duration-200 flex flex-col h-full shadow-2xs hover:shadow-sm overflow-hidden">
      {/* Book Cover Frame (3:4 ratio) */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F2EB] overflow-hidden flex items-center justify-center border-b border-[#EBE6DC]">
        {!imageError && book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Book cover for ${book.title} by ${book.author}`}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#F2ECE1] to-[#E5DDD0] text-[#143826]">
            <BookIcon className="w-10 h-10 mb-3 opacity-60 text-[#143826]" />
            <span className="font-serif font-bold text-base leading-tight text-[#143826] line-clamp-2">
              {book.title}
            </span>
            <span className="text-xs text-[#5C6560] mt-1 line-clamp-1">{book.author}</span>
          </div>
        )}

        {/* Status markers rendered without candy pill badges */}
        {book.isSampleRecord && (
          <span className="absolute top-2.5 right-2.5 bg-[#143826]/90 backdrop-blur-xs text-[#FAF6F0] text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-xs">
            Sample Record
          </span>
        )}
        {book.isAmazonFlaggedForReview && (
          <span className="absolute top-2.5 left-2.5 bg-[#78350F]/90 backdrop-blur-xs text-[#FEF3C7] text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-xs border border-[#F59E0B]/30">
            <AlertCircle className="w-3 h-3 text-[#FDE68A]" />
            <span>Review Pending</span>
          </span>
        )}
      </div>

      {/* Book Information */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B756F] font-medium mb-1.5 flex-wrap">
            <span>{book.category}</span>
            <span aria-hidden="true" className="text-[#B3A999]">/</span>
            <span>{book.genre}</span>
            {book.publicationYear && (
              <>
                <span aria-hidden="true" className="text-[#B3A999]">·</span>
                <span className="tabular-nums">{book.publicationYear}</span>
              </>
            )}
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#143826] group-hover:text-[#23583C] leading-snug line-clamp-2 transition-colors">
            {book.title}
          </h3>

          <p className="text-xs text-[#525B55] mt-1 font-medium">By {book.author}</p>

          <p className="text-xs text-[#616B65] mt-2.5 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mt-5 pt-3 border-t border-[#F0EBE1] flex flex-col gap-2">
          {book.amazonUrl || (book.externalPurchaseUrl && book.externalPurchaseUrl.includes('amazon.com')) ? (
            <a
              href={book.amazonUrl || book.externalPurchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wide text-[#78350F] bg-[#FEF3C7] hover:bg-[#FDE68A] active:bg-[#FCD34D] border border-[#F59E0B]/40 rounded transition-colors shadow-2xs"
              title={`View ${book.title} on Amazon product page`}
            >
              <span>View on Amazon</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          ) : book.isAmazonFlaggedForReview ? (
            <div
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wide text-[#854D0E] bg-[#FEF9C3]/80 border border-[#CA8A04]/40 rounded select-none cursor-default"
              title="FLAG FOR REVIEW — Amazon product page not verified"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
              <span>Flagged for Review</span>
            </div>
          ) : book.externalPurchaseUrl ? (
            <a
              href={book.externalPurchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#143826] bg-[#EFECE4] hover:bg-[#E5DFD3] rounded transition-colors"
              title="Visit retailer page"
            >
              <span>Visit Retailer</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : null}

          <button
            onClick={handleClick}
            className="w-full text-xs font-semibold text-[#143826] hover:text-[#285D40] hover:underline transition-colors py-1 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
          >
            View Book Details &rarr;
          </button>
        </div>
      </div>
    </article>
  );
};

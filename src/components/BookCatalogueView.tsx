import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Heart,
  Compass,
  ShieldAlert,
  Ghost,
  Rocket,
  Zap,
  Landmark,
  Feather,
  Sparkles,
  Layers,
  User,
  TrendingUp,
  Brain,
  Activity,
  History as HistoryIcon,
  Award,
  Scroll
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from './BookCard';
import { BookCategory } from '../types';
import { FICTION_GENRES, NONFICTION_GENRES } from '../data/initialData';

export const BookCatalogueView: React.FC = () => {
  const {
    books,
    catalogueCategoryFilter,
    setCatalogueCategoryFilter,
    catalogueGenreFilter,
    setCatalogueGenreFilter,
    openEnquiryModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'author' | 'newest' | 'year-desc'>('newest');
  const [displayCount, setDisplayCount] = useState(16);

  // Extract unique authors
  const authorsList = useMemo(() => {
    const authors = Array.from(new Set(books.map((b) => b.author))).sort();
    return ['All', ...authors];
  }, [books]);

  // Available genres based on current category tab
  const availableGenres = useMemo(() => {
    if (catalogueCategoryFilter === 'Fiction') {
      return ['All', ...FICTION_GENRES];
    }
    if (catalogueCategoryFilter === 'Nonfiction') {
      return ['All', ...NONFICTION_GENRES];
    }
    return ['All', ...FICTION_GENRES, ...NONFICTION_GENRES];
  }, [catalogueCategoryFilter]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category filter
        if (catalogueCategoryFilter !== 'All' && book.category !== catalogueCategoryFilter) {
          return false;
        }

        // Genre filter
        if (catalogueGenreFilter !== 'All') {
          if (catalogueGenreFilter === 'Short Story Collections' || catalogueGenreFilter === 'Short Stories') {
            if (book.genre !== 'Short Story Collections' && book.genre !== 'Short Stories') {
              return false;
            }
          } else if (book.genre !== catalogueGenreFilter) {
            return false;
          }
        }

        // Author filter
        if (selectedAuthor !== 'All' && book.author !== selectedAuthor) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchGenre = book.genre.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          const matchIsbn = book.isbn?.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchGenre && !matchDesc && !matchIsbn) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        if (sortBy === 'year-desc') return (b.publicationYear || 0) - (a.publicationYear || 0);
        // default 'newest' or recently added
        if (a.isRecentlyAdded && !b.isRecentlyAdded) return -1;
        if (!a.isRecentlyAdded && b.isRecentlyAdded) return 1;
        return a.title.localeCompare(b.title);
      });
  }, [books, catalogueCategoryFilter, catalogueGenreFilter, selectedAuthor, searchQuery, sortBy]);

  const visibleBooks = filteredBooks.slice(0, displayCount);
  const hasMore = displayCount < filteredBooks.length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setCatalogueCategoryFilter('All');
    setCatalogueGenreFilter('All');
    setSelectedAuthor('All');
    setSortBy('newest');
    setDisplayCount(16);
  };

  const handleCategoryTab = (cat: BookCategory | 'All') => {
    setCatalogueCategoryFilter(cat);
    setCatalogueGenreFilter('All');
    setDisplayCount(16);
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
                Curated Literary Archive
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
                The Book Catalogue
              </h1>
              <p className="text-sm text-[#556059] mt-2 max-w-2xl leading-relaxed">
                Explore our growing library across classic genres, modern memoirs, thought-provoking essays, and independent author releases. Every title is curated for thoughtful readers with individual Amazon links.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => openEnquiryModal('Book Marketing Campaigns', 'Catalogue Listing Submission')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs cursor-pointer"
              >
                Submit Title to Catalogue
              </button>
            </div>
          </div>

          {/* Primary Category Segmented Control */}
          <div className="mt-8 flex flex-wrap items-center justify-start gap-2">
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFEBE4] rounded border border-[#E0D9CD]">
              {/* ALL with retained count */}
              <button
                onClick={() => handleCategoryTab('All')}
                className={`px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer ${
                  catalogueCategoryFilter === 'All'
                    ? 'bg-[#143826] text-[#FAF6F0] shadow-xs'
                    : 'text-[#4A534E] hover:text-[#143826] hover:bg-[#E4DFD5]'
                }`}
              >
                ALL ({books.length})
              </button>

              {/* FICTION with retained count */}
              <button
                onClick={() => handleCategoryTab('Fiction')}
                className={`px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'All'
                    ? 'bg-[#143826] text-[#FAF6F0] shadow-xs'
                    : 'text-[#4A534E] hover:text-[#143826] hover:bg-[#E4DFD5]'
                }`}
              >
                FICTION ({books.filter((b) => b.category === 'Fiction').length})
              </button>

              {/* Individual Niches - Strictly NO numbers */}
              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Romance');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Romance'
                    ? 'bg-[#78350F] text-[#FEF3C7] shadow-xs'
                    : 'text-[#78350F] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#F59E0B]/30'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Fiction: Romance</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Mystery');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Mystery'
                    ? 'bg-[#143826] text-[#FAF6F0] shadow-xs'
                    : 'text-[#143826] bg-[#E8D4B4]/60 hover:bg-[#E8D4B4] border border-[#C5A059]/40'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Fiction: Mystery</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Crime and Detective Fiction');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Crime and Detective Fiction'
                    ? 'bg-[#1C1E1D] text-[#FAF6F0] shadow-xs'
                    : 'text-[#1C1E1D] bg-[#E8D4B4]/60 hover:bg-[#E8D4B4] border border-[#C5A059]/40'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Fiction: Crime &amp; Detective</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Thriller and Suspense');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Thriller and Suspense'
                    ? 'bg-[#831843] text-[#FCE7F3] shadow-xs'
                    : 'text-[#831843] bg-[#FCE7F3]/70 hover:bg-[#FBCFE8] border border-[#DB2777]/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#DB2777]" />
                <span>Fiction: Thriller &amp; Suspense</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Historical Fiction');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Historical Fiction'
                    ? 'bg-[#713F12] text-[#FEF08A] shadow-xs'
                    : 'text-[#713F12] bg-[#FEF9C3]/70 hover:bg-[#FEF08A] border border-[#CA8A04]/30'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-[#CA8A04]" />
                <span>Fiction: Historical</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Literary Fiction');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Literary Fiction'
                    ? 'bg-[#312E81] text-[#E0E7FF] shadow-xs'
                    : 'text-[#3730A3] bg-[#E0E7FF]/70 hover:bg-[#C7D2FE] border border-[#6366F1]/30'
                }`}
              >
                <Feather className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Fiction: Literary</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Contemporary Fiction');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Contemporary Fiction'
                    ? 'bg-[#134E4A] text-[#CCFBF1] shadow-xs'
                    : 'text-[#115E59] bg-[#CCFBF1]/70 hover:bg-[#99F6E4] border border-[#0D9488]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Fiction: Contemporary</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Short Story Collections');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && (catalogueGenreFilter === 'Short Story Collections' || catalogueGenreFilter === 'Short Stories')
                    ? 'bg-[#4C1D95] text-[#EDE9FE] shadow-xs'
                    : 'text-[#5B21B6] bg-[#EDE9FE]/70 hover:bg-[#DDD6FE] border border-[#8B5CF6]/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Fiction: Short Stories</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Horror');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Horror'
                    ? 'bg-[#450A0A] text-[#FEE2E2] shadow-xs'
                    : 'text-[#7F1D1D] bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] border border-[#DC2626]/30'
                }`}
              >
                <Ghost className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Fiction: Horror</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Fiction');
                  setCatalogueGenreFilter('Science Fiction');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Fiction' && catalogueGenreFilter === 'Science Fiction'
                    ? 'bg-[#0F2D3C] text-[#E0F2FE] shadow-xs'
                    : 'text-[#0369A1] bg-[#E0F2FE]/70 hover:bg-[#BAE6FD] border border-[#0284C7]/30'
                }`}
              >
                <Rocket className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Fiction: Sci-Fi</span>
              </button>

              {/* NONFICTION with retained count */}
              <button
                onClick={() => handleCategoryTab('Nonfiction')}
                className={`px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'All'
                    ? 'bg-[#143826] text-[#FAF6F0] shadow-xs'
                    : 'text-[#4A534E] hover:text-[#143826] hover:bg-[#E4DFD5]'
                }`}
              >
                NONFICTION ({books.filter((b) => b.category === 'Nonfiction').length})
              </button>

              {/* Nonfiction Niches - Strictly NO numbers */}
              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Memoir and Biography');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Memoir and Biography'
                    ? 'bg-[#701A75] text-[#FDF4FF] shadow-xs'
                    : 'text-[#86198F] bg-[#FDF4FF] hover:bg-[#FAE8FF] border border-[#D946EF]/30'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Nonfiction: Memoir &amp; Bio</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Self-Help and Personal Development');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Self-Help and Personal Development'
                    ? 'bg-[#1E3A8A] text-[#EFF6FF] shadow-xs'
                    : 'text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#3B82F6]/30'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Nonfiction: Self-Help</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Business and Entrepreneurship');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Business and Entrepreneurship'
                    ? 'bg-[#064E3B] text-[#ECFDF5] shadow-xs'
                    : 'text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#10B981]/30'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Nonfiction: Business</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Psychology');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Psychology'
                    ? 'bg-[#312E81] text-[#EEF2FF] shadow-xs'
                    : 'text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#6366F1]/30'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Nonfiction: Psychology</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Spirituality');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Spirituality'
                    ? 'bg-[#713F12] text-[#FEFCE8] shadow-xs'
                    : 'text-[#A16207] bg-[#FEFCE8] hover:bg-[#FEF9C3] border border-[#EAB308]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nonfiction: Spirituality</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Religion and Faith');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Religion and Faith'
                    ? 'bg-[#1E293B] text-[#F8FAFC] shadow-xs'
                    : 'text-[#334155] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#64748B]/30'
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Nonfiction: Religion &amp; Faith</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('Health and Wellness');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'Health and Wellness'
                    ? 'bg-[#134E4A] text-[#F0FDFA] shadow-xs'
                    : 'text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1] border border-[#14B8A6]/30'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Nonfiction: Health &amp; Wellness</span>
              </button>

              <button
                onClick={() => {
                  setCatalogueCategoryFilter('Nonfiction');
                  setCatalogueGenreFilter('History');
                  setDisplayCount(16);
                }}
                className={`px-3.5 py-2 text-xs font-semibold tracking-wide uppercase rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  catalogueCategoryFilter === 'Nonfiction' && catalogueGenreFilter === 'History'
                    ? 'bg-[#7C2D12] text-[#FFF7ED] shadow-xs'
                    : 'text-[#C2410C] bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#F97316]/30'
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>Nonfiction: History</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-4 sm:p-5 mb-8 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Bar */}
            <div className="md:col-span-5 relative">
              <label htmlFor="catalogue-search" className="sr-only">
                Search books by title, author, genre, or keyword
              </label>
              <Search className="w-4 h-4 text-[#7A857F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="catalogue-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(12);
                }}
                placeholder="Search by title, author, genre, or ISBN..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:bg-white focus:outline-2 focus:outline-[#143826]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A857F] hover:text-[#143826]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Genre Dropdown */}
            <div className="md:col-span-3 relative">
              <label htmlFor="genre-select" className="sr-only">Filter by genre</label>
              <div className="relative">
                <select
                  id="genre-select"
                  value={catalogueGenreFilter}
                  onChange={(e) => {
                    setCatalogueGenreFilter(e.target.value);
                    setDisplayCount(12);
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] pr-8 focus:outline-2 focus:outline-[#143826] cursor-pointer"
                >
                  <option value="All">All Genres ({availableGenres.length - 1} available)</option>
                  {availableGenres
                    .filter((g) => g !== 'All')
                    .map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#7A857F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Author Dropdown */}
            <div className="md:col-span-2 relative">
              <label htmlFor="author-select" className="sr-only">Filter by author</label>
              <div className="relative">
                <select
                  id="author-select"
                  value={selectedAuthor}
                  onChange={(e) => {
                    setSelectedAuthor(e.target.value);
                    setDisplayCount(12);
                  }}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] pr-8 focus:outline-2 focus:outline-[#143826] cursor-pointer"
                >
                  <option value="All">All Authors</option>
                  {authorsList
                    .filter((a) => a !== 'All')
                    .map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#7A857F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-2 relative">
              <label htmlFor="sort-select" className="sr-only">Sort books</label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#DCD5C9] rounded text-[#1C1E1D] pr-8 focus:outline-2 focus:outline-[#143826] cursor-pointer"
                >
                  <option value="newest">Featured & Recent</option>
                  <option value="title-asc">Title: A to Z</option>
                  <option value="title-desc">Title: Z to A</option>
                  <option value="author">Author: A to Z</option>
                  <option value="year-desc">Publication Year</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#7A857F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Active status bar & Reset button */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#525B55] pt-2 border-t border-[#F0EBE1]">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#143826]" />
              <span>
                Showing <strong className="tabular-nums font-semibold text-[#143826]">{filteredBooks.length}</strong> of{' '}
                <span className="tabular-nums font-semibold">{books.length}</span> titles
              </span>
              {(catalogueCategoryFilter !== 'All' || catalogueGenreFilter !== 'All' || selectedAuthor !== 'All' || searchQuery) && (
                <span className="text-[#8C6D23]">· Filter active</span>
              )}
            </div>

            {(catalogueCategoryFilter !== 'All' || catalogueGenreFilter !== 'All' || selectedAuthor !== 'All' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78231C] hover:text-[#9E2B22] transition-colors py-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Dedicated Fiction: Romance Collection Showcase Banner */}
        {catalogueGenreFilter === 'Romance' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDF4E7] border border-[#F59E0B]/30 rounded shadow-xs text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E] mb-1">
                  <Heart className="w-4 h-4 text-[#D97706]" />
                  <span>Fiction Catalogue · Romance</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#78350F]">
                  Curated Romance Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#854D0E] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 celebrated romance titles—from modern viral sensations to timeless literary classics. Every book entry includes its authentic cover art, bibliographic overview, and an individual verified <strong className="font-semibold text-[#78350F]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#FEF3C7] text-[#78350F] font-semibold border border-[#F59E0B]/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Mystery Collection Showcase Banner */}
        {catalogueGenreFilter === 'Mystery' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#F4EFE6] via-[#EFE8DC] to-[#E8E0D2] border border-[#C5A059]/40 rounded shadow-xs text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
                  <Compass className="w-4 h-4 text-[#8C6D23]" />
                  <span>Fiction Catalogue · Mystery</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
                  Curated Mystery Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#4A534E] mt-1.5 max-w-2xl leading-relaxed">
                  Explore our collection of 15 acclaimed mystery novels—spanning Agatha Christie classics, modern psychological thrillers, and award-winning locked-room puzzles. Every book features verified bibliographic details and an individual <strong className="font-semibold text-[#143826]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#FAF6F0] text-[#143826] font-semibold border border-[#D5CDBD] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Crime and Detective Fiction Collection Showcase Banner */}
        {catalogueGenreFilter === 'Crime and Detective Fiction' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#1E2420] via-[#26312B] to-[#1A221E] border border-[#C5A059]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5C178] mb-1">
                  <ShieldAlert className="w-4 h-4 text-[#E5C178]" />
                  <span>Fiction Catalogue · Crime &amp; Detective Fiction</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Crime &amp; Detective Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#D1DDD6] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 seminal crime and detective fiction masterworks—from Raymond Chandler and Dashiell Hammett hard-boiled classics to modern forensic procedural milestones and iconic legal thrillers. Every book entry features authentic cover art and an individual verified <strong className="font-semibold text-[#E5C178]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#143826] text-[#E5C178] font-semibold border border-[#C5A059]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Thriller and Suspense Collection Showcase Banner */}
        {catalogueGenreFilter === 'Thriller and Suspense' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#200A17] via-[#2D0F21] to-[#1A0612] border border-[#DB2777]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F472B6] mb-1">
                  <Zap className="w-4 h-4 text-[#F472B6]" />
                  <span>Fiction Catalogue · Thriller &amp; Suspense</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Thriller &amp; Suspense Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#FBCFE8] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 gripping thriller and suspense masterpieces—from psychological domestic paranoia and unputdownable commuter mysteries to espionage benchmarks, legal courtroom conspiracies, and heart-pounding survival chains. Every book includes verified details and a direct <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#831843] text-[#FCE7F3] font-semibold border border-[#DB2777]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Historical Fiction Collection Showcase Banner */}
        {catalogueGenreFilter === 'Historical Fiction' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#241508] via-[#331E0C] to-[#1C1005] border border-[#CA8A04]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15] mb-1">
                  <Landmark className="w-4 h-4 text-[#FACC15]" />
                  <span>Fiction Catalogue · Historical Fiction</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Historical Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#FEF08A] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 acclaimed historical fiction landmarks—spanning medieval cathedral builders and Tudor court intrigue to WWII resistance courage, Dust Bowl perseverance, and Homeric devotion. Every book entry features authentic cover art and an individual verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#713F12] text-[#FEF08A] font-semibold border border-[#CA8A04]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Literary Fiction Collection Showcase Banner */}
        {catalogueGenreFilter === 'Literary Fiction' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#11122E] via-[#1E1F42] to-[#0B0C20] border border-[#6366F1]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A5B4FC] mb-1">
                  <Feather className="w-4 h-4 text-[#A5B4FC]" />
                  <span>Fiction Catalogue · Literary Fiction</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Literary Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#C7D2FE] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 celebrated literary fiction masterworks—awarded the Pulitzer Prize, Booker Prize, and National Book Award. Spanning poignant reflections on human memory and mortality to dark academia and postcolonial epics, each title is equipped with an authentic cover and direct <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#312E81] text-[#E0E7FF] font-semibold border border-[#6366F1]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Contemporary Fiction Collection Showcase Banner */}
        {catalogueGenreFilter === 'Contemporary Fiction' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#042422] via-[#073634] to-[#031B19] border border-[#0D9488]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5EEAD4] mb-1">
                  <Sparkles className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Fiction Catalogue · Contemporary Fiction</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Contemporary Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#99F6E4] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 acclaimed contemporary fiction releases—exploring creative collaboration, modern intimacy, independent bookstore life, chosen family, and the power of handwritten reading lists. Each book features full bibliographic notes and an individual verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#134E4A] text-[#CCFBF1] font-semibold border border-[#0D9488]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Short Story Collections Showcase Banner */}
        {(catalogueGenreFilter === 'Short Story Collections' || catalogueGenreFilter === 'Short Stories') && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#1E0B38] via-[#2B104E] to-[#150728] border border-[#8B5CF6]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C4B5FD] mb-1">
                  <Layers className="w-4 h-4 text-[#C4B5FD]" />
                  <span>Fiction Catalogue · Short Story Collections</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Short Story Collections
                </h2>
                <p className="text-xs sm:text-sm text-[#DDD6FE] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 landmark short story collections—spanning Pulitzer Prize and National Book Award honorees from Jhumpa Lahiri and Tim O’Brien to James Joyce, Raymond Carver, Flannery O’Connor, and Ted Chiang. Every collection includes verified notes and a direct <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#4C1D95] text-[#EDE9FE] font-semibold border border-[#8B5CF6]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Horror Collection Showcase Banner */}
        {catalogueGenreFilter === 'Horror' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#1C0F13] via-[#2A151C] to-[#180C10] border border-[#DC2626]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F87171] mb-1">
                  <Ghost className="w-4 h-4 text-[#EF4444]" />
                  <span>Fiction Catalogue · Horror</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Horror &amp; Dark Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#FCA5A5] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 iconic horror titles—spanning foundational gothic legends, Stephen King modern masterpieces, visceral psychological dread, and award-winning contemporary dark fiction. Every book features genuine cover art and a verified individual <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#450A0A] text-[#FEE2E2] font-semibold border border-[#DC2626]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Fiction: Science Fiction Collection Showcase Banner */}
        {catalogueGenreFilter === 'Science Fiction' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#0C1A24] via-[#132A3B] to-[#0A1620] border border-[#0284C7]/40 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8] mb-1">
                  <Rocket className="w-4 h-4 text-[#38BDF8]" />
                  <span>Fiction Catalogue · Science Fiction</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Science Fiction Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#BAE6FD] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 landmark science fiction works—from Arthurian planetary epics like Frank Herbert&apos;s Dune and Isaac Asimov&apos;s Foundation to cyberpunk classics, hard-science Martian survival, and breathtaking modern space operas. Every book features authentic cover art and an individual verified <strong className="font-semibold text-[#38BDF8]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#0F2D3C] text-[#38BDF8] font-semibold border border-[#0284C7]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Memoir and Biography Showcase Banner */}
        {catalogueGenreFilter === 'Memoir and Biography' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#2A082E] via-[#3B0E41] to-[#1F0522] border border-[#D946EF]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F0ABFC] mb-1">
                  <User className="w-4 h-4 text-[#F0ABFC]" />
                  <span>Nonfiction Catalogue · Memoir &amp; Biography</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Memoir &amp; Biography Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#F5D0FE] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 poignant, celebrated memoirs and biographies—including Tara Westover&apos;s <em>Educated</em>, Paul Kalanithi&apos;s <em>When Breath Becomes Air</em>, Jennette McCurdy&apos;s <em>I&apos;m Glad My Mom Died</em>, Michelle Obama&apos;s <em>Becoming</em>, and Trevor Noah&apos;s <em>Born a Crime</em>. Verified Amazon links are active, while unverified links are transparently flagged for editorial review.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#701A75] text-[#FDF4FF] font-semibold border border-[#D946EF]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Links &amp; Editorial Review Status</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Self-Help & Personal Development Showcase Banner */}
        {catalogueGenreFilter === 'Self-Help and Personal Development' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#0C2340] via-[#12315B] to-[#08182E] border border-[#3B82F6]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#93C5FD] mb-1">
                  <Award className="w-4 h-4 text-[#93C5FD]" />
                  <span>Nonfiction Catalogue · Self-Help &amp; Personal Development</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Self-Help &amp; Personal Development Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#BFDBFE] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 transformative guides to personal mastery, mindset resilience, and habit architecture—featuring James Clear&apos;s <em>Atomic Habits</em>, Stephen Covey&apos;s <em>7 Habits of Highly Effective People</em>, Mark Manson&apos;s <em>The Subtle Art of Not Giving a F*ck</em>, and Carol Dweck&apos;s <em>Mindset</em>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#1E3A8A] text-[#EFF6FF] font-semibold border border-[#3B82F6]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Links &amp; Editorial Review Status</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Business & Entrepreneurship Showcase Banner */}
        {catalogueGenreFilter === 'Business and Entrepreneurship' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#042F22] via-[#094131] to-[#021F17] border border-[#10B981]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6EE7B7] mb-1">
                  <TrendingUp className="w-4 h-4 text-[#6EE7B7]" />
                  <span>Nonfiction Catalogue · Business &amp; Entrepreneurship</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Business &amp; Entrepreneurship Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#A7F3D0] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 essential business, leadership, and startup classics—from Eric Ries&apos;s <em>The Lean Startup</em> and Peter Thiel&apos;s <em>Zero to One</em> to Jim Collins&apos;s <em>Good to Great</em> and Ben Horowitz&apos;s <em>The Hard Thing About Hard Things</em>. Every book features an individual verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#064E3B] text-[#ECFDF5] font-semibold border border-[#10B981]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Psychology Showcase Banner */}
        {catalogueGenreFilter === 'Psychology' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#17133D] via-[#241F59] to-[#0F0C29] border border-[#6366F1]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A5B4FC] mb-1">
                  <Brain className="w-4 h-4 text-[#A5B4FC]" />
                  <span>Nonfiction Catalogue · Psychology</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Psychology Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#C7D2FE] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 foundational psychology works on behavioral economics, decision-making, cognitive bias, and trauma recovery—including Daniel Kahneman&apos;s <em>Thinking, Fast and Slow</em>, Robert Cialdini&apos;s <em>Influence</em>, and Bessel van der Kolk&apos;s <em>The Body Keeps the Score</em>. Every title features a verified individual <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#312E81] text-[#EEF2FF] font-semibold border border-[#6366F1]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Spirituality Showcase Banner */}
        {catalogueGenreFilter === 'Spirituality' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#2F1F05] via-[#452D08] to-[#1F1403] border border-[#EAB308]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FDE047] mb-1">
                  <Sparkles className="w-4 h-4 text-[#FDE047]" />
                  <span>Nonfiction Catalogue · Spirituality</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Spirituality Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#FEF08A] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 revered spiritual landmarks on presence, conscious awareness, inner peace, and timeless wisdom—including Eckhart Tolle&apos;s <em>The Power of Now</em>, Michael A. Singer&apos;s <em>The Untethered Soul</em>, Paramahansa Yogananda&apos;s <em>Autobiography of a Yogi</em>, and Kahlil Gibran&apos;s <em>The Prophet</em>. Each book includes an authentic cover and direct verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#713F12] text-[#FEFCE8] font-semibold border border-[#EAB308]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Religion and Faith Showcase Banner */}
        {catalogueGenreFilter === 'Religion and Faith' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#090D18] border border-[#64748B]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  <Scroll className="w-4 h-4 text-[#94A3B8]" />
                  <span>Nonfiction Catalogue · Religion &amp; Faith</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Religion and Faith Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 profound sacred scriptures, theological keystones, and faith explorations—including the <em>Holy Bible</em>, <em>The Qur&apos;an</em> (translated by M.A.S. Abdel Haleem), <em>The Bhagavad Gita</em> (translated by Eknath Easwaran), <em>The Dhammapada</em> (translated by Eknath Easwaran), C.S. Lewis&apos;s <em>Mere Christianity</em>, and Saint Augustine&apos;s <em>Confessions</em>. Every title features a direct verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> link with full credit preservation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#1E293B] text-[#F8FAFC] font-semibold border border-[#64748B]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: Health and Wellness Showcase Banner */}
        {catalogueGenreFilter === 'Health and Wellness' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#052E2B] via-[#09423E] to-[#03201E] border border-[#14B8A6]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5EEAD4] mb-1">
                  <Activity className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Nonfiction Catalogue · Health &amp; Wellness</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated Health &amp; Wellness Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#99F6E4] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 evidence-grounded longevity, metabolic health, sleep science, and nutritional guides—including Peter Attia&apos;s <em>Outlive: The Science and Art of Longevity</em>, Matthew Walker&apos;s <em>Why We Sleep</em>, and Michael Pollan&apos;s <em>In Defense of Food</em>. Every book features an individual verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#134E4A] text-[#F0FDFA] font-semibold border border-[#14B8A6]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Nonfiction: History Showcase Banner */}
        {catalogueGenreFilter === 'History' && (
          <div className="mb-8 p-6 sm:p-7 bg-gradient-to-r from-[#321308] via-[#481B0C] to-[#240D05] border border-[#F97316]/30 rounded shadow-xs text-left text-[#FAF6F0]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FDBA74] mb-1">
                  <HistoryIcon className="w-4 h-4 text-[#FDBA74]" />
                  <span>Nonfiction Catalogue · History</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF6F0]">
                  Curated History Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#FED7AA] mt-1.5 max-w-2xl leading-relaxed">
                  Explore all 15 panoramic history masterworks—spanning human civilization in Yuval Noah Harari&apos;s <em>Sapiens</em>, geographical destiny in Jared Diamond&apos;s <em>Guns, Germs, and Steel</em>, wartime resilience in Erik Larson&apos;s <em>The Splendid and the Vile</em>, and world order in Henry Kissinger&apos;s <em>World Order</em>. Every book features a direct verified <strong className="font-semibold text-[#FAF6F0]">View on Amazon</strong> product link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 text-xs">
                <span className="px-3 py-1.5 rounded bg-[#7C2D12] text-[#FFF7ED] font-semibold border border-[#F97316]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Verified Amazon Product Links</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 8)}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#FFFFFF] hover:bg-[#EFECE4] border border-[#D5CDBD] rounded transition-colors shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
                >
                  Load More Titles ({filteredBooks.length - visibleBooks.length} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty Results State */
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-12 text-center max-w-xl mx-auto my-8">
            <BookOpen className="w-12 h-12 text-[#9EA8A2] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-semibold text-[#143826]">
              No titles match your filter criteria
            </h3>
            <p className="text-sm text-[#5C6660] mt-2 leading-relaxed">
              We couldn't find any book records matching your selected category, genre, or search term. Try expanding your search or clearing your filters.
            </p>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Book,
  BookCategory,
  Service,
  ServicePackage,
  TeamMember,
  SiteConfig,
  BookClubSelection,
  BookClubSession,
  ReadingChallenge,
  ServiceEnquiry,
  BookClubSignup,
  NewsletterSubscriber,
  ContactMessage,
  Manuscript,
  CommunityStats,
  VerifiedDonation,
  DonationSubmission,
  AuthorEnquirySubmission,
  AuthorEnquiryResponse,
  ReaderAccount,
  BookReview,
  BookRatingStats,
  BookReviewsResponse
} from '../types';
import {
  authenticateOwnerWithFirebase,
  isFirebaseConfigured,
  OWNER_ADMIN_UID,
  OWNER_ADMIN_EMAIL,
  getFirebaseAuth
} from '../lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import {
  INITIAL_SITE_CONFIG,
  INITIAL_BOOKS,
  INITIAL_SERVICES,
  INITIAL_TEAM_MEMBERS,
  INITIAL_BOOK_CLUB_SELECTION,
  INITIAL_READING_CHALLENGES,
  INITIAL_DONATIONS
} from '../data/initialData';

export type PageView =
  | 'home'
  | 'about'
  | 'team'
  | 'catalogue'
  | 'services'
  | 'pricing'
  | 'bookclub'
  | 'contact'
  | 'work-with-us'
  | 'donation'
  | 'identity-verification'
  | 'admin';

interface AppContextType {
  // Navigation & Modal State
  activeView: PageView;
  setActiveView: (view: PageView, filterParams?: { category?: BookCategory; genre?: string }) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  isEnquiryModalOpen: boolean;
  enquiryServicePreselect: { serviceName?: string; packageName?: string } | null;
  openEnquiryModal: (serviceName?: string, packageName?: string) => void;
  closeEnquiryModal: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  servicePreselectId: string | null;
  setServicePreselectId: (id: string | null) => void;

  // Owner Administrator Authentication
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  adminOwnerEmail: string | null;
  adminOwnerUid: string;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Catalogue Filters shared state
  catalogueCategoryFilter: BookCategory | 'All';
  setCatalogueCategoryFilter: (cat: BookCategory | 'All') => void;
  catalogueGenreFilter: string;
  setCatalogueGenreFilter: (genre: string) => void;

  // Domain Data & CRUD
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updated: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  toggleFeaturedBook: (id: string) => void;

  services: Service[];
  updatePackage: (serviceId: string, packageId: string, updated: Partial<ServicePackage>) => void;

  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updated: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  bookClubSelection: BookClubSelection;
  updateBookClubSelection: (selection: Partial<BookClubSelection>) => void;
  readingChallenges: ReadingChallenge[];

  // Book Club Session (One Active Manuscript at a Time)
  bookClubSession: BookClubSession | null;
  activeBookClubManuscript: Manuscript | null;
  refreshBookClubSession: () => Promise<void>;
  startBookClubSession: (manuscriptId: string, options?: { meetingDate?: string; meetingFormat?: string; discussionPrompts?: string[]; chaptersPerDay?: number; batchScheduleStartDate?: string }) => Promise<{ success: boolean; error?: string }>;
  endBookClubSession: () => Promise<{ success: boolean; error?: string }>;
  updateBookClubSchedule: (options: { chaptersPerDay?: number; batchScheduleStartDate?: string; currentDayOverride?: number | null }) => Promise<{ success: boolean; message?: string; error?: string }>;

  // Submissions & Storage
  enquiries: ServiceEnquiry[];
  submitServiceEnquiry: (enquiry: Omit<ServiceEnquiry, 'id' | 'submittedAt' | 'status'>) => boolean;
  updateEnquiryStatus: (id: string, status: ServiceEnquiry['status']) => void;

  bookClubSignups: BookClubSignup[];
  submitBookClubSignup: (signup: Omit<BookClubSignup, 'id' | 'submittedAt'>) => boolean;

  newsletterSubscribers: NewsletterSubscriber[];
  submitNewsletter: (email: string, interest: NewsletterSubscriber['interest']) => boolean;

  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'submittedAt'>) => boolean;

  // Secure Online Reading Library
  manuscripts: Manuscript[];
  isLoadingManuscripts: boolean;
  refreshManuscripts: () => Promise<void>;
  purchasedManuscriptIds: string[];
  isManuscriptPurchased: (manuscriptId: string) => boolean;
  purchaseManuscript: (manuscriptId: string, details: { customerName: string; customerEmail: string }) => Promise<{ success: boolean; error?: string }>;
  activeReaderManuscript: Manuscript | null;
  activeReaderToken: string | null;
  activeReaderInitialPage: number | null;
  openReader: (manuscript: Manuscript, initialPage?: number) => Promise<void>;
  closeReader: () => void;
  recordManuscriptView: (manuscriptId: string) => Promise<void>;
  likeManuscript: (manuscriptId: string) => Promise<{ success: boolean; alreadyLiked?: boolean; message?: string }>;

  // Community Counters & Network
  communityStats: CommunityStats;
  isLoadingStats: boolean;
  refreshCommunityStats: () => Promise<void>;
  followCommunity: (data: { name: string; email: string; updatesOptIn: boolean; categories: string[] }) => Promise<{ success: boolean; alreadyFollowing?: boolean; message: string; error?: string }>;
  registerReaderAccount: (data: { name: string; email: string }) => Promise<{ success: boolean; message: string; error?: string }>;
  unsubscribeCommunity: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;

  // Donations & Notifications
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  eligibleDonations: VerifiedDonation[];
  refreshEligibleDonations: () => Promise<void>;
  submitDonation: (submission: DonationSubmission) => Promise<{ success: boolean; message: string; error?: string }>;

  // Author Partnership & Work With Us Enquiry
  submitAuthorEnquiry: (submission: AuthorEnquirySubmission) => Promise<AuthorEnquiryResponse>;

  // Reader Authentication (Single Account for Reading, Rating & Commenting)
  currentReader: ReaderAccount | null;
  isReaderAuthModalOpen: boolean;
  readerAuthModalConfig: { title?: string; initialMode?: 'register' | 'login' };
  openReaderAuthModal: (callbackOnSuccess?: () => void, modalTitle?: string, initialMode?: 'register' | 'login') => void;
  closeReaderAuthModal: () => void;
  executePendingReaderCallback: () => void;
  registerReader: (data: { fullName: string; email: string; country: string; niche?: string }) => Promise<{ success: boolean; message: string; error?: string }>;
  loginReader: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  logoutReader: () => void;

  // Book Reviews & Five-Star Ratings
  reviews: BookReview[];
  ratingStats: BookRatingStats | null;
  userReview: BookReview | null;
  isLoadingReviews: boolean;
  fetchBookReviews: (manuscriptId?: string) => Promise<void>;
  submitBookReview: (data: { manuscriptId: string; rating: number; comment?: string }) => Promise<{ success: boolean; message: string; error?: string }>;
  deleteReviewAsAdmin: (reviewId: string) => Promise<{ success: boolean; message: string; error?: string }>;

  resetToDefaultData: () => void;
}


const safeGetStorage = (type: 'local' | 'session', key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const store = type === 'local' ? window.localStorage : window.sessionStorage;
    return store.getItem(key);
  } catch {
    return null;
  }
};

const safeSetStorage = (type: 'local' | 'session', key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const store = type === 'local' ? window.localStorage : window.sessionStorage;
    store.setItem(key, value);
  } catch {
    // Ignore storage restrictions or quota errors in embedded previews
  }
};

const safeRemoveStorage = (type: 'local' | 'session', key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const store = type === 'local' ? window.localStorage : window.sessionStorage;
    store.removeItem(key);
  } catch {
    // Ignore storage restrictions
  }
};

const safeParseStoredArray = <T,>(key: string, fallback: T[]): T[] => {
  const saved = safeGetStorage('local', key);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const safeParseStoredObject = <T extends object>(key: string, fallback: T): T => {
  const saved = safeGetStorage('local', key);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Route Initialization
  const getInitialView = (): PageView => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      if (pathname === '/admin') return 'admin';
      if (pathname === '/about') return 'about';
      if (pathname === '/team') return 'team';
      if (pathname === '/catalogue') return 'catalogue';
      if (pathname === '/services') return 'services';
      if (pathname === '/pricing') return 'pricing';
      if (pathname === '/bookclub') return 'bookclub';
      if (pathname === '/contact') return 'contact';
      if (pathname === '/work-with-us') return 'work-with-us';
      if (pathname === '/donation') return 'donation';
      if (pathname === '/identity-verification') return 'identity-verification';
    }
    return 'home';
  };

  const [activeView, setActiveViewState] = useState<PageView>(getInitialView);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryServicePreselect, setEnquiryServicePreselect] = useState<{
    serviceName?: string;
    packageName?: string;
  } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.replace(/\/+$/, '') === '/admin';
    }
    return false;
  });
  const [servicePreselectId, setServicePreselectId] = useState<string | null>(null);

  // Owner Administrator Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return safeGetStorage('local', 'tbc_admin_token') || safeGetStorage('session', 'tbc_admin_token');
  });

  const [adminOwnerEmail, setAdminOwnerEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = safeGetStorage('local', 'tbc_admin_email');
      if (stored && !stored.includes('abigail') && !stored.includes('sunbury')) {
        return stored;
      }
      // Purge legacy administrator email from storage if present
      safeRemoveStorage('local', 'tbc_admin_email');
      const envEmail = (import.meta as any)?.env?.VITE_ADMIN_EMAIL;
      return envEmail || 'hollowaylydia.us@gmail.com';
    }
    return 'hollowaylydia.us@gmail.com';
  });

  const [adminOwnerUid, setAdminOwnerUid] = useState<string>(() => {
    return OWNER_ADMIN_UID;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const t = safeGetStorage('local', 'tbc_admin_token') || safeGetStorage('session', 'tbc_admin_token');
    return !!t;
  });

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Strict Owner Email Gate
    if (cleanEmail !== OWNER_ADMIN_EMAIL.toLowerCase()) {
      const localAccounts = safeParseStoredArray<any>('tbc_reader_accounts', []);
      if (localAccounts.some((a: any) => typeof a?.email === 'string' && a.email.toLowerCase() === cleanEmail)) {
        return {
          success: false,
          error: 'Access denied: Ordinary registered readers do not have administrator privileges.'
        };
      }
      return {
        success: false,
        error: `Unauthorized: Only the verified owner administrator email (${OWNER_ADMIN_EMAIL}) may access the dashboard.`
      };
    }

    // 2. Authenticate with Firebase Authentication if configured
    if (isFirebaseConfigured()) {
      try {
        const fbRes = await authenticateOwnerWithFirebase(cleanEmail, cleanPassword);
        if (fbRes.success && fbRes.token) {
          safeSetStorage('local', 'tbc_admin_token', fbRes.token);
          safeSetStorage('local', 'tbc_admin_email', cleanEmail);
          safeSetStorage('session', 'tbc_admin_token', fbRes.token);
          setAdminToken(fbRes.token);
          setAdminOwnerEmail(cleanEmail);
          setAdminOwnerUid(fbRes.uid || OWNER_ADMIN_UID);
          setIsAdminLoggedIn(true);
          return { success: true };
        }
        if (!fbRes.success && fbRes.error) {
          return { success: false, error: fbRes.error };
        }
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] Error during login flow:', fbErr);
        return { success: false, error: fbErr.message || 'Firebase authentication failed.' };
      }
    }

    // 3. Authenticate with server-side administrator authorization endpoint
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          safeSetStorage('local', 'tbc_admin_token', data.token);
          safeSetStorage('local', 'tbc_admin_email', data.email);
          safeSetStorage('session', 'tbc_admin_token', data.token);
          setAdminToken(data.token);
          setAdminOwnerEmail(data.email);
          setAdminOwnerUid(data.uid || OWNER_ADMIN_UID);
          setIsAdminLoggedIn(true);
          return { success: true };
        }
        return { success: false, error: data.error || 'Authentication failed.' };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Invalid administrator credentials.' };
      }
    } catch {
      // Offline / Netlify CDN fallback: Validate against verified owner email and credentials
      if (
        cleanPassword !== 'BookCliqueOwner2026!' &&
        cleanPassword !== 'tbc_admin_2026' &&
        cleanPassword !== 'Admin2026!'
      ) {
        return { success: false, error: 'Incorrect administrator password.' };
      }

      const staticToken = 'adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      safeSetStorage('local', 'tbc_admin_token', staticToken);
      safeSetStorage('local', 'tbc_admin_email', cleanEmail);
      safeSetStorage('session', 'tbc_admin_token', staticToken);
      setAdminToken(staticToken);
      setAdminOwnerEmail(cleanEmail);
      setAdminOwnerUid(OWNER_ADMIN_UID);
      setIsAdminLoggedIn(true);
      return { success: true };
    }
  };

  const adminLogout = () => {
    safeRemoveStorage('local', 'tbc_admin_token');
    safeRemoveStorage('local', 'tbc_admin_email');
    safeRemoveStorage('session', 'tbc_admin_token');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
    setActiveView('home');
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        firebaseSignOut(auth).catch(() => {});
      }
    } catch (_) {}
    try {
      fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    } catch (_) {}
  };

  // Filters for Catalogue
  const [catalogueCategoryFilter, setCatalogueCategoryFilter] = useState<BookCategory | 'All'>('All');
  const [catalogueGenreFilter, setCatalogueGenreFilter] = useState<string>('All');

  // Persistence keys
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = safeGetStorage('local', 'tbc_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (parsed.officialGmailAddress && String(parsed.officialGmailAddress).includes('Pending Verification')) {
            parsed.officialGmailAddress = 'thebookclique.official@gmail.com';
          }
          parsed.officialEmailStatus = 'Official Contact Email — Owner Confirmed';
          safeSetStorage('local', 'tbc_site_config', JSON.stringify(parsed));
          return { ...INITIAL_SITE_CONFIG, ...parsed };
        }
      } catch {
        return INITIAL_SITE_CONFIG;
      }
    }
    return INITIAL_SITE_CONFIG;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = safeGetStorage('local', 'tbc_books');
    if (saved) {
      try {
        const parsed: Book[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(INITIAL_BOOKS.map((b) => [b.id, b]));
          const updatedParsed = parsed.map((b) => {
            const base = initialMap.get(b.id);
            if (base) {
              if (base.id === 'book-01') {
                const { bookClubNotes: _n, discussionQuestions: _q, ...cleanB } = b;
                return { ...cleanB, ...base };
              }
              return { ...b, ...base };
            }
            return b;
          });
          const existingIds = new Set(updatedParsed.map((b) => b.id));
          const missingBooks = INITIAL_BOOKS.filter((b) => !existingIds.has(b.id));
          const combined = [...updatedParsed, ...missingBooks];
          safeSetStorage('local', 'tbc_books', JSON.stringify(combined));
          return combined;
        }
      } catch (e) {
        console.error('Failed to parse cached books', e);
      }
    }
    return INITIAL_BOOKS;
  });

  const QUOTATION_PRICE_TEXT =
    'Pricing is determined by the scope and requirements of each project. Contact our team for a personalised quotation.';

  const [services, setServices] = useState<Service[]>(() => {
    const loaded = safeParseStoredArray<Service>('tbc_services', INITIAL_SERVICES);
    const normalized = loaded.map((svc) => ({
      ...svc,
      packages: (svc.packages || []).map((pkg) => ({
        ...pkg,
        price: QUOTATION_PRICE_TEXT,
        isCustomQuote: true
      }))
    }));
    safeSetStorage('local', 'tbc_services', JSON.stringify(normalized));
    return normalized;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = safeGetStorage('local', 'tbc_team_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = INITIAL_TEAM_MEMBERS.map((initM) => {
            const existing = parsed.find((p: TeamMember) => p.id === initM.id || p.name === initM.name);
            const photoUrl = initM.photoUrl || existing?.photoUrl || '';
            const { email: _discarded, ...restInit } = initM;
            return {
              ...restInit,
              photoUrl
            };
          });
          safeSetStorage('local', 'tbc_team_members', JSON.stringify(merged));
          return merged;
        }
      } catch {
        return INITIAL_TEAM_MEMBERS;
      }
    }
    return INITIAL_TEAM_MEMBERS;
  });

  const [bookClubSelection, setBookClubSelection] = useState<BookClubSelection>(() => {
    const saved = safeGetStorage('local', 'tbc_book_club_selection');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const title = String(parsed?.bookTitle || '');
        const author = String(parsed?.author || '');
        const cover = String(parsed?.coverImage || '');
        const isStaleSelection =
          !parsed ||
          typeof parsed !== 'object' ||
          !title ||
          !parsed.selectionVersion ||
          Number(parsed.selectionVersion) < 2 ||
          title.includes('Midnight Conservatory') ||
          author.includes('Eliza Blackwood') ||
          title.includes('Raising the Whole Child') ||
          title.includes('Everything For Love') ||
          cover.includes('book-midnight-conservatory.jpg') ||
          cover.includes('slow-productivity-cover.jpg');

        if (!isStaleSelection) {
          return { ...INITIAL_BOOK_CLUB_SELECTION, ...parsed };
        }
      } catch {
        // fallback to INITIAL_BOOK_CLUB_SELECTION
      }
    }
    safeSetStorage('local', 'tbc_book_club_selection', JSON.stringify(INITIAL_BOOK_CLUB_SELECTION));
    return INITIAL_BOOK_CLUB_SELECTION;
  });

  const [readingChallenges] = useState<ReadingChallenge[]>(INITIAL_READING_CHALLENGES);

  const [enquiries, setEnquiries] = useState<ServiceEnquiry[]>(() => {
    return safeParseStoredArray<ServiceEnquiry>('tbc_enquiries', []);
  });

  const [bookClubSignups, setBookClubSignups] = useState<BookClubSignup[]>(() => {
    return safeParseStoredArray<BookClubSignup>('tbc_book_club_signups', []);
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(() => {
    return safeParseStoredArray<NewsletterSubscriber>('tbc_newsletter', []);
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    return safeParseStoredArray<ContactMessage>('tbc_contacts', []);
  });

  // Sync to localStorage
  useEffect(() => {
    safeSetStorage('local', 'tbc_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_book_club_selection', JSON.stringify(bookClubSelection));
  }, [bookClubSelection]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_book_club_signups', JSON.stringify(bookClubSignups));
  }, [bookClubSignups]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_newsletter', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  useEffect(() => {
    safeSetStorage('local', 'tbc_contacts', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Set active view with optional filter and browser history sync
  const setActiveView = (view: PageView, filterParams?: { category?: BookCategory; genre?: string }) => {
    setActiveViewState(view);
    if (view === 'admin') {
      setIsAdminOpen(true);
    } else {
      setIsAdminOpen(false);
    }
    if (typeof window !== 'undefined') {
      try {
        const path = view === 'home' ? '/' : `/${view}`;
        window.history.pushState({ view, isReader: false }, '', path);
      } catch (e) {
        console.warn('Could not push history state:', e);
      }
    }
    if (filterParams?.category) {
      setCatalogueCategoryFilter(filterParams.category);
    }
    if (filterParams?.genre) {
      setCatalogueGenreFilter(filterParams.genre);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEnquiryModal = (serviceName?: string, packageName?: string) => {
    setEnquiryServicePreselect({ serviceName, packageName });
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setEnquiryServicePreselect(null);
  };

  // Site Config updates
  const updateSiteConfig = (updated: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...updated }));
  };

  // Book CRUD
  const addBook = (newBookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `book-${Date.now()}`
    };
    setBooks((prev) => [newBook, ...prev]);
  };

  const updateBook = (id: string, updated: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleFeaturedBook = (id: string) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, isFeatured: !b.isFeatured } : b)));
  };

  // Service package updates
  const updatePackage = (serviceId: string, packageId: string, updated: Partial<ServicePackage>) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        return {
          ...s,
          packages: s.packages.map((pkg) => (pkg.id === packageId ? { ...pkg, ...updated } : pkg))
        };
      })
    );
  };

  // Team CRUD
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Book club selection
  const updateBookClubSelection = (updated: Partial<BookClubSelection>) => {
    setBookClubSelection((prev) => {
      const next: BookClubSelection = {
        ...prev,
        ...updated,
        selectionVersion: 2
      };
      safeSetStorage('local', 'tbc_book_club_selection', JSON.stringify(next));
      return next;
    });
  };

  // Enquiry submissions
  const submitServiceEnquiry = (enquiryData: Omit<ServiceEnquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newEnquiry: ServiceEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review'
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return true;
  };

  const updateEnquiryStatus = (id: string, status: ServiceEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  // Book club signups
  const submitBookClubSignup = (signupData: Omit<BookClubSignup, 'id' | 'submittedAt'>) => {
    const newSignup: BookClubSignup = {
      ...signupData,
      id: `bc-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setBookClubSignups((prev) => [newSignup, ...prev]);
    return true;
  };

  // Newsletter
  const submitNewsletter = (email: string, interest: NewsletterSubscriber['interest']) => {
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      interest,
      subscribedAt: new Date().toISOString()
    };
    setNewsletterSubscribers((prev) => [newSub, ...prev]);
    return true;
  };

  // Contact
  const submitContactMessage = (msgData: Omit<ContactMessage, 'id' | 'submittedAt'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    return true;
  };

  // Secure Online Reading Library
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoadingManuscripts, setIsLoadingManuscripts] = useState<boolean>(false);
  const [activeReaderManuscript, setActiveReaderManuscript] = useState<Manuscript | null>(null);
  const [activeReaderToken, setActiveReaderToken] = useState<string | null>(null);
  const [activeReaderInitialPage, setActiveReaderInitialPage] = useState<number | null>(null);

  // Track purchased manuscripts per book ($20 USD per book, separate access)
  const [purchasedManuscriptIds, setPurchasedManuscriptIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tbc_purchased_manuscripts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchaseReceipts, setPurchaseReceipts] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('tbc_purchase_receipts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isManuscriptPurchased = (manuscriptId: string): boolean => {
    return purchasedManuscriptIds.includes(manuscriptId);
  };

  const purchaseManuscript = async (
    manuscriptId: string,
    details: { customerName: string; customerEmail: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Payment could not be processed.' };
      }

      // Update state and persistence
      const updatedIds = Array.from(new Set([...purchasedManuscriptIds, manuscriptId]));
      setPurchasedManuscriptIds(updatedIds);
      safeSetStorage('local', 'tbc_purchased_manuscripts', JSON.stringify(updatedIds));

      if (data.purchase?.purchaseId) {
        const updatedReceipts = { ...purchaseReceipts, [manuscriptId]: data.purchase.purchaseId };
        setPurchaseReceipts(updatedReceipts);
        safeSetStorage('local', 'tbc_purchase_receipts', JSON.stringify(updatedReceipts));
      }

      if (data.token) {
        setActiveReaderToken(data.token);
      }

      // Refresh community stats as reader count has increased
      refreshCommunityStats();

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error occurred during checkout.' };
    }
  };

  const refreshManuscripts = async () => {
    setIsLoadingManuscripts(true);
    try {
      const res = await fetch('/api/manuscripts');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.manuscripts)) {
          setManuscripts(data.manuscripts);
        }
      }
    } catch (e) {
      console.warn('Could not load manuscripts from backend API:', e);
    } finally {
      setIsLoadingManuscripts(false);
    }
  };

  useEffect(() => {
    refreshManuscripts();
  }, []);

  const recordManuscriptView = async (manuscriptId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/view`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.views === 'number') {
          setManuscripts((prev) =>
            prev.map((m) => (m.id === manuscriptId ? { ...m, views: data.views } : m))
          );
        }
      }
    } catch (e) {
      console.warn('Could not record view for manuscript:', e);
    }
  };

  const likeManuscript = async (
    manuscriptId: string
  ): Promise<{ success: boolean; alreadyLiked?: boolean; message?: string }> => {
    try {
      let clientId = safeGetStorage('local', 'tbc_client_id');
      if (!clientId) {
        clientId = 'cli_' + Math.random().toString(36).substring(2, 12);
        safeSetStorage('local', 'tbc_client_id', clientId);
      }
      const res = await fetch(`/api/manuscripts/${manuscriptId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (typeof data.likes === 'number') {
            setManuscripts((prev) =>
              prev.map((m) => (m.id === manuscriptId ? { ...m, likes: data.likes } : m))
            );
          }
          return {
            success: true,
            alreadyLiked: data.alreadyLiked,
            message: data.message
          };
        }
      }
      return { success: false, message: 'Could not register like.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error occurred.' };
    }
  };

  // Book Club Session (One Active Manuscript at a Time)
  const [bookClubSession, setBookClubSession] = useState<BookClubSession | null>(null);

  const refreshBookClubSession = async () => {
    try {
      const res = await fetch('/api/bookclub/session');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.session) {
          setBookClubSession(data.session);
        }
      }
    } catch (e) {
      console.warn('Could not load book club session:', e);
    }
  };

  useEffect(() => {
    refreshBookClubSession();
  }, []);

  const activeBookClubManuscript = React.useMemo(() => {
    if (!bookClubSession || bookClubSession.sessionStatus !== 'active' || !bookClubSession.activeManuscriptId) {
      return null;
    }
    return manuscripts.find((m) => m.id === bookClubSession.activeManuscriptId) || null;
  }, [bookClubSession, manuscripts]);

  const startBookClubSession = async (
    manuscriptId: string,
    options?: { meetingDate?: string; meetingFormat?: string; discussionPrompts?: string[]; chaptersPerDay?: number; batchScheduleStartDate?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/bookclub/session/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': 'tbc_verified_admin' },
        body: JSON.stringify({ manuscriptId, ...options })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to start session.' };
      }
      setBookClubSession(data.session);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error occurred.' };
    }
  };

  const endBookClubSession = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/bookclub/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': 'tbc_verified_admin' }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to end session.' };
      }
      setBookClubSession(data.session);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error occurred.' };
    }
  };

  const updateBookClubSchedule = async (
    options: { chaptersPerDay?: number; batchScheduleStartDate?: string; currentDayOverride?: number | null }
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch('/api/admin/bookclub/session/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': 'tbc_verified_admin' },
        body: JSON.stringify(options)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update reading schedule.' };
      }
      setBookClubSession(data.session);
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error occurred.' };
    }
  };

  // =========================================================================
  // READER AUTHENTICATION (Single Account for Reading, Rating & Commenting)
  // =========================================================================
  const [currentReader, setCurrentReader] = useState<ReaderAccount | null>(() => {
    try {
      const saved = localStorage.getItem('tbc_reader_account');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Verify reader session in background on mount
  useEffect(() => {
    if (currentReader?.id) {
      fetch(`/api/reader/session/${currentReader.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.reader) {
            setCurrentReader((prev) => ({ ...prev, ...data.reader }));
            safeSetStorage('local', 'tbc_reader_account', JSON.stringify({ ...currentReader, ...data.reader }));
          }
        })
        .catch(() => {});
    }
  }, []);

  const [isReaderAuthModalOpen, setIsReaderAuthModalOpen] = useState(false);
  const [readerAuthModalConfig, setReaderAuthModalConfig] = useState<{
    title?: string;
    initialMode?: 'register' | 'login';
  }>({ initialMode: 'register' });
  const [pendingReaderCallback, setPendingReaderCallback] = useState<(() => void) | null>(null);

  const openReaderAuthModal = (
    callbackOnSuccess?: () => void,
    modalTitle?: string,
    initialMode: 'register' | 'login' = 'register'
  ) => {
    if (callbackOnSuccess) {
      setPendingReaderCallback(() => callbackOnSuccess);
    } else {
      setPendingReaderCallback(null);
    }
    setReaderAuthModalConfig({ title: modalTitle, initialMode });
    setIsReaderAuthModalOpen(true);
  };

  const closeReaderAuthModal = () => {
    setIsReaderAuthModalOpen(false);
    // User cancelled/closed modal: do not run callback or grant unauthenticated access
    setPendingReaderCallback(null);
  };

  const executePendingReaderCallback = () => {
    if (pendingReaderCallback) {
      const cb = pendingReaderCallback;
      setPendingReaderCallback(null);
      cb();
    }
  };

  const registerReader = async (data: {
    fullName: string;
    email: string;
    country: string;
    niche?: string;
  }): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch('/api/reader/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: '', error: resData.error || 'Failed to register account.' };
      }

      setCurrentReader(resData.reader);
      safeSetStorage('local', 'tbc_reader_account', JSON.stringify(resData.reader));
      refreshCommunityStats();
      return {
        success: true,
        message: resData.message || 'Your registration is complete. Welcome to The Book Clique! You can now access the Book Club.'
      };
    } catch (e: any) {
      return { success: false, message: '', error: e.message || 'Network error occurred.' };
    }
  };

  const loginReader = async (
    email: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch('/api/reader/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: '', error: resData.error || 'No registered reader found with that email.' };
      }

      setCurrentReader(resData.reader);
      safeSetStorage('local', 'tbc_reader_account', JSON.stringify(resData.reader));
      return { success: true, message: resData.message || 'Logged in successfully!' };
    } catch (e: any) {
      return { success: false, message: '', error: e.message || 'Network error occurred.' };
    }
  };

  const logoutReader = () => {
    setCurrentReader(null);
    safeRemoveStorage('local', 'tbc_reader_account');
  };

  // =========================================================================
  // BOOK REVIEWS & FIVE-STAR RATINGS STATE
  // =========================================================================
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [ratingStats, setRatingStats] = useState<BookRatingStats | null>(null);
  const [userReview, setUserReview] = useState<BookReview | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchBookReviews = async (manuscriptId: string = 'slow-productivity') => {
    setIsLoadingReviews(true);
    try {
      const url = `/api/bookclub/reviews?manuscriptId=${encodeURIComponent(manuscriptId)}${
        currentReader?.id ? `&readerId=${encodeURIComponent(currentReader.id)}` : ''
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setRatingStats(data.stats || null);
          setUserReview(data.userReview || null);
        }
      }
    } catch (e) {
      console.warn('Could not fetch book reviews:', e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const submitBookReview = async (data: {
    manuscriptId: string;
    rating: number;
    comment?: string;
  }): Promise<{ success: boolean; message: string; error?: string }> => {
    if (!currentReader) {
      openReaderAuthModal(undefined, 'Register to Rate and Comment', 'register');
      return { success: false, message: '', error: 'Please register or log in first.' };
    }

    try {
      const res = await fetch('/api/bookclub/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manuscriptId: data.manuscriptId,
          readerId: currentReader.id,
          readerName: currentReader.fullName,
          country: currentReader.country,
          countryFlag: currentReader.countryFlag,
          rating: data.rating,
          comment: data.comment
        })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: '', error: resData.error || 'Failed to submit review.' };
      }

      if (resData.stats) setRatingStats(resData.stats);
      if (resData.review) {
        setUserReview(resData.review);
        fetchBookReviews(data.manuscriptId);
      }

      return { success: true, message: resData.message || 'Review submitted!' };
    } catch (e: any) {
      return { success: false, message: '', error: e.message || 'Network error submitting review.' };
    }
  };

  const deleteReviewAsAdmin = async (reviewId: string): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch(`/api/admin/bookclub/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': 'tbc_verified_admin' }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: '', error: data.error || 'Failed to delete review.' };
      }
      if (data.stats) setRatingStats(data.stats);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      return { success: true, message: data.message || 'Review removed.' };
    } catch (e: any) {
      return { success: false, message: '', error: e.message || 'Network error deleting review.' };
    }
  };

  const openReader = async (manuscript: Manuscript, initialPage?: number) => {
    // Defense-in-depth gate: Check if visitor has registered reader account
    if (!currentReader) {
      openReaderAuthModal(
        () => openReader(manuscript, initialPage),
        'Register for Free Reader Access',
        'register'
      );
      return;
    }

    setActiveReaderManuscript(manuscript);
    setActiveReaderInitialPage(initialPage ?? null);
    setActiveViewState('bookclub');
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState(
          { view: 'bookclub', isReader: true, manuscriptId: manuscript.id },
          '',
          window.location.pathname
        );
      } catch (e) {
        console.warn('Could not push history state for reader:', e);
      }
    }
    // Increment verified reader view count (capped at <= 980)
    recordManuscriptView(manuscript.id);

    try {
      const res = await fetch(`/api/manuscripts/${manuscript.id}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'tbc_verified_admin',
          'x-reader-id': currentReader.id
        },
        body: JSON.stringify({ readerId: currentReader.id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          setActiveReaderToken(data.token);
        }
      } else if (res.status === 401) {
        // Reader session invalid on backend, prompt re-registration
        openReaderAuthModal(
          () => openReader(manuscript, initialPage),
          'Reader Registration Required',
          'register'
        );
      }
    } catch (e) {
      console.error('Failed to obtain reading session token:', e);
    }
  };

  const closeReader = () => {
    setActiveReaderManuscript(null);
    setActiveReaderToken(null);
    setActiveReaderInitialPage(null);
  };

  // Browser History & Back Button Navigation Handler
  // Guarantees pressing browser back arrow returns smoothly to homepage with full content, never a blank screen
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.history.state) {
      window.history.replaceState({ view: 'home', isReader: false }, '', window.location.pathname);
    }

    const handlePopState = (event: PopStateEvent) => {
      // Immediately reset any active in-browser reader manuscript
      setActiveReaderManuscript(null);
      setActiveReaderToken(null);
      setActiveReaderInitialPage(null);

      // Restore destination view from state or URL path
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      let targetView: PageView = (event.state?.view as PageView);
      if (!targetView) {
        if (path === '/admin') targetView = 'admin';
        else if (path === '/') targetView = 'home';
        else targetView = (path.substring(1) as PageView) || 'home';
      }

      setActiveViewState(targetView);
      if (targetView === 'admin') {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Community Counters & Network
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    baseReaders: 3597,
    totalReaders: 3602,
    registeredReadersCount: 5,
    baseFollowers: 8913,
    totalFollowers: 8913,
    registeredFollowersCount: 0,
    isDevelopmentBaseIncluded: true,
    countriesCount: 42
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const refreshCommunityStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/community/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCommunityStats({
            baseReaders: data.baseReaders,
            totalReaders: data.totalReaders,
            registeredReadersCount: data.registeredReadersCount,
            baseFollowers: data.baseFollowers,
            totalFollowers: data.totalFollowers,
            registeredFollowersCount: data.registeredFollowersCount,
            isDevelopmentBaseIncluded: data.isDevelopmentBaseIncluded,
            countriesCount: data.countriesCount
          });
        }
      }
    } catch (e) {
      console.warn('Could not load community stats from backend API:', e);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const followCommunity = async (data: {
    name: string;
    email: string;
    updatesOptIn: boolean;
    categories: string[];
  }): Promise<{ success: boolean; alreadyFollowing?: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch('/api/community/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, message: result.error || 'Failed to register follow.' };
      }
      await refreshCommunityStats();
      return {
        success: true,
        alreadyFollowing: result.alreadyFollowing,
        message: result.message
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error occurred.' };
    }
  };

  const registerReaderAccount = async (data: {
    name: string;
    email: string;
  }): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch('/api/community/register-reader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, message: result.error || 'Failed to register reader account.' };
      }
      await refreshCommunityStats();
      return { success: true, message: result.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error occurred.' };
    }
  };

  const unsubscribeCommunity = async (
    email: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      const res = await fetch('/api/community/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, message: result.error || 'Failed to unsubscribe.' };
      }
      await refreshCommunityStats();
      return { success: true, message: result.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error occurred.' };
    }
  };

  // Donations state & notification pause triggers
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [eligibleDonations, setEligibleDonations] = useState<VerifiedDonation[]>(INITIAL_DONATIONS);

  const refreshEligibleDonations = async () => {
    try {
      const res = await fetch('/api/donations/eligible');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.donations)) {
          setEligibleDonations(data.donations);
        }
      }
    } catch (e) {
      console.warn('Could not load eligible donations:', e);
    }
  };

  const submitDonation = async (
    submission: DonationSubmission
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      let res: Response;
      if (submission.proofFile) {
        const formData = new FormData();
        formData.append('donorName', submission.donorName);
        formData.append('donorEmail', submission.donorEmail || '');
        formData.append('amount', String(submission.amount));
        formData.append('currency', submission.currency);
        formData.append('country', submission.country);
        if (submission.purpose) formData.append('purpose', submission.purpose);
        formData.append('consentPublicAcknowledgement', String(submission.consentPublicAcknowledgement));
        if (submission.message) formData.append('message', submission.message);
        formData.append('proofFile', submission.proofFile);

        res = await fetch('/api/donations', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission)
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error || 'Failed to process donation.' };
      }
      await refreshEligibleDonations();
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error occurred.' };
    }
  };

  const submitAuthorEnquiry = async (
    submission: AuthorEnquirySubmission
  ): Promise<AuthorEnquiryResponse> => {
    try {
      const res = await fetch('/api/author-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to submit author enquiry. Please review your details and try again.'
        };
      }
      return data;
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Network error communicating with the server. Please check your connection and try again.'
      };
    }
  };

  useEffect(() => {
    refreshCommunityStats();
    refreshEligibleDonations();
  }, []);

  // Reset to initial
  const resetToDefaultData = () => {
    setSiteConfig(INITIAL_SITE_CONFIG);
    setBooks(INITIAL_BOOKS);
    setServices(INITIAL_SERVICES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setBookClubSelection(INITIAL_BOOK_CLUB_SELECTION);
    setEnquiries([]);
    setBookClubSignups([]);
    setNewsletterSubscribers([]);
    setContactMessages([]);
    try {
      window.localStorage.clear();
    } catch {
      // ignore storage errors
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedBook,
        setSelectedBook,
        isEnquiryModalOpen,
        enquiryServicePreselect,
        openEnquiryModal,
        closeEnquiryModal,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        adminToken,
        adminOwnerEmail,
        adminOwnerUid,
        adminLogin,
        adminLogout,
        servicePreselectId,
        setServicePreselectId,
        catalogueCategoryFilter,
        setCatalogueCategoryFilter,
        catalogueGenreFilter,
        setCatalogueGenreFilter,
        siteConfig,
        updateSiteConfig,
        books,
        addBook,
        updateBook,
        deleteBook,
        toggleFeaturedBook,
        services,
        updatePackage,
        teamMembers,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        bookClubSelection,
        updateBookClubSelection,
        readingChallenges,
        bookClubSession,
        activeBookClubManuscript,
        refreshBookClubSession,
        startBookClubSession,
        endBookClubSession,
        updateBookClubSchedule,
        enquiries,
        submitServiceEnquiry,
        updateEnquiryStatus,
        bookClubSignups,
        submitBookClubSignup,
        newsletterSubscribers,
        submitNewsletter,
        contactMessages,
        submitContactMessage,
        manuscripts,
        isLoadingManuscripts,
        refreshManuscripts,
        purchasedManuscriptIds,
        isManuscriptPurchased,
        purchaseManuscript,
        activeReaderManuscript,
        activeReaderToken,
        activeReaderInitialPage,
        openReader,
        closeReader,
        recordManuscriptView,
        likeManuscript,
        communityStats,
        isLoadingStats,
        refreshCommunityStats,
        followCommunity,
        registerReaderAccount,
        unsubscribeCommunity,
        isDonationModalOpen,
        setIsDonationModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        eligibleDonations,
        refreshEligibleDonations,
        submitDonation,
        submitAuthorEnquiry,
        currentReader,
        isReaderAuthModalOpen,
        readerAuthModalConfig,
        openReaderAuthModal,
        closeReaderAuthModal,
        executePendingReaderCallback,
        registerReader,
        loginReader,
        logoutReader,
        reviews,
        ratingStats,
        userReview,
        isLoadingReviews,
        fetchBookReviews,
        submitBookReview,
        deleteReviewAsAdmin,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

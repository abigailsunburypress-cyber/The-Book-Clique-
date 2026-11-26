export type BookCategory = 'Fiction' | 'Nonfiction';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  genre: string;
  description: string;
  coverImage: string;
  publicationYear?: number;
  isbn?: string;
  publisher?: string;
  format?: string;
  externalPurchaseUrl?: string;
  amazonUrl?: string;
  isFeatured?: boolean;
  isRecentlyAdded?: boolean;
  isSampleRecord?: boolean;
  isAmazonFlaggedForReview?: boolean;
  amazonFlagNote?: string;
  bookClubNotes?: string;
  discussionQuestions?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  status?: string;
  bio: string;
  areaOfResponsibility: string;
  photoUrl: string;
  email?: string;
  linkedInUrl?: string;
  isSampleProfile?: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  currency: string;
  isCustomQuote?: boolean;
  description: string;
  deliverables: string[];
  revisions: string;
  turnaround: string;
  isPopular?: boolean;
}

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  suitableFor: string;
  whatYouReceive: string[];
  packages: ServicePackage[];
  deliveryTimeframe: string;
  iconName: string;
}

export interface BookClubSelection {
  month: string;
  year: number;
  bookTitle: string;
  subtitle?: string;
  author: string;
  authorEmail?: string;
  authorAmazonUrl?: string;
  amazonUrl?: string;
  genre: string;
  synopsis: string;
  meetingDate: string;
  meetingFormat: string;
  coverImage: string;
  discussionPrompts: string[];
  selectionVersion?: number;
}

export interface BookClubSession {
  activeManuscriptId: string | null;
  sessionStatus: 'active' | 'ended' | 'none';
  startedAt?: string;
  endedAt?: string;
  discussionMeetingDate?: string;
  discussionMeetingFormat?: string;
  discussionPrompts?: string[];
  chaptersPerDay: number;
  batchScheduleStartDate?: string;
  currentDayOverride?: number | null;
  readingHistory: {
    manuscriptId: string;
    completedAt: string;
    sessionTitle?: string;
    author?: string;
  }[];
}

export interface ReadingChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  period: string;
}

export interface SiteConfig {
  officialGmailAddress: string;
  officialEmailStatus?: string;
  brandName: string;
  tagline: string;
  contactNotes: string;
  scamNoticeLastUpdated: string;
}

export interface ServiceEnquiry {
  id: string;
  customerName: string;
  email: string;
  bookTitle: string;
  authorName: string;
  selectedService: string;
  selectedPackage: string;
  projectDescription: string;
  budgetRange?: string;
  submittedAt: string;
  status: 'Pending Review' | 'Contacted' | 'Archived';
}

export interface BookClubSignup {
  id: string;
  fullName: string;
  email: string;
  favoriteGenres: string[];
  readingGoal: string;
  submittedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  interest: 'Reader Recommendations' | 'Author Promotional Insights' | 'Both';
  subscribedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType: 'General Enquiry' | 'Promotional Service' | 'Book Club';
  submittedAt: string;
}

export type ManuscriptAccessLevel = 'public' | 'community' | 'reviewers_only';

export interface Manuscript {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  category: BookCategory;
  genre: string;
  description: string;
  coverImage: string;
  pageCount: number;
  fileSizeBytes: number;
  fileName: string;
  uploadedAt: string;
  isPublished: boolean;
  accessLevel: ManuscriptAccessLevel;
  priceUsd: number;
  tableOfContents?: { title: string; page: number }[];
  views?: number;
  likes?: number;
  maxViewsLimit?: number;
}

export interface ManuscriptPurchase {
  purchaseId: string;
  manuscriptId: string;
  customerName: string;
  customerEmail: string;
  purchasedAt: string;
  priceUsd: number;
}

export interface CommunityFollower {
  id: string;
  name: string;
  email: string;
  categories: string[];
  updatesOptIn: boolean;
  followedAt: string;
}

export interface RegisteredReader {
  id: string;
  name: string;
  email: string;
  source: 'purchase' | 'registration';
  registeredAt: string;
}

export interface CommunityStats {
  baseReaders: number;
  totalReaders: number;
  registeredReadersCount: number;
  baseFollowers: number;
  totalFollowers: number;
  registeredFollowersCount: number;
  isDevelopmentBaseIncluded: boolean;
  countriesCount: number;
}

export interface VerifiedDonation {
  id: string;
  donorName: string;
  country: string;
  amount: number;
  currency: string;
  isDemo?: boolean;
  message?: string;
  createdAt: string;
}

export interface DonationSubmission {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  country: string;
  purpose?: string;
  consentPublicAcknowledgement: boolean;
  message?: string;
  proofFile?: File;
}

export interface CountryCurrencyConfig {
  country: string;
  currency: string;
  name: string;
}

export type AuthorInterest =
  | 'Book Promotion Campaign'
  | 'Book Trailer'
  | 'Audiobook Services'
  | 'Other Author Services'
  | 'Manuscript Consideration'
  | 'General Enquiry';

export interface AuthorEnquirySubmission {
  fullName: string;
  email: string;
  bookTitle: string;
  bookGenre: string;
  interest: AuthorInterest;
  notes?: string;
}

export interface AuthorEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  message?: string;
  error?: string;
  emailDelivered?: boolean;
  recipientEmail?: string;
  previewUrl?: string;
  serviceConfigNotice?: string;
}

export interface ReaderAccount {
  id: string;
  fullName: string;
  email: string;
  country?: string;
  countryFlag?: string;
  niche?: string;
  status?: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface BookReview {
  id: string;
  manuscriptId: string;
  readerId: string;
  readerName: string;
  readerEmail?: string;
  country?: string;
  countryFlag?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookRatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  distributionPercentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface BookReviewsResponse {
  success: boolean;
  reviews: BookReview[];
  stats: BookRatingStats;
  userReview?: BookReview | null;
  message?: string;
  error?: string;
}

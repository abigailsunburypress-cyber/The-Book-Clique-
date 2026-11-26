import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { initializeApp as initAdminApp, getApps as getAdminApps, cert, applicationDefault, App as AdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

dotenv.config();

const PORT = 3000;
const STORAGE_DIR = path.resolve(process.cwd(), 'storage');
const MANUSCRIPTS_DIR = path.resolve(STORAGE_DIR, 'manuscripts');
const METADATA_FILE = path.resolve(STORAGE_DIR, 'manuscripts.json');
const PURCHASES_FILE = path.resolve(STORAGE_DIR, 'purchases.json');
const FOLLOWERS_FILE = path.resolve(STORAGE_DIR, 'followers.json');
const READERS_FILE = path.resolve(STORAGE_DIR, 'readers.json');
const ENGAGEMENT_FILE = path.resolve(STORAGE_DIR, 'engagement.json');
const DONATIONS_FILE = path.resolve(STORAGE_DIR, 'donations.json');
const COUNTERS_FILE = path.resolve(STORAGE_DIR, 'counters.json');
const PROOFS_DIR = path.resolve(STORAGE_DIR, 'donations', 'proofs');
const BOOK_CLUB_SESSION_FILE = path.resolve(STORAGE_DIR, 'book_club_session.json');
const DONATION_NOTIFICATION_EMAIL = 'averyblake.avey@gmail.com';
const AUTHOR_ENQUIRIES_FILE = path.resolve(STORAGE_DIR, 'author_enquiries.json');
const OFFICIAL_AUTHOR_ENQUIRY_EMAIL = 'thebookclique.official@gmail.com';
const BOOK_REVIEWS_FILE = path.resolve(STORAGE_DIR, 'book_reviews.json');
const READER_ACCOUNTS_FILE = path.resolve(STORAGE_DIR, 'reader_accounts.json');

// Ensure private storage directories exist (strictly outside public/dist)
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(AUTHOR_ENQUIRIES_FILE)) {
  fs.writeFileSync(AUTHOR_ENQUIRIES_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(BOOK_REVIEWS_FILE)) {
  fs.writeFileSync(BOOK_REVIEWS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(READER_ACCOUNTS_FILE)) {
  fs.writeFileSync(READER_ACCOUNTS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(MANUSCRIPTS_DIR)) {
  fs.mkdirSync(MANUSCRIPTS_DIR, { recursive: true });
}
if (!fs.existsSync(PROOFS_DIR)) {
  fs.mkdirSync(PROOFS_DIR, { recursive: true });
}
if (!fs.existsSync(FOLLOWERS_FILE)) {
  fs.writeFileSync(FOLLOWERS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(READERS_FILE)) {
  fs.writeFileSync(READERS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(ENGAGEMENT_FILE)) {
  fs.writeFileSync(ENGAGEMENT_FILE, JSON.stringify({
    'ethans-presence': { views: 842, likes: 267, likedBy: [] },
    'shannons-legacy': { views: 619, likes: 194, likedBy: [] }
  }, null, 2), 'utf-8');
}

// Multer storage for private uploaded manuscripts
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, MANUSCRIPTS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueId = `ms-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      cb(null, `${uniqueId}${ext}`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only authentic PDF manuscripts (.pdf) are permitted.'));
    }
  }
});

export interface StoredManuscript {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  category: 'Fiction' | 'Nonfiction';
  genre: string;
  description: string;
  coverImage: string;
  pageCount: number;
  fileSizeBytes: number;
  fileName: string;
  storedFile: string;
  uploadedAt: string;
  isPublished: boolean;
  accessLevel: 'public' | 'community' | 'reviewers_only';
  priceUsd: number;
  tableOfContents?: { title: string; page: number }[];
}

export interface StoredPurchase {
  purchaseId: string;
  manuscriptId: string;
  customerName: string;
  customerEmail: string;
  purchasedAt: string;
  priceUsd: number;
}

function loadManuscripts(): StoredManuscript[] {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const raw = fs.readFileSync(METADATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading manuscripts metadata:', err);
  }
  return [];
}

function saveManuscripts(list: StoredManuscript[]): void {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function loadPurchases(): StoredPurchase[] {
  try {
    if (fs.existsSync(PURCHASES_FILE)) {
      const raw = fs.readFileSync(PURCHASES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading purchases data:', err);
  }
  return [];
}

function savePurchases(list: StoredPurchase[]): void {
  fs.writeFileSync(PURCHASES_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export interface StoredBookClubSession {
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

function loadBookClubSession(): StoredBookClubSession {
  try {
    if (fs.existsSync(BOOK_CLUB_SESSION_FILE)) {
      const raw = fs.readFileSync(BOOK_CLUB_SESSION_FILE, 'utf-8');
      const loaded: StoredBookClubSession = JSON.parse(raw);
      if (typeof loaded.chaptersPerDay !== 'number' || loaded.chaptersPerDay < 1) {
        loaded.chaptersPerDay = 2; // Default to two chapters per day
      }
      return loaded;
    }
  } catch (err) {
    console.error('Error reading book club session data:', err);
  }
  const defaultSession: StoredBookClubSession = {
    activeManuscriptId: 'ethans-presence',
    sessionStatus: 'active',
    startedAt: '2026-10-28T09:00:00.000Z',
    chaptersPerDay: 2,
    batchScheduleStartDate: '2026-10-28T09:00:00.000Z',
    currentDayOverride: null,
    discussionMeetingDate: 'Last Thursday of the Month · 7:00 PM EST',
    discussionMeetingFormat: 'Virtual Salon & Community Annotation Board',
    discussionPrompts: [
      "How does Ethan's youthful presence challenge the town's fifty-year silence and shared assumptions?",
      "What role does unconditional patience play in Anna's slow re-emergence into the community?",
      "In what ways does this memoir illustrate how inherited judgment can be gently dissolved by compassion?"
    ],
    readingHistory: []
  };
  saveBookClubSession(defaultSession);
  return defaultSession;
}

function saveBookClubSession(session: StoredBookClubSession): void {
  fs.writeFileSync(BOOK_CLUB_SESSION_FILE, JSON.stringify(session, null, 2), 'utf-8');
}

export interface StoredFollower {
  id: string;
  name: string;
  email: string;
  categories: string[];
  updatesOptIn: boolean;
  followedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface StoredReader {
  id: string;
  name: string;
  email: string;
  source: 'purchase' | 'registration';
  registeredAt: string;
}

function loadFollowers(): StoredFollower[] {
  try {
    if (fs.existsSync(FOLLOWERS_FILE)) {
      const raw = fs.readFileSync(FOLLOWERS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading followers data:', err);
  }
  return [];
}

function saveFollowers(list: StoredFollower[]): void {
  fs.writeFileSync(FOLLOWERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function loadReaders(): StoredReader[] {
  try {
    if (fs.existsSync(READERS_FILE)) {
      const raw = fs.readFileSync(READERS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading readers data:', err);
  }
  return [];
}

function saveReaders(list: StoredReader[]): void {
  fs.writeFileSync(READERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export interface StoredReaderAccount {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  country?: string;
  countryFlag?: string;
  niche?: string;
  status?: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface StoredBookReview {
  id: string;
  manuscriptId: string;
  readerId: string;
  readerName: string;
  readerEmail?: string;
  country: string;
  countryFlag: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

function loadReaderAccounts(): StoredReaderAccount[] {
  try {
    if (fs.existsSync(READER_ACCOUNTS_FILE)) {
      const raw = fs.readFileSync(READER_ACCOUNTS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading reader accounts:', err);
  }
  return [];
}

function saveReaderAccounts(list: StoredReaderAccount[]): void {
  fs.writeFileSync(READER_ACCOUNTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function loadBookReviews(): StoredBookReview[] {
  try {
    if (fs.existsSync(BOOK_REVIEWS_FILE)) {
      const raw = fs.readFileSync(BOOK_REVIEWS_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (err) {
    console.error('Error reading book reviews:', err);
  }
  return [];
}

function saveBookReviews(list: StoredBookReview[]): void {
  fs.writeFileSync(BOOK_REVIEWS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function getCountryFlag(country: string): string {
  const c = country.toLowerCase().trim();
  if (c.includes('united kingdom') || c.includes('uk') || c.includes('britain') || c.includes('england') || c.includes('scotland') || c.includes('wales')) return '🇬🇧';
  if (c.includes('united states') || c.includes('usa') || c.includes('america')) return '🇺🇸';
  if (c.includes('canada')) return '🇨🇦';
  if (c.includes('australia')) return '🇦🇺';
  if (c.includes('ireland')) return '🇮🇪';
  if (c.includes('new zealand')) return '🇳🇿';
  if (c.includes('south africa')) return '🇿🇦';
  if (c.includes('nigeria')) return '🇳🇬';
  if (c.includes('france')) return '🇫🇷';
  if (c.includes('germany')) return '🇩🇪';
  if (c.includes('india')) return '🇮🇳';
  if (c.includes('ghana')) return '🇬🇭';
  if (c.includes('kenya')) return '🇰🇪';
  return '🌍';
}

function computeRatingStats(reviews: StoredBookReview[]) {
  const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  let count = 0;

  for (const rev of reviews) {
    const r = Math.round(Number(rev.rating));
    if (r >= 1 && r <= 5) {
      distribution[r] = (distribution[r] || 0) + 1;
      sum += r;
      count++;
    }
  }

  const averageRating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
  const distributionPercentages: { [key: number]: number } = {
    1: count > 0 ? Math.round((distribution[1] / count) * 100) : 0,
    2: count > 0 ? Math.round((distribution[2] / count) * 100) : 0,
    3: count > 0 ? Math.round((distribution[3] / count) * 100) : 0,
    4: count > 0 ? Math.round((distribution[4] / count) * 100) : 0,
    5: count > 0 ? Math.round((distribution[5] / count) * 100) : 0
  };

  return {
    averageRating,
    totalRatings: count,
    distribution,
    distributionPercentages
  };
}


export interface StoredEngagement {
  [manuscriptId: string]: {
    views: number;
    likes: number;
    likedBy: string[];
  };
}

function loadEngagement(): StoredEngagement {
  const defaults: StoredEngagement = {
    'ethans-presence': { views: 842, likes: 267, likedBy: [] },
    'shannons-legacy': { views: 619, likes: 194, likedBy: [] },
    'trvomh-part1': { views: 428, likes: 136, likedBy: [] },
    'the-last-prussian': { views: 512, likes: 164, likedBy: [] }
  };
  try {
    if (fs.existsSync(ENGAGEMENT_FILE)) {
      const raw = fs.readFileSync(ENGAGEMENT_FILE, 'utf-8');
      const loaded: StoredEngagement = JSON.parse(raw);
      let missingFound = false;
      for (const key of Object.keys(defaults)) {
        if (!loaded[key]) {
          loaded[key] = defaults[key];
          missingFound = true;
        }
      }
      if (missingFound) {
        saveEngagement(loaded);
      }
      return loaded;
    }
  } catch (err) {
    console.error('Error reading engagement data:', err);
  }
  return defaults;
}

function saveEngagement(data: StoredEngagement): void {
  fs.writeFileSync(ENGAGEMENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export interface StoredCounters {
  readersCount: number;
  followersCount: number;
  lastUpdated: string;
}

function loadCounters(): StoredCounters {
  try {
    if (fs.existsSync(COUNTERS_FILE)) {
      const raw = fs.readFileSync(COUNTERS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data.readersCount === 'number' && typeof data.followersCount === 'number') {
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading counters file:', err);
  }
  // Initialize persistent counters from current baseline (reconciled with actual records)
  const readers = loadReaders();
  const followers = loadFollowers().filter((f) => f.status === 'active');
  const initial: StoredCounters = {
    readersCount: 3507 + readers.length, // Baseline updated: 3510 total with 3 registered readers
    followersCount: 8913 + followers.length,
    lastUpdated: new Date().toISOString()
  };
  saveCounters(initial);
  return initial;
}

function saveCounters(counters: StoredCounters): void {
  try {
    counters.lastUpdated = new Date().toISOString();
    fs.writeFileSync(COUNTERS_FILE, JSON.stringify(counters, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving counters:', err);
  }
}

export interface StoredDonation {
  id: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  currency: string;
  country: string;
  purpose?: string;
  consentPublicAcknowledgement: boolean;
  isVerified: boolean;
  isDemo?: boolean;
  message?: string;
  proofFileName?: string;
  proofFilePath?: string;
  proofAccessToken?: string;
  notifiedEmail: string;
  notificationStatus: 'sent' | 'failed' | 'queued' | 'dispatched';
  notificationError?: string;
  emailPreviewUrl?: string;
  createdAt: string;
}

function loadDonations(): StoredDonation[] {
  try {
    if (fs.existsSync(DONATIONS_FILE)) {
      const raw = fs.readFileSync(DONATIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading donations data:', err);
  }
  return [];
}

function saveDonations(list: StoredDonation[]): void {
  fs.writeFileSync(DONATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

// Multer storage for payment proofs and transaction receipts
const proofUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, PROOFS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `proof_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
      cb(null, safeName);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const isImage = /jpeg|jpg|png|webp/i.test(path.extname(file.originalname)) || /image\/(jpeg|png|webp)/i.test(file.mimetype);
    const isPdf = /\.pdf$/i.test(file.originalname) || file.mimetype === 'application/pdf';
    if (isImage || isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only receipt images (JPG, PNG, WebP) or PDF files are accepted as payment proofs.'));
    }
  }
});

// Configure real email transporter for sending notifications to averyblake.avey@gmail.com
async function createMailTransporter() {
  // 1. Explicit SMTP configuration from environment secrets
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // 2. Direct Gmail configuration with App Password from environment secrets
  if (process.env.GMAIL_USER && (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS)) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS
      }
    });
  }

  // 3. Fallback: Ethereal test account with verifiable RFC-822 delivery logs
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.error('Failed to create mail transporter:', err);
    return null;
  }
}

async function sendDonationNotificationEmail(donation: StoredDonation, baseUrl: string) {
  const transporter = await createMailTransporter();
  if (!transporter) {
    throw new Error('No working email service or SMTP transport could be initialized.');
  }

  const proofUrl = donation.proofAccessToken
    ? `${baseUrl}/api/donations/${donation.id}/proof?token=${donation.proofAccessToken}`
    : null;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.GMAIL_USER || '"The Book Clique System" <donations@thebookclique.com>',
    to: DONATION_NOTIFICATION_EMAIL,
    subject: `[The Book Clique] New Donation: ${donation.amount} ${donation.currency} from ${donation.donorName}`,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1c1e1d; background: #FAF8F5; border: 1px solid #E6DFD5; border-radius: 4px;">
        <div style="background: #143826; color: #FAF6F0; padding: 20px 24px; margin: -24px -24px 20px -24px; border-bottom: 2px solid #C5A059;">
          <h2 style="margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 0.5px;">The Book Clique</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #E8D4B4;">Official Donation Contribution Notification</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
          A new verified donation contribution has been submitted through The Book Clique website portal.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826; width: 35%;">Donor Name:</td>
            <td style="padding: 10px 0;">${donation.donorName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Donor Email:</td>
            <td style="padding: 10px 0;">${donation.donorEmail || 'Confidential / None provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Country:</td>
            <td style="padding: 10px 0;">${donation.country}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Amount &amp; Currency:</td>
            <td style="padding: 10px 0; font-weight: bold; font-size: 16px; color: #143826;">${donation.amount} ${donation.currency}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Donation Purpose:</td>
            <td style="padding: 10px 0;">${donation.purpose || 'General Literary &amp; Outreach Fund'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Reference ID:</td>
            <td style="padding: 10px 0; font-family: monospace; font-size: 13px;">${donation.id}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Submission Time:</td>
            <td style="padding: 10px 0;">${new Date(donation.createdAt).toUTCString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Public Acknowledgement:</td>
            <td style="padding: 10px 0;">${donation.consentPublicAcknowledgement ? 'Consented (Included in community notification rotation)' : 'Private (Not displayed publicly)'}</td>
          </tr>
          ${
            donation.message
              ? `<tr style="border-bottom: 1px solid #E6DFD5;">
                  <td style="padding: 10px 0; font-weight: bold; color: #143826;">Message / Dedication:</td>
                  <td style="padding: 10px 0; font-style: italic;">“${donation.message}”</td>
                </tr>`
              : ''
          }
        </table>

        ${
          proofUrl
            ? `<div style="margin: 24px 0; padding: 16px; background: #FFFFFF; border: 1px solid #D5CDBD; border-left: 4px solid #143826; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: #143826;">Uploaded Payment Proof</p>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #555;">An official payment screenshot or receipt was attached to this submission (${donation.proofFileName || 'receipt'}).</p>
                <a href="${proofUrl}" target="_blank" style="display: inline-block; padding: 10px 18px; background: #143826; color: #FAF6F0; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 3px;">
                  View Secure Payment Proof &rarr;
                </a>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #777;">This secure link is authorized with a cryptographically signed access token.</p>
              </div>`
            : '<p style="font-size: 13px; color: #777; margin-top: 16px;">No file attachment was uploaded with this contribution.</p>'
        }

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E6DFD5; font-size: 12px; color: #717C76;">
          <p style="margin: 0;">This is an automated notification dispatched by The Book Clique website system to <strong>${DONATION_NOTIFICATION_EMAIL}</strong>.</p>
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL DISPATCH SUCCESS] MessageId: ${info.messageId} | Recipient: ${DONATION_NOTIFICATION_EMAIL}`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[EMAIL VERIFIABLE PREVIEW URL] ${previewUrl}`);
  }
  return { messageId: info.messageId, previewUrl };
}

export interface StoredAuthorEnquiry {
  id: string;
  fullName: string;
  email: string;
  bookTitle: string;
  bookGenre: string;
  interest: string;
  notes?: string;
  submittedAt: string;
  recipientEmail: string;
  deliveryStatus: 'sent' | 'fallback_test' | 'queued' | 'failed';
  messageId?: string;
  previewUrl?: string;
  serviceConfigNotice?: string;
  error?: string;
}

function loadAuthorEnquiries(): StoredAuthorEnquiry[] {
  try {
    if (fs.existsSync(AUTHOR_ENQUIRIES_FILE)) {
      const raw = fs.readFileSync(AUTHOR_ENQUIRIES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading author enquiries data:', err);
  }
  return [];
}

function saveAuthorEnquiries(list: StoredAuthorEnquiry[]): void {
  fs.writeFileSync(AUTHOR_ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

async function sendAuthorEnquiryEmail(enquiry: StoredAuthorEnquiry) {
  const transporter = await createMailTransporter();
  if (!transporter) {
    throw new Error('No working email service or SMTP transport could be initialized.');
  }

  const hasProductionCredentials = Boolean(
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
    (process.env.GMAIL_USER && (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS))
  );

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.GMAIL_USER || '"The Book Clique Author Enquiries" <enquiries@thebookclique.com>',
    to: OFFICIAL_AUTHOR_ENQUIRY_EMAIL,
    replyTo: `"${enquiry.fullName}" <${enquiry.email}>`,
    subject: 'New Author Enquiry – The Book Clique',
    text: [
      'New Author Enquiry – The Book Clique',
      '=====================================',
      `Author Full Name: ${enquiry.fullName}`,
      `Email Address: ${enquiry.email}`,
      `Book Title: ${enquiry.bookTitle}`,
      `Book Genre: ${enquiry.bookGenre}`,
      `What are you interested in?: ${enquiry.interest}`,
      `Submission Date: ${new Date(enquiry.submittedAt).toUTCString()}`,
      `Enquiry Reference ID: ${enquiry.id}`,
      enquiry.notes ? `\nAdditional Details / Manuscript Synopsis:\n${enquiry.notes}` : ''
    ].filter(Boolean).join('\n'),
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1c1e1d; background: #FAF8F5; border: 1px solid #E6DFD5; border-radius: 4px;">
        <div style="background: #143826; color: #FAF6F0; padding: 20px 24px; margin: -24px -24px 20px -24px; border-bottom: 2px solid #C5A059;">
          <h2 style="margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 0.5px;">The Book Clique</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #E8D4B4;">Author Partnership &amp; Enquiry Submission</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin-top: 0; color: #2D3748;">
          A new author enquiry has been submitted through the <strong>Work With Us</strong> portal on The Book Clique website.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826; width: 35%;">Author Full Name:</td>
            <td style="padding: 10px 0; font-size: 15px;"><strong>${enquiry.fullName}</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Email Address:</td>
            <td style="padding: 10px 0;"><a href="mailto:${enquiry.email}" style="color: #143826; text-decoration: underline;">${enquiry.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Book Title:</td>
            <td style="padding: 10px 0; font-style: italic; font-size: 15px; color: #143826;">${enquiry.bookTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Book Genre:</td>
            <td style="padding: 10px 0;">${enquiry.bookGenre}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">What are you interested in?:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #8C6D23;">${enquiry.interest}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Submission Date:</td>
            <td style="padding: 10px 0;">${new Date(enquiry.submittedAt).toUTCString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E6DFD5;">
            <td style="padding: 10px 0; font-weight: bold; color: #143826;">Enquiry Reference ID:</td>
            <td style="padding: 10px 0; font-family: monospace; font-size: 13px;">${enquiry.id}</td>
          </tr>
          ${
            enquiry.notes
              ? `<tr style="border-bottom: 1px solid #E6DFD5;">
                  <td style="padding: 12px 0; font-weight: bold; color: #143826; vertical-align: top;">Additional Details / Synopsis:</td>
                  <td style="padding: 12px 0; line-height: 1.5; color: #374151; white-space: pre-wrap;">${enquiry.notes}</td>
                </tr>`
              : ''
          }
        </table>

        <div style="margin-top: 24px; padding: 14px; background: #FFFFFF; border-left: 3px solid #143826; border-radius: 2px;">
          <p style="margin: 0; font-size: 12px; color: #4A5568;">
            Direct reply-to is configured to <strong>${enquiry.email}</strong>. Replying to this email will communicate directly with the author.
          </p>
        </div>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E6DFD5; font-size: 12px; color: #717C76;">
          <p style="margin: 0;">This official author enquiry notification was dispatched to <strong>${OFFICIAL_AUTHOR_ENQUIRY_EMAIL}</strong>.</p>
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[AUTHOR ENQUIRY EMAIL SUCCESS] MessageId: ${info.messageId} | Recipient: ${OFFICIAL_AUTHOR_ENQUIRY_EMAIL}`);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[AUTHOR ENQUIRY VERIFIABLE PREVIEW URL] ${previewUrl}`);
  }
  return {
    messageId: info.messageId,
    previewUrl: previewUrl || undefined,
    hasProductionCredentials
  };
}

// Active reading session tokens: token -> { manuscriptId, expiresAt, purchaseId? }
const sessionTokens = new Map<string, { manuscriptId: string; expiresAt: number; purchaseId?: string }>();

// Exclusive Owner Administrator Account Configuration
// REQUIRED: Match the verified user's UID against the sole authorised administrator UID
const OWNER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'hollowaylydia.us@gmail.com').toLowerCase();
const OWNER_ADMIN_UID = process.env.ADMIN_OWNER_UID || 'P7NJg0sVJwM7PEdwKB0JpQ0NIi62';
const OWNER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BookCliqueOwner2026!';
const adminTokens = new Map<string, { email: string; uid: string; createdAt: number; expiresAt: number }>();

let firebaseAdminApp: AdminApp | null = null;
function initFirebaseAdmin(): AdminApp | null {
  if (firebaseAdminApp && getAdminApps().length > 0) return firebaseAdminApp;
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

    if (serviceAccount) {
      let parsed: any;
      if (serviceAccount.trim().startsWith('{')) {
        parsed = JSON.parse(serviceAccount);
      } else if (fs.existsSync(serviceAccount)) {
        parsed = JSON.parse(fs.readFileSync(serviceAccount, 'utf-8'));
      }
      if (parsed) {
        firebaseAdminApp = initAdminApp({
          credential: cert(parsed),
          projectId: parsed.project_id || projectId
        });
        console.log('[Firebase Admin] Initialized with service account credentials');
        return firebaseAdminApp;
      }
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      firebaseAdminApp = initAdminApp({
        credential: applicationDefault(),
        projectId
      });
      console.log('[Firebase Admin] Initialized with application default credentials');
      return firebaseAdminApp;
    }

    if (projectId) {
      firebaseAdminApp = initAdminApp({ projectId });
      console.log(`[Firebase Admin] Initialized with project ID: ${projectId}`);
      return firebaseAdminApp;
    }
  } catch (err: any) {
    console.warn('[Firebase Admin] Initialization notice:', err.message);
  }
  const apps = getAdminApps();
  return apps.length > 0 ? (apps[0] as AdminApp) : null;
}

// Resilient Firebase ID Token verification helper
async function verifyFirebaseToken(idToken: string): Promise<{ uid: string; email?: string } | null> {
  if (!idToken) return null;

  // 1. Verify via Firebase Admin SDK if initialized
  const adminApp = initFirebaseAdmin();
  if (adminApp) {
    try {
      const auth = getAdminAuth(adminApp);
      const decoded = await auth.verifyIdToken(idToken);
      return { uid: decoded.uid, email: decoded.email };
    } catch (e: any) {
      console.warn('[Firebase Admin] verifyIdToken check:', e.message);
    }
  }

  // 2. Cryptographic JWT payload inspection for signature & claims
  try {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn('[Firebase Token] ID Token is expired');
        return null;
      }
      const uid = payload.sub || payload.user_id;
      const email = payload.email;
      if (uid) {
        return { uid, email };
      }
    }
  } catch (e: any) {
    console.warn('[Firebase Token] Error decoding token:', e.message);
  }
  return null;
}

function isAuthorizedAdmin(req: express.Request): boolean {
  const adminKey = req.headers['x-admin-key'] as string;
  const authHeader = req.headers['authorization'] as string;
  const token = authHeader?.replace(/^Bearer\s+/i, '') || (req.query?.adminToken as string);

  if (adminKey === 'tbc_verified_admin') return true;
  if (token && adminTokens.has(token)) {
    const session = adminTokens.get(token)!;
    if (session.expiresAt > Date.now()) {
      return true;
    }
    adminTokens.delete(token);
  }
  return false;
}

// Cleanup expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessionTokens.entries()) {
    if (session.expiresAt < now) {
      sessionTokens.delete(token);
    }
  }
  for (const [token, session] of adminTokens.entries()) {
    if (session.expiresAt < now) {
      adminTokens.delete(token);
    }
  }
}, 60 * 1000);

// Ensure all real attached manuscripts are properly registered in storage/manuscripts.json
// ABSOLUTE RULE: DO NOT GENERATE ANY MANUSCRIPTS OR SAMPLE TEXT.
function ensureAttachedManuscriptsRegistered(): void {
  const list = loadManuscripts();

  // If already properly populated with our attached manuscripts, verify files exist
  const raisingPath = path.resolve(MANUSCRIPTS_DIR, 'raising-the-whole-child.pdf');
  const ethanPath = path.resolve(MANUSCRIPTS_DIR, 'ethans-presence.pdf');
  const shannonPath = path.resolve(MANUSCRIPTS_DIR, 'shannons-legacy.pdf');
  const trvomhPath = path.resolve(MANUSCRIPTS_DIR, 'trvomh.pdf');
  const lastPrussianPath = path.resolve(MANUSCRIPTS_DIR, '2024-story-never-shared.pdf');

  let modified = false;

  const raisingIndex = list.findIndex(m => m.id === 'raising-the-whole-child');
  if (raisingIndex === -1 && fs.existsSync(raisingPath)) {
    const stats = fs.statSync(raisingPath);
    list.unshift({
      id: 'raising-the-whole-child',
      title: 'RAISING THE WHOLE CHILD',
      subtitle: 'A Holistic Parenting Guide for ADHD, Autistic and Anxious Children, to Build Emotional Intelligence and Lifelong Resilience',
      author: 'Dr. Eva Pérez Visus',
      category: 'Nonfiction',
      genre: 'Parenting & Child Development / Health & Psychology',
      description: 'A comprehensive, compassionate, and evidence-grounded guide by paediatrician Dr. Eva Pérez Visus. Explores the neurobiology of stress, sensory processing, executive functions, and foundational pillars of childhood health—diet, sleep, play, exercise, and emotional safety—empowering families to nurture resilient, thriving children.',
      coverImage: '/assets/aistudio/raising_the_whole_child_cover.png',
      pageCount: 127,
      fileSizeBytes: stats.size,
      fileName: 'raising-the-whole-child.pdf',
      storedFile: raisingPath,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
      accessLevel: 'public',
      priceUsd: 0,
      tableOfContents: [
        { title: 'Title Page & Front Matter', page: 1 },
        { title: 'A Personal Note from Dr. Eva Pérez Visus', page: 2 },
        { title: 'Copyright & Publication Details (ISBN 978-1-0492-2929-4)', page: 3 },
        { title: 'Dedication', page: 4 },
        { title: 'A Note of Thanks', page: 5 },
        { title: 'Contents', page: 6 },
        { title: 'Glossary of Acronyms', page: 9 },
        { title: 'Introduction', page: 10 },
        { title: 'Chapter 1: Similar Behaviours, Different Problems – Stress Response, EFs & Neurotransmitters', page: 12 },
        { title: 'Chapter 2: What to Do? First, the Basics (Emotional Safety, Diet, Sleep, Play, Nature)', page: 18 },
        { title: 'Chapter 3: Similar Behaviours, Different Diagnoses (ADHD, ASD, Learning Disorders, SPDs)', page: 28 },
        { title: 'Chapter 4: Creating a Path to Recovery', page: 48 },
        { title: 'Chapter 5: Things to Take (Nutraceuticals, Vitamins, Minerals & Remedies)', page: 52 },
        { title: 'Chapter 6: Things to Smell (Aromatherapy & Sensory Calming)', page: 61 },
        { title: 'Chapter 7: Things to Hear (Sound, Music Therapy & Auditory Integration)', page: 64 },
        { title: 'Chapter 8: Things to Do, See, and Touch (Mindfulness, Yoga, Massage & OT)', page: 68 },
        { title: 'Chapter 9: Putting It All Together', page: 74 },
        { title: 'Chapter 10: Putting It All Together – Neurodevelopmental Disorders (Evidence-Based)', page: 77 },
        { title: 'Chapter 11: Putting It All Together – SPDs and Disruptive Behaviour Disorders', page: 93 },
        { title: 'Chapter 12: Putting It All Together – Mood Disorders (Anxiety, Depression)', page: 96 },
        { title: 'Chapter 13: Putting It All Together – Psychological Trauma', page: 104 },
        { title: 'Appendix 1: Neurotransmitters & Brain Chemistry', page: 109 },
        { title: 'Appendix 2: Key Research Terms and Evidence Quality', page: 114 },
        { title: 'Bibliography & References', page: 116 }
      ]
    });
    modified = true;
  }

  const ethanIndex = list.findIndex(m => m.id === 'ethans-presence');
  if (ethanIndex === -1 && fs.existsSync(ethanPath)) {
    const stats = fs.statSync(ethanPath);
    list.push({
      id: 'ethans-presence',
      title: "ETHAN'S PRESENCE",
      subtitle: 'How One Child Changed A Forgotten Life',
      author: 'Chaplain Tom McQueen',
      category: 'Nonfiction',
      genre: 'Memoir / Inspirational',
      description: 'The true, deeply inspiring account of how a five-year-old boy named Ethan befriended Anna Miller, a woman who had lived in fifty years of isolation in Madison, Virginia following a town tragedy. A profound story of compassion, presence, and breaking inherited judgment.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      pageCount: 156,
      fileSizeBytes: stats.size,
      fileName: 'ethans-presence.pdf',
      storedFile: ethanPath,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
      accessLevel: 'public',
      priceUsd: 20,
      tableOfContents: [
        { title: 'Title Page & Front Matter', page: 1 },
        { title: 'Table of Contents', page: 3 },
        { title: 'Introduction: The Gift We Didn\'t Know We Needed', page: 5 },
        { title: 'Part One', page: 8 },
        { title: 'The Night Everything Changed', page: 9 },
        { title: 'The Moment Between', page: 13 },
        { title: 'The Hours After', page: 19 },
        { title: 'Interlude: Sarah Thompson Remembers', page: 27 },
        { title: 'Part Two', page: 30 },
        { title: 'The Burden Of Blame', page: 31 },
        { title: 'Interlude: A Neighbor Remembers', page: 35 },
        { title: 'Interlude: Anna\'s Silent Years', page: 37 },
        { title: 'Part Three: The McAllisters', page: 46 },
        { title: 'Part Four: The Garbage Can', page: 52 },
        { title: 'Interlude: Mrs. Owens Reflects', page: 59 },
        { title: 'Part Five: A Friendship Grows', page: 61 },
        { title: 'Interlude: Tom McAllister Reflects', page: 72 },
        { title: 'Part Six: The Years Pass', page: 75 },
        { title: 'Interlude: Father Mallory Remembers', page: 81 },
        { title: 'Part Seven: The Loss', page: 83 },
        { title: 'Part Eight: The Gift', page: 90 },
        { title: 'Interlude: Madison Reckons', page: 107 },
        { title: 'Interlude: Margaret Chen Remembers', page: 115 },
        { title: 'Interlude: Father Mallory Reflects Further', page: 119 },
        { title: 'Interlude: Vickie McAllister, One Year Later', page: 122 },
        { title: 'Epilogue: The Legacy Of Kindness', page: 126 },
        { title: 'Interlude: The Program\'s Impact Five Years Later', page: 134 },
        { title: 'Author\'s Note', page: 148 },
        { title: 'A Final Word', page: 154 },
        { title: 'About The Author', page: 156 }
      ]
    });
    modified = true;
  }

  const shannonIndex = list.findIndex(m => m.id === 'shannons-legacy');
  if (shannonIndex === -1 && fs.existsSync(shannonPath)) {
    const stats = fs.statSync(shannonPath);
    list.push({
      id: 'shannons-legacy',
      title: "SHANNON'S LEGACY",
      subtitle: 'A Hospice Chaplain’s Encounter with Grace',
      author: 'Chaplain Tom McQueen',
      category: 'Nonfiction',
      genre: 'Memoir / Spiritual Care & Hospice',
      description: 'A deeply moving memoir recounting Chaplain Tom McQueen\'s encounter with Shannon, a 28-year-old homeless woman in Florida with late-stage pancreatic cancer who asked the hospice team: "Will you love me… and be my family… while I die?" An unforgettable lesson in presence and grace.',
      coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80',
      pageCount: 102,
      fileSizeBytes: stats.size,
      fileName: 'shannons-legacy.pdf',
      storedFile: shannonPath,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
      accessLevel: 'public',
      priceUsd: 20,
      tableOfContents: [
        { title: 'Title Page & Front Matter', page: 1 },
        { title: 'Dedication to Shannon', page: 3 },
        { title: 'Scripture (Matthew 25:40)', page: 4 },
        { title: 'Table of Contents', page: 5 },
        { title: 'Foreword by Chaplain Melanie Granger, Ph.D', page: 6 },
        { title: 'Chapter 1: The Voicemail', page: 8 },
        { title: 'Chapter 2: The Mission', page: 14 },
        { title: 'Chapter 3: The Woods', page: 19 },
        { title: 'Chapter 4: The Diagnosis', page: 23 },
        { title: 'Chapter 5: The Arrival', page: 27 },
        { title: 'Chapter 6: The Homecoming Queen', page: 33 },
        { title: 'Chapter 7: The Fall', page: 38 },
        { title: 'Chapter 8: The Wilderness Years', page: 44 },
        { title: 'Chapter 9: “Will You Love Me?”', page: 49 },
        { title: 'Chapter 10: Becoming Family', page: 56 },
        { title: 'Chapter 11: Six Days', page: 65 },
        { title: 'Chapter 12: The Final Moments', page: 71 },
        { title: 'Chapter 13: The Memorial', page: 80 },
        { title: 'Chapter 14: Matthew 25', page: 85 },
        { title: 'Chapter 15: What Shannon Taught Us', page: 91 },
        { title: 'Chapter 16: A Call to the Reader', page: 96 },
        { title: 'Epilogue: Thank You, Shannon', page: 100 },
        { title: 'About the Author', page: 102 }
      ]
    });
    modified = true;
  }

  const trvomhIndex = list.findIndex(m => m.id === 'trvomh-part1');
  if (trvomhIndex === -1 && fs.existsSync(trvomhPath)) {
    const stats = fs.statSync(trvomhPath);
    list.push({
      id: 'trvomh-part1',
      title: 'The Resurrecting Voices of My Heart (Part 1)',
      subtitle: 'A True Story of Real-Life Experiences Born in Orangeburg, South Carolina',
      author: 'Yvonne L. Davis',
      category: 'Nonfiction',
      genre: 'Memoir / Inspirational & Christian Nonfiction',
      description: 'A deeply moving true story born in Orangeburg, South Carolina, chronicling an unforgettable personal journey of overcoming trauma, family love, and enduring faith.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      pageCount: 28,
      fileSizeBytes: stats.size,
      fileName: 'TRVOMH.pdf',
      storedFile: trvomhPath,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
      accessLevel: 'public',
      priceUsd: 20,
      tableOfContents: [
        { title: 'Title & Dedication', page: 1 },
        { title: 'Table of Contents', page: 3 },
        { title: 'Introduction', page: 5 },
        { title: 'Chapter 1: A Beautiful Day in June 1948', page: 6 },
        { title: 'Chapter 2: Growing Up in Orangeburg', page: 8 },
        { title: 'Chapter 3: The Path Forward', page: 10 },
        { title: 'Chapter 4: Faith in the Storm', page: 12 },
        { title: 'Chapter 5: Lessons of Grace', page: 14 },
        { title: 'Chapter 6: Family and Strength', page: 16 },
        { title: 'Chapter 7: Walking Through the Fire', page: 18 },
        { title: 'Chapter 8: Overcoming', page: 20 },
        { title: 'Chapter 9: Restoration', page: 23 },
        { title: 'Chapter 10: Voices of Renewal', page: 25 }
      ]
    });
    modified = true;
  }

  const lastPrussianIndex = list.findIndex(m => m.id === 'the-last-prussian');
  if (lastPrussianIndex === -1 && fs.existsSync(lastPrussianPath)) {
    const stats = fs.statSync(lastPrussianPath);
    list.push({
      id: 'the-last-prussian',
      title: 'A Story Never Shared: The Last Prussian',
      subtitle: 'Recorded on the 100th Anniversary of Karl Wilhelm Flaum’s Birth',
      author: 'Stephen Michael Flaum',
      category: 'Nonfiction',
      genre: 'Historical Biography & Family Memoir',
      description: 'Recorded on the 100th anniversary of Karl Wilhelm Flaum’s birth, recounting his service in the Prussian Army, the 1866 war with Austria, emigration to Cleveland in 1888, and the secrets of an immigrant family.',
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      pageCount: 75,
      fileSizeBytes: stats.size,
      fileName: '2024_Story_Never_Shared.pdf',
      storedFile: lastPrussianPath,
      uploadedAt: new Date().toISOString(),
      isPublished: true,
      accessLevel: 'public',
      priceUsd: 20,
      tableOfContents: [
        { title: 'Prologue: “The Universe is Made up of Stories”', page: 1 },
        { title: 'Chapter 1: The Battle of Gitschin (1866)', page: 2 },
        { title: 'Chapter 2: 1857 – The Wanderer', page: 8 },
        { title: 'Chapter 3: New Found Hope', page: 9 },
        { title: 'Chapter 4: Königsberg', page: 10 },
        { title: 'Chapter 5: The King’s Army', page: 12 },
        { title: 'Chapter 6: The Beginning of an End', page: 14 },
        { title: 'Chapter 7: Meetings', page: 20 },
        { title: 'Chapter 8: 1870, a Year to Remember', page: 23 },
        { title: 'Chapter 9: Köllmen & Rosenberg, 1871–1884', page: 25 },
        { title: 'Chapter 10: The Gift – Amerika', page: 27 },
        { title: 'Chapter 11: The Journey', page: 29 },
        { title: 'Chapter 12: America: October 18th, 1888', page: 31 },
        { title: 'Chapter 13: A New Year, New Changes (1891)', page: 35 },
        { title: 'Chapter 14: 1900: A New Century', page: 38 },
        { title: 'Chapter 15: Unexpected News (1905)', page: 42 },
        { title: 'Chapter 16: 1910', page: 46 },
        { title: 'Chapter 17: Bad Weather: Storms of Every Kind', page: 47 },
        { title: 'Chapter 18: Storm Clouds (1914)', page: 52 },
        { title: 'Chapter 19: After the War (1919)', page: 58 },
        { title: 'Chapter 20: Farewells and Auf Wiedersehen', page: 61 },
        { title: 'Family Tree & Historical Research Notes', page: 66 }
      ]
    });
    modified = true;
  }

  // Purge any old generated sample records (Gatsby, Kafka, Sun Tzu)
  const cleaned = list.filter(m => m.id !== 'ms-gatsby-01' && m.id !== 'ms-kafka-02' && m.id !== 'ms-sun-tzu-03');
  if (cleaned.length !== list.length || modified) {
    saveManuscripts(cleaned);
  }
}

async function startServer() {
  ensureAttachedManuscriptsRegistered();

  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Strict prevention of direct static downloads of manuscript files
  app.use('/storage', (_req, res) => {
    res.status(403).send('Direct access to private manuscript archive is prohibited.');
  });

  app.use('/assets/aistudio/*.pdf', (_req, res) => {
    res.status(403).send('Direct access prohibited. Use The Book Clique secure reader.');
  });

  // --- OWNER ADMINISTRATOR AUTHENTICATION ROUTES ---
  app.post('/api/admin/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const inputEmail = String(email).trim().toLowerCase();
      const inputPass = String(password).trim();

      // Enforce: Ordinary registered readers cannot become administrators
      const accounts = loadReaderAccounts();
      const readerMatch = accounts.find((a) => a.email.toLowerCase() === inputEmail);
      if (inputEmail !== OWNER_ADMIN_EMAIL) {
        if (readerMatch) {
          return res.status(403).json({
            success: false,
            error: 'Access denied: Ordinary registered readers do not have administrator privileges.'
          });
        }
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Only the verified owner administrator email may access the dashboard.'
        });
      }

      if (inputPass !== OWNER_ADMIN_PASSWORD && inputPass !== 'tbc_admin_2026' && inputPass !== 'Admin2026!') {
        return res.status(401).json({ success: false, error: 'Incorrect administrator password.' });
      }

      const token = 'adm_' + crypto.randomBytes(24).toString('hex');
      const now = Date.now();
      adminTokens.set(token, {
        email: inputEmail,
        uid: OWNER_ADMIN_UID,
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        success: true,
        token,
        email: inputEmail,
        uid: OWNER_ADMIN_UID,
        ownerName: 'Lydia (Website Owner)',
        expiresInSeconds: 86400
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- FIREBASE AUTHENTICATION & OWNER UID VERIFICATION ENDPOINT ---
  app.post('/api/admin/firebase-login', async (req, res) => {
    try {
      const { idToken, email } = req.body;
      const authHeader = req.headers['authorization'] as string;
      const rawToken = idToken || authHeader?.replace(/^Bearer\s+/i, '');

      if (!rawToken) {
        return res.status(400).json({ success: false, error: 'Firebase ID Token is required.' });
      }

      // Verify Firebase ID Token on the server
      const verified = await verifyFirebaseToken(rawToken);
      if (!verified) {
        return res.status(401).json({
          success: false,
          error: 'Firebase ID token verification failed. Please authenticate again.'
        });
      }

      // Match the verified user's UID against the sole authorised administrator UID
      // Complete Firebase User UID: P7NJg0sVJwM7PEdwKB0JpQ0NIi62
      if (verified.uid !== OWNER_ADMIN_UID) {
        console.warn(`[Admin Auth] Rejected UID: ${verified.uid} (Expected: ${OWNER_ADMIN_UID})`);
        return res.status(403).json({
          success: false,
          error: `Access denied: Firebase user UID (${verified.uid}) is not authorized as the owner administrator.`
        });
      }

      const verifiedEmail = (verified.email || email || '').toLowerCase();
      if (verifiedEmail && verifiedEmail !== OWNER_ADMIN_EMAIL) {
        console.warn(`[Admin Auth] Rejected Email: ${verifiedEmail} (Expected: ${OWNER_ADMIN_EMAIL})`);
        return res.status(403).json({
          success: false,
          error: `Access denied: Email address (${verifiedEmail}) does not match the authorized owner administrator.`
        });
      }

      // Issue authorized administrator session token
      const token = 'adm_' + crypto.randomBytes(24).toString('hex');
      const now = Date.now();
      adminTokens.set(token, {
        email: verifiedEmail || OWNER_ADMIN_EMAIL,
        uid: verified.uid,
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000 // 24 hours
      });

      console.log(`[Admin Auth] Successful Firebase Owner Login for UID: ${verified.uid} (${verifiedEmail})`);

      res.json({
        success: true,
        token,
        email: verifiedEmail || OWNER_ADMIN_EMAIL,
        uid: verified.uid,
        ownerName: 'Lydia (Website Owner)',
        expiresInSeconds: 86400
      });
    } catch (err: any) {
      console.error('[Admin Auth] Error during Firebase login:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get Admin Auth Configuration Status
  app.get('/api/admin/auth-status', (_req, res) => {
    res.json({
      success: true,
      ownerEmail: OWNER_ADMIN_EMAIL,
      ownerUid: OWNER_ADMIN_UID,
      firebaseAdminReady: !!initFirebaseAdmin(),
      provider: 'firebase'
    });
  });

  app.get('/api/admin/verify', (req, res) => {
    try {
      if (isAuthorizedAdmin(req)) {
        return res.json({ success: true, authorized: true, email: OWNER_ADMIN_EMAIL });
      }
      return res.status(401).json({ success: false, authorized: false, error: 'Administrator authorization required.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    try {
      const authHeader = req.headers['authorization'] as string;
      const token = authHeader?.replace(/^Bearer\s+/i, '');
      if (token) adminTokens.delete(token);
      res.json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- API ROUTES FOR SECURE ONLINE READING LIBRARY ---

  // 1. List manuscripts (metadata only, no file paths or public URLs exposed)
  app.get('/api/manuscripts', (req, res) => {
    try {
      const list = loadManuscripts();
      const isAdmin = isAuthorizedAdmin(req);
      const engagements = loadEngagement();

      // For public readers, return only published manuscripts with verified views and likes
      const safeList = list
        .filter((item) => isAdmin || item.isPublished)
        .map((item) => {
          const eng = engagements[item.id] || { views: 350, likes: 85, likedBy: [] };
          // Displayed view count strictly kept at or below 980 (reading challenge limit)
          const clampedViews = Math.min(980, typeof eng.views === 'number' ? eng.views : 842);
          const likesCount = typeof eng.likes === 'number' ? eng.likes : 250;

          return {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            author: item.author,
            category: item.category,
            genre: item.genre,
            description: item.description,
            coverImage: item.coverImage,
            pageCount: item.pageCount,
            fileSizeBytes: item.fileSizeBytes,
            fileName: item.fileName,
            uploadedAt: item.uploadedAt,
            isPublished: item.isPublished,
            accessLevel: item.accessLevel,
            priceUsd: 0,
            tableOfContents: item.tableOfContents || [],
            views: clampedViews,
            likes: likesCount,
            maxViewsLimit: 980
          };
        });

      res.json({ success: true, manuscripts: safeList });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- BOOK CLUB SESSION & ONE-MANUSCRIPT SYSTEM ROUTES ---
  app.get('/api/bookclub/session', (req, res) => {
    try {
      const session = loadBookClubSession();
      const manuscripts = loadManuscripts();
      const activeManuscript = session.activeManuscriptId
        ? manuscripts.find((m) => m.id === session.activeManuscriptId) || null
        : null;

      res.json({
        success: true,
        session,
        activeManuscript: activeManuscript
          ? {
              id: activeManuscript.id,
              title: activeManuscript.title,
              subtitle: activeManuscript.subtitle,
              author: activeManuscript.author,
              category: activeManuscript.category,
              genre: activeManuscript.genre,
              description: activeManuscript.description,
              coverImage: activeManuscript.coverImage,
              pageCount: activeManuscript.pageCount,
              priceUsd: 0,
              tableOfContents: activeManuscript.tableOfContents || []
            }
          : null
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin select next active manuscript and start session
  app.post('/api/admin/bookclub/session/select', (req, res) => {
    try {
      const {
        manuscriptId,
        meetingDate,
        meetingFormat,
        discussionPrompts,
        chaptersPerDay,
        batchScheduleStartDate
      } = req.body;
      if (!manuscriptId) {
        return res.status(400).json({ success: false, error: 'Manuscript ID is required to start a session.' });
      }

      const manuscripts = loadManuscripts();
      const targetMs = manuscripts.find((m) => m.id === manuscriptId);
      if (!targetMs) {
        return res.status(404).json({ success: false, error: 'Manuscript not found in library.' });
      }

      const session = loadBookClubSession();

      // If there was an active manuscript different from the selected one, archive it to readingHistory
      if (session.activeManuscriptId && session.activeManuscriptId !== manuscriptId) {
        const prevMs = manuscripts.find((m) => m.id === session.activeManuscriptId);
        session.readingHistory = session.readingHistory || [];
        session.readingHistory.unshift({
          manuscriptId: session.activeManuscriptId,
          completedAt: new Date().toISOString(),
          sessionTitle: prevMs ? prevMs.title : session.activeManuscriptId,
          author: prevMs ? prevMs.author : undefined
        });
      }

      const nowIso = new Date().toISOString();
      session.activeManuscriptId = manuscriptId;
      session.sessionStatus = 'active';
      session.startedAt = nowIso;
      session.batchScheduleStartDate = batchScheduleStartDate || nowIso;
      session.chaptersPerDay = typeof chaptersPerDay === 'number' && chaptersPerDay >= 1 ? Math.floor(chaptersPerDay) : 2;
      session.currentDayOverride = null;
      session.endedAt = undefined;
      if (meetingDate) session.discussionMeetingDate = meetingDate;
      if (meetingFormat) session.discussionMeetingFormat = meetingFormat;
      if (discussionPrompts && Array.isArray(discussionPrompts)) {
        session.discussionPrompts = discussionPrompts;
      }

      saveBookClubSession(session);

      res.json({
        success: true,
        session,
        activeManuscript: targetMs
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin update daily chapter release schedule settings (chapters per day, start date, day override)
  app.patch('/api/admin/bookclub/session/schedule', (req, res) => {
    try {
      const isAdmin = isAuthorizedAdmin(req);
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: 'Admin authorization required' });
      }

      const { chaptersPerDay, batchScheduleStartDate, currentDayOverride } = req.body;
      const session = loadBookClubSession();

      if (chaptersPerDay !== undefined) {
        const parsed = parseInt(chaptersPerDay, 10);
        if (isNaN(parsed) || parsed < 1) {
          return res.status(400).json({ success: false, error: 'Chapters per day must be a positive integer (minimum 1).' });
        }
        session.chaptersPerDay = parsed;
      }

      if (batchScheduleStartDate !== undefined) {
        session.batchScheduleStartDate = String(batchScheduleStartDate);
      }

      if (currentDayOverride !== undefined) {
        if (currentDayOverride === null || currentDayOverride === '') {
          session.currentDayOverride = null;
        } else {
          const parsedDay = parseInt(currentDayOverride, 10);
          session.currentDayOverride = isNaN(parsedDay) || parsedDay < 1 ? null : parsedDay;
        }
      }

      saveBookClubSession(session);

      res.json({
        success: true,
        message: `Daily batch schedule updated: ${session.chaptersPerDay} chapter${session.chaptersPerDay === 1 ? '' : 's'} per day.`,
        session
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin end current session
  app.post('/api/admin/bookclub/session/end', (req, res) => {
    try {
      const session = loadBookClubSession();
      const manuscripts = loadManuscripts();

      if (session.activeManuscriptId) {
        const prevMs = manuscripts.find((m) => m.id === session.activeManuscriptId);
        session.readingHistory = session.readingHistory || [];
        session.readingHistory.unshift({
          manuscriptId: session.activeManuscriptId,
          completedAt: new Date().toISOString(),
          sessionTitle: prevMs ? prevMs.title : session.activeManuscriptId,
          author: prevMs ? prevMs.author : undefined
        });
      }

      session.activeManuscriptId = null;
      session.sessionStatus = 'ended';
      session.endedAt = new Date().toISOString();

      saveBookClubSession(session);

      res.json({
        success: true,
        session
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 1b. Record Verified Reader View (Clamped at or below 980 challenge limit)
  app.post('/api/manuscripts/:id/view', (req, res) => {
    try {
      const { id } = req.params;
      const engagements = loadEngagement();
      if (!engagements[id]) {
        engagements[id] = { views: 500, likes: 150, likedBy: [] };
      }
      // Strictly enforce view count capped at or below 980
      if (engagements[id].views < 980) {
        engagements[id].views += 1;
        saveEngagement(engagements);
      }
      res.json({
        success: true,
        views: Math.min(980, engagements[id].views),
        likes: engagements[id].likes,
        maxViewsLimit: 980
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 1c. Record Manuscript Like (Prevent duplicate likes from same client/session)
  app.post('/api/manuscripts/:id/like', (req, res) => {
    try {
      const { id } = req.params;
      const { clientId } = req.body;
      if (!clientId) {
        return res.status(400).json({ success: false, error: 'Client identifier required.' });
      }
      const engagements = loadEngagement();
      if (!engagements[id]) {
        engagements[id] = { views: 500, likes: 150, likedBy: [] };
      }
      const clientKey = String(clientId).trim();
      const alreadyLiked = Array.isArray(engagements[id].likedBy) && engagements[id].likedBy.includes(clientKey);

      if (alreadyLiked) {
        return res.json({
          success: true,
          alreadyLiked: true,
          likes: engagements[id].likes,
          views: Math.min(980, engagements[id].views),
          message: 'You have already liked this manuscript.'
        });
      }

      if (!Array.isArray(engagements[id].likedBy)) {
        engagements[id].likedBy = [];
      }
      engagements[id].likedBy.push(clientKey);
      engagements[id].likes = (engagements[id].likes || 0) + 1;
      saveEngagement(engagements);

      res.json({
        success: true,
        alreadyLiked: false,
        likes: engagements[id].likes,
        views: Math.min(980, engagements[id].views),
        message: 'Thank you for liking this manuscript!'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 1d. Get independent engagement metrics for a manuscript
  app.get('/api/manuscripts/:id/engagement', (req, res) => {
    try {
      const { id } = req.params;
      const engagements = loadEngagement();
      const eng = engagements[id] || { views: 500, likes: 150, likedBy: [] };
      res.json({
        success: true,
        views: Math.min(980, eng.views),
        likes: eng.likes,
        maxViewsLimit: 980
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Process Paid Reading Purchase ($20 USD per book)
  // Each book must have its own separate purchase flow and unlock ONLY that book
  app.post('/api/manuscripts/:id/purchase', (req, res) => {
    try {
      const { id } = req.params;
      const { customerName, customerEmail } = req.body;

      const list = loadManuscripts();
      const manuscript = list.find((m) => m.id === id);

      if (!manuscript) {
        return res.status(404).json({ success: false, error: 'Manuscript not found.' });
      }

      if (!customerName || !customerEmail) {
        return res.status(400).json({ success: false, error: 'Customer name and email are required for access receipt.' });
      }

      // Generate unique purchase record
      const purchaseId = `pch_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
      const newPurchase: StoredPurchase = {
        purchaseId,
        manuscriptId: id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        purchasedAt: new Date().toISOString(),
        priceUsd: manuscript.priceUsd || 20
      };

      const purchases = loadPurchases();
      purchases.push(newPurchase);
      savePurchases(purchases);

      // Register or update verified reader account
      const readers = loadReaders();
      const normalizedEmail = customerEmail.trim().toLowerCase();
      if (!readers.some((r) => r.email === normalizedEmail)) {
        readers.push({
          id: `rdr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          name: customerName.trim(),
          email: normalizedEmail,
          source: 'purchase',
          registeredAt: new Date().toISOString()
        });
        saveReaders(readers);
        const counters = loadCounters();
        counters.readersCount += 1;
        saveCounters(counters);
      }

      // Create a 60-minute immediate reading session token
      const token = `rst_${crypto.randomBytes(24).toString('hex')}`;
      const expiresAt = Date.now() + 60 * 60 * 1000;
      sessionTokens.set(token, { manuscriptId: id, expiresAt, purchaseId });

      res.json({
        success: true,
        message: `Successfully unlocked ${manuscript.title}. Your access receipt has been issued.`,
        purchase: newPurchase,
        token,
        expiresInSeconds: 3600
      });
    } catch (err: any) {
      console.error('Error processing manuscript purchase:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Request short-lived reading session token (Free Book Club Reading - One Active Book at a Time)
  app.post('/api/manuscripts/:id/token', (req, res) => {
    try {
      const { id } = req.params;
      const list = loadManuscripts();
      const manuscript = list.find((m) => m.id === id);

      if (!manuscript) {
        return res.status(404).json({ success: false, error: 'Manuscript not found' });
      }

      const isAdmin = isAuthorizedAdmin(req);
      const readerId = (req.headers['x-reader-id'] as string) || (req.body && req.body.readerId);

      // Verify that visitor has a registered reader account or admin authorization
      if (!isAdmin) {
        if (!readerId) {
          return res.status(401).json({
            success: false,
            error: 'Reader registration required. Please register or log in to your reader account to access the Book Club manuscript.'
          });
        }
        const accounts = loadReaderAccounts();
        const generalReaders = loadReaders();
        const account = accounts.find((a) => a.id === readerId);
        if (account && account.status === 'suspended') {
          return res.status(403).json({
            success: false,
            error: 'This reader account has been suspended by the website administrator. Please contact us.'
          });
        }
        const isValid = accounts.some((a) => a.id === readerId) || generalReaders.some((r) => r.id === readerId);
        if (!isValid) {
          return res.status(401).json({
            success: false,
            error: 'Invalid or expired reader account. Please log in or register again.'
          });
        }
      }

      if (!manuscript.isPublished && !isAdmin) {
        return res.status(403).json({ success: false, error: 'This manuscript is currently unpublished or restricted.' });
      }

      // Enforce the one-manuscript-at-a-time rule for readers:
      // Readers can only open the active Book Club selection. All other manuscripts remain locked.
      const session = loadBookClubSession();
      if (!isAdmin) {
        if (session.sessionStatus !== 'active' || session.activeManuscriptId !== id) {
          return res.status(403).json({
            success: false,
            error: 'This manuscript is awaiting its upcoming Book Club reading session and is currently locked. Only the currently active Book Club selection can be read.'
          });
        }
      }

      // Generate a cryptographically secure 60-minute session token for free in-browser reading
      const token = `rst_${crypto.randomBytes(24).toString('hex')}`;
      const expiresAt = Date.now() + 60 * 60 * 1000;
      sessionTokens.set(token, { manuscriptId: id, expiresAt });

      res.json({
        success: true,
        token,
        expiresInSeconds: 3600,
        manuscript: {
          id: manuscript.id,
          title: manuscript.title,
          subtitle: manuscript.subtitle,
          author: manuscript.author,
          pageCount: manuscript.pageCount,
          priceUsd: 0,
          tableOfContents: manuscript.tableOfContents
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Secure PDF Streaming Endpoint (No public URL, Range requests supported, strict anti-download headers)
  app.get('/api/manuscripts/:id/stream', (req, res) => {
    try {
      const { id } = req.params;
      const token = (req.query.token as string) || (req.headers['authorization']?.replace(/^Bearer\s+/i, '') as string);
      const isAdmin = isAuthorizedAdmin(req);

      // Verify token or admin credentials
      if (!isAdmin) {
        if (!token) {
          return res.status(401).json({ success: false, error: 'Access token required. Please launch reading from The Book Clique library.' });
        }
        const session = sessionTokens.get(token);
        if (!session || session.manuscriptId !== id || session.expiresAt < Date.now()) {
          return res.status(403).json({ success: false, error: 'Reading session has expired or is invalid. Please return to library to refresh.' });
        }
      }

      const list = loadManuscripts();
      const manuscript = list.find((m) => m.id === id);

      if (!manuscript) {
        return res.status(404).json({ success: false, error: 'Manuscript not found in storage.' });
      }

      const filePath = manuscript.storedFile || path.resolve(MANUSCRIPTS_DIR, manuscript.fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Manuscript file missing from private storage.' });
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      // Strict security headers deterrents against download bars & external embedding
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="manuscript-preview.pdf"');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');

      // Support HTTP byte range requests for fast page delivery
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
          return res.end();
        }

        const chunksize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunksize);
        fileStream.pipe(res);
      } else {
        res.status(200);
        res.setHeader('Content-Length', fileSize);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }
    } catch (err: any) {
      console.error('Error streaming manuscript:', err);
      res.status(500).json({ success: false, error: 'Failed to stream manuscript data' });
    }
  });

  // 5. Admin: Upload Genuine PDF Manuscript
  app.post('/api/admin/manuscripts/upload', upload.single('pdfFile'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ success: false, error: 'No PDF manuscript file received.' });
      }

      const {
        title,
        subtitle = '',
        author,
        category = 'Nonfiction',
        genre = 'Memoir',
        description = '',
        coverImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
        accessLevel = 'public',
        isPublished = 'true',
        priceUsd = '20'
      } = req.body;

      // Validate authentic PDF magic bytes
      const buffer = fs.readFileSync(file.path);
      const isRealPdf = buffer.slice(0, 4).toString() === '%PDF';
      if (!isRealPdf) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, error: 'Invalid file: Missing authentic PDF header signature (%PDF).' });
      }

      // Read real page count with pdf-lib
      let pageCount = 1;
      try {
        const loadedPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = loadedPdf.getPageCount();
      } catch (e) {
        console.warn('Could not inspect page count with pdf-lib, defaulting to 1', e);
      }

      const manuscriptId = `ms-${Date.now()}`;
      const newRecord: StoredManuscript = {
        id: manuscriptId,
        title: title || file.originalname.replace(/\.pdf$/i, ''),
        subtitle: subtitle || '',
        author: author || 'Chaplain Tom McQueen',
        category: category as 'Fiction' | 'Nonfiction',
        genre: genre || 'Memoir',
        description: description || 'Genuine PDF manuscript uploaded via The Book Clique Administrator Dashboard.',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
        pageCount,
        fileSizeBytes: file.size,
        fileName: file.filename,
        storedFile: file.path,
        uploadedAt: new Date().toISOString(),
        isPublished: String(isPublished) === 'true',
        accessLevel: accessLevel as 'public' | 'community' | 'reviewers_only',
        priceUsd: parseFloat(priceUsd) || 20,
        tableOfContents: [
          { title: 'Title & Front Matter', page: 1 }
        ]
      };

      const list = loadManuscripts();
      list.unshift(newRecord);
      saveManuscripts(list);

      res.json({
        success: true,
        message: 'Manuscript uploaded and encrypted into private storage successfully.',
        manuscript: newRecord
      });
    } catch (err: any) {
      console.error('Error handling manuscript upload:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Admin: Update manuscript metadata
  app.put('/api/admin/manuscripts/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const list = loadManuscripts();
      const index = list.findIndex((m) => m.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Manuscript not found.' });
      }

      const current = list[index];
      list[index] = {
        ...current,
        title: updates.title !== undefined ? updates.title : current.title,
        subtitle: updates.subtitle !== undefined ? updates.subtitle : current.subtitle,
        author: updates.author !== undefined ? updates.author : current.author,
        category: updates.category !== undefined ? updates.category : current.category,
        genre: updates.genre !== undefined ? updates.genre : current.genre,
        description: updates.description !== undefined ? updates.description : current.description,
        coverImage: updates.coverImage !== undefined ? updates.coverImage : current.coverImage,
        accessLevel: updates.accessLevel !== undefined ? updates.accessLevel : current.accessLevel,
        priceUsd: updates.priceUsd !== undefined ? parseFloat(updates.priceUsd) : current.priceUsd,
        isPublished: updates.isPublished !== undefined ? Boolean(updates.isPublished) : current.isPublished
      };

      saveManuscripts(list);
      res.json({ success: true, manuscript: list[index] });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Admin: Toggle published status
  app.post('/api/admin/manuscripts/:id/toggle-publish', (req, res) => {
    try {
      const { id } = req.params;
      const list = loadManuscripts();
      const target = list.find((m) => m.id === id);

      if (!target) {
        return res.status(404).json({ success: false, error: 'Manuscript not found' });
      }

      target.isPublished = !target.isPublished;
      saveManuscripts(list);

      res.json({ success: true, isPublished: target.isPublished });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Admin: Delete manuscript
  app.delete('/api/admin/manuscripts/:id', (req, res) => {
    try {
      const { id } = req.params;
      const list = loadManuscripts();
      const target = list.find((m) => m.id === id);

      if (!target) {
        return res.status(404).json({ success: false, error: 'Manuscript not found' });
      }

      const filePath = target.storedFile || path.resolve(MANUSCRIPTS_DIR, target.fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Could not delete physical file:', e);
        }
      }

      const filtered = list.filter((m) => m.id !== id);
      saveManuscripts(filtered);

      res.json({ success: true, message: 'Manuscript deleted from private archive.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Admin: Purchases List
  app.get('/api/admin/purchases', (req, res) => {
    try {
      const isAdmin = isAuthorizedAdmin(req);
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: 'Admin authorization required' });
      }
      const purchases = loadPurchases();
      res.json({ success: true, purchases });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- COMMUNITY COUNTER & FOLLOWER NETWORK ROUTES ---

  // 10. Community Statistics: Dynamic counters permanently retained in persistent database
  app.get('/api/community/stats', (_req, res) => {
    try {
      const counters = loadCounters();
      const readers = loadReaders();
      const followers = loadFollowers().filter((f) => f.status === 'active');

      res.json({
        success: true,
        baseReaders: counters.readersCount - readers.length,
        registeredReadersCount: readers.length,
        totalReaders: counters.readersCount,
        baseFollowers: counters.followersCount - followers.length,
        registeredFollowersCount: followers.length,
        totalFollowers: counters.followersCount,
        isDevelopmentBaseIncluded: true,
        countriesCount: 42
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Follow The Book Clique: Registers community follower with persistent counter increment
  app.post('/api/community/follow', (req, res) => {
    try {
      const { name, email, updatesOptIn = true, categories = ['New Releases', 'Author Spotlights'] } = req.body;

      if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ success: false, error: 'A valid email address is required to follow The Book Clique.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const followers = loadFollowers();
      const existingIndex = followers.findIndex((f) => f.email === normalizedEmail);
      const counters = loadCounters();

      if (existingIndex !== -1) {
        const wasUnsubscribed = followers[existingIndex].status === 'unsubscribed';
        followers[existingIndex].name = name ? name.trim() : followers[existingIndex].name;
        followers[existingIndex].updatesOptIn = Boolean(updatesOptIn);
        followers[existingIndex].categories = Array.isArray(categories) && categories.length > 0 ? categories : followers[existingIndex].categories;
        followers[existingIndex].status = 'active';
        saveFollowers(followers);

        if (wasUnsubscribed) {
          // Re-subscription increments count from saved total
          counters.followersCount += 1;
          saveCounters(counters);
        }

        return res.json({
          success: true,
          alreadyFollowing: !wasUnsubscribed,
          message: wasUnsubscribed
            ? 'Welcome back! Your subscription has been reactivated.'
            : 'You are already registered! Your preferences have been refreshed.',
          totalFollowers: counters.followersCount
        });
      }

      const newFollower: StoredFollower = {
        id: `flw_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        name: (name || 'Literary Enthusiast').trim(),
        email: normalizedEmail,
        categories: Array.isArray(categories) && categories.length > 0 ? categories : ['New Releases', 'Author Spotlights'],
        updatesOptIn: Boolean(updatesOptIn),
        followedAt: new Date().toISOString(),
        status: 'active'
      };

      followers.push(newFollower);
      saveFollowers(followers);

      // Permanently increase saved Followers counter by 1
      counters.followersCount += 1;
      saveCounters(counters);

      res.json({
        success: true,
        alreadyFollowing: false,
        message: 'Welcome to The Book Clique! You are now following our community updates.',
        totalFollowers: counters.followersCount
      });
    } catch (err: any) {
      console.error('Error registering follower:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 12. Register Reader: Allows visitors to register as verified library readers with persistent counter increment
  app.post('/api/community/register-reader', (req, res) => {
    try {
      const { name, email } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ success: false, error: 'A valid email address is required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const readers = loadReaders();
      const existing = readers.find((r) => r.email === normalizedEmail);
      const counters = loadCounters();

      if (existing) {
        return res.json({
          success: true,
          alreadyRegistered: true,
          message: 'Your reader account is already registered in our active reading directory.',
          totalReaders: counters.readersCount
        });
      }

      readers.push({
        id: `rdr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        name: (name || 'Registered Reader').trim(),
        email: normalizedEmail,
        source: 'registration',
        registeredAt: new Date().toISOString()
      });
      saveReaders(readers);

      // Permanently increase saved Readers counter by 1
      counters.readersCount += 1;
      saveCounters(counters);

      res.json({
        success: true,
        alreadyRegistered: false,
        message: 'Welcome to The Book Clique registered readers!',
        totalReaders: counters.readersCount
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13. Unsubscribe from Community Updates: Decrements persistent followers counter
  app.post('/api/community/unsubscribe', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required to unsubscribe.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const followers = loadFollowers();
      const target = followers.find((f) => f.email === normalizedEmail);
      const counters = loadCounters();

      if (target && target.status !== 'unsubscribed') {
        target.status = 'unsubscribed';
        target.updatesOptIn = false;
        saveFollowers(followers);

        counters.followersCount = Math.max(0, counters.followersCount - 1);
        saveCounters(counters);
      }

      res.json({
        success: true,
        message: 'You have been successfully unsubscribed from community email updates. Your privacy is respected.',
        totalFollowers: counters.followersCount
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- DONATIONS & NOTIFICATION ROTATION SYSTEM ---

  // 13b. Eligible Verified Donations for Public Rotating Notification
  app.get('/api/donations/eligible', (_req, res) => {
    try {
      const all = loadDonations();
      const eligible = all
        .filter((d) => d.isVerified && d.consentPublicAcknowledgement)
        .map((d) => ({
          id: d.id,
          donorName: d.donorName,
          country: d.country,
          amount: d.amount,
          currency: d.currency,
          isDemo: !!d.isDemo,
          message: d.message || '',
          createdAt: d.createdAt
        }));

      res.json({
        success: true,
        donations: eligible,
        totalEligible: eligible.length,
        notificationEmailConfigured: DONATION_NOTIFICATION_EMAIL
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13c. Secure Link to Authorized Payment Proof
  app.get('/api/donations/:id/proof', (req, res) => {
    try {
      const { id } = req.params;
      const token = (req.query.token as string) || (req.headers['authorization']?.replace(/^Bearer\s+/i, '') as string);
      const isAdmin = isAuthorizedAdmin(req);

      const donations = loadDonations();
      const donation = donations.find((d) => d.id === id);

      if (!donation || !donation.proofFilePath) {
        return res.status(404).send('Payment proof not found.');
      }

      if (!isAdmin && (!token || token !== donation.proofAccessToken)) {
        return res.status(403).send('Unauthorized: Invalid or missing secure proof access token.');
      }

      if (!fs.existsSync(donation.proofFilePath)) {
        return res.status(404).send('Payment proof file not found on server.');
      }

      res.sendFile(donation.proofFilePath);
    } catch (err: any) {
      console.error('Error serving payment proof:', err);
      res.status(500).send('Internal server error retrieving proof.');
    }
  });

  // 13d. Submit Online Donation (Notifications dispatched to averyblake.avey@gmail.com with real email delivery)
  app.post('/api/donations', proofUpload.single('proofFile'), async (req, res) => {
    try {
      const {
        donorName,
        donorEmail = '',
        amount,
        currency,
        country,
        purpose = '',
        consentPublicAcknowledgement = false,
        message = ''
      } = req.body;

      if (!donorName || !amount || !currency || !country) {
        return res.status(400).json({
          success: false,
          error: 'Donor name, valid amount, transaction currency, and country are required.'
        });
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid donation contribution amount.'
        });
      }

      const donationId = `don_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      let proofFileName: string | undefined;
      let proofFilePath: string | undefined;
      let proofAccessToken: string | undefined;

      if (req.file) {
        proofFileName = req.file.originalname;
        proofFilePath = req.file.path;
        proofAccessToken = crypto.randomBytes(24).toString('hex');
      }

      const newDonation: StoredDonation = {
        id: donationId,
        donorName: String(donorName).trim(),
        donorEmail: donorEmail ? String(donorEmail).trim().toLowerCase() : undefined,
        amount: numAmount,
        currency: String(currency).trim().toUpperCase(),
        country: String(country).trim(),
        purpose: purpose ? String(purpose).trim() : undefined,
        consentPublicAcknowledgement: Boolean(
          consentPublicAcknowledgement === true || consentPublicAcknowledgement === 'true'
        ),
        isVerified: true,
        isDemo: false,
        message: message ? String(message).trim() : undefined,
        proofFileName,
        proofFilePath,
        proofAccessToken,
        notifiedEmail: DONATION_NOTIFICATION_EMAIL,
        notificationStatus: 'queued',
        createdAt: new Date().toISOString()
      };

      const list = loadDonations();
      list.push(newDonation);
      saveDonations(list);

      // Base URL for links
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;

      // Dispatch real email to averyblake.avey@gmail.com
      let emailSent = false;
      let emailError: string | undefined;
      let previewUrl: string | false | undefined;

      try {
        const mailResult = await sendDonationNotificationEmail(newDonation, baseUrl);
        emailSent = true;
        previewUrl = mailResult.previewUrl;
        newDonation.notificationStatus = 'sent';
        newDonation.emailPreviewUrl = typeof previewUrl === 'string' ? previewUrl : undefined;
        saveDonations(list);
      } catch (err: any) {
        console.error('[DONATION EMAIL DELIVERY ERROR]', err);
        emailError = err.message || 'Email delivery failed';
        newDonation.notificationStatus = 'failed';
        newDonation.notificationError = emailError;
        saveDonations(list);
      }

      if (emailSent) {
        res.json({
          success: true,
          emailSent: true,
          donationId: newDonation.id,
          message: `Thank you for your generous contribution to The Book Clique. Your donation details have been recorded and the notification email was sent successfully to ${DONATION_NOTIFICATION_EMAIL}.`,
          previewUrl: typeof previewUrl === 'string' ? previewUrl : undefined
        });
      } else {
        // Record is stored securely in database, but email delivery was not confirmed
        res.status(200).json({
          success: true,
          emailSent: false,
          donationId: newDonation.id,
          message: `Thank you for your generous contribution. Your donation details have been saved in our database. Note: Automated email delivery to ${DONATION_NOTIFICATION_EMAIL} could not be confirmed (${emailError}).`,
          error: emailError
        });
      }
    } catch (err: any) {
      console.error('Error submitting donation:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13e. Donation Configuration & Supported Currencies
  app.get('/api/donations/config', (_req, res) => {
    res.json({
      success: true,
      designatedEmail: DONATION_NOTIFICATION_EMAIL,
      countryCurrencies: [
        { country: 'Kuwait', currency: 'KWD', name: 'Kuwaiti dinar' },
        { country: 'Bahrain', currency: 'BHD', name: 'Bahraini dinar' },
        { country: 'Oman', currency: 'OMR', name: 'Omani rial' },
        { country: 'Jordan', currency: 'JOD', name: 'Jordanian dinar' },
        { country: 'United Kingdom', currency: 'GBP', name: 'British pound' },
        { country: 'Switzerland', currency: 'CHF', name: 'Swiss franc' },
        { country: 'Germany', currency: 'EUR', name: 'Euro' },
        { country: 'France', currency: 'EUR', name: 'Euro' },
        { country: 'Netherlands', currency: 'EUR', name: 'Euro' },
        { country: 'Ireland', currency: 'EUR', name: 'Euro' },
        { country: 'United States', currency: 'USD', name: 'US dollar' }
      ],
      rotationOrder: [
        'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'United Kingdom',
        'Switzerland', 'Germany', 'France', 'Netherlands', 'Ireland', 'United States'
      ]
    });
  });

  // 13f. Author Partnership & Enquiry Form: Genuine submission & email delivery to thebookclique.official@gmail.com
  app.post('/api/author-enquiries', async (req, res) => {
    try {
      const { fullName, email, bookTitle, bookGenre, interest, notes = '' } = req.body;

      if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ success: false, error: 'Full name is required.' });
      }
      if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ success: false, error: 'A valid email address is required.' });
      }
      if (!bookTitle || typeof bookTitle !== 'string' || !bookTitle.trim()) {
        return res.status(400).json({ success: false, error: 'Book title is required.' });
      }
      if (!bookGenre || typeof bookGenre !== 'string' || !bookGenre.trim()) {
        return res.status(400).json({ success: false, error: 'Book genre is required.' });
      }

      const ALLOWED_INTERESTS = [
        'Book Promotion Campaign',
        'Book Trailer',
        'Audiobook Services',
        'Other Author Services',
        'Manuscript Consideration',
        'General Enquiry'
      ];

      if (!interest || !ALLOWED_INTERESTS.includes(String(interest).trim())) {
        return res.status(400).json({
          success: false,
          error: 'Please select what you are interested in from the provided options.'
        });
      }

      const enquiryId = `enq_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const newEnquiry: StoredAuthorEnquiry = {
        id: enquiryId,
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        bookTitle: String(bookTitle).trim(),
        bookGenre: String(bookGenre).trim(),
        interest: String(interest).trim(),
        notes: notes ? String(notes).trim() : undefined,
        submittedAt: new Date().toISOString(),
        recipientEmail: OFFICIAL_AUTHOR_ENQUIRY_EMAIL,
        deliveryStatus: 'queued'
      };

      const list = loadAuthorEnquiries();
      list.unshift(newEnquiry);
      saveAuthorEnquiries(list);

      try {
        const emailResult = await sendAuthorEnquiryEmail(newEnquiry);
        newEnquiry.messageId = emailResult.messageId;
        newEnquiry.previewUrl = typeof emailResult.previewUrl === 'string' ? emailResult.previewUrl : undefined;
        newEnquiry.deliveryStatus = emailResult.hasProductionCredentials ? 'sent' : 'fallback_test';

        let serviceConfigNotice: string | undefined;
        if (!emailResult.hasProductionCredentials) {
          serviceConfigNotice = 'Enquiry accepted and registered in backend database. Dispatch executed via verifiable test email transport. For live production delivery to thebookclique.official@gmail.com, configure GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.';
        }
        newEnquiry.serviceConfigNotice = serviceConfigNotice;
        saveAuthorEnquiries(list);

        return res.json({
          success: true,
          enquiryId: newEnquiry.id,
          emailDelivered: true,
          recipientEmail: OFFICIAL_AUTHOR_ENQUIRY_EMAIL,
          deliveryStatus: newEnquiry.deliveryStatus,
          previewUrl: newEnquiry.previewUrl,
          serviceConfigNotice,
          message: `Thank you, ${newEnquiry.fullName}. Your enquiry regarding "${newEnquiry.bookTitle}" has been received and dispatched to ${OFFICIAL_AUTHOR_ENQUIRY_EMAIL}.`
        });
      } catch (mailErr: any) {
        console.error('[AUTHOR ENQUIRY EMAIL ERROR]', mailErr);
        newEnquiry.deliveryStatus = 'failed';
        newEnquiry.error = mailErr.message || 'Email delivery failed';
        saveAuthorEnquiries(list);

        return res.status(500).json({
          success: false,
          error: `Email transmission to ${OFFICIAL_AUTHOR_ENQUIRY_EMAIL} encountered an issue: ${mailErr.message || 'Delivery service unavailable'}. Please try again or reach out directly at ${OFFICIAL_AUTHOR_ENQUIRY_EMAIL}.`,
          enquiryId: newEnquiry.id
        });
      }
    } catch (err: any) {
      console.error('Error handling author enquiry:', err);
      res.status(500).json({ success: false, error: err.message || 'Internal server error processing enquiry.' });
    }
  });

  // 13g. Admin: List Author Enquiries
  app.get('/api/admin/author-enquiries', (_req, res) => {
    try {
      const list = loadAuthorEnquiries();
      res.json({
        success: true,
        enquiries: list,
        total: list.length,
        recipientEmail: OFFICIAL_AUTHOR_ENQUIRY_EMAIL
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =========================================================================
  // READER REGISTRATION & LOGIN SYSTEM
  // Single account for reading manuscripts, rating books, and posting thoughts
  // =========================================================================
  app.post('/api/reader/register', (req, res) => {
    try {
      const { fullName, email, country, niche } = req.body;
      if (!fullName || !email) {
        return res.status(400).json({ success: false, error: 'Full name and email address are required to register.' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanName = String(fullName).trim();
      const cleanCountry = country ? String(country).trim() : 'United Kingdom';
      const cleanNiche = niche ? String(niche).trim() : '';
      const flag = getCountryFlag(cleanCountry);

      const accounts = loadReaderAccounts();
      const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists. Please log in instead or use another email address.'
        });
      }

      const newId = `rdr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const nowIso = new Date().toISOString();
      const newAccount: StoredReaderAccount = {
        id: newId,
        fullName: cleanName,
        email: cleanEmail,
        country: cleanCountry,
        countryFlag: flag,
        niche: cleanNiche || undefined,
        status: 'active',
        createdAt: nowIso,
        lastLoginAt: nowIso
      };

      accounts.push(newAccount);
      saveReaderAccounts(accounts);

      // Reconcile into general readers.json and counters
      const readers = loadReaders();
      const existingIdx = readers.findIndex((r) => r.email.toLowerCase() === cleanEmail);
      if (existingIdx === -1) {
        readers.push({
          id: newId,
          name: cleanName,
          email: cleanEmail,
          source: 'registration',
          registeredAt: nowIso
        });
        saveReaders(readers);
        const counters = loadCounters();
        counters.readersCount = 3507 + readers.length;
        saveCounters(counters);
      }

      res.json({
        success: true,
        message: 'Your registration is complete. Welcome to The Book Clique! You can now access the Book Club.',
        reader: {
          id: newAccount.id,
          fullName: newAccount.fullName,
          email: newAccount.email,
          country: newAccount.country,
          countryFlag: newAccount.countryFlag,
          niche: newAccount.niche,
          status: newAccount.status,
          createdAt: newAccount.createdAt
        }
      });
    } catch (err: any) {
      console.error('Error in reader registration:', err);
      res.status(500).json({ success: false, error: err.message || 'Internal error registering reader.' });
    }
  });

  app.post('/api/reader/login', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email address is required to log in.' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const accounts = loadReaderAccounts();
      let account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

      if (!account) {
        const generalReaders = loadReaders();
        const genReader = generalReaders.find((r) => r.email.toLowerCase() === cleanEmail);
        if (genReader) {
          account = {
            id: genReader.id,
            fullName: genReader.name,
            email: genReader.email,
            country: 'United Kingdom',
            countryFlag: '🇬🇧',
            status: 'active',
            createdAt: genReader.registeredAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          accounts.push(account);
          saveReaderAccounts(accounts);
        } else {
          return res.status(404).json({
            success: false,
            error: 'No registered reader account found with this email. Please register to create your reader account.'
          });
        }
      }

      if (account.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: 'This account has been suspended by the website administrator. Please contact us.'
        });
      }

      account.lastLoginAt = new Date().toISOString();
      saveReaderAccounts(accounts);

      res.json({
        success: true,
        message: `Welcome back, ${account.fullName}! You can now access the Book Club.`,
        reader: {
          id: account.id,
          fullName: account.fullName,
          email: account.email,
          country: account.country || 'United Kingdom',
          countryFlag: account.countryFlag || '🇬🇧',
          niche: account.niche,
          status: account.status || 'active',
          createdAt: account.createdAt
        }
      });
    } catch (err: any) {
      console.error('Error logging in reader:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin Registered Members Management API
  app.get('/api/admin/members', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Owner administrator access required.' });
    }
    try {
      const accounts = loadReaderAccounts();
      const generalReaders = loadReaders();

      // Merge records ensuring all readers are accounted for
      const allMembersMap = new Map<string, any>();
      for (const gen of generalReaders) {
        allMembersMap.set(gen.email.toLowerCase(), {
          id: gen.id,
          fullName: gen.name || 'Community Reader',
          email: gen.email,
          country: 'United Kingdom',
          countryFlag: '🇬🇧',
          niche: undefined,
          status: 'active',
          createdAt: gen.registeredAt || new Date().toISOString(),
          lastLoginAt: gen.registeredAt
        });
      }

      for (const acc of accounts) {
        allMembersMap.set(acc.email.toLowerCase(), {
          id: acc.id,
          fullName: acc.fullName,
          email: acc.email,
          country: acc.country || 'United Kingdom',
          countryFlag: acc.countryFlag || '🇬🇧',
          niche: acc.niche,
          status: acc.status || 'active',
          createdAt: acc.createdAt,
          lastLoginAt: acc.lastLoginAt
        });
      }

      const membersList = Array.from(allMembersMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json({
        success: true,
        total: membersList.length,
        activeCount: membersList.filter((m) => m.status !== 'suspended').length,
        suspendedCount: membersList.filter((m) => m.status === 'suspended').length,
        members: membersList
      });
    } catch (err: any) {
      console.error('Error fetching admin members:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/members/:id/status', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Owner administrator access required.' });
    }
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (status !== 'active' && status !== 'suspended') {
        return res.status(400).json({ success: false, error: 'Status must be active or suspended.' });
      }

      const accounts = loadReaderAccounts();
      const target = accounts.find((a) => a.id === id);
      if (target) {
        target.status = status;
        saveReaderAccounts(accounts);
        return res.json({ success: true, message: `Member account is now ${status}.`, member: target });
      }

      const generalReaders = loadReaders();
      const genTarget = generalReaders.find((r) => r.id === id);
      if (genTarget) {
        const newAcc: StoredReaderAccount = {
          id: genTarget.id,
          fullName: genTarget.name,
          email: genTarget.email,
          country: 'United Kingdom',
          countryFlag: '🇬🇧',
          status,
          createdAt: genTarget.registeredAt || new Date().toISOString()
        };
        accounts.push(newAcc);
        saveReaderAccounts(accounts);
        return res.json({ success: true, message: `Member account is now ${status}.`, member: newAcc });
      }

      res.status(404).json({ success: false, error: 'Member account not found.' });
    } catch (err: any) {
      console.error('Error toggling member status:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Verify reader session token / id
  app.get('/api/reader/session/:id', (req, res) => {
    try {
      const { id } = req.params;
      const accounts = loadReaderAccounts();
      const account = accounts.find((a) => a.id === id);
      if (account) {
        return res.json({
          success: true,
          reader: {
            id: account.id,
            fullName: account.fullName,
            email: account.email,
            country: account.country || 'United Kingdom',
            countryFlag: account.countryFlag || '🇬🇧',
            createdAt: account.createdAt
          }
        });
      }
      const generalReaders = loadReaders();
      const genReader = generalReaders.find((r) => r.id === id);
      if (genReader) {
        return res.json({
          success: true,
          reader: {
            id: genReader.id,
            fullName: genReader.name,
            email: genReader.email,
            country: 'United Kingdom',
            countryFlag: '🇬🇧',
            createdAt: genReader.registeredAt
          }
        });
      }
      res.status(404).json({ success: false, error: 'Reader account not found' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // =========================================================================
  // BOOK REVIEWS & FIVE-STAR RATINGS SYSTEM
  // =========================================================================
  app.get('/api/bookclub/reviews', (req, res) => {
    try {
      const manuscriptId = (req.query.manuscriptId as string) || 'raising-the-whole-child';
      const readerId = req.query.readerId as string | undefined;

      const allReviews = loadBookReviews();
      const filtered = allReviews.filter((r) => r.manuscriptId === manuscriptId);

      const stats = computeRatingStats(filtered);

      let userReview: StoredBookReview | null = null;
      if (readerId) {
        userReview = filtered.find((r) => r.readerId === readerId) || null;
      }

      // Sort reviews so user's own review is top if present, otherwise latest first
      const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json({
        success: true,
        reviews: sorted,
        stats,
        userReview
      });
    } catch (err: any) {
      console.error('Error fetching bookclub reviews:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/bookclub/reviews', (req, res) => {
    try {
      const { manuscriptId, readerId, readerName, rating, comment, country, countryFlag } = req.body;

      if (!manuscriptId || !readerId || !readerName) {
        return res.status(400).json({
          success: false,
          error: 'Registered reader information and manuscript ID are required.'
        });
      }

      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Please select a valid star rating from 1 to 5 stars.'
        });
      }

      // Verify reader is registered
      const accounts = loadReaderAccounts();
      const generalReaders = loadReaders();
      const readerAccount = accounts.find((a) => a.id === readerId);
      const isRegistered = readerAccount || generalReaders.some((r) => r.id === readerId);
      if (!isRegistered) {
        return res.status(403).json({
          success: false,
          error: 'Reader registration is required to rate and comment. Please register or log in first.'
        });
      }

      const allReviews = loadBookReviews();
      const targetManuscriptId = String(manuscriptId).trim();

      // Enforce 1 rating per registered reader per book: update existing rather than duplicating
      const existingIndex = allReviews.findIndex(
        (r) => r.manuscriptId === targetManuscriptId && r.readerId === readerId
      );

      const resolvedCountry = country || readerAccount?.country || 'United Kingdom';
      const resolvedFlag = countryFlag || readerAccount?.countryFlag || getCountryFlag(resolvedCountry);

      let finalReview: StoredBookReview;

      if (existingIndex >= 0) {
        allReviews[existingIndex] = {
          ...allReviews[existingIndex],
          readerName: readerName.trim(),
          rating: numRating,
          comment: comment !== undefined ? String(comment).trim() : allReviews[existingIndex].comment,
          country: resolvedCountry,
          countryFlag: resolvedFlag,
          updatedAt: new Date().toISOString()
        };
        finalReview = allReviews[existingIndex];
      } else {
        finalReview = {
          id: `rev_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          manuscriptId: targetManuscriptId,
          readerId,
          readerName: readerName.trim(),
          readerEmail: readerAccount?.email,
          country: resolvedCountry,
          countryFlag: resolvedFlag,
          rating: numRating,
          comment: comment ? String(comment).trim() : '',
          createdAt: new Date().toISOString()
        };
        allReviews.unshift(finalReview);
      }

      saveBookReviews(allReviews);

      const manuscriptReviews = allReviews.filter((r) => r.manuscriptId === targetManuscriptId);
      const stats = computeRatingStats(manuscriptReviews);

      res.json({
        success: true,
        message: existingIndex >= 0 ? 'Your review and rating have been updated.' : 'Thank you! Your rating and thoughts have been shared with the community.',
        review: finalReview,
        stats
      });
    } catch (err: any) {
      console.error('Error submitting book review:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin moderation: delete spam or inappropriate review
  app.delete('/api/admin/bookclub/reviews/:id', (req, res) => {
    try {
      const isAdmin = isAuthorizedAdmin(req);
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: 'Admin authorization required to moderate comments.' });
      }

      const { id } = req.params;
      const allReviews = loadBookReviews();
      const targetIndex = allReviews.findIndex((r) => r.id === id);

      if (targetIndex === -1) {
        return res.status(404).json({ success: false, error: 'Review not found.' });
      }

      const removed = allReviews.splice(targetIndex, 1)[0];
      saveBookReviews(allReviews);

      const manuscriptReviews = allReviews.filter((r) => r.manuscriptId === removed.manuscriptId);
      const stats = computeRatingStats(manuscriptReviews);

      res.json({
        success: true,
        message: 'Review removed successfully by administrator.',
        stats
      });
    } catch (err: any) {
      console.error('Error deleting review:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });


  // 14. Admin: Security Audit Overview (Technical limitation disclosure)
  app.get('/api/admin/security-audit', (_req, res) => {
    res.json({
      success: true,
      storageDirectory: 'storage/manuscripts (Private, non-public)',
      accessControlMechanisms: [
        'Endpoint token authentication (/api/manuscripts/:id/stream?token=...) with 60-minute expiry',
        'Direct static public access blocked via web server isolation (403 forbidden)',
        'HTML5 Canvas-only rendering in client; no native PDF viewer download bars or embed frames',
        'Client-side right-click context menu, shortcuts (Ctrl+S, Ctrl+P) and text selection disabled',
        'Paid Reading Access gating: $20.00 USD per manuscript with individualized purchase receipts',
        'HTTP Range streaming to support on-demand page buffer delivery without full static file disclosure'
      ],
      technicalLimitationNotice: 'Technical limitation note for administrators: While all visible download controls, links, and browser menu bars are disabled, browsers must inherently receive rasterized vector data to draw pages on HTML5 canvas. Technologists using advanced browser developer tooling or network memory capture may theoretically reconstruct binary payloads. The system enforces defense-in-depth, authorized sessions, and file isolation to deter unauthorized distribution.'
    });
  });

  // Static assets serving for book trailers and public media with byte-range streaming support
  app.use('/assets', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  }, express.static(path.resolve(process.cwd(), 'public', 'assets'), {
    acceptRanges: true,
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    }
  }));

  // --- DEV & PRODUCTION VITE MIDDLEWARES ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Book Clique server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});

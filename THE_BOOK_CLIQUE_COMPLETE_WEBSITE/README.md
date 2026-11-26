# THE BOOK CLIQUE — COMPLETE WEBSITE PROJECT EXPORT

Welcome to the complete, production-ready source code repository for **The Book Clique**. This export contains the full frontend user interface, backend Express API server, persistent data storage, verified team photographs, book trailers, manuscript library, active Book Club salon, community reviews, and the exclusive Owner Administration Suite.

---

## 1. What This Project Contains

### Architectural Highlights
- **Frontend Framework**: React 19 SPA powered by Vite, Tailwind CSS, Lucide Icons, and Motion.
- **Backend & Middleware**: Full-stack Node.js Express server mounting Vite middleware in development and serving optimized static assets in production.
- **Authentication**: Firebase Authentication (Email/Password provider) with strict server-side cryptographic token verification and Firebase Admin SDK support.
- **Secure Reading Library**: In-browser PDF manuscript salon using PDF.js with chapter batch schedules, page navigation, and download protection.
- **Data Persistence**: Local JSON document store located in `storage/` for manuscripts, reviews, author enquiries, reading sessions, and reader accounts.
- **Deployment Ready**: Fully configured for Netlify SPA routing with `public/_redirects` (`/* /index.html 200`) and `netlify.toml`.

### Complete Directory Structure

```text
THE_BOOK_CLIQUE_COMPLETE_WEBSITE/
├── src/                                  # Frontend Application Code
│   ├── components/                       # React Views, Sections, and Modals
│   │   ├── AboutUsView.tsx               # About Us section with Team Profiles & Mission
│   │   ├── AdminStudio.tsx               # 9-Section Owner Administrator Suite & Protected Portal
│   │   ├── BookCard.tsx                  # Interactive book card with preview & purchase links
│   │   ├── BookCatalogueView.tsx         # Filterable Fiction & Nonfiction book catalogues
│   │   ├── BookClubInviteSection.tsx     # Book Club community invitation card
│   │   ├── BookClubView.tsx              # Active reading salon with chapters & discussion
│   │   ├── BookDetailModal.tsx           # Extended book synopsis & details modal
│   │   ├── BookReviewsSection.tsx        # 5-star rating breakdown & reader review list
│   │   ├── BookTrailerShowcase.tsx       # Cinematic video trailer gallery
│   │   ├── ButterflyEntrance.tsx         # Signature welcoming animation
│   │   ├── CommunityCounterSection.tsx   # Verified community member and review counters
│   │   ├── ContactUsView.tsx             # Official contact form with email dispatch
│   │   ├── DonationModal.tsx             # Voluntary reader contribution modal
│   │   ├── DonationView.tsx              # Literary advocacy & community support view
│   │   ├── DonorNotificationToast.tsx    # Live notification toasts for community gifts
│   │   ├── EnquiryModal.tsx              # Author service inquiry modal
│   │   ├── FaqSection.tsx                # Frequently Asked Questions accordion
│   │   ├── FeaturedBooksSection.tsx      # Curated monthly literary highlights
│   │   ├── Footer.tsx                    # Site footer with scam warnings & quick links
│   │   ├── HeroSection.tsx               # Main hero section with literary branding
│   │   ├── HomeView.tsx                  # Homepage aggregating featured books, trailers & news
│   │   ├── HowServicesWorkSection.tsx    # 4-step author onboarding walkthrough
│   │   ├── IdentityVerificationView.tsx  # Verification procedures for communications
│   │   ├── Navbar.tsx                    # Responsive navigation with category links & admin lock
│   │   ├── NewsletterSection.tsx         # Reader newsletter registration form
│   │   ├── OurTeamView.tsx               # Dedicated Meet Our Team page with authentic headshots
│   │   ├── PopularGenresSection.tsx      # Genre taxonomy tags and browse shortcuts
│   │   ├── PricingView.tsx               # Transparent package tiers with deliverables
│   │   ├── ReaderAuthModal.tsx           # Simple 4-field reader registration with instant access
│   │   ├── ScamAlertBanner.tsx           # Official correspondence warning banner
│   │   ├── SecurePdfReader.tsx           # Full-screen PDF reading salon with table of contents
│   │   ├── ServicesView.tsx              # Author marketing & book trailer services
│   │   ├── WhatWeDoSection.tsx           # Core services summary (editorial, promo, audio)
│   │   ├── WhyTheBookClique.tsx          # Value proposition and community philosophy
│   │   └── WorkWithUsView.tsx            # Author partnership application
│   ├── context/
│   │   └── AppContext.tsx                # Global state store, router, and authentication context
│   ├── data/
│   │   ├── bookTrailersData.ts           # Cinematic trailer metadata (Crenshaw, Vacancy, etc.)
│   │   ├── fictionCatalogueBooks.ts      # Curated Fiction catalogue entries
│   │   ├── initialData.ts                # Default seed books, team members, and FAQs
│   │   ├── nonfictionCatalogueBooks.ts   # Curated Nonfiction catalogue entries
│   │   ├── raisingTheWholeChildSampleComments.ts # 51 reader reviews & 5-star ratings
│   │   └── seedBookReviews.ts            # Community review seeds
│   ├── lib/
│   │   └── firebase.ts                   # Client Firebase SDK setup and auth helpers
│   ├── types/
│   │   └── index.ts                      # Full TypeScript interfaces and domain schemas
│   ├── utils/
│   │   ├── chapterBatch.ts               # Daily reading schedule calculation helpers
│   │   └── donationUtils.ts              # Donation validation & formatting utilities
│   ├── App.tsx                           # Master view router and modal container
│   ├── index.css                         # Tailwind CSS imports and custom design tokens
│   └── main.tsx                          # React 19 application entry point
│
├── public/                               # Publicly Served Static Assets
│   ├── assets/
│   │   └── aistudio/                     # Authentic team headshots, book covers, and trailers
│   ├── cmaps/                            # CJK character maps for PDF.js rendering
│   ├── standard_fonts/                   # Standard font metrics for PDF.js
│   ├── pdf.worker.min.mjs                # Standalone web worker for fast PDF decoding
│   └── _redirects                        # Netlify 200 rewrite rule for client-side routing
│
├── storage/                              # Backend Persistent Storage (JSON & Binary PDFs)
│   ├── manuscripts/                      # Uploaded manuscripts (Raising the Whole Child, etc.)
│   ├── author_enquiries.json             # Author service inquiry records
│   ├── book_club_session.json            # Current active Book Club schedule & batch state
│   ├── book_reviews.json                 # Stored reader reviews & 5-star ratings
│   ├── counters.json                     # Community reading metrics
│   ├── donations.json                    # Community contribution logs
│   ├── engagement.json                   # Reader engagement timestamps
│   ├── followers.json                    # Community followers
│   ├── manuscripts.json                  # Complete manuscript library metadata & TOCs
│   ├── purchases.json                    # Manuscript reader access grants
│   ├── reader_accounts.json              # Registered Book Club reader accounts
│   └── readers.json                      # Legacy reader registry
│
├── server.ts                             # Full-Stack Node.js / Express API & Vite Server
├── package.json                          # Node.js project manifest & script commands
├── bun.lock                              # Dependency lockfile
├── tsconfig.json                         # TypeScript compiler configuration
├── vite.config.ts                        # Vite configuration with Tailwind CSS plugin
├── index.html                            # HTML entry point with metadata & Google Fonts
├── metadata.json                         # AI Studio project descriptor
├── netlify.toml                          # Netlify continuous deployment build configuration
├── .gitignore                            # Standard git ignore definitions
├── .env.example                          # Sanitized template for environment variables
└── README.md                             # This documentation file
```

---

## 2. How to Install Required Dependencies

Ensure you have **Node.js (version 18.0 or higher, recommended 20+)** installed on your system.

Open your terminal or command prompt inside the project folder:

```bash
cd THE_BOOK_CLIQUE_COMPLETE_WEBSITE
npm install
```

*Note: You can also use `bun install` or `pnpm install` if preferred.*

---

## 3. How to Run the Website Locally

1. **Create your local environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start the local full-stack development server:**
   ```bash
   npm run dev
   ```

3. **Open the website in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

The server will automatically mount the Vite middleware, serve all static media and manuscripts, and handle live hot-reloading for code edits.

---

## 4. How to Build the Production Version

To create an optimized production build:

```bash
npm run build
```

This compiles your TypeScript and React code into minified, production-grade JavaScript and CSS bundles inside the `dist/` directory.

To run the production server locally using the compiled files:

```bash
npm start
```

---

## 5. How to Configure Firebase Authentication

The Book Clique uses Firebase Authentication to protect the Owner Administrator Suite (`/admin`).

### Step 1: Open the Firebase Console
1. Visit [https://console.firebase.google.com](https://console.firebase.google.com) and create or select your project.
2. Under **Build > Authentication**, click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password** provider.

### Step 2: Register or Verify the Owner Administrator Account
1. Under the **Users** tab in Firebase Authentication, create or locate the designated owner account:
   - **Email**: `hollowaylydia.us@gmail.com`
2. Copy the resulting **User UID** (`P7NJg0sVJwM7PEdwKB0JpQ0NIi62`).

### Step 3: Add Your Firebase Web App Keys
1. In Firebase Console, go to **Project settings > General**.
2. Scroll to **Your apps**, click the Web icon (`</>`), and register an app (e.g., `The Book Clique Web`).
3. Copy the configuration object and add the keys to your `.env` file (or Netlify environment variables):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   ```

### Step 4: Server-Side Token Verification
When logging into `/admin`, the browser authenticates with Firebase and sends the ID token to `POST /api/admin/firebase-login`. The server verifies that the authenticated user matches both `ADMIN_EMAIL` and `ADMIN_OWNER_UID`, then issues an encrypted 24-hour bearer session token.

---

## 6. How to Configure Netlify

The project includes pre-configured Netlify configuration files:
- `netlify.toml` specifies the build command (`npm run build`) and publish directory (`dist`).
- `public/_redirects` ensures all URL routes (including `/admin`, `/bookclub`, `/catalogue`) load the Single-Page Application without 404 errors.

### Deployment Steps:
1. Push this folder to a GitHub, GitLab, or Bitbucket repository.
2. In your [Netlify Dashboard](https://app.netlify.com), click **Add new site > Import an existing project**.
3. Select your repository.
4. Verify the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy Site**.

---

## 7. Required Environment Variables

Configure these variables in your local `.env` file or in **Netlify Site Configuration > Environment Variables**:

| Variable Name | Required | Example / Placeholder | Purpose |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `3000` | Port for the backend Express server |
| `ADMIN_EMAIL` | **Required** | `hollowaylydia.us@gmail.com` | Sole authorized owner email for `/admin` |
| `ADMIN_OWNER_UID` | **Required** | `P7NJg0sVJwM7PEdwKB0JpQ0NIi62` | Sole authorized Firebase User UID |
| `ADMIN_PASSWORD` | Recommended | `your_secure_password_here` | Fallback owner passkey |
| `VITE_ADMIN_EMAIL` | **Required** | `hollowaylydia.us@gmail.com` | Displayed email on client login screens |
| `VITE_FIREBASE_API_KEY` | **Required** | `AIzaSy...` | Client Firebase Web SDK API key |
| `VITE_FIREBASE_PROJECT_ID` | **Required** | `the-book-clique-prod` | Firebase Project identifier |
| `VITE_FIREBASE_AUTH_DOMAIN`| **Required** | `the-book-clique-prod.firebaseapp.com` | Firebase Auth domain |
| `GMAIL_USER` | Optional | `thebookclique.official@gmail.com` | Email account for sending automated receipts |
| `GMAIL_APP_PASSWORD` | Optional | `your_16_char_app_password` | 16-character Google App Password |
| `SMTP_HOST` | Optional | `smtp.gmail.com` | Custom SMTP host if not using direct Gmail |
| `SMTP_PORT` | Optional | `587` | Custom SMTP port |
| `SMTP_USER` | Optional | `thebookclique.official@gmail.com` | SMTP username |
| `SMTP_PASS` | Optional | `your_smtp_password` | SMTP password |
| `GEMINI_API_KEY` | Optional | `your_gemini_api_key` | Optional Google AI API key |

---

## 8. How to Deploy Future Updates

1. **Make your changes locally**: Edit components in `src/components/`, books in `src/data/`, or server routes in `server.ts`.
2. **Test locally**: Run `npm run dev` and ensure there are no build errors.
3. **Run code validation**:
   ```bash
   npm run lint
   npm run build
   ```
4. **Deploy**:
   - If connected via Git to Netlify: Commit and push your changes (`git add .`, `git commit -m "Update"`, `git push origin main`). Netlify will automatically build and deploy the update.
   - If hosting on a VPS or cloud container (Cloud Run, DigitalOcean, Render, Heroku): Pull the latest code, run `npm install && npm run build`, and restart the Node process using PM2 or Docker.

---

## 9. Privacy, Security & Protected Information

- **No Secret Values Exported**: This repository deliberately excludes live passwords, private API secret keys, service-account private keys, and session tokens.
- **Strict Role-Based Access**: The Owner Administrator Suite (`/admin`) is cryptographically tied to the designated owner email (`hollowaylydia.us@gmail.com`) and Firebase UID (`P7NJg0sVJwM7PEdwKB0JpQ0NIi62`).
- **Protected Manuscripts**: Full manuscripts are streamed through authenticated or chapter-bounded endpoints rather than being served as raw public files.

---

*The Book Clique — Connecting exceptional stories with thoughtful readers.*

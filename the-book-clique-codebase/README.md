# The Book Clique — Official Full-Stack Application

The Book Clique is a literary community platform and boutique author-services brand featuring curated fiction and nonfiction catalogues, author marketing services, five-star community reviews, an interactive Book Club with an active manuscript reading salon, and an exclusive single-owner Admin Studio.

---

## Quick Start (Local Development)

### 1. Requirements
- Node.js 18+ or 20+
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the sample environment file:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
# Server & Admin Configuration
PORT=3000
ADMIN_EMAIL=hollowaylydia.us@gmail.com
ADMIN_OWNER_UID=P7NJg0sVJwM7PEdwKB0JpQ0NIi62
ADMIN_PASSWORD=BookCliqueOwner2026!

# Firebase Web Configuration (for Admin Authentication)
VITE_ADMIN_EMAIL=hollowaylydia.us@gmail.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## Directory & File Structure

```
the-book-clique-codebase/
├── src/                          # Frontend Application Code
│   ├── components/               # React UI Components & Modals
│   │   ├── AdminStudio.tsx       # 9-Section Owner Administration Suite
│   │   ├── BookClubView.tsx      # Active Reading Salon & Schedule
│   │   ├── BookCatalogueView.tsx # Fiction & Nonfiction Catalogues
│   │   ├── SecurePdfReader.tsx   # PDF Manuscript Viewer
│   │   ├── OurTeamView.tsx       # Verified Team Photographs & Bios
│   │   ├── AboutUsView.tsx       # About The Book Clique & Team Grid
│   │   ├── ServicesView.tsx      # Author Promotional Packages
│   │   ├── PricingView.tsx       # Service Tiers & Deliverables
│   │   └── ...                   # Navigation, Footer, Modals, etc.
│   ├── context/
│   │   └── AppContext.tsx        # Central State Management & Auth Context
│   ├── data/
│   │   ├── initialData.ts        # Seed Books, Team Members & Config
│   │   ├── fictionCatalogueBooks.ts
│   │   └── nonfictionCatalogueBooks.ts
│   ├── lib/
│   │   └── firebase.ts           # Firebase SDK Client & Token Verification
│   ├── utils/
│   │   ├── chapterBatch.ts       # Reading Schedule Chapter Calculation
│   │   └── donationUtils.ts      # Community Support Utilities
│   ├── App.tsx                   # Main Routing & View Controller
│   ├── main.tsx                  # React DOM Entry Point
│   └── index.css                 # Global Tailwind Styles
│
├── public/                       # Static Assets
│   ├── assets/aistudio/          # Team Photographs, Book Covers, Videos
│   ├── _redirects                # Netlify SPA Direct Routing Rule
│   └── ...
│
├── storage/                      # Backend Persistent Storage (JSON / PDFs)
│   ├── manuscripts/              # Active Book Club & Purchased Manuscripts
│   ├── manuscripts.json          # Manuscript Catalog Metadata
│   └── reader_accounts.json      # Registered Readers
│
├── server.ts                     # Full-Stack Express Server with Vite Middleware
├── package.json                  # Dependencies & NPM Scripts
├── tsconfig.json                 # TypeScript Configuration
├── vite.config.ts                # Vite Configuration
├── netlify.toml                  # Netlify Build & Route Configuration
├── metadata.json                 # Project Metadata
└── .env.example                  # Environment Variables Template
```

---

## Owner Administrator Authentication

- **Sole Authorized Owner:** `hollowaylydia.us@gmail.com`
- **Authorized Firebase User UID:** `P7NJg0sVJwM7PEdwKB0JpQ0NIi62`
- **Protected Direct Route:** `/admin`
- The Admin Portal verifies Firebase ID Tokens against the specified owner UID before granting 24-hour cryptographic bearer sessions.

---

## Netlify Deployment

1. Connect your repository to Netlify.
2. Build Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Environment Variables (in Netlify Site Configuration):
   - `ADMIN_EMAIL`: `hollowaylydia.us@gmail.com`
   - `ADMIN_OWNER_UID`: `P7NJg0sVJwM7PEdwKB0JpQ0NIi62`
   - `VITE_ADMIN_EMAIL`: `hollowaylydia.us@gmail.com`
   - `VITE_FIREBASE_API_KEY`: *(Your Firebase Web API Key)*
   - `VITE_FIREBASE_PROJECT_ID`: *(Your Firebase Project ID)*
   - `VITE_FIREBASE_AUTH_DOMAIN`: *(Your Firebase Auth Domain)*
4. Direct visits to `/admin` and refreshes are handled by `public/_redirects` (`/* /index.html 200`).

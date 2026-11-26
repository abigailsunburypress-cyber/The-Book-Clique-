import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AboutUsView } from './components/AboutUsView';
import { OurTeamView } from './components/OurTeamView';
import { BookCatalogueView } from './components/BookCatalogueView';
import { ServicesView } from './components/ServicesView';
import { PricingView } from './components/PricingView';
import { BookClubView } from './components/BookClubView';
import { ContactUsView } from './components/ContactUsView';
import { WorkWithUsView } from './components/WorkWithUsView';
import { DonationView } from './components/DonationView';
import { Footer } from './components/Footer';
import { BookDetailModal } from './components/BookDetailModal';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminStudio } from './components/AdminStudio';
import { DonorNotificationToast } from './components/DonorNotificationToast';
import { DonationModal } from './components/DonationModal';
import { ButterflyEntrance } from './components/ButterflyEntrance';
import { ReaderAuthModal } from './components/ReaderAuthModal';
import { IdentityVerificationView } from './components/IdentityVerificationView';
import { HolidayBonusPopup } from './components/HolidayBonusPopup';

const MainLayout: React.FC = () => {
  const {
    activeView,
    isReaderAuthModalOpen,
    closeReaderAuthModal,
    executePendingReaderCallback,
    readerAuthModalConfig
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1E1D]">
      {/* 0. Elegant Multi-Butterfly Entrance Animation (Once per session, 3-5s flight, non-blocking) */}
      <ButterflyEntrance />

      {/* 1. Top Announcement Bar (Official Portfolio & Contact Email) */}
      <TopAnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <Navbar />

      {/* 3. Dynamic Page View Router */}
      <main className="flex-grow">
        {activeView === 'home' && <HomeView />}
        {activeView === 'about' && <AboutUsView />}
        {activeView === 'team' && <OurTeamView />}
        {activeView === 'catalogue' && <BookCatalogueView />}
        {activeView === 'services' && <ServicesView />}
        {activeView === 'pricing' && <PricingView />}
        {activeView === 'bookclub' && <BookClubView />}
        {activeView === 'contact' && <ContactUsView />}
        {activeView === 'work-with-us' && <WorkWithUsView />}
        {activeView === 'donation' && <DonationView />}
        {activeView === 'identity-verification' && <IdentityVerificationView />}
        {activeView === 'admin' && <AdminStudio isStandalonePage={true} />}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Modals and Drawers */}
      <BookDetailModal />
      <EnquiryModal />
      <AdminStudio />
      <DonationModal />
      <ReaderAuthModal
        isOpen={isReaderAuthModalOpen}
        onClose={closeReaderAuthModal}
        onSuccess={executePendingReaderCallback}
        title={readerAuthModalConfig.title}
        initialMode={readerAuthModalConfig.initialMode}
      />

      {/* 6. Rotating Verified Donor Notification (Bottom-Left Toast) */}
      <DonorNotificationToast />

      {/* 7. Holiday Bonus Pop-up (Initial Homepage Entry) */}
      <HolidayBonusPopup />
    </div>
  );
};

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected display error occurred.'
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[The Book Clique] Application error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-[#1C1E1D] p-6">
          <div className="max-w-md w-full bg-white border border-[#E6DFD5] rounded p-8 shadow-sm text-center space-y-4">
            <h1 className="font-serif text-2xl font-semibold text-[#143826]">
              The Book Clique
            </h1>
            <p className="text-sm text-[#4A534E] leading-relaxed">
              The display encountered a temporary state error and was safely paused to protect the page.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    window.history.pushState(null, '', '/');
                  } catch {
                    // ignore
                  }
                  this.setState({ hasError: false, errorMessage: '' });
                }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#143826] text-[#FBF9F5] rounded hover:bg-[#1D4F36] cursor-pointer"
              >
                Restore View
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#D5CDBD] text-[#143826] rounded hover:bg-[#FAF6F0] cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AppErrorBoundary>
  );
}

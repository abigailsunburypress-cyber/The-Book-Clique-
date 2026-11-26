import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ScamAlertBanner } from './components/ScamAlertBanner';
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

      {/* 1. Scam Alert Banner temporarily disabled per user request */}
      {/* <ScamAlertBanner /> */}

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
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

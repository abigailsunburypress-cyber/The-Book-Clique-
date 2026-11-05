import React from 'react';
import { HeroSection } from './HeroSection';
import { CommunityCounterSection } from './CommunityCounterSection';
import { FeaturedBooksSection } from './FeaturedBooksSection';
import { WhatWeDoSection } from './WhatWeDoSection';
import { PopularGenresSection } from './PopularGenresSection';
import { WhyTheBookClique } from './WhyTheBookClique';
import { HowServicesWorkSection } from './HowServicesWorkSection';
import { BookClubInviteSection } from './BookClubInviteSection';
import { FaqSection } from './FaqSection';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Opening Hero Section: Main introduction with welcome message & buttons */}
      <HeroSection />

      {/* 2. Reader and Follower Community Counter: Immediately after hero section */}
      <CommunityCounterSection />

      {/* 3. Featured Book of the Month: Immediately after community counter */}
      <FeaturedBooksSection />

      {/* 4. Subsequent Homepage Sections */}
      <WhatWeDoSection />
      <PopularGenresSection />
      <WhyTheBookClique />
      <HowServicesWorkSection />
      <BookClubInviteSection />
      <FaqSection />
      <NewsletterSection />
    </div>
  );
};

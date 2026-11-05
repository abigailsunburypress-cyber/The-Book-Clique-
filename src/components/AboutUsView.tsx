import React from 'react';
import { Target, Compass, Heart, BookOpen, Sparkles, ArrowRight, Globe, Quote, ShieldCheck, CheckCircle2, FileText, Users, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUsView: React.FC = () => {
  const { setActiveView, teamMembers } = useApp();

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================== */}
        {/* 1. AT THE VERY BEGINNING: ABOUT THE FOUNDER SUBSECTION */}
        {/* Appears before 'Purpose, Vision & Craft' and all About Us content */}
        {/* ============================================================== */}
        <section
          id="about-the-founder"
          aria-labelledby="founder-heading"
          className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-10 lg:p-12 mb-12 relative overflow-hidden"
        >
          {/* Subtle decorative top bar in heritage forest green and gold */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#143826] via-[#C5A059] to-[#143826]" />

          {/* Subsection Header */}
          <div className="border-b border-[#F0EAE1] pb-6 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Sparkles className="w-4 h-4 text-[#8C6D23]" />
              <span>Leadership &amp; Community Vision</span>
            </div>
            <h2 id="founder-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] tracking-tight">
              About the Founder
            </h2>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1.5">
              The heart, philosophy, and humanitarian dedication shaping The Book Clique.
            </p>
          </div>

          {/* Responsive Side-by-Side Layout on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Official Photograph of Susan Marie Collins */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[360px] bg-[#FAF8F5] rounded border-2 border-[#DFD7CA] overflow-hidden shadow-md p-2 relative group">
                <img
                  src="/assets/aistudio/download_6a8f7f57.jfif"
                  alt="Susan Marie Collins, Founder of The Book Clique"
                  className="w-full h-auto object-contain rounded-xs"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Founder Quote Card */}
              <div className="w-full max-w-[360px] mt-4 p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-left shadow-2xs">
                <div className="flex items-start gap-2 text-[#8C6D23] mb-1">
                  <Quote className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                  <p className="text-xs italic text-[#3E4642] leading-relaxed">
                    “Reading is more than a solitary activity; it is a shared experience that brings people together through ideas, conversations, and a common love of stories.”
                  </p>
                </div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#143826] text-right mt-1">
                  — Susan Marie Collins
                </span>
              </div>
            </div>

            {/* Right Column: Complete Founder Information & Biographical Profile */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#143826] tracking-tight">
                  Susan Marie Collins
                </h3>
                <p className="text-sm sm:text-base font-semibold text-[#8C6D23] italic mt-1">
                  Founder of The Book Clique
                </p>
              </div>

              {/* Biography Paragraph 1 */}
              <p className="text-sm sm:text-base text-[#3E4642] leading-relaxed">
                Susan Marie Collins, born in 1963, is the founder of The Book Clique, a literary community dedicated to celebrating books, storytelling, and the joy of reading. With a vision of bringing readers together and encouraging meaningful reading experiences, she hopes to inspire a lasting love of literature.
              </p>

              {/* Biography Paragraph 2 */}
              <p className="text-sm sm:text-base text-[#3E4642] leading-relaxed">
                Susan is happily married and a proud mother of two children. Beyond her passion for literature, she has dedicated herself to helping children around the world, particularly across the African continent, with a commitment to supporting their growth, learning, and opportunities for a brighter future.
              </p>

              {/* Humanitarian Dedication Spotlight Box */}
              <div className="p-4 sm:p-5 bg-[#FAF7F2] border-l-4 border-[#8C6D23] rounded-r border-t border-r border-b border-[#EAE4D8] text-xs sm:text-sm text-[#3E4642] space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-[#143826]">
                  <Globe className="w-4 h-4 text-[#8C6D23] shrink-0" />
                  <span>Global Outreach &amp; Dedication to Children</span>
                </div>
                <p className="leading-relaxed text-[#525B55] text-xs sm:text-sm">
                  A foundational pillar of Susan’s personal mission is providing children around the world—especially across communities in Africa—with essential learning resources, nurturing environments, and pathways toward educational growth and lasting opportunity.
                </p>
              </div>

              {/* Biography Paragraph 3 */}
              <p className="text-sm sm:text-base text-[#3E4642] leading-relaxed">
                Through The Book Clique, she aims to cultivate a community where readers can discover compelling works, explore different perspectives, and develop a deeper appreciation for literature. The platform is founded on the belief that reading is more than a solitary activity; it is a shared experience that brings people together through ideas, conversations, and a common love of stories.
              </p>

              {/* Biography Paragraph 4 */}
              <p className="text-sm sm:text-base text-[#3E4642] leading-relaxed">
                As founder, Susan Marie Collins continues to champion the vision behind The Book Clique: creating a distinctive literary destination where books are celebrated, readers are welcomed, and the joy of reading can be shared.
              </p>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. MEET OUR TEAM SECTION */}
        {/* ============================================================== */}
        <section
          id="meet-our-team"
          aria-labelledby="team-heading"
          className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-10 lg:p-12 mb-16 relative overflow-hidden"
        >
          {/* Subtle decorative top bar in heritage forest green and gold */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#143826] via-[#C5A059] to-[#143826]" />

          {/* Section Header */}
          <div className="border-b border-[#F0EAE1] pb-6 mb-8 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <Users className="w-4 h-4 text-[#8C6D23]" />
              <span>Editorial, Production &amp; Reader Community</span>
            </div>
            <h2 id="team-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] tracking-tight">
              Meet Our Team
            </h2>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1.5 max-w-2xl leading-relaxed">
              Meet the literary coordinators, book trailer specialists, and marketing strategists dedicated to connecting exceptional stories with thoughtful readers across The Book Clique.
            </p>
          </div>

          {/* Team Member Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-[#FFFFFF] rounded-sm border border-[#E6DFD5] hover:border-[#C5A059]/60 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Consistent Photograph Presentation Area */}
                  <div className="aspect-[4/5] bg-gradient-to-br from-[#143826] via-[#0E281B] to-[#081910] overflow-hidden relative flex items-center justify-center border-b border-[#E6DFD5]">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={`${member.name} - ${member.status || member.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
                      />
                    ) : (
                      /* Dignified Photograph Area - Preserved without picture for Amber Williams */
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative">
                        {/* Corner Decorative Filigree Hairlines */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A059]/40" />
                        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A059]/40" />
                        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A059]/40" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A059]/40" />

                        {/* Monogram Medallion */}
                        <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] bg-[#143826] shadow-xl flex items-center justify-center group-hover:border-[#E8D4B4] transition-colors">
                          <span className="font-serif text-2xl font-bold tracking-widest text-[#E8D4B4]">
                            {getInitials(member.name)}
                          </span>
                        </div>

                        {/* Name in Portrait Area */}
                        <span className="font-serif text-lg font-semibold text-[#FAF6F0] mt-3.5 tracking-wide">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-[#C5A059] font-medium mt-0.5 max-w-[220px] line-clamp-1">
                          {member.status || member.title}
                        </span>
                      </div>
                    )}

                    {/* Status Tag Overlay (when photo is present) */}
                    {member.photoUrl && (
                      <div className="absolute top-3 left-3 bg-[#143826]/90 backdrop-blur-xs text-[#FAF6F0] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-xs border border-[#C5A059]/40 shadow-xs">
                        {member.status || member.title}
                      </div>
                    )}
                  </div>

                  {/* Profile Information */}
                  <div className="p-6 text-left">
                    {/* Official Status */}
                    <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider block font-sans">
                      {member.status || member.title}
                    </span>

                    {/* Full Name */}
                    <h3 className="font-serif text-2xl font-bold text-[#143826] mt-1 tracking-tight group-hover:text-[#8C6D23] transition-colors">
                      {member.name}
                    </h3>

                    {/* Hairline Divider */}
                    <div className="border-t border-[#F0EBE1] my-3.5" />

                    {/* Complete Biography */}
                    <p className="text-xs sm:text-[13px] text-[#3D4741] leading-relaxed font-normal">
                      {member.bio}
                    </p>

                    {/* Contact Email Address with Mail Icon */}
                    {member.email && (
                      <div className="mt-4 pt-3.5 border-t border-[#F0EBE1]">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 text-xs font-medium text-[#143826] hover:text-[#8C6D23] transition-colors group/mail break-all"
                          title={`Send an email to ${member.name} (${member.email})`}
                        >
                          <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] group-hover/mail:border-[#C5A059] flex items-center justify-center shrink-0 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-[#8C6D23]" />
                          </span>
                          <span className="underline decoration-[#C5A059]/40 group-hover/mail:decoration-[#8C6D23] underline-offset-2">
                            {member.email}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Card Footer */}
                <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-[#737E77]">
                    The Book Clique Team
                  </span>
                  <span className="text-[11px] text-[#8C6D23] font-semibold">
                    {member.areaOfResponsibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. OUR AUTHORISED PAYMENT AGENT SUBSECTION */}
        {/* Positioned directly after founder info and team introduction */}
        {/* ============================================================== */}
        <section
          id="authorised-payment-agent"
          aria-labelledby="payment-agent-heading"
          className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-10 lg:p-12 mb-16 relative overflow-hidden"
        >
          {/* Subtle decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#143826] via-[#C5A059] to-[#143826]" />

          {/* Subsection Header */}
          <div className="border-b border-[#F0EAE1] pb-6 mb-8 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#8C6D23]" />
              <span>Official Author Representation</span>
            </div>
            <h2 id="payment-agent-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] tracking-tight">
              Our Authorised Payment Agent
            </h2>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1.5">
              Official payment coordination and verification details for authors partnering with The Book Clique.
            </p>
          </div>

          {/* Agent Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Official Photograph (unmodified, original aspect ratio) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] bg-[#FAF8F5] rounded border-2 border-[#DFD7CA] overflow-hidden shadow-md p-2">
                <img
                  src="/assets/aistudio/homme_noir_en_veste_1813c940.jfif"
                  alt="Mr. Abdul Wasiu Yusuf, Authorised Payment Agent for The Book Clique"
                  className="w-full h-auto object-contain rounded-xs"
                />
              </div>

              {/* Official Credential Note */}
              <div className="w-full max-w-[340px] mt-4 p-4 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-left shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#143826]">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Designated Payment Representative</span>
                </div>
                <p className="text-xs text-[#525B55] leading-relaxed">
                  Mr. Abdul Wasiu Yusuf is the single designated Authorised Payment Agent for The Book Clique.
                </p>
              </div>
            </div>

            {/* Right Column: Agent Information, Profile Description, Verification & Arrangement */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#143826] tracking-tight">
                  Mr. Abdul Wasiu Yusuf
                </h3>
                <p className="text-base sm:text-lg font-semibold text-[#8C6D23] mt-1">
                  Authorised Payment Agent
                </p>
                <p className="text-xs sm:text-sm text-[#636E67] font-medium mt-0.5">
                  Originally from Nigeria and now based in the United States
                </p>
              </div>

              {/* Profile Description */}
              <div className="space-y-4 text-sm sm:text-base text-[#3E4642] leading-relaxed">
                <p>
                  Mr. Abdul Wasiu Yusuf serves as the Authorised Payment Agent for The Book Clique. Originally from Nigeria and now based in the United States, he is responsible for coordinating service payments for authors who choose to work with our organisation.
                </p>
                <p>
                  He works directly with authors to communicate approved payment instructions, coordinate payment confirmations and maintain payment records. Through this arrangement, authors have a designated representative to contact when they are ready to complete payment for their selected services.
                </p>
              </div>

              {/* Official Email For Confirmation Box */}
              {/* STRICT REQUIREMENT: Ordinary, non-clickable text only. No link, no button, no form */}
              <div className="bg-[#FAF6F0] border-2 border-[#C5A059]/60 rounded-md p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6D23]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                    Official Payment Agent Email
                  </span>
                </div>

                <div className="bg-[#FFFFFF] border border-[#D5CDBD] rounded p-4 text-center sm:text-left">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#143826] select-all tracking-normal block">
                    info.abdulwasiuyusuf@gmail.com
                  </span>
                </div>

                <p className="text-xs text-[#636E67] leading-relaxed">
                  <strong>Verification &amp; Identification Note:</strong> The email address above is displayed strictly as ordinary reference text for confirmation and identification purposes. There is no clickable email link or payment button on this page. Authors receive this official address from our team upon agreeing to a service and contact Mr. Abdul Wasiu Yusuf directly to coordinate payment.
                </p>
              </div>

              {/* How the Payment Arrangement Works */}
              <div className="bg-[#FAF8F5] border border-[#E6DFD5] rounded-md p-5 sm:p-6 space-y-3">
                <h4 className="font-serif text-lg font-bold text-[#143826] flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#8C6D23]" />
                  <span>How the Payment Arrangement Works</span>
                </h4>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#464F4A] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Authors first communicate with a member of The Book Clique team regarding the services they are interested in.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Once an author selects a service and agrees to the applicable price, the team member provides the official payment agent's email address.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>The author then contacts Mr. Abdul Wasiu Yusuf directly through his Gmail address to arrange payment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>Mr. Abdul Wasiu Yusuf provides the approved payment instructions and coordinates the payment process.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                    <span>Payment is confirmed before the agreed service proceeds.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. PRESERVED EXISTING ABOUT US CONTENT (IN ORIGINAL ORDER) */}
        {/* ============================================================== */}

        {/* Existing Header: Purpose, Vision & Craft */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Purpose, Vision &amp; Craft
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
              About The Book Clique
            </h1>
            <p className="text-sm sm:text-base text-[#525B55] mt-2 leading-relaxed">
              We are an independent literary collective and author advocacy platform dedicated to nurturing genuine reading communities and giving worthy books an authentic chance to be seen.
            </p>
          </div>
        </div>

        {/* Existing Section 1: Our Story with Literary Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
              Our Story
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826] leading-snug">
              Born from a Love of Thoughtful Reading and Author Respect
            </h2>
            <p className="text-sm text-[#464F4A] leading-relaxed">
              In an overcrowded digital landscape where thousands of titles are published daily, outstanding manuscripts frequently languish in algorithmic obscurity. The Book Clique was established to restore human curation, literary dignity, and attentive community reading to the heart of book discovery.
            </p>
            <p className="text-sm text-[#464F4A] leading-relaxed">
              We believe that independent and traditionally published authors deserve transparent promotional partners—teams that actually read, understand genre conventions, and build marketing strategies around narrative depth rather than superficial vanity promises.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded border border-[#DFD7CA] overflow-hidden shadow-md">
              <img
                src="/src/assets/images/hero_literary_atmosphere_1793101459242.jpg"
                alt="Sunlit literary archive with high bookshelves"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Existing Section 2: Mission & Vision (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Mission */}
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-8 shadow-2xs">
            <div className="w-10 h-10 rounded-sm bg-[#143826] text-[#E8D4B4] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#143826]">
              Our Mission
            </h3>
            <p className="text-sm text-[#525B55] mt-3 leading-relaxed">
              To empower authors with honest, transparent, high-standard promotional solutions while curating an inspiring, open space for readers to discover extraordinary fiction and nonfiction from diverse voices across the globe.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-8 shadow-2xs">
            <div className="w-10 h-10 rounded-sm bg-[#143826] text-[#E8D4B4] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#143826]">
              Our Vision
            </h3>
            <p className="text-sm text-[#525B55] mt-3 leading-relaxed">
              To build a celebrated literary benchmark—a trusted ecosystem where readers know every recommendation has been thoughtfully evaluated, and where writers receive the honest advocacy, creative assets, and community reach their dedication deserves.
            </p>
          </div>

        </div>

        {/* Existing Section 3: Our Core Values */}
        <div className="bg-[#FAF7F2] border border-[#E6DFD5] rounded p-8 sm:p-10 mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              What We Stand For
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826] mt-1">
              Our Core Values
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#143826] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#8C6D23]" />
                <span>Literary Integrity</span>
              </div>
              <p className="text-xs text-[#556059] leading-relaxed">
                We champion narrative substance over short-lived trends, treating every book with meticulous editorial care.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#143826] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#8C6D23]" />
                <span>Genuine Community</span>
              </div>
              <p className="text-xs text-[#556059] leading-relaxed">
                Reading thrives in conversation. We create respectful, welcoming spaces where readers share insights freely.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#143826] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8C6D23]" />
                <span>Transparent Practice</span>
              </div>
              <p className="text-xs text-[#556059] leading-relaxed">
                Every service scope, deliverable list, turnaround, and official communication is documented and verified.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-semibold text-[#143826] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#8C6D23]" />
                <span>Author Advocacy</span>
              </div>
              <p className="text-xs text-[#556059] leading-relaxed">
                We believe every writer who puts in the grueling work of finishing a book deserves an honest, supportive partner.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Section 4: What We Offer (Action Banner) */}
        <div className="bg-[#143826] text-[#FBF9F5] rounded border border-[#1D4A36] p-8 sm:p-10 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Engage With Us
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FFFDF9] mt-1">
              Ready to Discover or Promote Your Next Book?
            </h3>
            <p className="text-xs sm:text-sm text-[#D1DDD6] mt-2 leading-relaxed">
              Explore our comprehensive catalogue or reach out to our team to plan your upcoming book launch and promotional campaign.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => setActiveView('catalogue')}
              className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0F291E] bg-[#E8D4B4] hover:bg-[#F3E5CF] rounded transition-colors shadow-xs cursor-pointer"
            >
              Explore Catalogue
            </button>
            <button
              onClick={() => setActiveView('services')}
              className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] border border-[#A4C2B2]/40 hover:bg-[#1A4533] rounded transition-colors cursor-pointer"
            >
              Author Services
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

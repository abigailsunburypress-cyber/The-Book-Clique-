import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  Clock,
  Award,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthorInterest, AuthorEnquirySubmission, AuthorEnquiryResponse } from '../types';
import { FICTION_GENRES, NONFICTION_GENRES } from '../data/initialData';

export const WorkWithUsView: React.FC = () => {
  const { submitAuthorEnquiry, setActiveView } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [genreChoice, setGenreChoice] = useState('Mystery');
  const [customGenre, setCustomGenre] = useState('');
  const [interest, setInterest] = useState<AuthorInterest>('Book Promotion Campaign');
  const [notes, setNotes] = useState('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AuthorEnquiryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const OFFICIAL_EMAIL = 'thebookclique.official@gmail.com';

  const interestOptions: AuthorInterest[] = [
    'Book Promotion Campaign',
    'Book Trailer',
    'Audiobook Services',
    'Other Author Services',
    'Manuscript Consideration',
    'General Enquiry'
  ];

  const popularGenres = [
    ...FICTION_GENRES.slice(0, 8),
    ...NONFICTION_GENRES.slice(0, 6),
    'Custom / Other Genre'
  ];

  const effectiveGenre = genreChoice === 'Custom / Other Genre' ? customGenre.trim() : genreChoice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!bookTitle.trim()) {
      setErrorMessage('Please enter your book title.');
      return;
    }
    if (!effectiveGenre) {
      setErrorMessage('Please select or specify your book genre.');
      return;
    }

    setIsSubmitting(true);

    const submission: AuthorEnquirySubmission = {
      fullName: fullName.trim(),
      email: email.trim(),
      bookTitle: bookTitle.trim(),
      bookGenre: effectiveGenre,
      interest,
      notes: notes.trim() || undefined
    };

    try {
      const result = await submitAuthorEnquiry(submission);
      if (result.success) {
        setSubmissionResult(result);
        setErrorMessage('');
      } else {
        setErrorMessage(result.error || 'Unable to submit your enquiry. Please verify your details and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setBookTitle('');
    setGenreChoice('Mystery');
    setCustomGenre('');
    setInterest('Book Promotion Campaign');
    setNotes('');
    setSubmissionResult(null);
    setErrorMessage('');
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Author Collaboration &amp; Publishing Services
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
              Work With Us
            </h1>
            <p className="text-sm sm:text-base text-[#46514B] mt-3 leading-relaxed">
              Tell us about your book and how you would like to work with The Book Clique. We welcome enquiries from authors interested in our services, promotional opportunities and manuscript consideration.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Form on Left, Authority Sidebar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded shadow-xs p-6 sm:p-8">
              
              {/* Form Title & Target Email Indicator */}
              <div className="border-b border-[#F0EBE1] pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#143826]">
                    Author Partnership &amp; Enquiry Form
                  </h2>
                  <p className="text-xs text-[#6B756F] mt-1">
                    Every enquiry is reviewed directly by our editorial and marketing team.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F0] border border-[#D5CDBD] rounded text-[11px] text-[#143826] shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Delivery: <strong>{OFFICIAL_EMAIL}</strong></span>
                </div>
              </div>

              {/* Confirmation State (Only shown after backend acceptance) */}
              {submissionResult && submissionResult.success ? (
                <div className="py-4 space-y-6 animate-in fade-in">
                  <div className="p-6 bg-[#F2FAF5] border border-[#2B7349]/40 rounded text-left">
                    <div className="flex items-center gap-2.5 text-[#165A35] font-semibold text-base sm:text-lg">
                      <CheckCircle2 className="w-6 h-6 text-[#2B7349] shrink-0" />
                      <span>Author Enquiry Received Successfully</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#3E5247] mt-3 leading-relaxed">
                      Thank you, <strong>{fullName}</strong>. Your enquiry for <em>&ldquo;{bookTitle}&rdquo;</em> regarding <strong>{interest}</strong> has been transmitted to our official correspondence mailbox (<strong>{OFFICIAL_EMAIL}</strong>).
                    </p>

                    <div className="mt-4 p-3.5 bg-[#FFFFFF] border border-[#CDE5D7] rounded text-xs text-[#2A4B37] space-y-1.5">
                      <div className="flex items-center justify-between border-b border-[#E1F0E7] pb-1.5">
                        <span className="font-semibold text-[#143826]">Enquiry Reference:</span>
                        <code className="font-mono text-[#143826]">{submissionResult.enquiryId}</code>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#E1F0E7] pb-1.5">
                        <span className="font-semibold text-[#143826]">Destination Inbox:</span>
                        <span className="font-mono text-[#8C6D23]">{OFFICIAL_EMAIL}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#E1F0E7] pb-1.5">
                        <span className="font-semibold text-[#143826]">Submitted Genre:</span>
                        <span>{effectiveGenre}</span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-semibold text-[#143826]">Estimated Response Time:</span>
                        <span>Within 2 to 3 business days</span>
                      </div>
                    </div>

                    {/* Email Service Configuration Notice if running with test transport */}
                    {submissionResult.serviceConfigNotice && (
                      <div className="mt-4 p-3 bg-[#FEF9C3]/70 border border-[#CA8A04]/40 rounded text-[11px] text-[#713F12] flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                        <div>
                          <strong>Backend Email Dispatch Notice:</strong> {submissionResult.serviceConfigNotice}
                          {submissionResult.previewUrl && (
                            <div className="mt-1">
                              <a
                                href={submissionResult.previewUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline font-semibold text-[#854D0E] hover:text-[#713F12]"
                              >
                                View verified RFC-822 test email preview &rarr;
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleResetForm}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#EFEBE4] hover:bg-[#E4DFD5] rounded transition-colors cursor-pointer text-center"
                    >
                      Submit Another Enquiry
                    </button>
                    <button
                      onClick={() => setActiveView('services')}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors cursor-pointer text-center"
                    >
                      Explore Our 10 Author Services &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                /* The Author Enquiry Form */
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {/* Error Banner */}
                  {errorMessage && (
                    <div className="p-4 bg-[#FDF2F2] border border-[#F87171]/40 rounded text-xs text-[#991B1B] flex items-start gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                      <div>
                        <strong>Submission Issue:</strong> {errorMessage}
                        <div className="mt-1 text-[11px] text-[#7F1D1D]">
                          Please correct the field or email us directly at <a href={`mailto:${OFFICIAL_EMAIL}`} className="underline font-semibold">{OFFICIAL_EMAIL}</a>.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label htmlFor="author-full-name" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      1. Full Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="author-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:bg-white focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>

                  {/* 2. Email Address */}
                  <div>
                    <label htmlFor="author-email" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      2. Email Address <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="author-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:bg-white focus:outline-2 focus:outline-[#143826]"
                    />
                    <span className="text-[11px] text-[#6B756F] mt-1 block">
                      Our response will be sent directly to this address from {OFFICIAL_EMAIL}.
                    </span>
                  </div>

                  {/* 3. Book Title */}
                  <div>
                    <label htmlFor="author-book-title" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      3. Book Title <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="author-book-title"
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Enter your book title"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:bg-white focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>

                  {/* 4. Book Genre */}
                  <div>
                    <label htmlFor="author-book-genre" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      4. Book Genre <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                      id="author-book-genre"
                      value={genreChoice}
                      onChange={(e) => setGenreChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:bg-white focus:outline-2 focus:outline-[#143826] cursor-pointer"
                    >
                      {popularGenres.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>

                    {/* Free-text input when Custom / Other is chosen */}
                    {genreChoice === 'Custom / Other Genre' && (
                      <div className="mt-2.5 animate-in fade-in">
                        <input
                          type="text"
                          required
                          value={customGenre}
                          onChange={(e) => setCustomGenre(e.target.value)}
                          placeholder="Type your exact book genre (e.g. Cozy Culinary Mystery, Historical Biography)..."
                          className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#C5A059] rounded text-[#1C1E1D] focus:bg-white focus:outline-2 focus:outline-[#143826]"
                        />
                      </div>
                    )}
                  </div>

                  {/* 5. What are you interested in? */}
                  <div>
                    <label htmlFor="author-interest" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      5. What are you interested in? <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                      id="author-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value as AuthorInterest)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:bg-white focus:outline-2 focus:outline-[#143826] cursor-pointer font-medium"
                    >
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Optional Notes / Description */}
                  <div>
                    <label htmlFor="author-notes" className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1.5">
                      Additional Details &amp; Manuscript Overview <span className="text-[#717C76] font-normal normal-case">(Optional)</span>
                    </label>
                    <textarea
                      id="author-notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share a brief synopsis, release timeline, current publisher/indie status, or specific goals for your book..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:bg-white focus:outline-2 focus:outline-[#143826] resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0F2A1D] disabled:opacity-60 rounded transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#E8D4B4]" />
                          <span>Transmitting Author Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#E8D4B4]" />
                          <span>Submit Author Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Verification & Direct Delivery Guarantee Footer */}
                  <div className="pt-3 border-t border-[#F0EBE1] text-[11px] text-[#6B756F] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#143826]" />
                      <span>Direct connection to <strong>{OFFICIAL_EMAIL}</strong></span>
                    </span>
                    <span>No automated spam · Human editorial review</span>
                  </div>

                </form>
              )}

            </div>
          </div>

          {/* Authority & Guidance Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Scam Alert & Official Channel Card */}
            <div className="bg-[#78231C]/10 border border-[#78231C]/30 rounded p-6 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#78231C] block mb-1">
                Official Correspondence Security
              </span>
              <h3 className="font-serif text-lg font-bold text-[#5C1B15]">
                Verified Communication Guarantee
              </h3>
              <p className="text-xs text-[#4A1612] mt-1.5 leading-relaxed">
                All communications and proposals from The Book Clique originate exclusively from our officially listed Gmail address:
              </p>
              <div className="mt-3 p-2.5 bg-[#FFFFFF] border border-[#78231C]/20 rounded font-mono text-xs text-[#78231C] font-semibold break-all">
                {OFFICIAL_EMAIL}
              </div>
              <p className="text-[11px] text-[#631812] mt-2 italic">
                Any outreach regarding The Book Clique from any other domain or address is unauthorized.
              </p>
            </div>

            {/* What to Expect Next */}
            <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 text-left shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-2">
                <Clock className="w-4 h-4 text-[#8C6D23]" />
                <span>Our Collaborative Process</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#143826]">
                What Happens After You Submit?
              </h3>
              
              <ol className="mt-4 space-y-3.5 text-xs text-[#4E5752]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] flex items-center justify-center shrink-0 font-bold text-[11px]">1</span>
                  <div>
                    <strong className="text-[#143826] block">Meticulous Editorial Review</strong>
                    Our team examines your book details, genre positioning, and requested services.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] flex items-center justify-center shrink-0 font-bold text-[11px]">2</span>
                  <div>
                    <strong className="text-[#143826] block">Direct Official Response</strong>
                    We reply from {OFFICIAL_EMAIL} within 2–3 business days with clear deliverables and transparent milestones.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#143826] text-[#FAF6F0] flex items-center justify-center shrink-0 font-bold text-[11px]">3</span>
                  <div>
                    <strong className="text-[#143826] block">No Hidden Obligations</strong>
                    All preliminary evaluations and quote discussions are entirely transparent with zero pressure.
                  </div>
                </li>
              </ol>
            </div>

            {/* Quick Service Exploration Card */}
            <div className="bg-[#FAF7F2] border border-[#E0D7C7] rounded p-6 text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143826] mb-1">
                <Award className="w-4 h-4 text-[#8C6D23]" />
                <span>Available Solutions</span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#143826]">
                Explore Full Package Tiers
              </h4>
              <p className="text-xs text-[#525B55] mt-1.5 leading-relaxed">
                Review all 10 specialized author services—including Book Trailers, ACX Audiobook Mastering, Marketing Campaigns, and Cover Design.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveView('services')}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#143826] text-[#FAF6F0] hover:bg-[#1E4D35] rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>View Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveView('pricing')}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FFFFFF] border border-[#D5CDBD] text-[#143826] hover:bg-[#FAF7F2] rounded transition-colors cursor-pointer"
                >
                  Compare Pricing
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

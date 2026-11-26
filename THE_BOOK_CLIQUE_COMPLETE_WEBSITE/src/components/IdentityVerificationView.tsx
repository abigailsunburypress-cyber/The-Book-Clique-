import React, { useState } from 'react';
import {
  Headphones,
  ShieldCheck,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Users,
  CreditCard,
  BookOpen,
  FileText,
  HelpCircle,
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const IdentityVerificationView: React.FC = () => {
  const { setActiveView } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'thebookclique.official@gmail.com';
  const mailtoSubject = 'Identity Verification / Clarification – The Book Clique';
  const mailtoLink = `mailto:${officialEmail}?subject=${encodeURIComponent(mailtoSubject)}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(officialEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const contactTopics = [
    {
      icon: ShieldCheck,
      title: "Confirmation of The Book Clique's Identity",
      description:
        "Verify whether any website, publication, promotion, campaign, or digital imprint is genuinely owned, operated, or endorsed by The Book Clique.",
      badge: 'Identity Check'
    },
    {
      icon: Mail,
      title: 'Verification of Emails & Messages',
      description:
        'Verify emails, social media direct messages, letters, or solicitations claiming to represent us. If an address looks unfamiliar, we will confirm whether it originated from our staff.',
      badge: 'Communications'
    },
    {
      icon: Users,
      title: 'Confirmation of Team Members & Representatives',
      description:
        'Check the current standing of any consultant, editor, marketer, or liaison claiming to work with or represent The Book Clique on any project.',
      badge: 'Personnel'
    },
    {
      icon: BookOpen,
      title: 'Questions About Author Services & Book Club',
      description:
        'Obtain clarification regarding our promotional campaigns, book trailer productions, audiobook production, reading schedule, or manuscript access requirements.',
      badge: 'Services & Club'
    },
    {
      icon: CreditCard,
      title: 'Clarification About Payments & Arrangements',
      description:
        'Confirm official invoices, banking details, or card processing links before remitting funds. We help you verify authorised payment channels so you never encounter illegitimate fees.',
      badge: 'Payment Safety'
    },
    {
      icon: HelpCircle,
      title: 'General Enquiries & Website Assistance',
      description:
        'Get clear answers about navigating our catalogue, submitting your manuscript for consideration, reader account registration, or community participation.',
      badge: 'Support Desk'
    }
  ];

  const verificationRules = [
    {
      label: 'Verified Official Email Address',
      official: 'thebookclique.official@gmail.com',
      note: 'Our exclusive direct channel for customer care, identity clarification, and author communications.'
    },
    {
      label: 'Secure Payment Verification',
      official: 'Formal Invoices & Authorized Channels Only',
      note: 'We never solicit payments through unverified third-party personal accounts, gift cards, or untraceable wire transfers.'
    },
    {
      label: 'Editorial & Book Club Terms',
      official: 'Publicly Stated & Transparent',
      note: 'Authors retain 100% rights to their work. Free Book Club access is granted upon simple registration with zero hidden fees.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#1C1E1D] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb & Section Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6DFD5]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>The Book Clique · Official Support Desk</span>
          </div>
          <span className="text-xs text-[#717C76] font-mono">
            Direct Line: thebookclique.official@gmail.com
          </span>
        </div>

        {/* HERO SECTION: Main Heading & Official Statement */}
        <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading, Subheading & Core Message */}
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#EAE4D8] text-[#143826] text-xs font-bold uppercase tracking-wider border border-[#D5CDBD]">
                  <Lock className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>IDENTITY VERIFICATION &amp; CUSTOMER CARE</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143826] tracking-tight leading-tight">
                  Need to Confirm Our Identity or Verify a Communication?
                </h1>

                <p className="text-base sm:text-lg text-[#38413C] leading-relaxed">
                  Your confidence and security matter to us. If you have received a message claiming to represent The Book Clique, or if you need clarification about our identity, services, team members, payment arrangements, or any communication from us, please contact our official customer care team.
                </p>

                {/* Quick Action Button Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={mailtoLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0E271B] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span>Contact Customer Care</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]/80 ml-0.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#FAF8F5] hover:bg-[#F0EBE1] active:bg-[#EAE4D8] text-[#143826] border border-[#D5CDBD] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    title="Copy official email to clipboard"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-4 h-4 text-[#15803D]" />
                        <span className="text-[#15803D]">Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#8C6D23]" />
                        <span>Copy Email Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Customer Care Visual Illustration (Friendly Support Badging - No human faces/AI people) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-gradient-to-br from-[#143826] via-[#1A4530] to-[#0D2419] p-6 text-[#FAF6F0] shadow-xl border-2 border-[#C5A059]/40 flex flex-col items-center justify-center text-center">
                  
                  {/* Decorative background aura */}
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.18)_0%,transparent_70%)] pointer-events-none" />

                  {/* Elegant Customer Service Headset with Speech Bubble & Shield Motif */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#FAF8F5] text-[#143826] flex items-center justify-center shadow-lg border-2 border-[#C5A059] relative">
                      <Headphones className="w-12 h-12 text-[#143826]" />
                      <div className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-[#C5A059] text-[#143826] flex items-center justify-center shadow-md border-2 border-[#FAF8F5]">
                        <MessageSquare className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="relative space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#E8D4B4] text-[11px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Official Support</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#FFFDF9]">
                      The Book Clique Care
                    </h3>
                    <p className="text-[11px] text-[#D1DDD6] max-w-[200px] leading-tight">
                      Dedicated clarification, identity assurance &amp; communication verification
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 24/7 AVAILABILITY & OFFICIAL CONTACT NOTICE STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 24/7 Customer Care Availability Card */}
          <div className="bg-[#143826] text-[#FAF6F0] rounded-lg p-6 sm:p-8 border border-[#C5A059]/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0D2419] border border-[#C5A059]/40 text-[#E8D4B4] text-xs font-bold uppercase tracking-wider mb-3">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Round-the-Clock Support</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFDF9] mb-2 leading-snug">
                CUSTOMER CARE AVAILABLE 24 HOURS A DAY, 7 DAYS A WEEK
              </h2>
              <p className="text-sm text-[#D1DDD6] leading-relaxed">
                Our customer care contact is available around the clock for identity confirmation, enquiries, and clarification. Contact us whenever you need assistance.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex items-center justify-between text-xs text-[#A4B5AC]">
              <span>Direct correspondence desk</span>
              <span className="text-[#E8D4B4] font-medium">All Timezones Welcome</span>
            </div>
          </div>

          {/* Official Contact Details Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#C5A059] rounded-lg p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] block mb-1">
                Official Customer Care &amp; Identity Verification Email
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143826] mb-3">
                Direct Verification Inbox
              </h2>
              
              {/* Clickable Email Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-md border border-[#D5CDBD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase text-[#717C76] block mb-0.5">
                    Click to Open Email Client:
                  </span>
                  <a
                    href={mailtoLink}
                    className="font-mono text-sm sm:text-base font-bold text-[#143826] hover:text-[#8C6D23] hover:underline break-all transition-colors inline-flex items-center gap-1.5"
                    title="Send verification request to thebookclique.official@gmail.com"
                  >
                    <span>{officialEmail}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#8C6D23]" />
                  </a>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#D5CDBD] text-[#143826] hover:bg-[#F0EBE1] text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center shrink-0"
                >
                  {copiedEmail ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <p className="text-xs text-[#525B55] mt-3">
                <strong>Pre-Filled Email Subject:</strong>{' '}
                <span className="font-mono text-[#143826] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E6DFD5]">
                  {mailtoSubject}
                </span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0EAE1]">
              <a
                href={mailtoLink}
                className="w-full py-2.5 px-4 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors text-center inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>Open Verification Email in Your App</span>
              </a>
            </div>
          </div>

        </div>

        {/* WHAT VISITORS CAN CONTACT US ABOUT (6-Card Section) */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
              Scope of Customer Assistance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143826]">
              What You Can Contact Us About
            </h2>
            <p className="text-sm text-[#525B55]">
              We encourage authors, readers, and literary partners to reach out for formal clarification whenever they have questions regarding any of the following matters:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactTopics.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg p-6 shadow-xs hover:border-[#143826]/40 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded bg-[#FAF7F2] border border-[#C5A059]/40 text-[#143826] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#8C6D23]" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F0EBE1] text-[#717C76]">
                        {topic.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#143826] leading-snug">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-[#525B55] leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0EAE1]">
                    <a
                      href={`mailto:${officialEmail}?subject=${encodeURIComponent(`${topic.title} – The Book Clique`)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143826] hover:text-[#8C6D23] transition-colors"
                    >
                      <span>Inquire about this</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OFFICIAL VERIFICATION CRITERIA & RECOGNITION GUIDE */}
        <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143826]">
                How to Authenticate The Book Clique
              </h3>
              <p className="text-xs text-[#525B55] mt-1">
                Reference standards to help authors and readers ensure they are interacting directly with our verified platform.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 self-start sm:self-center">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Verified Standards</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationRules.map((rule, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded border border-[#D5CDBD] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D23] block">
                  {rule.label}
                </span>
                <div className="font-mono text-xs font-bold text-[#143826] break-all">
                  {rule.official}
                </div>
                <p className="text-xs text-[#525B55] leading-relaxed">
                  {rule.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CRITICAL SECURITY & SAFETY INSTRUCTION */}
        <div className="bg-[#FFFDF5] border-2 border-[#D4AF37] rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF0D7] border border-[#C5A059] text-[#8C6D23] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-[#8C6D23]" />
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#8C6D23] text-white">
                  Security Instruction
                </span>
                <span className="text-xs font-semibold text-[#8C6D23]">
                  Protect Your Sensitive Information
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-[#143826]">
                Never Send Passwords, Sensitive Codes, or Financial Credentials
              </h4>

              <div className="text-xs sm:text-sm text-[#38413C] space-y-2 leading-relaxed">
                <p>
                  The Book Clique will <strong>never</strong> ask authors, readers, or visitors to send passwords, two-factor authentication codes, or sensitive account credentials by email.
                </p>
                <p>
                  Do not trust unverified contact addresses or third-party links requesting sensitive credentials. All official communication is channeled exclusively through our verified email address: <strong className="font-mono text-[#143826]">thebookclique.official@gmail.com</strong>.
                </p>
                <p className="text-xs text-[#717C76] italic">
                  If anyone contacts you demanding payment to personal accounts or asking for account login details, report the message immediately to our Customer Care team for identity verification.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={mailtoLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Report Suspicious Communication</span>
                </a>
                
                <button
                  type="button"
                  onClick={() => setActiveView('team')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFFFFF] hover:bg-[#F0EBE1] text-[#143826] border border-[#D5CDBD] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>View Verified Team Directory</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HELP BANNER */}
        <div className="bg-[#143826] text-[#FAF6F0] rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#FFFDF9] mb-1">
              Have a Specific Question About Working With Us?
            </h4>
            <p className="text-xs sm:text-sm text-[#D1DDD6] max-w-xl">
              You can also submit an enquiry through our Author Services form or reach out through our general contact desk.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('work-with-us')}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#143826] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-sans"
            >
              Work With Us
            </button>
            <button
              type="button"
              onClick={() => setActiveView('contact')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#FAF6F0] border border-white/20 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-sans"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

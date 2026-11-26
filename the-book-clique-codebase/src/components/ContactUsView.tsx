import React, { useState } from 'react';
import {
  Mail,
  AlertTriangle,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FAQS } from '../data/initialData';

export const ContactUsView: React.FC = () => {
  const { siteConfig, submitContactMessage, setActiveView } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<'General Enquiry' | 'Promotional Service' | 'Book Club'>('General Enquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [formStatus, setFormStatus] = useState<'idle' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus('error');
      setErrorMessage('Please complete all required fields.');
      return;
    }

    try {
      submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        inquiryType,
        subject: subject.trim() || `${inquiryType} from ${name}`,
        message: message.trim()
      });
      setFormStatus('submitted');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrorMessage('');
    } catch {
      setFormStatus('error');
      setErrorMessage('Unable to process message submission.');
    }
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Official Communications
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
              Contact The Book Clique
            </h1>
            <p className="text-sm sm:text-base text-[#525B55] mt-2 leading-relaxed">
              Whether you are an author seeking promotional guidance, a reader with a community suggestion, or a publisher exploring collaboration, we look forward to hearing from you.
            </p>
          </div>
        </div>

        {/* Dedicated Author Partnership Portal Banner */}
        <div className="mb-10 p-5 sm:p-6 bg-[#FAF7F2] border border-[#C5A059]/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded bg-[#143826] text-[#E8D4B4] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <strong className="text-sm font-semibold text-[#143826] block">Are you an author seeking services or manuscript consideration?</strong>
              <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                Tell us about your book and how you would like to work with The Book Clique. We welcome enquiries from authors interested in our services, promotional opportunities and manuscript consideration.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('work-with-us')}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            Work With Us Form &rarr;
          </button>
        </div>

        {/* Prominent Scam Warning & Official Email Showcase Card */}
        <div className="mb-12 bg-[#78231C]/10 border-2 border-[#78231C]/30 rounded p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-[#78231C] text-[#FFF7F5] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#FBBF24]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78231C]">
                  Official Channel Verification
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5C1B15] mt-0.5">
                  Official Communication Email Address
                </h2>
                <p className="text-xs sm:text-sm text-[#4A1612] mt-1 leading-relaxed max-w-2xl">
                  <strong>SCAM ALERT:</strong> Any outreach from any other Gmail address except the official Gmail address listed on this website is a scam. Always verify that you are communicating with us through our officially listed email address.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#143826]/20 p-4 rounded shrink-0 w-full md:w-auto text-left shadow-xs">
              <span className="text-[11px] font-semibold text-[#525B55] uppercase tracking-wider block mb-1">
                Official Contact Email:
              </span>
              <a
                href="mailto:thebookclique.official@gmail.com"
                className="text-sm sm:text-base font-bold text-[#143826] hover:underline flex items-center gap-2 break-all"
                title="Direct email to verified address"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#C5A059]" />
                <span>thebookclique.official@gmail.com</span>
              </a>
              <span className="text-[11px] text-[#8C6D23] font-semibold block mt-1">
                Official Contact Email — Owner Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Contact Form Left, Official Info & FAQs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
              <MessageSquare className="w-4 h-4 text-[#8C6D23]" />
              <span>Direct Submission Form</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#143826]">
              Send Us a Message
            </h3>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1 mb-6 leading-relaxed">
              Submissions are logged into our verified administration desk. We reply through our officially listed Gmail address.
            </p>

            {formStatus === 'submitted' ? (
              <div className="p-6 bg-[#F2FAF5] border border-[#2B7349]/30 rounded text-left">
                <div className="flex items-center gap-2 text-[#1E5C38] font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#2B7349]" />
                  <span>Your Message Has Been Submitted</span>
                </div>
                <p className="text-xs text-[#3E5247] mt-2 leading-relaxed">
                  Thank you for reaching out. Your enquiry has been recorded in our official queue. Our team will review your notes and respond from our verified Gmail address.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Sarah Walker"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="sarah@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiry-type"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826] cursor-pointer"
                  >
                    <option value="General Enquiry">General Reader & Community Enquiry</option>
                    <option value="Promotional Service">Author Marketing & Service Proposal</option>
                    <option value="Book Club">Book Club Selection Suggestion</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Subject / Book Title (if applicable)
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiring about Book Trailer or Catalogue Inclusion"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Message Details *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Provide details regarding your manuscript, question, or proposal..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>

                {formStatus === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs text-[#9E2B22]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Official Team</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#717C76] text-center pt-1">
                  We never share your personal information. Submissions are processed under strict privacy guidelines.
                </p>
              </form>
            )}

          </div>

          {/* Right Column: Communication Verification & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#FAF7F2] border border-[#E6DFD5] rounded p-6 text-xs text-[#525B55] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143826]">
                <ShieldCheck className="w-4 h-4 text-[#8C6D23]" />
                <span>Verification Checklist</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                  <span>Always check the domain handle matches our official listing exactly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                  <span>The Book Clique never requests passwords, private crypto keys, or unverified wire transfers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                  <span>Invoices are issued only after written project scope confirmation.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 shadow-2xs">
              <h4 className="font-serif text-base font-semibold text-[#143826] mb-2">
                Editorial Review Turnaround
              </h4>
              <p className="text-xs text-[#525B55] leading-relaxed">
                General reader questions and catalogue submissions are evaluated within 2 to 3 business days. Author service proposals receive personalized attention within 48 hours.
              </p>
            </div>

          </div>

        </div>

        {/* FAQs Section */}
        <div className="border-t border-[#E6DFD5] pt-12">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Common Inquiries
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826] mt-1">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#525B55] mt-1.5">
              Clear answers regarding our scam safety protocols, catalogue discovery, author services, and community participation.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#E6DFD5] rounded overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                  >
                    <span className="font-serif text-base sm:text-lg font-semibold text-[#143826]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C6D23] shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#464F4A] leading-relaxed border-t border-[#F0EBE1] pt-3 bg-[#FAF8F5]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnquiryModal: React.FC = () => {
  const {
    isEnquiryModalOpen,
    closeEnquiryModal,
    enquiryServicePreselect,
    submitServiceEnquiry,
    services
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('Personalised Quotation (Scope-Based)');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isEnquiryModalOpen) {
      const preSvc = enquiryServicePreselect?.serviceName || services[0]?.name || '';
      const prePkg = enquiryServicePreselect?.packageName || 'Starter';
      setSelectedService(preSvc);
      setSelectedPackage(prePkg);
      setBudgetRange(
        preSvc === 'Holiday Book Club Registration'
          ? 'Holiday Book Club Offer ($99)'
          : 'Personalised Quotation (Scope-Based)'
      );
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isEnquiryModalOpen, enquiryServicePreselect, services]);

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !email.includes('@') || !bookTitle.trim()) {
      setStatus('error');
      setErrorMsg('Please provide your name, valid email, and book title.');
      return;
    }

    try {
      submitServiceEnquiry({
        customerName: customerName.trim(),
        email: email.trim(),
        bookTitle: bookTitle.trim(),
        authorName: authorName.trim() || customerName.trim(),
        selectedService,
        selectedPackage,
        projectDescription: projectDescription.trim(),
        budgetRange
      });
      setStatus('success');
      setErrorMsg('');
    } catch {
      setStatus('error');
      setErrorMsg('Unable to record your booking inquiry.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0F291E]/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#FBF9F5] rounded border border-[#DCD5C9] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1D5] bg-[#FAF7F2]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D23]">
              Author Services
            </span>
            <h2 className="font-serif text-xl font-semibold text-[#143826]">
              Book & Enquire About a Service Package
            </h2>
          </div>
          <button
            onClick={closeEnquiryModal}
            className="p-1.5 text-[#5C6660] hover:text-[#143826] rounded cursor-pointer"
            aria-label="Close Inquiry Form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
          {status === 'success' ? (
            <div className="p-6 bg-[#F2FAF5] border border-[#2B7349]/30 rounded text-left">
              <div className="flex items-center gap-2 text-[#1E5C38] font-semibold text-base">
                <CheckCircle2 className="w-5 h-5 text-[#2B7349]" />
                <span>Enquiry Successfully Submitted</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3E5247] mt-2 leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Your inquiry regarding <em>"{bookTitle}"</em> for the <strong>{selectedService} ({selectedPackage})</strong> tier has been saved into our administration records.
              </p>
              <p className="text-xs text-[#52645B] mt-2">
                Our author support team will review your project requirements and respond directly from our official Gmail address.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={closeEnquiryModal}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] rounded cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Selected Package Banner */}
              <div className="p-3 bg-[#F2EDE2] border border-[#E0D7C7] rounded text-xs text-[#3E4642] flex items-center justify-between">
                <div>
                  <span className="text-[#6B756F]">Service & Tier:</span>{' '}
                  <strong className="text-[#143826]">{selectedService}</strong> — <span>{selectedPackage}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enq-custname" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="enq-custname"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Abigail Press"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>

                <div>
                  <label htmlFor="enq-email" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="author@example.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enq-booktitle" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Book Title *
                  </label>
                  <input
                    id="enq-booktitle"
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    required
                    placeholder="The Song of the Heron"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>

                <div>
                  <label htmlFor="enq-authorname" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Author Byline Name
                  </label>
                  <input
                    id="enq-authorname"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Pen name or full name"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enq-service" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Selected Service
                  </label>
                  <select
                    id="enq-service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  >
                    <option value="Holiday Book Club Registration">
                      Holiday Book Club Registration
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="enq-budget" className="block text-xs font-semibold text-[#2C332F] mb-1">
                    Quotation Preference
                  </label>
                  <select
                    id="enq-budget"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                  >
                    {selectedService === 'Holiday Book Club Registration' && (
                      <option value="Holiday Book Club Offer ($99)">
                        Holiday Book Club Offer ($99)
                      </option>
                    )}
                    <option value="Personalised Quotation (Scope-Based)">
                      Personalised Quotation (Scope-Based)
                    </option>
                    <option value="Custom Campaign / Multi-Title Scope">
                      Custom Campaign / Multi-Title Scope
                    </option>
                    <option value="Book Club Registration Enquiry">
                      Book Club Registration Enquiry
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="enq-description" className="block text-xs font-semibold text-[#2C332F] mb-1">
                  Brief Project Overview & Deadlines
                </label>
                <textarea
                  id="enq-description"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Tell us about your target reader genre, publication date, or any specific requirements..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-xs text-[#9E2B22]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
                >
                  Submit Booking Inquiry
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#717C76] justify-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#143826]" />
                <span>Protected by The Book Clique Official Communication Guarantee.</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-[#FAF7F2] border-t border-[#E8E1D5] flex justify-end">
          <button
            onClick={closeEnquiryModal}
            className="text-xs text-[#6B756F] hover:text-[#143826] font-medium"
          >
            Cancel & Close
          </button>
        </div>

      </div>
    </div>
  );
};

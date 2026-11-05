import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsletterSubscriber } from '../types';

export const NewsletterSection: React.FC = () => {
  const { submitNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState<NewsletterSubscriber['interest']>('Both');
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid, complete email address.');
      return;
    }

    try {
      submitNewsletter(email.trim(), interest);
      setStatus('submitted');
      setEmail('');
      setErrorMessage('');
    } catch {
      setStatus('error');
      setErrorMessage('Unable to register subscription at this moment.');
    }
  };

  return (
    <section className="py-16 bg-[#F4EFE6] border-b border-[#E6DFD5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-12 h-12 rounded-sm bg-[#143826] text-[#E8D4B4] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
          Curated Literary Dispatch
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
          Subscribe to The Book Clique Gazette
        </h2>

        <p className="text-sm text-[#525B55] mt-2 max-w-xl mx-auto leading-relaxed">
          Receive bi-weekly book recommendations, author spotlights, new catalogue additions, and publishing insights delivered straight to your inbox.
        </p>

        {status === 'submitted' ? (
          <div className="mt-8 p-6 bg-[#FFFFFF] border border-[#2B7349]/30 rounded max-w-md mx-auto text-left shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-[#1E5C38] font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#2B7349]" />
              <span>Subscription Confirmed</span>
            </div>
            <p className="text-xs text-[#444D48] mt-1.5 leading-relaxed">
              Thank you for joining our literary community. Your subscription preference ({interest}) has been registered. You can unsubscribe at any time via the link in each dispatch.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-3 text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
            >
              Register another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto space-y-4 text-left">
            
            {/* Interest Options */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#464F4A]">
              <span className="text-[#6B756F]">I am interested in:</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  checked={interest === 'Reader Recommendations'}
                  onChange={() => setInterest('Reader Recommendations')}
                  className="text-[#143826] focus:ring-[#143826]"
                />
                <span>Book Recommendations</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  checked={interest === 'Author Promotional Insights'}
                  onChange={() => setInterest('Author Promotional Insights')}
                  className="text-[#143826] focus:ring-[#143826]"
                />
                <span>Author Marketing Tips</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  checked={interest === 'Both'}
                  onChange={() => setInterest('Both')}
                  className="text-[#143826] focus:ring-[#143826]"
                />
                <span>Both</span>
              </label>
            </div>

            {/* Input Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] placeholder:text-[#8D9690] focus:outline-2 focus:outline-[#143826]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] active:bg-[#0F291E] rounded transition-colors whitespace-nowrap shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
              >
                Subscribe Now
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-xs text-[#9E2B22]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-[#717C76] text-center">
              We respect your privacy. No spam, ever. Unsubscribe at any time.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};

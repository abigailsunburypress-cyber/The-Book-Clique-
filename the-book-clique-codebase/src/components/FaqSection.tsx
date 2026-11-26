import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FaqItem {
  question: string;
  answer: string;
  linkAction?: {
    label: string;
    view?: 'work-with-us' | 'bookclub' | 'contact' | 'services';
    email?: string;
  };
}

const FAQS: FaqItem[] = [
  {
    question: '1. What is The Book Clique?',
    answer:
      'The Book Clique is a literary community and author services platform dedicated to discovering books, connecting readers and authors, and giving every book a chance to be seen.'
  },
  {
    question: '2. What services do you offer authors?',
    answer:
      'We offer book promotion campaigns, book trailers, audiobook services and other author-focused opportunities.',
    linkAction: {
      label: 'Explore Our Services',
      view: 'services'
    }
  },
  {
    question: '3. Can I submit my book for manuscript consideration?',
    answer:
      'Yes. Authors can submit an enquiry through our Work With Us section to have their books considered for editorial opportunities. Submission does not guarantee acceptance or publication.',
    linkAction: {
      label: 'Submit Author Enquiry',
      view: 'work-with-us'
    }
  },
  {
    question: '4. How can I join the Book Club?',
    answer:
      'Visit our Book Club section to explore the current reading selection and access available chapters according to the reading schedule.',
    linkAction: {
      label: 'Visit The Book Club',
      view: 'bookclub'
    }
  },
  {
    question: '5. How can I work with The Book Clique?',
    answer:
      'Complete the Author Enquiry Form in our Work With Us section, select the service you are interested in and submit your details.',
    linkAction: {
      label: 'Go to Work With Us Form',
      view: 'work-with-us'
    }
  },
  {
    question: '6. How can I contact The Book Clique?',
    answer:
      'You can email our team directly at thebookclique.official@gmail.com or submit an enquiry through our website.',
    linkAction: {
      label: 'Contact Us',
      view: 'contact',
      email: 'thebookclique.official@gmail.com'
    }
  }
];

export const FaqSection: React.FC = () => {
  const { setActiveView } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E6DFD5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#143826]/10 text-[#143826] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#143826]/15">
            <HelpCircle className="w-3.5 h-3.5 text-[#8C6D23]" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#525B55] leading-relaxed">
            Essential information about The Book Clique, our reading fellowship, author services, and how to get in touch with our team.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-[#FFFFFF] border rounded-md transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#143826] shadow-sm'
                    : 'border-[#E6DFD5] hover:border-[#C5A059]/60 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#143826]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#143826] pr-2">
                    {item.question}
                  </span>

                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#143826] text-[#FAF6F0] rotate-180'
                        : 'bg-[#FAF6F0] text-[#717C76] border border-[#D5CDBD]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#3E4642] leading-relaxed border-t border-[#F0EAE1] bg-[#FAF9F6]/40"
                  >
                    <p className="mt-2 text-sm sm:text-base text-[#2E3531]">{item.answer}</p>

                    {item.linkAction && (
                      <div className="mt-4 pt-3 flex flex-wrap items-center gap-3">
                        {item.linkAction.view && (
                          <button
                            type="button"
                            onClick={() => setActiveView(item.linkAction!.view!)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#143826] hover:text-[#8C6D23] transition-colors py-1 cursor-pointer"
                          >
                            <span>{item.linkAction.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.linkAction.email && (
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.linkAction.email)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D23] hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{item.linkAction.email}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Strip */}
        <div className="mt-10 sm:mt-12 p-6 rounded-md bg-[#FAF6F0] border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-base font-bold text-[#143826]">
              Have a question that isn&apos;t covered here?
            </h3>
            <p className="text-xs text-[#525B55] mt-0.5">
              Our team is pleased to assist authors and readers with any additional questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('work-with-us')}
              className="px-4 py-2.5 rounded bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              Work With Us
            </button>
            <button
              onClick={() => setActiveView('contact')}
              className="px-4 py-2.5 rounded bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#143826] border border-[#D5CDBD] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Contact Team
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowServicesWorkSection: React.FC = () => {
  const { setActiveView } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Consultation & Inquiry',
      description: 'Select your preferred service package or request a custom quote. Share your book’s synopsis, genre, target reader demographics, and timeline.'
    },
    {
      step: '02',
      title: 'Scope & Verification',
      description: 'We review your submission and reply through our officially verified Gmail address with a clear roadmap, milestone deliverables, and exact turnaround dates.'
    },
    {
      step: '03',
      title: 'Production & Collaborative Review',
      description: 'Our team crafts your custom trailers, social graphics, editorial marks, or audio masters, with structured review rounds for your complete approval.'
    },
    {
      step: '04',
      title: 'Distribution & Engagement',
      description: 'We launch your campaign across The Book Clique community, newsletter readers, and social channels, delivering clear performance recaps.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
              Transparent Collaboration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#143826] mt-1 tracking-tight">
              How Our Author Services Work
            </h2>
            <p className="text-sm text-[#525B55] mt-1.5 max-w-xl leading-relaxed">
              Every author collaboration follows four structured steps designed for creative peace of mind, timely delivery, and clear communication.
            </p>
          </div>

          <button
            onClick={() => setActiveView('services')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#143826] hover:text-[#285D40] transition-colors py-2 cursor-pointer"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-[#8C6D23] tabular-nums">
                  {item.step}
                </span>
                <h3 className="font-serif text-base font-semibold text-[#143826] mt-3">
                  {item.title}
                </h3>
                <p className="text-xs text-[#525B55] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

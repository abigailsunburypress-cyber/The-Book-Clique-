import React, { useState } from 'react';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  const { services, openEnquiryModal, setActiveView } = useApp();
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');

  const filteredServices = selectedServiceFilter === 'All'
    ? services
    : services.filter((s) => s.id === selectedServiceFilter);

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
            Transparent Investment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
            Service Packages & Pricing
          </h1>
          <p className="text-sm text-[#525B55] mt-2.5 leading-relaxed">
            Every author project deserves crystal-clear terms, defined deliverables, and reliable timelines. Compare our tiered packages below or request a custom quote tailored to your manuscript.
          </p>

          {/* Pricing Placeholder Advisory */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#F4EDE0] border border-[#E2D5BE] rounded text-xs text-[#6B5724]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Note: Prices shown are structured demonstration placeholders editable by site administrators.</span>
          </div>

          {/* Filter dropdown */}
          <div className="mt-6 flex justify-center">
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826] cursor-pointer"
            >
              <option value="All">All Services ({services.length})</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services & Packages Grid */}
        <div className="space-y-16">
          {filteredServices.map((service) => (
            <div key={service.id} className="border-t border-[#E6DFD5] pt-10">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
                <div>
                  <span className="text-xs font-semibold text-[#8C6D23] uppercase tracking-wider">
                    Service Overview
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#143826] mt-0.5">
                    {service.name}
                  </h2>
                  <p className="text-xs text-[#525B55] mt-1 max-w-2xl leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="text-xs text-[#6B756F]">
                  Typical Timeline: <strong className="text-[#143826]">{service.deliveryTimeframe}</strong>
                </div>
              </div>

              {/* Package Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded border flex flex-col justify-between p-6 transition-all ${
                      pkg.isPopular
                        ? 'bg-[#FFFFFF] border-[#143826] shadow-sm relative'
                        : 'bg-[#FAF8F5] border-[#E6DFD5]'
                    }`}
                  >
                    <div>
                      {pkg.isPopular && (
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#143826] bg-[#E8D4B4] px-2 py-0.5 rounded-xs inline-block mb-3">
                          Recommended Tier
                        </span>
                      )}

                      <h3 className="font-serif text-xl font-semibold text-[#143826]">
                        {pkg.name}
                      </h3>

                      <div className="mt-2 mb-3">
                        <span className="font-serif text-2xl font-bold text-[#143826] tabular-nums">
                          {pkg.price}
                        </span>
                        {!pkg.isCustomQuote && (
                          <span className="text-xs text-[#6B756F] ml-1">/ project</span>
                        )}
                      </div>

                      <p className="text-xs text-[#556059] leading-relaxed mb-4">
                        {pkg.description}
                      </p>

                      <div className="pt-3 border-t border-[#ECE6DB] space-y-2 text-xs">
                        <div className="font-semibold text-[11px] uppercase tracking-wider text-[#636E67]">
                          Included Deliverables:
                        </div>
                        <ul className="space-y-1.5 text-[#3A423E]">
                          {pkg.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 text-xs">
                              <Check className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                              <span className="leading-tight">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#ECE6DB] space-y-1 text-xs text-[#616B65]">
                        <div className="flex justify-between">
                          <span className="text-[#7A857F]">Revisions:</span>
                          <span className="font-medium text-[#1C1E1D]">{pkg.revisions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#7A857F]">Turnaround:</span>
                          <span className="font-medium text-[#1C1E1D]">{pkg.turnaround}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#ECE6DB]">
                      <button
                        onClick={() => openEnquiryModal(service.name, pkg.name)}
                        className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded transition-colors text-center cursor-pointer ${
                          pkg.isPopular
                            ? 'bg-[#143826] text-[#FAF6F0] hover:bg-[#1E4D35] shadow-xs'
                            : 'bg-[#EAE3D4] text-[#143826] hover:bg-[#DDD5C4]'
                        }`}
                      >
                        {pkg.isCustomQuote ? 'Request Custom Quote' : 'Enquire & Book Package'}
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Global Custom Quote Card */}
        <div className="mt-16 bg-[#143826] text-[#FBF9F5] rounded border border-[#1D4A36] p-8 sm:p-10 shadow-lg">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Bespoke Proposals
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FFFDF9] mt-1">
              Need a Custom Campaign or Multi-Title Package?
            </h3>
            <p className="text-xs sm:text-sm text-[#D1DDD6] mt-2 leading-relaxed">
              If your manuscript requires a tailored blend of trailers, social media sprints, audiobook mastering, and launch coordination, we will prepare a personalized scope and quote with zero obligation.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => openEnquiryModal('Custom Author & Publisher Support', 'Bespoke Campaign Proposal')}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0F291E] bg-[#E8D4B4] hover:bg-[#F3E5CF] rounded transition-colors shadow-sm cursor-pointer"
              >
                Request Custom Quotation
              </button>
              <button
                onClick={() => setActiveView('contact')}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFFDF9] border border-[#A4C2B2]/40 hover:bg-[#1A4533] rounded transition-colors cursor-pointer"
              >
                Contact Our Official Team
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

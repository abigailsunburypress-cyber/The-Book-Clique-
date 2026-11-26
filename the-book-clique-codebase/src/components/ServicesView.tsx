import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Film,
  Headphones,
  Share2,
  Rocket,
  UserCheck,
  Image as ImageIcon,
  FileText,
  Globe,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { BookTrailerShowcase } from './BookTrailerShowcase';

export const ServicesView: React.FC = () => {
  const { services, openEnquiryModal, setActiveView, servicePreselectId, setServicePreselectId } = useApp();
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return servicePreselectId || 'service-02'; // default to Book Trailer Production so work is instantly seen
  });

  const [trailerViewTab, setTrailerViewTab] = useState<'all' | 'work' | 'packages'>('all');

  // Sync when preselected from navigation or hero
  useEffect(() => {
    if (servicePreselectId) {
      setSelectedServiceId(servicePreselectId);
    }
  }, [servicePreselectId]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const isTrailerService =
    selectedService.id === 'service-02' ||
    selectedService.name.toLowerCase().includes('trailer');

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Megaphone': return Megaphone;
      case 'Film': return Film;
      case 'Headphones': return Headphones;
      case 'Share2': return Share2;
      case 'Rocket': return Rocket;
      case 'UserCheck': return UserCheck;
      case 'Image': return ImageIcon;
      case 'FileText': return FileText;
      case 'Globe': return Globe;
      default: return Sliders;
    }
  };

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    setServicePreselectId(id);
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
                Professional Author Solutions
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
                Our Author Services
              </h1>
              <p className="text-sm text-[#525B55] mt-2 max-w-2xl leading-relaxed">
                From cinematic book trailers and targeted launch campaigns to audiobook mastering and developmental line editing, we offer transparent, high-integrity support to champion your book.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleSelectService('service-02')}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isTrailerService
                    ? 'bg-[#143826] text-[#FAF6F0]'
                    : 'text-[#143826] bg-[#E8D4B4] hover:bg-[#F3E5CF] border border-[#C5A059]/40'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Featured Book Trailers Portfolio</span>
              </button>

              <button
                onClick={() => setActiveView('pricing')}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#143826] border border-[#D5CDBD] hover:bg-[#EFECE4] rounded transition-colors cursor-pointer"
              >
                Compare Pricing Tiers
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Services Navigation List on Left, Active Service Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Menu / Selector */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#68736D] px-2 mb-3">
              Select Service ({services.length} Available)
            </h3>
            <div className="space-y-1.5">
              {services.map((service, idx) => {
                const Icon = getServiceIcon(service.iconName);
                const isSelected = service.id === selectedServiceId;
                const isTrailer = service.id === 'service-02' || service.name.toLowerCase().includes('trailer');

                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service.id)}
                    className={`w-full text-left p-3.5 rounded transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-[#143826] text-[#FAF6F0] border-[#143826] shadow-2xs'
                        : 'bg-[#FFFFFF] text-[#2C332F] border-[#E6DFD5] hover:border-[#143826]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs tabular-nums ${isSelected ? 'text-[#D4AF37]' : 'text-[#8C6D23]'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FAF6F0]' : 'text-[#143826]'}`} />
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold truncate max-w-[190px]">
                          {service.name}
                        </span>
                        {isTrailer && (
                          <span className={`text-[10px] font-medium tracking-tight ${isSelected ? 'text-[#E8D4B4]' : 'text-[#8C6D23]'}`}>
                            ★ 3 Client Trailers Showcased
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-[#9AA39E]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Promo Callout */}
            <div className="mt-6 p-4 bg-[#FAF7F2] border border-[#E6DFD5] rounded-sm text-xs text-[#525B55] space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                <Sparkles className="w-4 h-4 text-[#8C6D23]" />
                <span>Custom Author Bundles</span>
              </div>
              <p className="leading-relaxed">
                Need a combination of video trailers, press kit design, and book club placements? We provide customized multi-format packages for new and backlist releases.
              </p>
            </div>
          </div>

          {/* Right Main Service Detail View */}
          <div className="lg:col-span-8 bg-[#FFFFFF] rounded border border-[#E6DFD5] p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* Service Header */}
            <div className="border-b border-[#EFEBE4] pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#8C6D23] uppercase tracking-wider mb-1">
                <div className="flex items-center gap-2">
                  <span>Service Spotlight</span>
                  <span aria-hidden="true">·</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeframe: {selectedService.deliveryTimeframe}</span>
                </div>

                {isTrailerService && (
                  <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#143826] border border-[#C5A059]/40 text-[10px] font-bold">
                    Official Production Reel
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#143826]">
                {selectedService.name}
              </h2>
              <p className="text-sm text-[#464F4A] mt-2 leading-relaxed">
                {selectedService.fullDescription}
              </p>

              {/* View Filter Switcher when inside Book Trailer Service */}
              {isTrailerService && (
                <div className="mt-4 pt-4 border-t border-[#F0EBE1] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#143826] mr-1">
                    Display:
                  </span>
                  <button
                    type="button"
                    onClick={() => setTrailerViewTab('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                      trailerViewTab === 'all'
                        ? 'bg-[#143826] text-[#FAF6F0]'
                        : 'bg-[#FAF7F2] text-[#4E5752] hover:bg-[#EFECE4] border border-[#E0D7C7]'
                    }`}
                  >
                    Complete Overview (Work &amp; Packages)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrailerViewTab('work')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      trailerViewTab === 'work'
                        ? 'bg-[#143826] text-[#FAF6F0]'
                        : 'bg-[#FAF7F2] text-[#4E5752] hover:bg-[#EFECE4] border border-[#E0D7C7]'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current text-[#8C6D23]" />
                    <span>Work We Have Done (3 Trailers)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrailerViewTab('packages')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                      trailerViewTab === 'packages'
                        ? 'bg-[#143826] text-[#FAF6F0]'
                        : 'bg-[#FAF7F2] text-[#4E5752] hover:bg-[#EFECE4] border border-[#E0D7C7]'
                    }`}
                  >
                    Pricing Packages ({selectedService.packages.length})
                  </button>
                </div>
              )}
            </div>

            {/* Suitability & Deliverables Grid */}
            {(trailerViewTab === 'all' || trailerViewTab === 'packages') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F2] p-5 rounded border border-[#EAE4D8]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#143826] mb-2">
                    Who This Service Is For
                  </h4>
                  <p className="text-xs text-[#525B55] leading-relaxed">
                    {selectedService.suitableFor}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#143826] mb-2">
                    What You Receive
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#525B55]">
                    {selectedService.whatYouReceive.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#143826] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* WORK WE HAVE DONE: FEATURED BOOK TRAILERS PORTFOLIO SHOWCASE */}
            {/* Displayed inside "Our Services" and inside the Book Trailer part */}
            {/* ============================================================== */}
            {isTrailerService && (trailerViewTab === 'all' || trailerViewTab === 'work') && (
              <div id="book-trailer-portfolio" className="pt-2">
                <BookTrailerShowcase
                  onOrderTrailer={(trailerTitle) => {
                    openEnquiryModal('Book Trailer Production', `Style reference: ${trailerTitle}`);
                  }}
                />
              </div>
            )}

            {/* Banner when NOT on Book Trailer: Direct link to view the work */}
            {!isTrailerService && (
              <div className="p-4 bg-[#FAF7F2] rounded border border-[#E0D7C7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-[#143826] font-semibold flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-[#8C6D23]" />
                    <span>Looking for our Book Trailer production work?</span>
                  </strong>
                  <p className="text-[#525B55] mt-0.5">
                    View the 3 featured client trailers produced by The Book Clique (Crenshaw, Vacancy, and Girls of Storm and Shadow).
                  </p>
                </div>
                <button
                  onClick={() => handleSelectService('service-02')}
                  className="px-4 py-2 font-semibold text-[#143826] bg-[#E8D4B4] hover:bg-[#F3E5CF] rounded shrink-0 cursor-pointer transition-colors"
                >
                  View Book Trailers Reel →
                </button>
              </div>
            )}

            {/* Service Packages */}
            {(trailerViewTab === 'all' || trailerViewTab === 'packages') && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#636E67]">
                    Available Package Tiers ({selectedService.packages.length})
                  </h3>
                  <span className="text-xs text-[#8C6D23] font-medium">
                    Configurable &amp; Transparent
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedService.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`rounded border p-5 flex flex-col justify-between transition-all ${
                        pkg.isPopular
                          ? 'bg-[#FCFBF8] border-[#143826] shadow-xs'
                          : 'bg-[#FFFFFF] border-[#E6DFD5]'
                      }`}
                    >
                      <div>
                        {pkg.isPopular && (
                          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#143826] bg-[#E8D4B4] px-2 py-0.5 rounded-xs inline-block mb-2">
                            Most Requested
                          </span>
                        )}
                        <h4 className="font-serif text-lg font-semibold text-[#143826]">
                          {pkg.name}
                        </h4>
                        <p className="font-semibold text-xs text-[#8C6D23] mt-1 tabular-nums">
                          {pkg.price}
                        </p>
                        <p className="text-xs text-[#556059] mt-2 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[#F0EBE1] space-y-1.5 text-xs text-[#4E5752]">
                          <div className="font-medium text-[11px] text-[#143826]">Inclusions:</div>
                          {pkg.deliverables.slice(0, 3).map((d, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                              <span className="text-[#8C6D23] font-bold">·</span>
                              <span>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#F0EBE1]">
                        <div className="text-[11px] text-[#717C76] mb-3">
                          <span>Turnaround: {pkg.turnaround}</span>
                        </div>
                        <button
                          onClick={() => openEnquiryModal(selectedService.name, pkg.name)}
                          className={`w-full py-2 px-3 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer text-center ${
                            pkg.isPopular
                              ? 'bg-[#143826] text-[#FAF6F0] hover:bg-[#1E4D35]'
                              : 'bg-[#EFEBE4] text-[#143826] hover:bg-[#E4DFD5]'
                          }`}
                        >
                          Enquire &amp; Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Quote Note */}
            <div className="p-4 bg-[#F2EDE2] rounded border border-[#E0D7C7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-[#143826] font-semibold">Have custom or multi-title requirements?</strong>
                <p className="text-[#525B55] mt-0.5">We provide tailored quotes for series releases, publisher catalogues, and specialized campaigns.</p>
              </div>
              <button
                onClick={() => openEnquiryModal(selectedService.name, 'Custom Quotation')}
                className="px-4 py-2 font-semibold text-[#143826] bg-[#FFFFFF] border border-[#D5CDBD] hover:bg-[#FAF7F2] rounded shrink-0 cursor-pointer"
              >
                Request Custom Quote
              </button>
            </div>

            {/* Work With Us Direct Author Partnership Banner */}
            <div className="mt-6 p-6 bg-gradient-to-r from-[#143826] via-[#1B4B33] to-[#0F2D1F] rounded border border-[#C5A059]/40 text-[#FAF6F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E5C178]">
                  Author Partnership &amp; Enquiry
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#FAF6F0] mt-1">
                  Ready to Work With The Book Clique?
                </h3>
                <p className="text-xs sm:text-sm text-[#D1DDD6] mt-1.5 max-w-xl leading-relaxed">
                  Tell us about your book and how you would like to work with The Book Clique. We welcome enquiries from authors interested in our services, promotional opportunities and manuscript consideration.
                </p>
              </div>

              <button
                onClick={() => setActiveView('work-with-us')}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0F291E] bg-[#E8D4B4] hover:bg-[#F3E5CF] rounded transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-2"
              >
                <span>Go to Work With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

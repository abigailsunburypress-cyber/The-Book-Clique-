import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, Plus, Sparkles, X, User, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';

export const OurTeamView: React.FC = () => {
  const { teamMembers, updateTeamMember, setIsAdminOpen } = useApp();
  const [activeBioMember, setActiveBioMember] = useState<TeamMember | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper for member monogram initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (name[0] || '').toUpperCase();
  };

  // Allow website owner to quickly upload an authentic photograph if needed
  const handlePhotoUploadClick = (memberId: string) => {
    setUploadTargetId(memberId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetId) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) {
          updateTeamMember(uploadTargetId, {
            photoUrl: dataUrl
          });
        }
        setUploadTargetId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#FBF9F5] py-12 lg:py-16">
      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="border-b border-[#E6DFD5] pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D23]">
                Editorial, Production &amp; Reader Community
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#143826] mt-1 tracking-tight">
                Meet Our Team
              </h1>
              <p className="text-sm text-[#525B55] mt-2 max-w-2xl leading-relaxed">
                Meet the literary coordinators, book trailer specialists, and marketing strategists dedicated to connecting exceptional stories with thoughtful readers across The Book Clique.
              </p>
            </div>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#143826] border border-[#D5CDBD] hover:bg-[#EFECE4] rounded transition-colors cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Team Profiles</span>
            </button>
          </div>
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
                    /* Dignified Photograph Area - Ready for Upload */
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

                      {/* Ready For Upload Badge / Button */}
                      <button
                        type="button"
                        onClick={() => handlePhotoUploadClick(member.id)}
                        className="absolute bottom-3.5 inset-x-3.5 bg-black/65 hover:bg-black/85 backdrop-blur-xs py-2 px-3 rounded-xs border border-[#C5A059]/40 hover:border-[#C5A059] flex items-center justify-center gap-1.5 text-[11px] text-[#FAF6F0] tracking-wide font-medium transition-colors cursor-pointer"
                        title="Upload official photograph for this team member"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Photograph Area · Ready for Upload</span>
                      </button>
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
                <div className="p-6">
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

                  {/* Complete Biography (verbatim, fully displayed and readable) */}
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
              <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-[#737E77]">
                  The Book Clique Team
                </span>

                <button
                  type="button"
                  onClick={() => setActiveBioMember(member)}
                  className="font-semibold text-[#143826] hover:text-[#8C6D23] transition-colors cursor-pointer text-xs flex items-center gap-1"
                >
                  <span>Profile View</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Expanded Profile Modal View */}
      {activeBioMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F291E]/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveBioMember(null);
          }}
        >
          <div className="bg-[#FFFFFF] rounded-sm border border-[#C5A059]/40 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveBioMember(null)}
              className="absolute top-4 right-4 p-1.5 text-[#5C6660] hover:text-[#143826] rounded transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-20 h-24 rounded-xs overflow-hidden bg-[#143826] shrink-0 border border-[#C5A059]/40 flex items-center justify-center">
                {activeBioMember.photoUrl ? (
                  <img
                    src={activeBioMember.photoUrl}
                    alt={activeBioMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center text-[#E8D4B4] font-serif font-bold text-lg">
                    {getInitials(activeBioMember.name)}
                  </div>
                )}
              </div>
              <div className="pr-6">
                <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider block">
                  {activeBioMember.status || activeBioMember.title}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#143826] mt-0.5">
                  {activeBioMember.name}
                </h3>
                <span className="text-xs text-[#6B756F] font-medium block mt-0.5">
                  The Book Clique
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E8E1D5]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-2">
                Official Biography
              </h4>
              <p className="text-xs sm:text-sm text-[#3E4642] leading-relaxed">
                {activeBioMember.bio}
              </p>
            </div>

            {/* Direct Contact Email in Modal */}
            {activeBioMember.email && (
              <div className="mt-5 pt-3.5 border-t border-[#E8E1D5]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D23] block mb-2">
                  Direct Contact Email
                </span>
                <a
                  href={`mailto:${activeBioMember.email}`}
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#143826] hover:text-[#8C6D23] transition-colors group/modalmail break-all"
                  title={`Send an email to ${activeBioMember.name} (${activeBioMember.email})`}
                >
                  <span className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] group-hover/modalmail:border-[#C5A059] flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-4 h-4 text-[#8C6D23]" />
                  </span>
                  <span className="underline decoration-[#C5A059]/40 group-hover/modalmail:decoration-[#8C6D23] underline-offset-2">
                    {activeBioMember.email}
                  </span>
                </a>
              </div>
            )}

            <div className="mt-6 pt-3 flex items-center justify-between border-t border-[#F0EBE1]">
              {!activeBioMember.photoUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    const memberId = activeBioMember.id;
                    setActiveBioMember(null);
                    handlePhotoUploadClick(memberId);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#143826] hover:text-[#8C6D23] font-semibold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Upload Portrait</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setActiveBioMember(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Settings,
  BookOpen,
  Mail,
  DollarSign,
  Users,
  Inbox,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Download,
  BookMarked,
  Eye,
  Upload,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  Calendar,
  Clock,
  Layers,
  UserCheck,
  Search,
  Filter,
  ShieldAlert,
  UserX,
  RefreshCw,
  Heart,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, TeamMember, BookCategory, Manuscript, ManuscriptAccessLevel } from '../types';
import { FICTION_GENRES, NONFICTION_GENRES } from '../data/initialData';
import { calculateBatchSchedule } from '../utils/chapterBatch';

export const AdminStudio: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    siteConfig,
    updateSiteConfig,
    books,
    addBook,
    updateBook,
    deleteBook,
    toggleFeaturedBook,
    services,
    updatePackage,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    enquiries,
    updateEnquiryStatus,
    bookClubSignups,
    contactMessages,
    manuscripts,
    refreshManuscripts,
    openReader,
    communityStats,
    resetToDefaultData,
    bookClubSession,
    activeBookClubManuscript,
    startBookClubSession,
    endBookClubSession,
    refreshBookClubSession,
    updateBookClubSchedule
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'catalogue' | 'manuscripts' | 'pricing' | 'team' | 'inbox'>('general');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Registered Members State
  const [adminMembers, setAdminMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [memberSortOrder, setMemberSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [memberActionLoading, setMemberActionLoading] = useState<string | null>(null);

  const fetchAdminMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch('/api/admin/members');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setAdminMembers(data.members);
        }
      }
    } catch (e) {
      console.error('Failed to load registered members:', e);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'members' || isAdminOpen) {
      fetchAdminMembers();
    }
  }, [activeTab, isAdminOpen]);

  const handleToggleMemberStatus = async (memberId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    setMemberActionLoading(memberId);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'tbc_verified_admin'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showSuccess(`Member account status is now ${nextStatus}.`);
        await fetchAdminMembers();
      } else {
        alert(data.error || 'Failed to update member status.');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating member status.');
    } finally {
      setMemberActionLoading(null);
    }
  };

  // General settings state
  const [officialEmail, setOfficialEmail] = useState(siteConfig.officialGmailAddress);
  const [brandTagline, setBrandTagline] = useState(siteConfig.tagline);
  const [contactNotes, setContactNotes] = useState(siteConfig.contactNotes);

  // New book state
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<BookCategory>('Fiction');
  const [newBookGenre, setNewBookGenre] = useState<string>('Mystery');
  const [newBookDesc, setNewBookDesc] = useState('');
  const [newBookCover, setNewBookCover] = useState('');
  const [newBookYear, setNewBookYear] = useState<number>(2026);
  const [newBookIsbn, setNewBookIsbn] = useState('');

  // New team member state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTitle, setNewTeamTitle] = useState('');
  const [newTeamArea, setNewTeamArea] = useState('');
  const [newTeamBio, setNewTeamBio] = useState('');
  const [newTeamPhoto, setNewTeamPhoto] = useState('');

  // Manuscript Upload state
  const [msFile, setMsFile] = useState<File | null>(null);
  const [msTitle, setMsTitle] = useState('');
  const [msAuthor, setMsAuthor] = useState('');
  const [msCategory, setMsCategory] = useState<BookCategory>('Fiction');
  const [msGenre, setMsGenre] = useState('Literary Fiction');
  const [msDesc, setMsDesc] = useState('');
  const [msCover, setMsCover] = useState('');
  const [msAccess, setMsAccess] = useState<ManuscriptAccessLevel>('public');
  const [isUploadingMs, setIsUploadingMs] = useState(false);
  const [msUploadError, setMsUploadError] = useState<string | null>(null);

  // Book Club Session Management state
  const [sessionSelectedMsId, setSessionSelectedMsId] = useState<string>('');
  const [sessionMeetingDate, setSessionMeetingDate] = useState<string>('Last Thursday of the Month · 7:00 PM EST');
  const [sessionMeetingFormat, setSessionMeetingFormat] = useState<string>('Virtual Salon & Community Annotation Board');
  const [sessionPromptsText, setSessionPromptsText] = useState<string>('');
  const [chaptersPerDaySetting, setChaptersPerDaySetting] = useState<number>(bookClubSession?.chaptersPerDay || 2);
  const [currentDayOverrideSetting, setCurrentDayOverrideSetting] = useState<string>(
    bookClubSession?.currentDayOverride ? String(bookClubSession.currentDayOverride) : 'auto'
  );
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);
  const [sessionActionMsg, setSessionActionMsg] = useState('');

  React.useEffect(() => {
    if (bookClubSession) {
      setChaptersPerDaySetting(bookClubSession.chaptersPerDay || 2);
      setCurrentDayOverrideSetting(
        bookClubSession.currentDayOverride ? String(bookClubSession.currentDayOverride) : 'auto'
      );
    }
  }, [bookClubSession]);

  const [authorEnquiries, setAuthorEnquiries] = useState<any[]>([]);
  const [isLoadingAuthorEnquiries, setIsLoadingAuthorEnquiries] = useState(false);

  const fetchAuthorEnquiries = async () => {
    try {
      setIsLoadingAuthorEnquiries(true);
      const res = await fetch('/api/admin/author-enquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.enquiries)) {
          setAuthorEnquiries(data.enquiries);
        }
      }
    } catch (err) {
      console.warn('Could not fetch author enquiries:', err);
    } finally {
      setIsLoadingAuthorEnquiries(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'inbox' && isAdminOpen) {
      fetchAuthorEnquiries();
    }
  }, [activeTab, isAdminOpen]);

  if (!isAdminOpen) return null;

  const showSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      officialGmailAddress: officialEmail.trim(),
      tagline: brandTagline.trim(),
      contactNotes: contactNotes.trim(),
      scamNoticeLastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
    showSuccess('General site settings and official Gmail address updated site-wide!');
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) return;

    addBook({
      title: newBookTitle.trim(),
      author: newBookAuthor.trim(),
      category: newBookCategory,
      genre: newBookGenre,
      description: newBookDesc.trim() || 'A new catalogue entry waiting for full editorial synopsis.',
      coverImage: newBookCover.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
      publicationYear: Number(newBookYear) || 2026,
      isbn: newBookIsbn.trim() || '978-0-00000-000-0',
      publisher: 'The Book Clique Press / Independent',
      format: 'Hardcover & Ebook',
      isFeatured: false,
      isRecentlyAdded: true,
      isSampleRecord: false
    });

    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookDesc('');
    setNewBookCover('');
    setNewBookIsbn('');
    showSuccess(`Book "${newBookTitle}" added to catalogue successfully!`);
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamTitle.trim()) return;

    addTeamMember({
      name: newTeamName.trim(),
      title: newTeamTitle.trim(),
      areaOfResponsibility: newTeamArea.trim() || 'General Curation',
      bio: newTeamBio.trim() || 'Professional team member at The Book Clique.',
      photoUrl: newTeamPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      isSampleProfile: false
    });

    setNewTeamName('');
    setNewTeamTitle('');
    setNewTeamArea('');
    setNewTeamBio('');
    setNewTeamPhoto('');
    showSuccess('Team profile added successfully!');
  };

  const handleUploadManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msFile) {
      setMsUploadError('Please select a genuine PDF manuscript file (.pdf)');
      return;
    }
    if (!msTitle.trim() || !msAuthor.trim()) {
      setMsUploadError('Book title and author are required.');
      return;
    }

    setIsUploadingMs(true);
    setMsUploadError(null);

    try {
      const formData = new FormData();
      formData.append('pdfFile', msFile);
      formData.append('title', msTitle.trim());
      formData.append('author', msAuthor.trim());
      formData.append('category', msCategory);
      formData.append('genre', msGenre);
      formData.append('description', msDesc.trim() || 'Uploaded via The Book Clique Administrator Dashboard.');
      formData.append('coverImage', msCover.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80');
      formData.append('accessLevel', msAccess);
      formData.append('isPublished', 'true');

      const res = await fetch('/api/admin/manuscripts/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': 'tbc_verified_admin'
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload manuscript.');
      }

      setMsFile(null);
      setMsTitle('');
      setMsAuthor('');
      setMsDesc('');
      setMsCover('');
      await refreshManuscripts();
      showSuccess(`Manuscript "${data.manuscript.title}" stored securely! (${data.manuscript.pageCount} pages, ${(data.manuscript.fileSizeBytes / 1024).toFixed(1)} KB)`);
    } catch (err: any) {
      setMsUploadError(err.message || 'Error uploading manuscript.');
    } finally {
      setIsUploadingMs(false);
    }
  };

  const handleTogglePublishManuscript = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/manuscripts/${id}/toggle-publish`, {
        method: 'POST',
        headers: { 'x-admin-key': 'tbc_verified_admin' }
      });
      if (res.ok) {
        await refreshManuscripts();
        showSuccess('Manuscript publication status updated.');
      }
    } catch (e) {
      console.error('Failed to toggle publish status:', e);
    }
  };

  const handleDeleteManuscript = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from private storage?`)) return;
    try {
      const res = await fetch(`/api/admin/manuscripts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': 'tbc_verified_admin' }
      });
      if (res.ok) {
        await refreshManuscripts();
        showSuccess(`"${title}" deleted from private archive.`);
      }
    } catch (e) {
      console.error('Failed to delete manuscript:', e);
    }
  };

  const handleUpdateAccessLevel = async (id: string, accessLevel: ManuscriptAccessLevel) => {
    try {
      const res = await fetch(`/api/admin/manuscripts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'tbc_verified_admin'
        },
        body: JSON.stringify({ accessLevel })
      });
      if (res.ok) {
        await refreshManuscripts();
        showSuccess(`Access level set to "${accessLevel}".`);
      }
    } catch (e) {
      console.error('Failed to update access level:', e);
    }
  };

  const handlePreviewManuscript = (m: Manuscript) => {
    setIsAdminOpen(false);
    openReader(m);
  };

  const handleStartSession = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetId = sessionSelectedMsId || (manuscripts[0] ? manuscripts[0].id : '');
    if (!targetId) {
      alert('Please select a manuscript to start the reading session.');
      return;
    }
    setIsUpdatingSession(true);
    setSessionActionMsg('');
    const prompts = sessionPromptsText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const res = await startBookClubSession(targetId, {
      meetingDate: sessionMeetingDate,
      meetingFormat: sessionMeetingFormat,
      discussionPrompts: prompts.length > 0 ? prompts : undefined,
      chaptersPerDay: chaptersPerDaySetting
    });
    setIsUpdatingSession(false);
    if (res.success) {
      setSessionActionMsg('Reading session started with daily chapter batch schedule! Both Book Club and Featured Book of the Month have been updated.');
      showSuccess('Active Book Club manuscript updated!');
      setTimeout(() => setSessionActionMsg(''), 4000);
    } else {
      alert(res.error || 'Failed to start session.');
    }
  };

  const handleSaveBatchSchedule = async () => {
    setIsUpdatingSession(true);
    setSessionActionMsg('');
    const overrideVal = currentDayOverrideSetting === 'auto' ? null : parseInt(currentDayOverrideSetting, 10);
    const res = await updateBookClubSchedule({
      chaptersPerDay: chaptersPerDaySetting,
      currentDayOverride: overrideVal
    });
    setIsUpdatingSession(false);
    if (res.success) {
      setSessionActionMsg(res.message || 'Daily batch release schedule updated!');
      showSuccess('Release schedule updated!');
      setTimeout(() => setSessionActionMsg(''), 4000);
    } else {
      alert(res.error || 'Failed to update schedule.');
    }
  };

  const handleEndSession = async () => {
    if (!window.confirm('Are you sure you want to end the current reading session? The active manuscript will be archived to Reading History, and all manuscripts will remain locked until you select the next book.')) {
      return;
    }
    setIsUpdatingSession(true);
    setSessionActionMsg('');
    const res = await endBookClubSession();
    setIsUpdatingSession(false);
    if (res.success) {
      setSessionActionMsg('Session ended. Current book moved to reading history.');
      showSuccess('Reading session ended.');
      setTimeout(() => setSessionActionMsg(''), 4000);
    } else {
      alert(res.error || 'Failed to end session.');
    }
  };

  const handleMakeActiveSession = async (msId: string) => {
    setIsUpdatingSession(true);
    const res = await startBookClubSession(msId);
    setIsUpdatingSession(false);
    if (res.success) {
      setSessionActionMsg('Manuscript is now active in Book Club and Featured Book of the Month!');
      showSuccess('Active manuscript set!');
      setTimeout(() => setSessionActionMsg(''), 4000);
    } else {
      alert(res.error || 'Failed to set active session.');
    }
  };

  const handleExportJson = () => {
    const backupData = {
      siteConfig,
      books,
      services,
      teamMembers,
      enquiries,
      bookClubSignups,
      contactMessages,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-book-clique-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F291E]/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-5xl bg-[#FBF9F5] rounded border border-[#D5CDBD] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#143826] text-[#FAF6F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#E8D4B4] text-[#143826] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-semibold">
                Website Administration & Content Management
              </h2>
              <p className="text-[11px] text-[#C6D8CE]">
                The Book Clique Studio · Centralized Data & Settings Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAdminOpen(false);
                window.dispatchEvent(new CustomEvent('replay-butterfly-entrance'));
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-[#C5A059] hover:bg-[#D4AF37] text-[#143826] rounded transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Test & Replay Multi-Butterfly Entrance Animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#143826]" />
              <span className="hidden sm:inline">Replay Butterflies</span>
            </button>
            <button
              onClick={handleExportJson}
              className="p-1.5 text-[#D1DDD6] hover:text-[#FFFFFF] rounded cursor-pointer"
              title="Export Current Site Data as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-[#D1DDD6] hover:text-[#FFFFFF] rounded cursor-pointer"
              aria-label="Close Admin Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 py-2 bg-[#FAF7F2] border-b border-[#E6DFD5] overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Official Email & Site Config</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'members' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Registered Members ({adminMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'catalogue' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Book Catalogue ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manuscripts')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manuscripts' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Online Manuscripts ({manuscripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Services & Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'team' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Members ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inbox' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Enquiries & Inquiries ({enquiries.length + contactMessages.length})</span>
          </button>
        </div>

        {/* Success toast banner */}
        {saveSuccessMsg && (
          <div className="bg-[#143826] text-[#FDE68A] px-6 py-2 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#FDE68A]" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-6">
          
          {/* TAB 1: General Settings & Official Gmail */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#143826]">
                  Official Contact & Scam Alert Configuration
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Changing the official Gmail address here immediately propagates to the top Scam Alert Banner on every page, the Contact Us page, and the global footer.
                </p>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-4">
                <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-5 rounded space-y-4">
                  <div>
                    <label htmlFor="admin-official-email" className="block text-xs font-bold text-[#143826] uppercase tracking-wider mb-1">
                      Official Gmail Address *
                    </label>
                    <input
                      id="admin-official-email"
                      type="text"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      required
                      placeholder="e.g. thebookclique.official@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded text-[#1C1E1D] font-mono focus:outline-2 focus:outline-[#143826]"
                    />
                    <div className="text-[11px] text-[#525B55] mt-1.5 flex flex-wrap items-center gap-2">
                      <span>Confirmed Active Address:</span>
                      <strong className="font-mono text-[#143826]">{siteConfig.officialGmailAddress}</strong>
                      <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-2 py-0.5 rounded border border-[#86EFAC]">
                        Official Contact Email — Owner Confirmed
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-tagline" className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Brand Tagline
                    </label>
                    <input
                      id="admin-tagline"
                      type="text"
                      value={brandTagline}
                      onChange={(e) => setBrandTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-notes" className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Official Contact Advisory Note
                    </label>
                    <textarea
                      id="admin-notes"
                      rows={2}
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Global Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetToDefaultData}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#78231C] border border-[#78231C]/30 hover:bg-[#FAF0EE] rounded transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Demo Data</span>
                  </button>
                </div>
              </form>

              {/* Community Metrics Audit */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-5 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-[#143826]">
                    Global Community Statistics
                  </h4>
                  <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                    Live Synchronized
                  </span>
                </div>
                <p className="text-xs text-[#525B55]">
                  Live status of the global readers and followers counters displayed on the homepage.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3.5 rounded border border-[#E6DFD5]">
                    <span className="text-[11px] font-semibold text-[#7A857F] uppercase tracking-wider block">
                      Registered Readers
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#143826] block mt-1">
                      {communityStats.totalReaders.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#525B55]">
                      Baseline ({communityStats.baseReaders}) + {communityStats.registeredReadersCount} Live Accounts
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded border border-[#E6DFD5]">
                    <span className="text-[11px] font-semibold text-[#7A857F] uppercase tracking-wider block">
                      Community Followers
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#143826] block mt-1">
                      {communityStats.totalFollowers.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#525B55]">
                      Baseline ({communityStats.baseFollowers}) + {communityStats.registeredFollowersCount} Live Follows
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Registered Members Management */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#C5A059]" />
                    <span>Registered Members Management</span>
                  </h3>
                  <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                    Live authenticated reader accounts with automatic approval, immediate Book Club access, and administrative moderation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchAdminMembers}
                  disabled={isLoadingMembers}
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#EAE4D8] border border-[#D5CDBD] text-[#143826] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#8C6D23] ${isLoadingMembers ? 'animate-spin' : ''}`} />
                  <span>Refresh Members</span>
                </button>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Total Registered Readers
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-[#143826]">
                      {adminMembers.length}
                    </span>
                    <span className="text-[11px] text-[#15803D] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded">
                      Live Database Records
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    Every member automatically approved upon submission.
                  </span>
                </div>

                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Active Accounts
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-[#15803D]">
                      {adminMembers.filter((m) => m.status !== 'suspended').length}
                    </span>
                    <span className="text-[11px] text-[#525B55]">
                      Full Reading Access
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    Can read released chapters, rate, and comment.
                  </span>
                </div>

                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Suspended Accounts
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-[#B91C1C]">
                      {adminMembers.filter((m) => m.status === 'suspended').length}
                    </span>
                    <span className="text-[11px] text-[#717C76]">
                      Restricted
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    Blocked from reading tokens, comments, and ratings.
                  </span>
                </div>
              </div>

              {/* Search, Filter & Sort Bar */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-4 rounded flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search by full name or email address..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5CDBD] rounded text-xs text-[#1C1E1D] focus:outline-hidden focus:border-[#143826]"
                  />
                  {memberSearch && (
                    <button
                      type="button"
                      onClick={() => setMemberSearch('')}
                      className="absolute right-2.5 top-2.5 text-[#717C76] hover:text-[#143826] text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-[#D5CDBD] rounded px-2.5 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#8C6D23]" />
                    <span className="text-xs text-[#717C76]">Status:</span>
                    <select
                      value={memberStatusFilter}
                      onChange={(e) => setMemberStatusFilter(e.target.value as any)}
                      className="text-xs font-semibold text-[#143826] bg-transparent focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">All ({adminMembers.length})</option>
                      <option value="active">Active Only</option>
                      <option value="suspended">Suspended Only</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-[#D5CDBD] rounded px-2.5 py-1.5">
                    <span className="text-xs text-[#717C76]">Sort:</span>
                    <select
                      value={memberSortOrder}
                      onChange={(e) => setMemberSortOrder(e.target.value as any)}
                      className="text-xs font-semibold text-[#143826] bg-transparent focus:outline-hidden cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white border border-[#E6DFD5] rounded shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#143826] text-[#FAF6F0] uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Member Name</th>
                        <th className="py-3 px-4">Email Address</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Niche You Love</th>
                        <th className="py-3 px-4">Registered Date & Time</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Moderation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DFD5] text-[#1C1E1D]">
                      {adminMembers
                        .filter((m) => {
                          if (memberStatusFilter === 'active' && m.status === 'suspended') return false;
                          if (memberStatusFilter === 'suspended' && m.status !== 'suspended') return false;
                          if (!memberSearch.trim()) return true;
                          const q = memberSearch.toLowerCase().trim();
                          return (
                            (m.fullName && m.fullName.toLowerCase().includes(q)) ||
                            (m.email && m.email.toLowerCase().includes(q)) ||
                            (m.niche && m.niche.toLowerCase().includes(q)) ||
                            (m.country && m.country.toLowerCase().includes(q))
                          );
                        })
                        .sort((a, b) => {
                          const dateA = new Date(a.createdAt || 0).getTime();
                          const dateB = new Date(b.createdAt || 0).getTime();
                          return memberSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                        })
                        .map((member) => {
                          const isSuspended = member.status === 'suspended';
                          return (
                            <tr key={member.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="py-3 px-4 font-semibold text-[#143826] whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#143826] text-[#FAF6F0] flex items-center justify-center font-serif font-bold text-xs">
                                    {(member.fullName || 'R').charAt(0).toUpperCase()}
                                  </div>
                                  <span>{member.fullName || 'Community Reader'}</span>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-mono text-[#525B55] whitespace-nowrap">
                                <a
                                  href={`mailto:${member.email}`}
                                  className="hover:underline hover:text-[#143826]"
                                >
                                  {member.email}
                                </a>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 text-xs text-[#2C332F]">
                                  <span>{member.countryFlag || '🌍'}</span>
                                  <span>{member.country || 'International'}</span>
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                {member.niche ? (
                                  <span className="inline-flex items-center gap-1 bg-[#FAF6F0] text-[#8C6D23] border border-[#E6DFD5] px-2 py-0.5 rounded text-[11px] font-medium">
                                    <Heart className="w-3 h-3 text-[#C5A059]" />
                                    <span>{member.niche}</span>
                                  </span>
                                ) : (
                                  <span className="text-[#A4B5AC] italic text-[11px]">Not specified</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-[#717C76] whitespace-nowrap text-[11px]">
                                {member.createdAt
                                  ? new Date(member.createdAt).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })
                                  : 'Recently registered'}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                {isSuspended ? (
                                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                                    <span>Suspended</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Active</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMemberStatus(member.id, member.status || 'active')}
                                  disabled={memberActionLoading === member.id}
                                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                                    isSuspended
                                      ? 'bg-[#15803D] hover:bg-[#166534] text-white shadow-2xs'
                                      : 'bg-[#FAF6F0] hover:bg-rose-50 border border-rose-200 text-rose-700'
                                  }`}
                                >
                                  {memberActionLoading === member.id
                                    ? 'Updating...'
                                    : isSuspended
                                    ? 'Reactivate Account'
                                    : 'Suspend Account'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                      {adminMembers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-[#717C76]">
                            <UserX className="w-8 h-8 text-[#A4B5AC] mx-auto mb-2" />
                            <p className="font-semibold text-sm">No registered members found</p>
                            <p className="text-xs text-[#A4B5AC] mt-1">
                              New registrations from the Book Club form will appear here automatically.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Catalogue Management */}
          {activeTab === 'catalogue' && (
            <div className="space-y-8">
              
              {/* Add New Book Form */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-5 sm:p-6 rounded">
                <h4 className="font-serif text-lg font-semibold text-[#143826] mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#8C6D23]" />
                  <span>Add New Book to Catalogue</span>
                </h4>

                <form onSubmit={handleAddBookSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        value={newBookTitle}
                        onChange={(e) => setNewBookTitle(e.target.value)}
                        required
                        placeholder="e.g. Whispers of the Highlands"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Author Name *
                      </label>
                      <input
                        type="text"
                        value={newBookAuthor}
                        onChange={(e) => setNewBookAuthor(e.target.value)}
                        required
                        placeholder="e.g. Laura MacLeod"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Category
                      </label>
                      <select
                        value={newBookCategory}
                        onChange={(e) => {
                          const cat = e.target.value as BookCategory;
                          setNewBookCategory(cat);
                          setNewBookGenre(cat === 'Fiction' ? FICTION_GENRES[0] : NONFICTION_GENRES[0]);
                        }}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded"
                      >
                        <option value="Fiction">Fiction</option>
                        <option value="Nonfiction">Nonfiction</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Genre
                      </label>
                      <select
                        value={newBookGenre}
                        onChange={(e) => setNewBookGenre(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded"
                      >
                        {(newBookCategory === 'Fiction' ? FICTION_GENRES : NONFICTION_GENRES).map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Pub Year / ISBN
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newBookYear}
                          onChange={(e) => setNewBookYear(Number(e.target.value))}
                          placeholder="2026"
                          className="w-24 px-2 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                        />
                        <input
                          type="text"
                          value={newBookIsbn}
                          onChange={(e) => setNewBookIsbn(e.target.value)}
                          placeholder="ISBN"
                          className="w-full px-2 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={newBookCover}
                      onChange={(e) => setNewBookCover(e.target.value)}
                      placeholder="https://... or leave empty for default cover"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D5CDBD] rounded font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                      Synopsis / Description
                    </label>
                    <textarea
                      rows={2}
                      value={newBookDesc}
                      onChange={(e) => setNewBookDesc(e.target.value)}
                      placeholder="Brief overview of the book..."
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded transition-colors cursor-pointer"
                  >
                    Add Title to Catalogue
                  </button>
                </form>
              </div>

              {/* Existing Books List */}
              <div>
                <h4 className="font-serif text-lg font-semibold text-[#143826] mb-3">
                  Current Catalogue Titles ({books.length})
                </h4>

                <div className="divide-y divide-[#E6DFD5] border border-[#E6DFD5] rounded bg-white">
                  {books.map((book) => (
                    <div key={book.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-[#EFE9DE] rounded overflow-hidden shrink-0 border border-[#D5CDBD]">
                          <img
                            src={book.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#143826]">{book.title}</span>
                            {book.isFeatured && (
                              <span className="text-[10px] font-semibold text-[#8C6D23] bg-[#F7F0E1] px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#525B55] block">
                            By {book.author} · {book.category} ({book.genre})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            toggleFeaturedBook(book.id);
                            showSuccess(`Updated featured status for "${book.title}"`);
                          }}
                          className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
                            book.isFeatured
                              ? 'bg-[#143826] text-[#FAF6F0] border-[#143826]'
                              : 'bg-white text-[#4A534E] border-[#D5CDBD] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {book.isFeatured ? 'Featured' : 'Make Featured'}
                        </button>

                        <button
                          onClick={() => {
                            deleteBook(book.id);
                            showSuccess(`Deleted "${book.title}" from catalogue.`);
                          }}
                          className="p-1.5 text-[#9E2B22] hover:bg-[#FDF0EE] rounded cursor-pointer"
                          title="Delete book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Online Manuscript Library & PDF Security */}
          {activeTab === 'manuscripts' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#143826]">
                  Online Manuscript Library &amp; PDF Management
                </h3>
                <p className="text-xs text-[#525B55] mt-1">
                  Upload genuine PDF book manuscripts into private storage, manage Book Club reading sessions, and preview the authentic typographical layout in the secure browser reader.
                </p>
              </div>

              {/* ========================================================= */}
              {/* BOOK CLUB SESSION MANAGEMENT (ONE ACTIVE BOOK AT A TIME)  */}
              {/* ========================================================= */}
              <div className="bg-[#FFFFFF] border-2 border-[#143826] rounded p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE1] pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23] mb-1">
                      <BookMarked className="w-4 h-4 text-[#8C6D23]" />
                      <span>Book Club &amp; Featured Book Session Control</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#143826]">
                      One-Manuscript-At-A-Time Reading System
                    </h4>
                    <p className="text-xs text-[#525B55] mt-0.5">
                      Selecting an active Book Club manuscript automatically sets it as the Featured Book of the Month. All other manuscripts remain locked.
                    </p>
                  </div>

                  {bookClubSession?.sessionStatus === 'active' && activeBookClubManuscript ? (
                    <button
                      type="button"
                      onClick={handleEndSession}
                      disabled={isUpdatingSession}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9E2B22] hover:bg-[#801B14] text-[#FFFFFF] rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs shrink-0"
                    >
                      <span>End Current Session</span>
                    </button>
                  ) : null}
                </div>

                {/* Session Action Feedback Message */}
                {sessionActionMsg && (
                  <div className="p-3 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] rounded text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{sessionActionMsg}</span>
                  </div>
                )}

                {/* Current Active Status Banner */}
                {bookClubSession?.sessionStatus === 'active' && activeBookClubManuscript ? (
                  <div className="p-4 bg-[#FAF8F5] border border-[#143826]/30 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={activeBookClubManuscript.coverImage}
                        alt={activeBookClubManuscript.title}
                        className="w-12 h-16 object-cover rounded border border-[#E6DFD5] shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#86EFAC] inline-block mb-1">
                          Current Active Book Club Book
                        </span>
                        <h5 className="font-serif text-base font-bold text-[#143826]">
                          {activeBookClubManuscript.title}
                        </h5>
                        <p className="text-xs text-[#525B55]">
                          By {activeBookClubManuscript.author} · {activeBookClubManuscript.pageCount} Pages
                        </p>
                        {bookClubSession.startedAt && (
                          <p className="text-[11px] text-[#7A857F] mt-0.5">
                            Session Started: {new Date(bookClubSession.startedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePreviewManuscript(activeBookClubManuscript)}
                        className="px-3 py-1.5 bg-[#143826] text-[#FAF6F0] rounded text-xs font-semibold cursor-pointer"
                      >
                        Preview Reader
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FEF3C7]/60 border border-[#F59E0B]/40 rounded text-xs text-[#92400E] flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-[#D97706]" />
                    <span>
                      <strong>No active reading session currently running.</strong> The Featured Book of the Month displays: <em>“Our next Book Club selection will be announced soon”</em>. Select a manuscript below to start a new session.
                    </span>
                  </div>
                )}

                {/* ========================================================= */}
                {/* DAILY CHAPTER BATCH RELEASE SCHEDULE CONTROLS             */}
                {/* ========================================================= */}
                {bookClubSession?.sessionStatus === 'active' && activeBookClubManuscript && (
                  <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded border border-[#143826]/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4D8] pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Daily Chapter Batch Release Controls</span>
                        </div>
                        <h5 className="font-serif text-sm sm:text-base font-bold text-[#143826]">
                          Reading Pacing &amp; Release Configuration
                        </h5>
                      </div>
                      <span className="text-[11px] font-semibold text-[#143826] bg-[#DCFCE7] px-2.5 py-1 rounded border border-[#86EFAC]">
                        Default: 2 Chapters / Day
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Chapters Per Day selector */}
                      <div>
                        <label className="block text-xs font-semibold text-[#143826] mb-1">
                          Chapters Released Per Day
                        </label>
                        <select
                          value={chaptersPerDaySetting}
                          onChange={(e) => setChaptersPerDaySetting(Math.max(1, parseInt(e.target.value, 10) || 2))}
                          className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                        >
                          <option value={1}>1 Chapter Per Day (Slow / Thorough)</option>
                          <option value={2}>2 Chapters Per Day (Default Standard)</option>
                          <option value={3}>3 Chapters Per Day (Accelerated)</option>
                          <option value={4}>4 Chapters Per Day (Intensive)</option>
                          <option value={5}>5 Chapters Per Day</option>
                        </select>
                        <p className="text-[11px] text-[#636E67] mt-1">
                          The administrator controls the batch size for all community readers.
                        </p>
                      </div>

                      {/* Community Active Day Override */}
                      <div>
                        <label className="block text-xs font-semibold text-[#143826] mb-1">
                          Community Active Day Pacing
                        </label>
                        <select
                          value={currentDayOverrideSetting}
                          onChange={(e) => setCurrentDayOverrideSetting(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                        >
                          <option value="auto">Auto (Natural calendar elapsed days)</option>
                          <option value="1">Day 1 (Batch: Chapters 1 &amp; 2)</option>
                          <option value="2">Day 2 (Batch: Chapters 3 &amp; 4)</option>
                          <option value="3">Day 3 (Batch: Chapters 5 &amp; 6)</option>
                          <option value="4">Day 4 (Batch: Chapters 7 &amp; 8)</option>
                          <option value="5">Day 5 (Batch: Chapters 9 &amp; 10)</option>
                          <option value="6">Day 6 (Batch: Chapters 11 &amp; 12)</option>
                          <option value="7">Day 7 (Batch: Chapters 13 &amp; 14)</option>
                        </select>
                        <p className="text-[11px] text-[#636E67] mt-1">
                          Override active day for testing or advance schedule manually.
                        </p>
                      </div>

                      {/* Pacing Summary */}
                      <div className="bg-[#FAF6F0] p-3 rounded border border-[#EAE4D8] text-xs space-y-1">
                        <div className="font-semibold text-[#143826]">Pacing Schedule Projection:</div>
                        <div className="text-[11px] text-[#525B55]">
                          Total Chapters: <strong>{activeBookClubManuscript.tableOfContents?.length || activeBookClubManuscript.pageCount} sections</strong>
                        </div>
                        <div className="text-[11px] text-[#525B55]">
                          Rate: <strong>{chaptersPerDaySetting} chapter{chaptersPerDaySetting === 1 ? '' : 's'}/day</strong>
                        </div>
                        <div className="text-[11px] text-[#525B55]">
                          Est. Duration: <strong>{Math.ceil((activeBookClubManuscript.tableOfContents?.length || 20) / chaptersPerDaySetting)} days</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleSaveBatchSchedule}
                        disabled={isUpdatingSession}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Save Release Schedule Configuration</span>
                      </button>

                      <span className="text-[11px] text-[#717C76] italic">
                        Instantly updates chapter lock thresholds for all readers.
                      </span>
                    </div>
                  </div>
                )}

                {/* Form to Select Next Manuscript & Start Session */}
                <form onSubmit={handleStartSession} className="p-4 bg-[#FAF7F2] rounded border border-[#EAE4D8] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                    Select Next Book Club Manuscript &amp; Launch Session
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-[#143826] mb-1">
                        Select Manuscript *
                      </label>
                      <select
                        value={sessionSelectedMsId || (activeBookClubManuscript ? activeBookClubManuscript.id : (manuscripts[0]?.id || ''))}
                        onChange={(e) => setSessionSelectedMsId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                      >
                        {manuscripts.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title} — By {m.author}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-[#143826] mb-1">
                        Daily Chapter Batch Size
                      </label>
                      <select
                        value={chaptersPerDaySetting}
                        onChange={(e) => setChaptersPerDaySetting(Math.max(1, parseInt(e.target.value, 10) || 2))}
                        className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                      >
                        <option value={1}>1 Chapter / Day</option>
                        <option value={2}>2 Chapters / Day (Default)</option>
                        <option value={3}>3 Chapters / Day</option>
                        <option value={4}>4 Chapters / Day</option>
                      </select>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-[#143826] mb-1">
                        Scheduled Discussion Date
                      </label>
                      <input
                        type="text"
                        value={sessionMeetingDate}
                        onChange={(e) => setSessionMeetingDate(e.target.value)}
                        placeholder="e.g. Last Thursday of the Month · 7:00 PM EST"
                        className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-[#143826] mb-1">
                        Meeting Format
                      </label>
                      <input
                        type="text"
                        value={sessionMeetingFormat}
                        onChange={(e) => setSessionMeetingFormat(e.target.value)}
                        placeholder="e.g. Virtual Salon & Community Annotation Board"
                        className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143826] mb-1">
                      Discussion Prompts (Optional, one per line)
                    </label>
                    <textarea
                      rows={2}
                      value={sessionPromptsText}
                      onChange={(e) => setSessionPromptsText(e.target.value)}
                      placeholder="Prompt 1&#10;Prompt 2"
                      className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
                    />
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={isUpdatingSession}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                      <span>{isUpdatingSession ? 'Updating Session...' : 'Start / Set Active Book Club Session'}</span>
                    </button>

                    <p className="text-[11px] text-[#7A857F] italic">
                      Updates Book Club and Featured Book of the Month simultaneously with 2 chapters/day release schedule.
                    </p>
                  </div>
                </form>

                {/* Reading History */}
                {bookClubSession?.readingHistory && bookClubSession.readingHistory.length > 0 && (
                  <div className="pt-2 border-t border-[#F0EAE1]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#636E67] block mb-2">
                      Past Completed Sessions History ({bookClubSession.readingHistory.length})
                    </span>
                    <div className="space-y-1">
                      {bookClubSession.readingHistory.map((h, i) => (
                        <div key={i} className="text-xs text-[#525B55] flex items-center justify-between py-1 bg-[#FAF8F5] px-2.5 rounded">
                          <span>{h.sessionTitle || h.manuscriptId} {h.author ? `(by ${h.author})` : ''}</span>
                          <span className="text-[10px] text-[#8C6D23]">Completed {new Date(h.completedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Security & Access Architecture Banner (Prompt Requirement 7 Disclosure) */}
              <div className="p-4 sm:p-5 bg-[#FAF6F0] border border-[#C5A059]/40 rounded text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span>Security &amp; Anti-Download Architecture</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#4A534E] pt-1">
                  <div className="p-2.5 bg-[#FFFFFF] rounded border border-[#E6DFD5]">
                    <strong className="block text-[#143826] font-semibold mb-0.5">Private Storage</strong>
                    Stored in isolated server directory (<code className="text-[10px] bg-[#F0EBE1] px-1 py-0.5 rounded">storage/manuscripts/</code>). No public URL is ever exposed.
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF] rounded border border-[#E6DFD5]">
                    <strong className="block text-[#143826] font-semibold mb-0.5">Authorized Streaming</strong>
                    Served only through token-authenticated endpoint (<code className="text-[10px] bg-[#F0EBE1] px-1 py-0.5 rounded">/api/manuscripts/:id/stream</code>) with 30-min expiry.
                  </div>
                  <div className="p-2.5 bg-[#FFFFFF] rounded border border-[#E6DFD5]">
                    <strong className="block text-[#143826] font-semibold mb-0.5">Canvas-Only Rendering</strong>
                    Rendered via PDF.js on HTML5 canvas with zero browser download buttons, print menus, or right-click export.
                  </div>
                </div>
                <div className="p-2.5 bg-[#FFFBEB] border border-[#F59E0B]/30 rounded text-[11px] text-[#92400E] leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
                  <div>
                    <strong>Administrator Technical Disclosure:</strong> While all visible download controls, menus, and direct file URLs are suppressed, client browsers must receive vector/raster data to render pages on-screen. Determined visitors with advanced browser developer tools or memory dumpers may theoretically capture network payloads. Our architecture implements defense-in-depth, token expiry, and private storage to deter unauthorized distribution.
                  </div>
                </div>
              </div>

              {/* Upload Genuine PDF Manuscript Form */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-5 space-y-4">
                <h4 className="font-serif text-base font-semibold text-[#143826] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#C5A059]" />
                  <span>Upload Genuine PDF Manuscript</span>
                </h4>

                <form onSubmit={handleUploadManuscript} className="space-y-4">
                  {msUploadError && (
                    <div className="p-3 bg-[#FEF2F2] border border-[#F87171] text-[#991B1B] text-xs rounded">
                      {msUploadError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Select PDF Manuscript File *
                      </label>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setMsFile(file);
                          if (file && !msTitle) {
                            setMsTitle(file.name.replace(/\.pdf$/i, ''));
                          }
                        }}
                        required
                        className="w-full text-xs text-[#4A534E] file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#143826] file:text-[#FAF6F0] hover:file:bg-[#1E4D35] cursor-pointer border border-[#D5CDBD] rounded p-1.5 bg-[#FAF8F5]"
                      />
                      <span className="text-[10px] text-[#7A857F] mt-1 block">
                        Must be a genuine PDF document. The system will inspect page count and layout automatically.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Book Title *
                      </label>
                      <input
                        type="text"
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="e.g., The Midnight Conservatory"
                        required
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded focus:outline-hidden focus:border-[#143826]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Author Name *
                      </label>
                      <input
                        type="text"
                        value={msAuthor}
                        onChange={(e) => setMsAuthor(e.target.value)}
                        placeholder="e.g., Eliza Blackwood"
                        required
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded focus:outline-hidden focus:border-[#143826]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Primary Category &amp; Genre *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={msCategory}
                          onChange={(e) => setMsCategory(e.target.value as BookCategory)}
                          className="w-full text-xs px-2.5 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded"
                        >
                          <option value="Fiction">Fiction</option>
                          <option value="Nonfiction">Nonfiction</option>
                        </select>
                        <select
                          value={msGenre}
                          onChange={(e) => setMsGenre(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded"
                        >
                          {(msCategory === 'Fiction' ? FICTION_GENRES : NONFICTION_GENRES).map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Cover Image URL
                      </label>
                      <input
                        type="url"
                        value={msCover}
                        onChange={(e) => setMsCover(e.target.value)}
                        placeholder="https://images.unsplash.com/... or cover art link"
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded focus:outline-hidden focus:border-[#143826]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Reader Access Control *
                      </label>
                      <select
                        value={msAccess}
                        onChange={(e) => setMsAccess(e.target.value as ManuscriptAccessLevel)}
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded"
                      >
                        <option value="public">Public (All Website Visitors)</option>
                        <option value="community">Community Only (Book Club Members)</option>
                        <option value="reviewers_only">Verified Reviewers Only (ARC)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#2D332F] mb-1">
                        Manuscript Synopsis / Editorial Overview
                      </label>
                      <textarea
                        rows={2}
                        value={msDesc}
                        onChange={(e) => setMsDesc(e.target.value)}
                        placeholder="Provide an overview of this manuscript for readers in the library..."
                        className="w-full text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D5CDBD] rounded focus:outline-hidden focus:border-[#143826]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingMs}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-4 h-4 text-[#C5A059]" />
                    <span>{isUploadingMs ? 'Uploading & Processing PDF...' : 'Upload & Encrypt Manuscript'}</span>
                  </button>
                </form>
              </div>

              {/* Manuscript Library List */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] rounded p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-semibold text-[#143826] flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-[#C5A059]" />
                    <span>Active Manuscripts in Private Storage ({manuscripts.length})</span>
                  </h4>
                  <button
                    onClick={() => refreshManuscripts()}
                    className="text-xs font-semibold text-[#143826] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="divide-y divide-[#F0EBE1]">
                  {manuscripts.map((m) => (
                    <div key={m.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={m.coverImage}
                          alt={m.title}
                          className="w-12 h-16 object-cover rounded border border-[#E6DFD5] shrink-0 bg-[#FAF8F5]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-serif text-sm font-semibold text-[#143826] truncate">
                              {m.title}
                            </h5>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              m.isPublished ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}>
                              {m.isPublished ? 'Published' : 'Unpublished / Draft'}
                            </span>
                            <span className="text-[10px] font-semibold text-[#8C6D23] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
                              {m.accessLevel === 'public' ? 'Public Access' : m.accessLevel === 'community' ? 'Community Only' : 'Reviewer ARC'}
                            </span>
                          </div>

                          <span className="text-xs text-[#525B55] block mt-0.5">
                            By {m.author} · {m.category} ({m.genre}) · <strong className="font-mono text-[#143826]">{m.pageCount} Pages</strong> · Access: <strong className="text-[#15803D]">Free Book Club Reading</strong> ({(m.fileSizeBytes / 1024).toFixed(1)} KB)
                          </span>
                          <span className="text-[11px] text-[#7A857F] block line-clamp-1 mt-0.5">
                            {m.description}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {/* Book Club Active Session Status / Quick Set */}
                        {m.id === bookClubSession?.activeManuscriptId && bookClubSession?.sessionStatus === 'active' ? (
                          <span className="px-2.5 py-1 text-xs bg-[#DCFCE7] text-[#15803D] font-bold rounded border border-[#86EFAC] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active Book Club Book</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMakeActiveSession(m.id)}
                            className="px-2.5 py-1 text-xs bg-[#FAF6F0] hover:bg-[#143826] text-[#143826] hover:text-[#FAF6F0] font-semibold rounded border border-[#C5A059]/40 transition-colors cursor-pointer flex items-center gap-1"
                            title="Set this manuscript as the active Book Club selection and Featured Book of the Month"
                          >
                            <BookMarked className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Set as Active Book</span>
                          </button>
                        )}

                        {/* Access Control dropdown */}
                        <select
                          value={m.accessLevel}
                          onChange={(e) => handleUpdateAccessLevel(m.id, e.target.value as ManuscriptAccessLevel)}
                          className="text-xs px-2.5 py-1 bg-[#FAF8F5] border border-[#D5CDBD] rounded cursor-pointer"
                          title="Change Reader Access Permissions"
                        >
                          <option value="public">Public Access</option>
                          <option value="community">Community Only</option>
                          <option value="reviewers_only">Reviewer ARC</option>
                        </select>

                        {/* Publish / Unpublish Toggle */}
                        <button
                          onClick={() => handleTogglePublishManuscript(m.id)}
                          className={`px-3 py-1 text-xs rounded border font-semibold transition-colors cursor-pointer ${
                            m.isPublished
                              ? 'bg-[#FFFFFF] text-[#9E2B22] border-[#FCA5A5] hover:bg-[#FEF2F2]'
                              : 'bg-[#143826] text-[#FAF6F0] border-[#143826] hover:bg-[#1E4D35]'
                          }`}
                        >
                          {m.isPublished ? 'Unpublish' : 'Publish'}
                        </button>

                        {/* Preview in Secure Reader */}
                        <button
                          onClick={() => handlePreviewManuscript(m)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] rounded text-xs font-semibold cursor-pointer shadow-2xs"
                          title="Preview in Canvas Reader"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Preview</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteManuscript(m.id, m.title)}
                          className="p-1.5 text-[#9E2B22] hover:bg-[#FDF0EE] rounded cursor-pointer"
                          title="Delete manuscript permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Pricing & Package Manager */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#143826]">
                  Manage Services & Package Pricing
                </h3>
                <p className="text-xs text-[#525B55] mt-1">
                  Update package prices, turnarounds, or revisions. Changes immediately update across both the Services and Pricing pages.
                </p>
              </div>

              <div className="space-y-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white border border-[#E6DFD5] rounded p-5">
                    <h4 className="font-serif text-base font-semibold text-[#143826] mb-3 border-b border-[#F0EBE1] pb-2">
                      {service.name}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {service.packages.map((pkg) => (
                        <div key={pkg.id} className="p-3.5 bg-[#FAF8F5] rounded border border-[#E6DFD5] text-xs space-y-2">
                          <div className="font-semibold text-[#143826] flex justify-between">
                            <span>{pkg.name}</span>
                            <span className="font-mono text-[#8C6D23]">{pkg.price}</span>
                          </div>

                          <div>
                            <label className="block text-[10px] text-[#717C76] uppercase">Edit Price Text</label>
                            <input
                              type="text"
                              defaultValue={pkg.price}
                              onBlur={(e) => {
                                updatePackage(service.id, pkg.id, { price: e.target.value });
                                showSuccess(`Updated price for ${service.name} - ${pkg.name}`);
                              }}
                              className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-[#717C76] uppercase">Turnaround Time</label>
                            <input
                              type="text"
                              defaultValue={pkg.turnaround}
                              onBlur={(e) => {
                                updatePackage(service.id, pkg.id, { turnaround: e.target.value });
                                showSuccess(`Updated turnaround for ${pkg.name}`);
                              }}
                              className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Team Profiles */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              
              {/* Add Team Member */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-5 rounded">
                <h4 className="font-serif text-lg font-semibold text-[#143826] mb-3">
                  Add Team Profile
                </h4>
                <form onSubmit={handleAddTeamSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      required
                      placeholder="Full Name"
                      className="px-3 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                    />
                    <input
                      type="text"
                      value={newTeamTitle}
                      onChange={(e) => setNewTeamTitle(e.target.value)}
                      required
                      placeholder="Job Title"
                      className="px-3 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                    />
                    <input
                      type="text"
                      value={newTeamArea}
                      onChange={(e) => setNewTeamArea(e.target.value)}
                      placeholder="Area of Responsibility"
                      className="px-3 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                    />
                  </div>

                  <input
                    type="url"
                    value={newTeamPhoto}
                    onChange={(e) => setNewTeamPhoto(e.target.value)}
                    placeholder="Photo URL (optional)"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                  />

                  <textarea
                    rows={2}
                    value={newTeamBio}
                    onChange={(e) => setNewTeamBio(e.target.value)}
                    placeholder="Short biography..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#D5CDBD] rounded"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded cursor-pointer"
                  >
                    Add Team Member
                  </button>
                </form>
              </div>

              {/* Team list */}
              <div className="divide-y divide-[#E6DFD5] border border-[#E6DFD5] rounded bg-white">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EFE9DE] overflow-hidden shrink-0 flex items-center justify-center border border-[#D5CDBD]">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif font-bold text-xs text-[#143826]">
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-[#143826] block">{member.name}</span>
                        <span className="text-[11px] text-[#525B55]">{member.status || member.title} {member.email ? `• ${member.email}` : `(${member.areaOfResponsibility})`}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteTeamMember(member.id);
                        showSuccess(`Removed ${member.name}`);
                      }}
                      className="p-1.5 text-[#9E2B22] hover:bg-[#FAF0EE] rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: Enquiry Inbox */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#143826]">
                  Service Bookings & Inquiries Log
                </h3>
                <p className="text-xs text-[#525B55] mt-1">
                  All author booking requests and general messages submitted through website forms are recorded here.
                </p>
              </div>

              {/* Work With Us - Author Enquiries */}
              <div className="p-4 bg-[#FAF7F2] border-2 border-[#143826]/30 rounded">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                      Work With Us – Author Enquiries ({authorEnquiries.length})
                    </h4>
                    <span className="text-[11px] text-[#8C6D23]">
                      Connected to <strong>thebookclique.official@gmail.com</strong>
                    </span>
                  </div>
                  <button
                    onClick={fetchAuthorEnquiries}
                    disabled={isLoadingAuthorEnquiries}
                    className="text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
                  >
                    {isLoadingAuthorEnquiries ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                {authorEnquiries.length === 0 ? (
                  <p className="text-xs text-[#717C76] italic p-3 bg-white border border-[#E6DFD5] rounded">
                    No author partnership enquiries submitted yet. Submissions from the Work With Us form will appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {authorEnquiries.map((item) => (
                      <div key={item.id} className="p-4 bg-white border border-[#D5CDBD] rounded text-xs space-y-2 text-left shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#F0EBE1] pb-2">
                          <div>
                            <strong className="text-sm font-serif text-[#143826]">{item.fullName}</strong>
                            <a href={`mailto:${item.email}`} className="text-[#8C6D23] ml-2 underline font-mono text-xs">
                              {item.email}
                            </a>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold w-fit ${
                            item.deliveryStatus === 'sent'
                              ? 'bg-[#D1FAE5] text-[#065F46]'
                              : item.deliveryStatus === 'fallback_test'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}>
                            Email: {item.deliveryStatus === 'sent' ? 'Dispatched' : item.deliveryStatus === 'fallback_test' ? 'Test Verified' : 'Queued/Failed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#3A423E]">
                          <div>
                            <span className="text-[#6D7771]">Book Title:</span> <strong>&ldquo;{item.bookTitle}&rdquo;</strong>
                          </div>
                          <div>
                            <span className="text-[#6D7771]">Genre:</span> <strong>{item.bookGenre}</strong>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[#6D7771]">Interest:</span> <strong className="text-[#143826]">{item.interest}</strong>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EAE4D8] text-[#556059] text-[11px]">
                            {item.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#7A857F] pt-2 border-t border-[#F0EBE1]">
                          <span>Submitted: {new Date(item.submittedAt).toLocaleString()}</span>
                          {item.previewUrl && (
                            <a href={item.previewUrl} target="_blank" rel="noreferrer" className="text-[#8C6D23] underline font-semibold">
                              View Test Email Preview &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Enquiries */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2">
                  Service Package Enquiries ({enquiries.length})
                </h4>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-[#717C76] italic p-4 bg-white border border-[#E6DFD5] rounded">
                    No service bookings recorded yet. New submissions will appear here automatically.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-4 bg-white border border-[#E6DFD5] rounded text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-sm font-serif text-[#143826]">{enq.customerName}</strong>
                            <span className="text-[#6D7771] ml-2 font-mono">({enq.email})</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            enq.status === 'Pending Review' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#D1FAE5] text-[#065F46]'
                          }`}>
                            {enq.status}
                          </span>
                        </div>

                        <div className="text-[#3A423E]">
                          Book: <strong>"{enq.bookTitle}"</strong> by {enq.authorName} · Service: <strong>{enq.selectedService} ({enq.selectedPackage})</strong>
                        </div>

                        {enq.projectDescription && (
                          <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#EAE4D8] text-[#556059]">
                            {enq.projectDescription}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#7A857F] pt-2 border-t border-[#F0EBE1]">
                          <span>Submitted: {new Date(enq.submittedAt).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updateEnquiryStatus(enq.id, enq.status === 'Pending Review' ? 'Contacted' : 'Pending Review');
                                showSuccess(`Updated status for ${enq.customerName}`);
                              }}
                              className="text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
                            >
                              Toggle Status ({enq.status === 'Pending Review' ? 'Mark Contacted' : 'Mark Pending'})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Club Signups */}
              <div className="pt-4 border-t border-[#E6DFD5]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2">
                  Book Club Member Registrations ({bookClubSignups.length})
                </h4>
                {bookClubSignups.length === 0 ? (
                  <p className="text-xs text-[#717C76] italic p-4 bg-white border border-[#E6DFD5] rounded">
                    No club registrations yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E6DFD5] border border-[#E6DFD5] rounded bg-white">
                    {bookClubSignups.map((s) => (
                      <div key={s.id} className="p-3 text-xs flex justify-between items-center">
                        <div>
                          <strong>{s.fullName}</strong> ({s.email})
                          <span className="text-[#6D7771] ml-2 block sm:inline">
                            Genres: {s.favoriteGenres.join(', ')} · Goal: {s.readingGoal}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C6D23] font-mono shrink-0">
                          {new Date(s.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General Contact Messages */}
              <div className="pt-4 border-t border-[#E6DFD5]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#636E67] mb-2">
                  Contact Form Messages ({contactMessages.length})
                </h4>
                {contactMessages.length === 0 ? (
                  <p className="text-xs text-[#717C76] italic p-4 bg-white border border-[#E6DFD5] rounded">
                    No general messages recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="p-3.5 bg-white border border-[#E6DFD5] rounded text-xs space-y-1">
                        <div className="flex justify-between font-semibold text-[#143826]">
                          <span>{msg.name} ({msg.email})</span>
                          <span className="text-[10px] font-mono text-[#8C6D23]">{msg.inquiryType}</span>
                        </div>
                        <div className="font-medium text-[#2C332F]">{msg.subject}</div>
                        <p className="text-[#525B55] leading-relaxed">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E6DFD5] flex items-center justify-between text-xs text-[#6B756F]">
          <span>Centralized Configuration Engine · Changes persist to localStorage and reactive state</span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] rounded cursor-pointer"
          >
            Done & Close
          </button>
        </div>

      </div>
    </div>
  );
};

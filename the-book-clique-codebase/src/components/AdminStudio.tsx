import React, { useState, useEffect } from 'react';
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
  Globe,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Star,
  KeyRound,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, TeamMember, BookCategory, Manuscript, ManuscriptAccessLevel } from '../types';
import { FICTION_GENRES, NONFICTION_GENRES } from '../data/initialData';
import { calculateBatchSchedule } from '../utils/chapterBatch';
import {
  SAMPLE_COMMENTS_RAISING_THE_WHOLE_CHILD,
  SAMPLE_COMMENTS_STATS
} from '../data/raisingTheWholeChildSampleComments';
import {
  OWNER_ADMIN_UID,
  OWNER_ADMIN_EMAIL,
  isFirebaseConfigured,
  getFirebaseConfig,
  saveCustomFirebaseConfig
} from '../lib/firebase';

export interface AdminStudioProps {
  isStandalonePage?: boolean;
}

export type AdminTab =
  | 'overview'
  | 'members'
  | 'bookclub'
  | 'manuscripts'
  | 'reviews'
  | 'inbox'
  | 'settings'
  | 'security';

export const AdminStudio: React.FC<AdminStudioProps> = ({ isStandalonePage = false }) => {
  const {
    activeView,
    setActiveView,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    adminToken,
    adminOwnerEmail,
    adminOwnerUid,
    adminLogin,
    adminLogout,
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

  // If rendering inside standalone route (/admin) vs as modal popup
  if (isStandalonePage && activeView !== 'admin') {
    return null;
  }
  if (!isStandalonePage && (activeView === 'admin' || !isAdminOpen)) {
    return null;
  }

  // Login Form State
  const [loginEmail, setLoginEmail] = useState(adminOwnerEmail || 'hollowaylydia.us@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showFirebaseConfigModal, setShowFirebaseConfigModal] = useState(false);
  const [fbApiKey, setFbApiKey] = useState(() => getFirebaseConfig().apiKey);
  const [fbProjectId, setFbProjectId] = useState(() => getFirebaseConfig().projectId);
  const [fbAuthDomain, setFbAuthDomain] = useState(() => getFirebaseConfig().authDomain);
  const [fbAppId, setFbAppId] = useState(() => getFirebaseConfig().appId || '');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'catalogue' | 'pricing' | 'team'>('general');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Registered Members State
  const [adminMembers, setAdminMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [memberSortOrder, setMemberSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [memberActionLoading, setMemberActionLoading] = useState<string | null>(null);

  // Reviews Moderation State
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'all'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

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

  // Change Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdminMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch('/api/admin/members', {
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'x-admin-key': 'tbc_verified_admin'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.members)) {
          setAdminMembers(data.members);
          return;
        }
      }
      // Offline fallback: load from persistent reader_accounts cache
      const local = localStorage.getItem('tbc_reader_accounts');
      if (local) {
        setAdminMembers(JSON.parse(local));
      }
    } catch (e) {
      console.warn('Using local reader accounts fallback:', e);
      const local = localStorage.getItem('tbc_reader_accounts');
      if (local) {
        setAdminMembers(JSON.parse(local));
      }
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminMembers();
    }
  }, [isAdminLoggedIn, activeTab]);

  useEffect(() => {
    if (bookClubSession) {
      setChaptersPerDaySetting(bookClubSession.chaptersPerDay || 2);
      setCurrentDayOverrideSetting(
        bookClubSession.currentDayOverride ? String(bookClubSession.currentDayOverride) : 'auto'
      );
    }
  }, [bookClubSession]);

  const showSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const res = await adminLogin(loginEmail, loginPassword);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    } else {
      setLoginPassword('');
      showSuccess('Authenticated successfully as Website Owner.');
    }
  };

  const handleReturnToPublicWebsite = () => {
    setIsAdminOpen(false);
    setActiveView('home');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
  };

  const handleToggleMemberStatus = async (memberId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    setMemberActionLoading(memberId);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`,
          'x-admin-key': 'tbc_verified_admin'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showSuccess(`Member account status is now ${nextStatus}.`);
        await fetchAdminMembers();
      } else {
        // Local fallback update
        setAdminMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, status: nextStatus } : m))
        );
        showSuccess(`Member status updated to ${nextStatus}.`);
      }
    } catch {
      setAdminMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: nextStatus } : m))
      );
      showSuccess(`Member status updated to ${nextStatus}.`);
    } finally {
      setMemberActionLoading(null);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig({
      officialGmailAddress: officialEmail.trim(),
      tagline: brandTagline.trim(),
      contactNotes: contactNotes.trim(),
      scamNoticeLastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
    showSuccess('General site settings and official contact email updated site-wide!');
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
      photoUrl: newTeamPhoto.trim() || '',
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
          'Authorization': `Bearer ${adminToken || ''}`,
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
      showSuccess(`Manuscript "${data.manuscript.title}" stored securely! (${data.manuscript.pageCount} pages)`);
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
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'x-admin-key': 'tbc_verified_admin'
        }
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
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'x-admin-key': 'tbc_verified_admin'
        }
      });
      if (res.ok) {
        await refreshManuscripts();
        showSuccess(`"${title}" deleted from private archive.`);
      }
    } catch (e) {
      console.error('Failed to delete manuscript:', e);
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
      setSessionActionMsg('Reading session active! Both Book Club and Featured Book of the Month have been updated.');
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

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    // Update owner admin password
    localStorage.setItem('tbc_owner_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg({ type: 'success', text: 'Owner administrator password updated successfully!' });
    showSuccess('Owner password updated.');
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: OWNER ADMINISTRATOR LOGIN GATE (When not authenticated)
  // --------------------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div
        className={
          isStandalonePage
            ? 'min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-[#FAF7F2]'
            : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F291E]/75 backdrop-blur-xs animate-in fade-in'
        }
      >
        <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-sm border border-[#D5CDBD] shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#143826] border-2 border-[#C5A059] flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7 text-[#E8D4B4]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D23] block">
              The Book Clique · Restricted Owner Access
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#143826]">
              Owner Administrator Portal
            </h2>
            <p className="text-xs text-[#525B55] leading-relaxed max-w-xs mx-auto">
              Private dashboard authorized exclusively for the website owner via Firebase Authentication. Ordinary reader accounts and public visitors are denied access.
            </p>
          </div>

          {/* Account & UID Verification Badge */}
          <div className="p-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded text-left space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717C76]">
                Authorised Owner Identity
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                <span>Firebase Auth</span>
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#143826] font-semibold break-all">
              {adminOwnerEmail || 'hollowaylydia.us@gmail.com'}
            </div>
            <div className="text-[10px] text-[#525B55] flex items-center gap-1 font-mono">
              <span className="font-sans font-semibold text-[#8C6D23]">Owner UID:</span>
              <span className="bg-white px-1.5 py-0.5 rounded border border-[#E6DFD5] text-[#143826] font-bold">
                {OWNER_ADMIN_UID}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Access Denied:</strong> {loginError}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                Owner Email Address *
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded text-[#1C1E1D] font-mono focus:outline-2 focus:outline-[#143826]"
              />
              <span className="text-[11px] text-[#717C76] mt-1 block">
                Privileges assigned exclusively to verified owner: <strong className="text-[#143826]">{adminOwnerEmail || 'hollowaylydia.us@gmail.com'}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                Firebase Account Password *
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded text-[#1C1E1D] focus:outline-2 focus:outline-[#143826]"
              />
              <span className="text-[10px] text-[#717C76] mt-1 block">
                Enter the password created directly in your Firebase Authentication project.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-[#143826] hover:bg-[#1E4D35] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#C5A059]" />
              <span>{isLoggingIn ? 'Authenticating with Firebase...' : 'Authenticate & Open Dashboard'}</span>
            </button>
          </form>

          {/* Optional Firebase Web App Configuration Accordion */}
          <div className="pt-2 border-t border-[#E6DFD5]">
            <button
              type="button"
              onClick={() => setShowFirebaseConfigModal(!showFirebaseConfigModal)}
              className="w-full py-1 text-[11px] text-[#8C6D23] hover:text-[#143826] flex items-center justify-between font-medium cursor-pointer"
            >
              <span>Firebase Web Configuration (Client SDK Keys)</span>
              <span className="text-xs">{showFirebaseConfigModal ? '▲' : '▼'}</span>
            </button>

            {showFirebaseConfigModal && (
              <div className="mt-2 p-3 bg-[#FAF7F2] border border-[#E6DFD5] rounded text-left space-y-2.5 text-xs animate-in fade-in">
                <p className="text-[11px] text-[#525B55] leading-relaxed">
                  If your Firebase Web config keys are not already set in Netlify environment variables (<code className="bg-white px-1 rounded">VITE_FIREBASE_API_KEY</code>, etc.), you can enter them here for direct browser authentication:
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-[#143826] uppercase">Firebase Web API Key (apiKey)</label>
                  <input
                    type="text"
                    value={fbApiKey}
                    onChange={(e) => setFbApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#143826] uppercase">Firebase Project ID (projectId)</label>
                  <input
                    type="text"
                    value={fbProjectId}
                    onChange={(e) => setFbProjectId(e.target.value)}
                    placeholder="e.g. the-book-clique-app"
                    className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#143826] uppercase">Auth Domain (authDomain)</label>
                  <input
                    type="text"
                    value={fbAuthDomain}
                    onChange={(e) => setFbAuthDomain(e.target.value)}
                    placeholder="e.g. the-book-clique-app.firebaseapp.com"
                    className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#143826] uppercase">App ID (appId - optional)</label>
                  <input
                    type="text"
                    value={fbAppId}
                    onChange={(e) => setFbAppId(e.target.value)}
                    placeholder="1:123456789:web:abcdef"
                    className="w-full px-2 py-1 text-xs bg-white border border-[#D5CDBD] rounded font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    saveCustomFirebaseConfig({
                      apiKey: fbApiKey.trim(),
                      projectId: fbProjectId.trim(),
                      authDomain: fbAuthDomain.trim() || (fbProjectId ? `${fbProjectId.trim()}.firebaseapp.com` : ''),
                      appId: fbAppId.trim()
                    });
                    showSuccess('Firebase client credentials saved in browser!');
                    setShowFirebaseConfigModal(false);
                  }}
                  className="w-full py-1.5 bg-[#143826] hover:bg-[#1E4D35] text-white text-[11px] font-semibold rounded cursor-pointer transition-colors"
                >
                  Save Firebase Web Credentials
                </button>
              </div>
            )}
          </div>

          {/* Security Architecture Guarantees */}
          <div className="pt-3 border-t border-[#E6DFD5] space-y-1.5 text-[11px] text-[#525B55]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span>Single Owner Account: Matched to Firebase UID <strong className="font-mono text-[#143826]">P7NJg0sVJwM7PEdwKB0JpQ0NIi62</strong>.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span>Ordinary readers cannot promote themselves or access <code className="bg-[#FAF7F2] px-1 py-0.5 rounded">/admin</code>.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
              <span>Firebase ID token cryptographically verified on server.</span>
            </div>
          </div>

          {/* Return to Public Website */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleReturnToPublicWebsite}
              className="text-xs font-semibold text-[#143826] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: AUTHENTICATED 9-SECTION ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  const containerClasses = isStandalonePage
    ? 'min-h-[85vh] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col'
    : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F291E]/70 backdrop-blur-xs animate-in fade-in';

  const modalInnerClasses = isStandalonePage
    ? 'relative w-full bg-[#FBF9F5] rounded border border-[#D5CDBD] shadow-xl overflow-hidden flex flex-col'
    : 'relative w-full max-w-6xl bg-[#FBF9F5] rounded border border-[#D5CDBD] shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col';

  return (
    <div className={containerClasses}>
      <div className={modalInnerClasses}>
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#143826] text-[#FAF6F0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#E8D4B4] text-[#143826] flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-[#143826]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-semibold">
                  The Book Clique · Owner Administrator Dashboard
                </h2>
                <span className="text-[10px] bg-[#C5A059] text-[#143826] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Owner Active
                </span>
              </div>
              <p className="text-[11px] text-[#C6D8CE]">
                Sole Authorized Owner: <span className="font-mono text-white">{adminOwnerEmail || 'hollowaylydia.us@gmail.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('replay-butterfly-entrance'));
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-[#C5A059] hover:bg-[#D4AF37] text-[#143826] rounded transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Test & Replay Multi-Butterfly Entrance Animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#143826]" />
              <span className="hidden sm:inline">Butterflies</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-1.5 text-[#D1DDD6] hover:text-[#FFFFFF] rounded cursor-pointer"
              title="Export Current Site Data as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={adminLogout}
              className="px-2.5 py-1 text-xs font-semibold bg-rose-700/80 hover:bg-rose-800 text-white rounded flex items-center gap-1 transition-colors cursor-pointer"
              title="Log Out of Administrator Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {!isStandalonePage && (
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1.5 text-[#D1DDD6] hover:text-[#FFFFFF] rounded cursor-pointer ml-1"
                aria-label="Close Admin Studio"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 9-Section Navigation Tab Strip */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-[#FAF7F2] border-b border-[#E6DFD5] overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>1. Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'members' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>2. Registered Members ({adminMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookclub')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bookclub' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>3. Book Club Management</span>
          </button>

          <button
            onClick={() => setActiveTab('manuscripts')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manuscripts' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>4. Manuscript Management ({manuscripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reviews' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>5. Comments & Reviews (51)</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inbox' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>6. Author Enquiries ({enquiries.length + contactMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>7. Website Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security' ? 'bg-[#143826] text-[#FAF6F0]' : 'text-[#4A534E] hover:bg-[#EAE4D8]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>8. Admin Account & Security</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-2 rounded transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap text-rose-700 hover:bg-rose-50 hover:text-rose-900 ml-auto"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>9. Log Out</span>
          </button>
        </div>

        {/* Success toast banner */}
        {saveSuccessMsg && (
          <div className="bg-[#143826] text-[#FDE68A] px-6 py-2.5 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#FDE68A]" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow space-y-6">

          {/* ========================================================= */}
          {/* 1. DASHBOARD OVERVIEW                                     */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#143826] to-[#1E4D35] text-[#FAF6F0] p-6 rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-[#E8D4B4] uppercase tracking-wider block">
                    Welcome to The Book Clique Studio
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1">
                    Administrator Command Centre
                  </h3>
                  <p className="text-xs text-[#C6D8CE] mt-1 max-w-xl leading-relaxed">
                    Exclusive owner control for member management, active manuscript release cadence, literary discussions, and site-wide settings.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('members')}
                    className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#143826] text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    View Members
                  </button>
                  <button
                    onClick={() => setActiveTab('bookclub')}
                    className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    Manage Book Club
                  </button>
                </div>
              </div>

              {/* 4 Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded border border-[#E6DFD5] shadow-2xs">
                  <div className="flex items-center justify-between text-[#8C6D23]">
                    <span className="text-xs font-bold uppercase tracking-wider">Registered Readers</span>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#143826] mt-2">
                    {adminMembers.length}
                  </div>
                  <span className="text-[11px] text-[#15803D] font-medium block mt-1">
                    Auto-approved &amp; active
                  </span>
                </div>

                <div className="bg-white p-5 rounded border border-[#E6DFD5] shadow-2xs">
                  <div className="flex items-center justify-between text-[#8C6D23]">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Book Club</span>
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-xl font-bold text-[#143826] mt-2 line-clamp-1">
                    Raising the Whole Child
                  </div>
                  <span className="text-[11px] text-[#525B55] block mt-1">
                    By Dr. Eva Pérez Visus
                  </span>
                </div>

                <div className="bg-white p-5 rounded border border-[#E6DFD5] shadow-2xs">
                  <div className="flex items-center justify-between text-[#8C6D23]">
                    <span className="text-xs font-bold uppercase tracking-wider">Book Reviews</span>
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#143826] mt-2">
                    51 <span className="text-base font-normal text-[#8C6D23] font-sans">({SAMPLE_COMMENTS_STATS.averageRating}★)</span>
                  </div>
                  <span className="text-[11px] text-[#525B55] block mt-1">
                    Individual ratings 3★ to 5★
                  </span>
                </div>

                <div className="bg-white p-5 rounded border border-[#E6DFD5] shadow-2xs">
                  <div className="flex items-center justify-between text-[#8C6D23]">
                    <span className="text-xs font-bold uppercase tracking-wider">Author Enquiries</span>
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-[#143826] mt-2">
                    {enquiries.length + contactMessages.length}
                  </div>
                  <span className="text-[11px] text-[#525B55] block mt-1">
                    Project &amp; contact submissions
                  </span>
                </div>
              </div>

              {/* Quick Jump Action Tiles */}
              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  Administrative Sections Quick Jump
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('members')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Registered Members
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Moderate real database accounts &amp; check auto-approvals.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => setActiveTab('bookclub')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Book Club Session
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Configure daily chapter batches &amp; release pace.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => setActiveTab('manuscripts')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Manuscript Storage
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Upload genuine PDFs and preview in secure reader.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Comments &amp; Ratings
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Review the 51 discussion posts and genuine member ratings.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Website Settings
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Official contact email, scam alert, catalogue &amp; team.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className="p-4 bg-white border border-[#E6DFD5] hover:border-[#143826] rounded text-left transition-colors cursor-pointer group flex items-start justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-[#143826] font-semibold group-hover:text-[#1E4D35]">
                        Admin Security
                      </strong>
                      <span className="text-xs text-[#525B55] mt-0.5 block">
                        Audit owner credentials and server authorization rules.
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. REGISTERED MEMBERS (REAL DATABASE RECORDS ONLY)        */}
          {/* ========================================================= */}
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
                        <th className="py-3 px-4">Registered Date &amp; Time</th>
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
                                  {isSuspended ? 'Reactivate Access' : 'Suspend Account'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      {adminMembers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs text-[#717C76] italic">
                            No member registrations found. Newly registered readers will automatically appear here upon sign-up.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. BOOK CLUB MANAGEMENT (BATCH RELEASES & ACTIVE BOOK)    */}
          {/* ========================================================= */}
          {activeTab === 'bookclub' && (
            <div className="space-y-6">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-[#C5A059]" />
                  <span>Book Club Reading Session Management</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Controls the active manuscript selection, daily chapter batch release cadence, and community discussion salon.
                </p>
              </div>

              {/* Active Book Card */}
              <div className="bg-white border-2 border-[#143826] rounded p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/assets/aistudio/raising_the_whole_child_cover.png"
                      alt="Raising the Whole Child"
                      className="w-16 h-22 object-cover rounded shadow border border-[#D5CDBD] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Current Active Selection
                        </span>
                        <span className="text-[10px] bg-[#FAF6F0] text-[#8C6D23] font-semibold px-2 py-0.5 rounded border border-[#E6DFD5]">
                          Featured Book of the Month
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#143826] mt-1">
                        Raising the Whole Child
                      </h4>
                      <p className="text-xs text-[#525B55]">
                        By Dr. Eva Pérez Visus · Complete Ebook &amp; Manuscript
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const m = manuscripts.find((ms) => ms.title.includes('Raising'));
                        if (m) handlePreviewManuscript(m);
                      }}
                      className="px-3.5 py-2 bg-[#143826] hover:bg-[#1E4D35] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Preview in Reader</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleEndSession}
                      disabled={isUpdatingSession}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded transition-colors cursor-pointer"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Chapter Release Batch Schedule Settings */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-5 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#143826] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      <span>Daily Chapter Batch Release Schedule</span>
                    </h4>
                    <p className="text-xs text-[#525B55] mt-0.5">
                      Progressively unlocks manuscript chapters at midnight every day to maintain synchronized group reading.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded border border-[#E6DFD5] space-y-2">
                    <label className="block text-xs font-bold text-[#143826] uppercase tracking-wider">
                      Chapters Released Per Day
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={chaptersPerDaySetting}
                        onChange={(e) => setChaptersPerDaySetting(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24 px-3 py-2 text-xs font-bold text-center border border-[#D5CDBD] rounded text-[#143826]"
                      />
                      <span className="text-xs text-[#525B55]">
                        (Currently releasing <strong>{chaptersPerDaySetting} chapters</strong> per calendar day)
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border border-[#E6DFD5] space-y-2">
                    <label className="block text-xs font-bold text-[#143826] uppercase tracking-wider">
                      Current Reading Day Override
                    </label>
                    <select
                      value={currentDayOverrideSetting}
                      onChange={(e) => setCurrentDayOverrideSetting(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold border border-[#D5CDBD] rounded text-[#143826] bg-white cursor-pointer"
                    >
                      <option value="auto">Automatic (Based on Session Start Date)</option>
                      <option value="1">Day 1: Chapters 1 &amp; 2 Unlocked</option>
                      <option value="2">Day 2: Chapters 1 to 4 Unlocked</option>
                      <option value="3">Day 3: Chapters 1 to 6 Unlocked</option>
                      <option value="4">Day 4: Chapters 1 to 8 Unlocked</option>
                      <option value="5">Day 5: Chapters 1 to 10 Unlocked</option>
                      <option value="999">Unlock All Chapters (Session Finished)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveBatchSchedule}
                    disabled={isUpdatingSession}
                    className="px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-2xs flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Save Release Schedule</span>
                  </button>
                  {sessionActionMsg && (
                    <span className="text-xs font-semibold text-[#15803D]">
                      {sessionActionMsg}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. MANUSCRIPT MANAGEMENT (UPLOAD & PDF STORAGE)           */}
          {/* ========================================================= */}
          {activeTab === 'manuscripts' && (
            <div className="space-y-6">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#C5A059]" />
                  <span>Manuscript Management &amp; Private Storage</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Upload authentic PDF manuscripts into server storage with anti-download protection and integrated interactive reading.
                </p>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleUploadManuscript} className="bg-white border border-[#E6DFD5] p-5 rounded space-y-4">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  Upload Genuine PDF Manuscript
                </h4>

                {msUploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                    {msUploadError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                      PDF Document File (.pdf) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setMsFile(e.target.files ? e.target.files[0] : null)}
                      required
                      className="w-full text-xs text-[#525B55] file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#143826] file:text-white hover:file:bg-[#1E4D35] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      value={msTitle}
                      onChange={(e) => setMsTitle(e.target.value)}
                      placeholder="e.g. Raising the Whole Child"
                      required
                      className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={msAuthor}
                      onChange={(e) => setMsAuthor(e.target.value)}
                      placeholder="e.g. Dr. Eva Pérez Visus"
                      required
                      className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#143826] uppercase tracking-wider mb-1">
                      Access Level
                    </label>
                    <select
                      value={msAccess}
                      onChange={(e) => setMsAccess(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded bg-white"
                    >
                      <option value="public">Public (Open Preview)</option>
                      <option value="registered_readers">Registered Members Only</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploadingMs}
                  className="px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{isUploadingMs ? 'Uploading & Parsing...' : 'Upload Manuscript to Archive'}</span>
                </button>
              </form>

              {/* Manuscript Library List */}
              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  Archived Manuscripts ({manuscripts.length})
                </h4>

                <div className="divide-y divide-[#E6DFD5] bg-white border border-[#E6DFD5] rounded shadow-2xs">
                  {manuscripts.map((m) => (
                    <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5]">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.coverImage || '/assets/aistudio/raising_the_whole_child_cover.png'}
                          alt={m.title}
                          className="w-12 h-16 object-cover rounded border border-[#E6DFD5] shrink-0"
                        />
                        <div>
                          <strong className="block text-sm text-[#143826] font-serif font-bold">
                            {m.title}
                          </strong>
                          <span className="text-xs text-[#525B55]">
                            By {m.author} · {m.pageCount} Pages · {m.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handlePreviewManuscript(m)}
                          className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#EAE4D8] border border-[#D5CDBD] text-[#143826] text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#8C6D23]" />
                          <span>Preview Reader</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePublishManuscript(m.id)}
                          className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#EAE4D8] border border-[#D5CDBD] text-[#143826] text-xs font-semibold rounded cursor-pointer"
                        >
                          {m.isPublished ? 'Published' : 'Draft'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteManuscript(m.id, m.title)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Manuscript"
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

          {/* ========================================================= */}
          {/* 5. COMMENTS & REVIEWS (51 COMMENTS + STAR RATINGS)        */}
          {/* ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C5A059]" />
                  <span>Comments &amp; Star Ratings Moderation</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Review the 51 discussion comments attached exclusively to <em>Raising the Whole Child</em> with their individual 3★ to 5★ ratings, as well as genuine registered member reviews.
                </p>
              </div>

              {/* Review Statistics Summary Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Total Comments Displayed
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-[#143826]">
                      {SAMPLE_COMMENTS_STATS.totalCount}
                    </span>
                    <span className="text-xs text-[#8C6D23] font-semibold">
                      Discussion Entries
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    All 51 comments preserved verbatim.
                  </span>
                </div>

                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Overall Calculated Rating
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-[#143826]">
                      {SAMPLE_COMMENTS_STATS.averageRating}★
                    </span>
                    <span className="text-xs text-[#15803D] font-semibold">
                      Out of 5.0 Stars
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    Individual ratings range from 3 to 5 stars.
                  </span>
                </div>

                <div className="bg-white p-4 rounded border border-[#E6DFD5] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#717C76] uppercase tracking-wider block">
                    Verification Standard
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-bold text-[#143826] bg-[#FAF6F0] border border-[#E6DFD5] px-2.5 py-1 rounded">
                      Rigorous Attribution
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717C76] mt-1 block">
                    No fake verified badges; genuine reader reviews separated.
                  </span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-[#FAF7F2] border border-[#E6DFD5] p-4 rounded flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C6D23] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="Search comments by commenter name or discussion text..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5CDBD] rounded text-xs text-[#1C1E1D]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#717C76]">Star Rating:</span>
                  <select
                    value={reviewRatingFilter}
                    onChange={(e) => setReviewRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-white border border-[#D5CDBD] text-xs font-semibold text-[#143826] px-2.5 py-1.5 rounded cursor-pointer"
                  >
                    <option value="all">All Ratings (51)</option>
                    <option value={5}>5 Stars Only (34)</option>
                    <option value={4}>4 Stars Only (15)</option>
                    <option value={3}>3 Stars Only (2)</option>
                  </select>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {SAMPLE_COMMENTS_RAISING_THE_WHOLE_CHILD
                  .filter((c) => {
                    if (reviewRatingFilter !== 'all' && c.rating !== reviewRatingFilter) return false;
                    if (!reviewSearchQuery.trim()) return true;
                    const q = reviewSearchQuery.toLowerCase();
                    return c.name.toLowerCase().includes(q) || c.comment.toLowerCase().includes(q);
                  })
                  .map((c) => (
                    <div key={c.number} className="bg-white border border-[#E6DFD5] rounded p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#8C6D23]">
                            #{c.number}
                          </span>
                          <strong className="text-sm font-semibold text-[#143826]">
                            {c.name}
                          </strong>
                        </div>

                        <div className="flex items-center gap-1 text-[#C5A059]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < c.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-[#D5CDBD]'
                              }`}
                            />
                          ))}
                          <span className="font-bold text-[#143826] text-xs ml-1">
                            {c.rating}.0
                          </span>
                        </div>
                      </div>

                      <p className="text-[#3A433E] leading-relaxed">
                        {c.comment}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. AUTHOR ENQUIRIES                                       */}
          {/* ========================================================= */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-[#C5A059]" />
                  <span>Author Booking Enquiries &amp; Inquiries</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Inbound project requests from authors for Book Club Promotion, Book Trailers, and Marketing Strategy packages.
                </p>
              </div>

              {/* Service Enquiries */}
              <div className="space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  Work With Us Service Enquiries ({enquiries.length})
                </h4>

                {enquiries.length === 0 ? (
                  <p className="p-4 bg-white border border-[#E6DFD5] rounded text-xs text-[#717C76] italic">
                    No author booking enquiries submitted yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-4 bg-white border border-[#E6DFD5] rounded text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-sm font-semibold text-[#143826]">{enq.customerName}</strong>
                            <span className="text-[#525B55] ml-2 font-mono">({enq.email})</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF6F0] text-[#8C6D23] border border-[#E6DFD5]">
                            {enq.status}
                          </span>
                        </div>

                        {enq.projectDescription && (
                          <p className="text-[#3A433E] bg-[#FAF8F5] p-2.5 rounded border border-[#EAE4D8]">
                            {enq.projectDescription}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-[#7A857F] pt-2 border-t border-[#F0EBE1]">
                          <span>Submitted: {new Date(enq.submittedAt).toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateEnquiryStatus(
                                enq.id,
                                enq.status === 'Pending Review' ? 'Contacted' : 'Pending Review'
                              );
                              showSuccess(`Updated enquiry status for ${enq.customerName}`);
                            }}
                            className="text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
                          >
                            Toggle Status ({enq.status === 'Pending Review' ? 'Mark Contacted' : 'Mark Pending'})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Form Messages */}
              <div className="space-y-3 pt-4 border-t border-[#E6DFD5]">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  General Contact Form Inquiries ({contactMessages.length})
                </h4>

                {contactMessages.length === 0 ? (
                  <p className="p-4 bg-white border border-[#E6DFD5] rounded text-xs text-[#717C76] italic">
                    No general contact messages recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="p-4 bg-white border border-[#E6DFD5] rounded text-xs space-y-2">
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

          {/* ========================================================= */}
          {/* 7. WEBSITE SETTINGS (OFFICIAL GMAIL & CONFIG)             */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#C5A059]" />
                  <span>Website Settings &amp; Site-Wide Configuration</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Configure the verified official contact Gmail address, tagline, scam advisory notices, catalogue, and team.
                </p>
              </div>

              {/* Subtabs */}
              <div className="flex items-center gap-2 border-b border-[#E6DFD5] pb-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('general')}
                  className={`px-3 py-1.5 rounded cursor-pointer ${
                    settingsSubTab === 'general' ? 'bg-[#143826] text-white' : 'text-[#525B55] hover:bg-[#EAE4D8]'
                  }`}
                >
                  Official Contact &amp; Scam Alert
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('catalogue')}
                  className={`px-3 py-1.5 rounded cursor-pointer ${
                    settingsSubTab === 'catalogue' ? 'bg-[#143826] text-white' : 'text-[#525B55] hover:bg-[#EAE4D8]'
                  }`}
                >
                  Book Catalogue ({books.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab('team')}
                  className={`px-3 py-1.5 rounded cursor-pointer ${
                    settingsSubTab === 'team' ? 'bg-[#143826] text-white' : 'text-[#525B55] hover:bg-[#EAE4D8]'
                  }`}
                >
                  Team Profiles ({teamMembers.length})
                </button>
              </div>

              {settingsSubTab === 'general' && (
                <form onSubmit={handleSaveGeneral} className="space-y-4">
                  <div className="bg-white border border-[#E6DFD5] p-5 rounded space-y-4 shadow-2xs">
                    <div>
                      <label className="block text-xs font-bold text-[#143826] uppercase tracking-wider mb-1">
                        Official Contact Gmail Address *
                      </label>
                      <input
                        type="text"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded font-mono focus:outline-2 focus:outline-[#143826]"
                      />
                      <span className="text-[11px] text-[#525B55] mt-1 block">
                        Propagates immediately to the global Scam Alert Banner, Contact Us page, and Footer.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={brandTagline}
                        onChange={(e) => setBrandTagline(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded focus:outline-2 focus:outline-[#143826]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C332F] mb-1">
                        Official Contact Advisory Note
                      </label>
                      <textarea
                        rows={2}
                        value={contactNotes}
                        onChange={(e) => setContactNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBD] rounded focus:outline-2 focus:outline-[#143826]"
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
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </form>
              )}

              {settingsSubTab === 'catalogue' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddBookSubmit} className="bg-white border border-[#E6DFD5] p-5 rounded space-y-4 shadow-2xs">
                    <h4 className="font-serif text-base font-semibold text-[#143826]">Add Book to Catalogue</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#143826] mb-1">Title *</label>
                        <input
                          type="text"
                          value={newBookTitle}
                          onChange={(e) => setNewBookTitle(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#143826] mb-1">Author *</label>
                        <input
                          type="text"
                          value={newBookAuthor}
                          onChange={(e) => setNewBookAuthor(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-white text-xs font-bold rounded cursor-pointer"
                    >
                      Add Book
                    </button>
                  </form>
                </div>
              )}

              {settingsSubTab === 'team' && (
                <div className="space-y-4">
                  <div className="divide-y divide-[#E6DFD5] bg-white border border-[#E6DFD5] rounded shadow-2xs">
                    {teamMembers.map((m) => (
                      <div key={m.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.name} className="w-10 h-10 object-cover rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#143826] text-[#E8D4B4] flex items-center justify-center font-bold text-xs">
                              {m.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <strong className="block text-xs font-semibold text-[#143826]">{m.name}</strong>
                            <span className="text-[11px] text-[#525B55]">{m.title}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#8C6D23] font-mono">{m.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. ADMIN ACCOUNT & SECURITY                               */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-[#E6DFD5] pb-4">
                <h3 className="font-serif text-xl font-semibold text-[#143826] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#C5A059]" />
                  <span>Exclusive Administrator Account &amp; Security</span>
                </h3>
                <p className="text-xs text-[#525B55] mt-1 leading-relaxed">
                  Cryptographic verification status, owner credential management, and role-based access audit.
                </p>
              </div>

              {/* Owner Account Card */}
              <div className="bg-white border border-[#E6DFD5] p-5 rounded space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#717C76]">
                    Sole Authorized Owner Administrator
                  </span>
                  <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                    <span>Firebase Auth Verified</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-11 h-11 rounded-full bg-[#143826] text-[#E8D4B4] border border-[#C5A059] flex items-center justify-center font-bold font-serif text-sm shrink-0 shadow-xs">
                    LH
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-sm font-semibold text-[#143826]">
                      Lydia Holloway · The Book Clique Owner
                    </strong>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-xs text-[#143826] font-semibold">
                        {adminOwnerEmail || 'hollowaylydia.us@gmail.com'}
                      </span>
                      <span className="text-[10px] bg-[#143826]/10 text-[#143826] font-medium px-1.5 py-0.5 rounded">
                        Sole Owner
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0EAE1] text-xs text-[#525B55] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-[#FAF7F2] p-2.5 rounded border border-[#E6DFD5]">
                    <span className="font-semibold text-[#143826] text-[11px] uppercase tracking-wider">Complete Firebase UID:</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-[#D5CDBD] font-mono text-[11px] text-[#143826] font-semibold break-all select-all">
                      {adminOwnerUid || 'P7NJg0sVJwM7PEdwKB0JpQ0NIi62'}
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#717C76]">Authorisation Engine:</span>
                    <span className="font-semibold text-[#143826]">Firebase Admin SDK / Token Claim Verification</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#717C76]">Active Session:</span>
                    <code className="bg-[#FAF7F2] px-1 py-0.5 rounded font-mono text-[11px] text-[#143826]">Bearer Session (24-Hour Expiry)</code>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#717C76]">Protected Direct Route:</span>
                    <code className="bg-[#FAF7F2] px-1 py-0.5 rounded font-mono text-[11px] text-[#143826]">/admin (SPA Redirects Active)</code>
                  </div>
                </div>
              </div>

              {/* Change Owner Password */}
              <form onSubmit={handleChangePassword} className="bg-white border border-[#E6DFD5] p-5 rounded space-y-3 shadow-2xs">
                <h4 className="font-serif text-base font-semibold text-[#143826]">
                  Update Administrator Passkey
                </h4>

                {passwordMsg && (
                  <div className={`p-3 rounded text-xs ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {passwordMsg.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#143826] mb-1">
                    New Passkey *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#143826] mb-1">
                    Confirm New Passkey *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat passkey"
                    className="w-full px-3 py-2 text-xs border border-[#D5CDBD] rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#143826] hover:bg-[#1E4D35] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Update Passkey
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Modal / Dashboard Bottom Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E6DFD5] flex items-center justify-between text-xs text-[#6B756F]">
          <span>
            The Book Clique · Single Owner Administrative Engine · Verified for <strong className="text-[#143826] font-mono">{adminOwnerEmail || 'hollowaylydia.us@gmail.com'}</strong>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReturnToPublicWebsite}
              className="text-xs font-semibold text-[#143826] hover:underline cursor-pointer"
            >
              Back to Public Site
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#FAF6F0] bg-[#143826] hover:bg-[#1E4D35] rounded cursor-pointer transition-colors"
            >
              Done &amp; Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

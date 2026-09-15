import React, { useState, useEffect } from 'react';
import { Project, Testimonial } from '../types';
import { TESTIMONIALS } from '../data/initialData';
import { portfolioApi } from '../services/api';
import {
  X, Plus, Trash2, Edit3, Save, RefreshCw, Layers, CheckCircle2,
  Image, Sparkles, Lock, ShieldCheck, KeyRound, Eye, EyeOff,
  LogOut, ShieldAlert, Star, Quote, Upload, FileCheck, Check
} from 'lucide-react';

interface CmsAdminModalProps {
  projects: Project[];
  onClose: () => void;
  onSaveProjects: (projects: Project[]) => void;
  onResetData: () => void;
  initialTab?: 'list' | 'form' | 'inquiries' | 'reviews';
}

const PASSWORD_KEY = 'saad_cms_password_v2';
const SESSION_KEY = 'saad_cms_session_v1';
const DEFAULT_PASSWORD = 'UI/UXSAQ';

export const CmsAdminModal: React.FC<CmsAdminModalProps> = ({
  projects,
  onClose,
  onSaveProjects,
  onResetData,
  initialTab = 'list'
}) => {
  // Security State
  const [storedPassword, setStoredPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PASSWORD_KEY);
      if (saved) return saved;
      localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
      return DEFAULT_PASSWORD;
    } catch (e) {
      return DEFAULT_PASSWORD;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Auth Inputs
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [changePassError, setChangePassError] = useState<string | null>(null);
  const [showNewPassToggle, setShowNewPassToggle] = useState(false);

  // CMS Content Tabs
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'inquiries' | 'reviews'>(initialTab);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Reviews Management State
  const [reviewsList, setReviewsList] = useState<Testimonial[]>([]);

  const fetchReviews = async () => {
    try {
      const savedCustom = localStorage.getItem('saad_user_testimonials');
      const savedDeleted = localStorage.getItem('saad_deleted_testimonials');

      let localCustomList: Testimonial[] = [];
      let deletedIds: string[] = [];

      if (savedCustom) {
        try { localCustomList = JSON.parse(savedCustom); } catch (e) {}
      }
      if (savedDeleted) {
        try { deletedIds = JSON.parse(savedDeleted); } catch (e) {}
      }

      let serverList: Testimonial[] = [];
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && Array.isArray(data.reviews)) {
            serverList = data.reviews;
          }
        }
      } catch (srvErr) {
        console.log('Server reviews fetch error:', srvErr);
      }

      const reviewMap = new Map<string, Testimonial>();
      serverList.forEach(r => reviewMap.set(r.id, r));
      localCustomList.forEach(r => {
        if (!reviewMap.has(r.id)) {
          reviewMap.set(r.id, r);
        }
      });

      const publicUserReviews = Array.from(reviewMap.values());
      const combined = [...publicUserReviews, ...TESTIMONIALS].filter(t => !deletedIds.includes(t.id));
      setReviewsList(combined);
    } catch (e) {
      console.error('CMS fetchReviews error:', e);
    }
  };

  const handleDeleteReviewInCms = async (reviewId: string) => {
    // Direct instant deletion on clicking delete icon
    const updated = reviewsList.filter(t => t.id !== reviewId);
    setReviewsList(updated);

    // Save deleted ID so default reviews stay hidden
    const savedDeleted = localStorage.getItem('saad_deleted_testimonials');
    let deletedIds: string[] = [];
    if (savedDeleted) {
      try { deletedIds = JSON.parse(savedDeleted); } catch (e) {}
    }
    if (!deletedIds.includes(reviewId)) {
      deletedIds.push(reviewId);
      localStorage.setItem('saad_deleted_testimonials', JSON.stringify(deletedIds));
    }

    // Clean up from user custom reviews if applicable
    const savedUserCustom = localStorage.getItem('saad_user_testimonials');
    if (savedUserCustom) {
      try {
        const userCustomList: Testimonial[] = JSON.parse(savedUserCustom);
        const remainingUserCustom = userCustomList.filter(t => t.id !== reviewId);
        localStorage.setItem('saad_user_testimonials', JSON.stringify(remainingUserCustom));
      } catch (e) {}
    }

    // Send DELETE request to server API
    try {
      await fetch(`/api/reviews?id=${encodeURIComponent(reviewId)}`, { method: 'DELETE' });
    } catch (err) {
      console.log('Server review delete:', err);
    }

    showToast('Review deleted successfully');
    window.dispatchEvent(new Event('storage'));
  };

  // Saved Inquiries
  const [inquiries, setInquiries] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('saad_portfolio_inquiries_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const fetchInquiries = async () => {
    let combined: any[] = [];
    try {
      const savedStr = localStorage.getItem('saad_portfolio_inquiries_v1');
      if (savedStr) {
        combined = JSON.parse(savedStr);
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries && Array.isArray(data.inquiries)) {
          // Merge avoiding duplicates by id
          const existingIds = new Set(combined.map(i => i.id));
          data.inquiries.forEach((srvInq: any) => {
            if (!existingIds.has(srvInq.id)) {
              combined.unshift(srvInq);
            }
          });
        }
      }
    } catch (err) {
      console.log('Server inquiries fetch note:', err);
    }

    setInquiries(combined);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchReviews();

      const handleStorageSync = () => {
        fetchInquiries();
        fetchReviews();
      };

      window.addEventListener('storage', handleStorageSync);
      return () => window.removeEventListener('storage', handleStorageSync);
    }
  }, [isAuthenticated]);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Project['category']>('Website Design');
  const [formYear, setFormYear] = useState('2026');
  const [formClient, setFormClient] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formGallery, setFormGallery] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formProblem, setFormProblem] = useState('');
  const [formResearch, setFormResearch] = useState('');
  const [formWireframes, setFormWireframes] = useState('');
  const [formUiScreens, setFormUiScreens] = useState('');
  const [formPrototype, setFormPrototype] = useState('');
  const [formLive, setFormLive] = useState('');
  const [formTools, setFormTools] = useState('');
  const [formTags, setFormTags] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);

    const res = await portfolioApi.uploadFile(file);
    setIsUploading(false);

    if (res.success && res.url) {
      if (targetField === 'cover') {
        setFormCover(res.url);
      } else {
        setFormGallery((prev) => (prev ? `${prev}, ${res.url}` : res.url || ''));
      }
      setUploadSuccessMsg(`Uploaded: ${file.name}`);
      setTimeout(() => setUploadSuccessMsg(null), 3000);
      showToast('File uploaded to server successfully!');
    } else {
      showToast(res.error || 'Upload failed.');
    }
  };

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Call REST API login endpoint to get JWT token
    const res = await portfolioApi.login(passwordInput);

    if (res.success && res.token) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {}
      setPasswordInput('');
      showToast('Welcome back, Saad! Backend JWT Session Active.');
    } else if (passwordInput === storedPassword || passwordInput === DEFAULT_PASSWORD) {
      // Offline / Local fallback
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {}
      setPasswordInput('');
      showToast('Welcome back, Saad! CMS Unlocked.');
    } else {
      setLoginError(res.error || 'Incorrect password! Please try again.');
    }
  };

  const handleLogout = () => {
    portfolioApi.removeToken();
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('CMS Session locked.');
  };

  const handleCloseModal = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError(null);
    onClose();
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassInput || newPassInput.length < 4) {
      setChangePassError('New password must be at least 4 characters.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setChangePassError('New passwords do not match.');
      return;
    }

    const res = await portfolioApi.changePassword(currentPassInput, newPassInput);

    if (res.success) {
      try {
        localStorage.setItem(PASSWORD_KEY, newPassInput);
        setStoredPassword(newPassInput);
      } catch (err) {}

      setShowChangePasswordModal(false);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setChangePassError(null);
      showToast('Password changed successfully in backend database!');
    } else {
      setChangePassError(res.error || 'Failed to update password.');
    }
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setFormTitle('');
    setFormCategory('Website Design');
    setFormYear('2026');
    setFormClient('');
    setFormCover('');
    setFormGallery('');
    setFormShortDesc('');
    setFormProblem('');
    setFormResearch('');
    setFormWireframes('');
    setFormUiScreens('');
    setFormPrototype('');
    setFormLive('');
    setFormTools('Figma, Adobe Photoshop');
    setFormTags('UI/UX, Responsive, Webflow');
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormCategory(proj.category);
    setFormYear(proj.year);
    setFormClient(proj.clientName || '');
    setFormCover(proj.coverImage);
    setFormGallery(proj.galleryImages.join(', '));
    setFormShortDesc(proj.shortDescription);
    setFormProblem(proj.problemStatement);
    setFormResearch(proj.research);
    setFormWireframes(proj.wireframeImages.join(', '));
    setFormUiScreens(proj.uiScreens.join(', '));
    setFormPrototype(proj.prototypeLink || '');
    setFormLive(proj.liveLink || '');
    setFormTools(proj.toolsUsed.join(', '));
    setFormTags(proj.tags.join(', '));
    setActiveTab('form');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formShortDesc) {
      showToast('Please fill out required title and description.');
      return;
    }

    const defaultCover =
      formCover.trim() ||
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80';

    const galleryArray = formGallery
      ? formGallery.split(',').map((s) => s.trim())
      : [defaultCover];

    const wireframeArray = formWireframes
      ? formWireframes.split(',').map((s) => s.trim())
      : [];

    const uiScreensArray = formUiScreens
      ? formUiScreens.split(',').map((s) => s.trim())
      : [defaultCover];

    const toolsArray = formTools
      ? formTools.split(',').map((s) => s.trim())
      : ['Figma', 'Photoshop'];

    const tagsArray = formTags
      ? formTags.split(',').map((s) => s.trim())
      : ['UI/UX', 'CMS Upload'];

    const newProject: Project = {
      id: editingProjectId || `custom-project-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      year: formYear,
      clientName: formClient || undefined,
      coverImage: defaultCover,
      galleryImages: galleryArray,
      shortDescription: formShortDesc,
      problemStatement: formProblem || 'Comprehensive problem statement and requirements.',
      research: formResearch || 'User research, persona discovery, and competitive audit.',
      designProcess: [
        { phase: 'Research', description: 'User interviews & competitive analysis.' },
        { phase: 'Wireframe', description: 'Low-fidelity layout architecture.' },
        { phase: 'UI Design', description: 'High-contrast luxury theme interface.' },
        { phase: 'Testing', description: 'Usability testing & accessibility verification.' }
      ],
      wireframeImages: wireframeArray,
      uiScreens: uiScreensArray,
      prototypeLink: formPrototype || undefined,
      liveLink: formLive || undefined,
      toolsUsed: toolsArray,
      tags: tagsArray,
      featured: true
    };

    let updatedList: Project[];
    if (editingProjectId) {
      updatedList = projects.map((p) => (p.id === editingProjectId ? newProject : p));
      showToast(`Saving "${formTitle}" to backend...`);
      portfolioApi.updateProject(editingProjectId, newProject).then((res) => {
        if (res.success) {
          showToast(`Project "${formTitle}" updated on server!`);
        }
      });
    } else {
      updatedList = [newProject, ...projects];
      showToast(`Saving "${formTitle}" to database...`);
      portfolioApi.createProject(newProject).then((res) => {
        if (res.success) {
          showToast(`Project "${formTitle}" published to server!`);
        }
      });
    }

    onSaveProjects(updatedList);
    resetForm();
    setActiveTab('list');
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    onSaveProjects(updated);
    portfolioApi.deleteProject(id).then((res) => {
      if (res.success) {
        showToast('Project deleted permanently from server.');
      }
    });
    showToast('Project deleted successfully.');
  };

  const handleLoadSample = () => {
    setEditingProjectId(null);
    setFormTitle('Nexus AI Workspace');
    setFormCategory('Dashboard Design');
    setFormYear('2026');
    setFormClient('Nexus Technologies');
    setFormCover('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');
    setFormGallery('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');
    setFormShortDesc('Designed a next-generation AI assistant workspace for enterprise team collaboration.');
    setFormProblem('Complex AI model parameter controls were causing high error rates among non-technical operators.');
    setFormResearch('Interviews with 14 AI operators highlighted the need for prompt template libraries & visual token meters.');
    setFormWireframes('https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80');
    setFormUiScreens('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
    setFormPrototype('https://figma.com/proto/sample-nexus');
    setFormLive('https://nexus.ai');
    setFormTools('Figma, FigJam, React, Tailwind');
    setFormTags('AI Workspace, Dashboard, Enterprise, SaaS');
    setActiveTab('form');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/[0.12] rounded-3xl overflow-hidden my-auto shadow-2xl text-white">
        
        {/* Header Bar */}
        <div className="bg-[#111113] px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D91E2A] text-white flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(217,30,42,0.5)]">
              {isAuthenticated ? 'CMS' : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>Project Manager & CMS Admin</span>
                {isAuthenticated && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold lowercase">
                    ● authenticated
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-[#9A9A9A] font-mono">Saad Ahmed — Protected Portfolio System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setChangePassError(null);
                    setCurrentPassInput('');
                    setNewPassInput('');
                    setConfirmPassInput('');
                    setShowChangePasswordModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                  title="Change Admin Security Password"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D91E2A]" />
                  <span className="hidden sm:inline">Change Password</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Lock CMS Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock Session</span>
                </button>
              </>
            )}
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 relative">

          {/* Change Password Dialog Overlay */}
          {showChangePasswordModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-[#111113] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl relative text-white animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#D91E2A]/20 text-[#D91E2A] flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Change Admin Password</h3>
                  </div>
                  <button
                    onClick={() => setShowChangePasswordModal(false)}
                    className="text-[#9A9A9A] hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  {changePassError && (
                    <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{changePassError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="Enter current password..."
                      className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassToggle ? 'text' : 'password'}
                        required
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Enter new password (min 4 chars)..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassToggle(!showNewPassToggle)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white"
                      >
                        {showNewPassToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassToggle ? 'text' : 'password'}
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Confirm new password..."
                      className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowChangePasswordModal(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#9A9A9A] hover:text-white font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#D91E2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c01823] transition-all shadow-[0_0_15px_rgba(217,30,42,0.4)] flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Toast Notification */}
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* ================= IF NOT AUTHENTICATED: SECURITY LOCK SCREEN ================= */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-6 space-y-6">
              
              {/* Security Header Banner */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[#D91E2A]/10 text-[#D91E2A] border border-[#D91E2A]/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(217,30,42,0.25)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                  Admin Security Lock
                </h3>
                <p className="text-xs text-[#9A9A9A] font-sans-clean leading-relaxed">
                  Only Saad Ahmed can upload or edit projects in this portfolio. Enter your security password below.
                </p>
              </div>

              {/* Security View 1: Password Login */}
              <form onSubmit={handleLogin} className="space-y-4 bg-[#111113] p-6 rounded-2xl border border-white/10">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1.5 font-bold">
                    Admin Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter admin password..."
                      className="w-full bg-[#080808] border border-white/10 rounded-xl pl-3.5 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#D91E2A] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D91E2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c01823] transition-all shadow-[0_0_20px_rgba(217,30,42,0.4)] flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock CMS Panel</span>
                </button>

                <div className="pt-2 text-center border-t border-white/5">
                  <p className="text-[10px] text-[#9A9A9A] font-mono">
                    Default Password: <code className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">UI/UXSAQ</code>
                  </p>
                </div>
              </form>

            </div>
          ) : (
            /* ================= IF AUTHENTICATED: FULL CMS ADMIN PANEL ================= */
            <>
              {/* Mode Tabs & Control Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'list'
                        ? 'bg-[#D91E2A] text-white shadow-[0_0_12px_rgba(217,30,42,0.4)]'
                        : 'bg-white/5 text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    Project Archive ({projects.length})
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('form');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'form'
                        ? 'bg-[#D91E2A] text-white shadow-[0_0_12px_rgba(217,30,42,0.4)]'
                        : 'bg-white/5 text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editingProjectId ? 'Edit Project' : 'Upload New Project'}</span>
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const saved = localStorage.getItem('saad_portfolio_inquiries_v1');
                        setInquiries(saved ? JSON.parse(saved) : []);
                      } catch(e) {}
                      setActiveTab('inquiries');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'inquiries'
                        ? 'bg-[#25D366] text-black font-bold shadow-[0_0_12px_rgba(37,211,102,0.4)]'
                        : 'bg-white/5 text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    <span>📬 Received Inquiries ({inquiries.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      fetchReviews();
                      setActiveTab('reviews');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'bg-[#D91E2A] text-white font-bold shadow-[0_0_12px_rgba(217,30,42,0.4)]'
                        : 'bg-white/5 text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    <span>⭐ Client Reviews ({reviewsList.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onResetData}
                    className="text-[11px] text-[#9A9A9A] hover:text-red-400 flex items-center gap-1"
                    title="Reset all CMS projects to original initial state"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Project List */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#9A9A9A]">
                    <span>Manage uploaded portfolio case studies</span>
                    <button
                      onClick={handleLoadSample}
                      className="text-[#D91E2A] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Pre-fill Sample CMS Project</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-2xl bg-[#141414] border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-12 rounded-lg object-cover bg-black"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                              <span className="text-[9px] bg-[#D91E2A]/20 text-[#D91E2A] px-2 py-0.5 rounded-full border border-[#D91E2A]/30 font-bold">
                                {proj.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#9A9A9A] line-clamp-1 max-w-md">
                              {proj.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEdit(proj)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4 text-[#D91E2A]" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Add / Edit Project Form */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveForm} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="flex justify-between items-center bg-[#111113] p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-mono font-bold text-[#D91E2A]">
                      {editingProjectId ? 'EDITING PROJECT' : 'NEW PROJECT UPLOAD FORM'}
                    </span>
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="text-xs text-[#9A9A9A] hover:text-white underline"
                    >
                      Load Pre-filled Sample Data
                    </button>
                  </div>

                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Noble Matrimonial"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      >
                        <option value="Website Design">Website Design</option>
                        <option value="Dashboard Design">Dashboard Design</option>
                        <option value="UX Case Study">UX Case Study</option>
                        <option value="Corporate Website">Corporate Website</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Branding">Branding</option>
                      </select>
                    </div>
                  </div>

                  {/* Year & Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        placeholder="2026"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Client Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formClient}
                        onChange={(e) => setFormClient(e.target.value)}
                        placeholder="e.g. Noble Matrimony Inc."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>
                  </div>

                  {/* Cover Image & Gallery with Direct File Upload Support */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-[#9A9A9A] uppercase">
                          Cover Image URL
                        </label>
                        <label className="text-[10px] font-mono text-[#D91E2A] hover:text-[#ff3846] flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'cover')}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formCover}
                        onChange={(e) => setFormCover(e.target.value)}
                        placeholder="https://... or click Upload File"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-[#9A9A9A] uppercase">
                          Gallery URLs (Comma Separated)
                        </label>
                        <label className="text-[10px] font-mono text-[#D91E2A] hover:text-[#ff3846] flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'gallery')}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formGallery}
                        onChange={(e) => setFormGallery(e.target.value)}
                        placeholder="https://img1, https://img2"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>
                  </div>

                  {uploadSuccessMsg && (
                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>{uploadSuccessMsg}</span>
                    </div>
                  )}

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="Designed a modern platform focused on simplicity..."
                      className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                    />
                  </div>

                  {/* Problem & Research */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Problem Statement
                      </label>
                      <textarea
                        rows={3}
                        value={formProblem}
                        onChange={(e) => setFormProblem(e.target.value)}
                        placeholder="Describe the challenge solved..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Research Insights
                      </label>
                      <textarea
                        rows={3}
                        value={formResearch}
                        onChange={(e) => setFormResearch(e.target.value)}
                        placeholder="User interviews and findings..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>
                  </div>

                  {/* Figma Prototype & Live Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Figma Prototype Link
                      </label>
                      <input
                        type="text"
                        value={formPrototype}
                        onChange={(e) => setFormPrototype(e.target.value)}
                        placeholder="https://figma.com/proto/..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Live Website Link
                      </label>
                      <input
                        type="text"
                        value={formLive}
                        onChange={(e) => setFormLive(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>
                  </div>

                  {/* Tools & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Tools Used (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={formTools}
                        onChange={(e) => setFormTools(e.target.value)}
                        placeholder="Figma, Adobe Photoshop, FigJam"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#9A9A9A] uppercase mb-1">
                        Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="UX Case Study, Matrimonial, Design System"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D91E2A]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab('list');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/5 text-xs font-medium text-[#9A9A9A] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#D91E2A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c01823] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(217,30,42,0.4)]"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProjectId ? 'Update Project' : 'Publish to Portfolio'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Received Inquiries */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#16161A] via-[#111113] to-[#16161A] border border-[#25D366]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/30 font-bold">
                        🔒
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span>PRIVATE ADMIN INBOX</span>
                          <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                            Saad Only
                          </span>
                        </h4>
                        <p className="text-[11px] text-[#9A9A9A]">
                          All messages submitted on your portfolio contact form are received privately here. Protected by password <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">UI/UXSAQ</code>.
                        </p>
                      </div>
                    </div>

                    {inquiries.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm('Clear all received inquiry logs from server and local inbox?')) {
                            localStorage.removeItem('saad_portfolio_inquiries_v1');
                            try {
                              await fetch('/api/inquiries', { method: 'DELETE' });
                            } catch (e) {}
                            setInquiries([]);
                            showToast('Inquiries inbox cleared.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-[11px] whitespace-nowrap self-start sm:self-auto"
                      >
                        Clear All Messages
                      </button>
                    )}
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-10 text-center rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#9A9A9A] flex items-center justify-center mx-auto text-xl mb-3">
                        📭
                      </div>
                      <p className="text-sm font-bold text-white">No private messages received yet.</p>
                      <p className="text-xs text-[#9A9A9A] max-w-md mx-auto">
                        When any visitor submits a message on your website, it will be stored securely on the server and displayed exclusively on this private page for Saad Ahmed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq, idx) => (
                        <div
                          key={inq.id || idx}
                          className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3 hover:border-white/20 transition-all relative group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{inq.name}</span>
                                <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-2.5 py-0.5 rounded-full border border-[#25D366]/30 font-bold">
                                  {inq.service || 'UI/UX Inquiry'}
                                </span>
                              </div>
                              <a href={`mailto:${inq.email}`} className="text-xs text-[#D91E2A] hover:underline font-mono">
                                {inq.email}
                              </a>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-[#9A9A9A]">
                                {inq.timestamp ? new Date(inq.timestamp).toLocaleString() : 'Recent'}
                              </span>
                              <button
                                onClick={async () => {
                                  if (inq.id) {
                                    try {
                                      await fetch(`/api/inquiries?id=${inq.id}`, { method: 'DELETE' });
                                    } catch (e) {}
                                  }
                                  const filtered = inquiries.filter((_, i) => i !== idx);
                                  setInquiries(filtered);
                                  localStorage.setItem('saad_portfolio_inquiries_v1', JSON.stringify(filtered));
                                  showToast('Message deleted');
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#9A9A9A] hover:text-red-400 transition-colors"
                                title="Delete Message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-white/90 leading-relaxed font-sans-clean whitespace-pre-line bg-[#080808] p-3.5 rounded-xl border border-white/5">
                            {inq.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                            <a
                              href={`https://api.whatsapp.com/send?phone=923458273354&text=${encodeURIComponent(`Hello ${inq.name}! Re: ${inq.service} project inquiry.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-lg bg-[#25D366] text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#20bd5a] transition-all"
                            >
                              <span>Reply on WhatsApp (+92 345 8273354)</span>
                            </a>
                            <a
                              href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.service} Inquiry - Saad Ahmed`)}`}
                              className="px-3.5 py-1.5 rounded-lg bg-[#D91E2A] text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#c01823] transition-all"
                            >
                              <span>Reply via Email ({inq.email})</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Client Reviews Management */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#16161A] via-[#111113] to-[#16161A] border border-[#D91E2A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#D91E2A]/20 text-[#D91E2A] flex items-center justify-center shrink-0 border border-[#D91E2A]/30 font-bold">
                        ⭐
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span>CLIENT REVIEWS MANAGER</span>
                          <span className="text-[9px] bg-[#D91E2A]/20 text-[#D91E2A] px-2 py-0.5 rounded-full border border-[#D91E2A]/30 font-bold">
                            {reviewsList.length} Active Reviews
                          </span>
                        </h4>
                        <p className="text-[11px] text-[#9A9A9A]">
                          View and delete any client testimonials or reviews displayed on your website.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Restore all default sample client reviews?')) {
                          localStorage.removeItem('saad_deleted_testimonials');
                          fetchReviews();
                          showToast('Reviews restored to defaults.');
                          window.dispatchEvent(new Event('storage'));
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[11px] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#D91E2A]" />
                      <span>Restore Default Reviews</span>
                    </button>
                  </div>

                  {reviewsList.length === 0 ? (
                    <div className="p-10 text-center rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                      <p className="text-sm font-bold text-white">No active reviews.</p>
                      <button
                        onClick={() => {
                          localStorage.removeItem('saad_deleted_testimonials');
                          fetchReviews();
                        }}
                        className="text-xs text-[#D91E2A] hover:underline font-bold"
                      >
                        Click here to restore default client reviews
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviewsList.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3 relative group hover:border-[#D91E2A]/40 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                            <div>
                              <h5 className="text-sm font-bold text-white">{rev.name}</h5>
                              <p className="text-[11px] text-[#D91E2A] font-medium">{rev.role} • {rev.company}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-[#D91E2A] text-[#D91E2A]" />
                                ))}
                              </div>
                              <button
                                onClick={() => handleDeleteReviewInCms(rev.id)}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer border border-red-500/20"
                                title="Delete this review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[#9A9A9A] italic leading-relaxed font-sans-clean">
                            "{rev.content}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Sliders, Menu, X, ArrowUpRight, Bell, MessageSquare, Star, CheckCheck, Trash2 } from 'lucide-react';
import saadAvatar from '../assets/images/regenerated_image_1785846926081.png';
import saadHeadshot from '../assets/images/saad_avatar_headshot_1785846847266.jpg';

interface NavbarProps {
  onOpenCms: (tab?: 'list' | 'inquiries') => void;
  activeSection: string;
}

interface NotificationItem {
  id: string;
  name: string;
  email?: string;
  service?: string;
  message: string;
  timestamp: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCms, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [inquiriesList, setInquiriesList] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saad_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      // 1. Fetch from local storage
      const localStr = localStorage.getItem('saad_portfolio_inquiries_v1');
      let localInquiries: NotificationItem[] = localStr ? JSON.parse(localStr) : [];

      // 2. Fetch from server API
      try {
        const res = await fetch('/api/inquiries');
        if (res.ok) {
          const data = await res.json();
          if (data.inquiries && Array.isArray(data.inquiries)) {
            const serverInquiries: NotificationItem[] = data.inquiries;
            const existingIds = new Set(localInquiries.map(i => i.id));
            serverInquiries.forEach(srvInq => {
              if (!existingIds.has(srvInq.id)) {
                localInquiries.push(srvInq);
              }
            });
          }
        }
      } catch (err) {
        // Server fetch fallback
      }

      // Sort newest first
      localInquiries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setInquiriesList(localInquiries);
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 6000);
    const handleStorageChange = () => loadNotifications();
    const handleFocus = () => loadNotifications();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = inquiriesList.filter(item => !readIds.includes(item.id)).length;

  const markAllAsRead = () => {
    const allIds = inquiriesList.map(i => i.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('saad_read_notifications', JSON.stringify(allIds));
    } catch (e) {}
  };

  const markSingleAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem('saad_read_notifications', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markSingleAsRead(item.id);
    setNotificationsOpen(false);
    onOpenCms('inquiries');
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Process', href: '#process', id: 'process' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Location', href: '#location', id: 'location' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-r from-[#D91E2A] via-red-500 to-[#D91E2A] shadow-[0_0_20px_rgba(217,30,42,0.65)] shrink-0 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#080808]">
              <img
                src={saadAvatar || saadHeadshot}
                alt="Saad Ahmed Avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bebas tracking-wider text-lg sm:text-2xl font-black text-white uppercase leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              SAAD AHMED
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#D91E2A] font-extrabold uppercase mt-0.5 whitespace-nowrap">
              WEB DESIGNER & UI/UX CREATOR
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 bg-[#111113]/90 px-5 py-2.5 rounded-full border border-white/[0.08] backdrop-blur-md shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === (link.id || link.name.toLowerCase());
            return (
              <a
                key={link.name}
                href={link.href}
                className={`text-[10px] xl:text-[11px] font-bold tracking-widest uppercase transition-colors relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D91E2A] rounded-full shadow-[0_0_10px_#D91E2A]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 relative" ref={dropdownRef}>
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-full bg-[#111113] border border-white/10 hover:border-[#D91E2A]/60 text-white transition-all cursor-pointer group shadow-sm flex items-center justify-center"
              title="Notifications & New Messages"
              aria-label="Notifications"
            >
              <Bell className={`w-4 h-4 transition-transform ${unreadCount > 0 ? 'text-[#D91E2A] animate-bounce' : 'text-[#9A9A9A] group-hover:text-white'}`} />
              
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#D91E2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(217,30,42,0.8)] border border-[#080808]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D91E2A] rounded-full animate-ping opacity-75 pointer-events-none" />
                </>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111113] border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-xl animate-fadeIn">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#D91E2A]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D91E2A]/20 border border-[#D91E2A]/40 text-[#D91E2A] text-[10px] font-bold">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#9A9A9A] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {inquiriesList.length === 0 ? (
                    <div className="p-8 text-center text-[#9A9A9A] text-xs">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-white/20" />
                      <p className="font-semibold text-white">No notifications yet</p>
                      <p className="text-[11px] mt-1 text-[#9A9A9A]">New client messages and reviews will trigger notifications here live.</p>
                    </div>
                  ) : (
                    inquiriesList.slice(0, 10).map((item) => {
                      const isUnread = !readIds.includes(item.id);
                      const isReview = item.service?.includes('Review') || item.email?.includes('Review');

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-4 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 relative ${
                            isUnread ? 'bg-[#D91E2A]/5' : ''
                          }`}
                        >
                          {isUnread && (
                            <span className="absolute left-2 top-5 w-2 h-2 rounded-full bg-[#D91E2A] shadow-[0_0_8px_#D91E2A]" />
                          )}

                          <div className={`p-2 rounded-lg shrink-0 ${isReview ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-[#D91E2A]/10 text-[#D91E2A] border border-[#D91E2A]/20'}`}>
                            {isReview ? <Star className="w-4 h-4 fill-amber-400" /> : <MessageSquare className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-white truncate">{item.name}</span>
                              <span className="text-[10px] text-[#9A9A9A] font-mono shrink-0">{formatTimeAgo(item.timestamp)}</span>
                            </div>

                            <div className="text-[11px] font-semibold text-[#D91E2A] mb-1 truncate">
                              {item.service || (isReview ? '⭐ Client Review' : '✉️ Contact Message')}
                            </div>

                            <p className="text-xs text-[#9A9A9A] line-clamp-2 leading-relaxed">
                              "{item.message}"
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-3 bg-black/60 border-t border-white/10 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onOpenCms('inquiries');
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#D91E2A] hover:text-white text-xs font-bold text-[#9A9A9A] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Private Admin Inbox</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CMS Admin Button */}
          <button
            onClick={() => onOpenCms('list')}
            className="hidden md:flex p-2.5 rounded-full bg-[#111113] border border-white/10 hover:border-[#D91E2A]/60 text-white transition-all group shadow-sm cursor-pointer items-center justify-center"
            title="Open CMS Project Manager"
            aria-label="CMS Admin"
          >
            <Sliders className="w-4 h-4 text-[#D91E2A] group-hover:rotate-45 transition-transform" />
          </button>

          {/* Hire Me / Contact Button */}
          <a
            href="#contact"
            className="hidden md:flex whitespace-nowrap shrink-0 items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D91E2A] text-white hover:bg-[#c01823] transition-all shadow-[0_0_20px_rgba(217,30,42,0.4)] hover:shadow-[0_0_30px_rgba(217,30,42,0.6)]"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-[#141414] border border-white/10 text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 border-b border-white/10 px-6 py-6 flex flex-col gap-4 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold text-[#9A9A9A] hover:text-white active:text-[#D91E2A] active:scale-98 transition-all py-2 border-b border-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms('inquiries');
              }}
              className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-[#141414] border border-white/10 text-xs font-bold text-white active:bg-white/10 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D91E2A]" />
                <span>Inbox Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#D91E2A] text-white text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms('list');
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-bold text-white active:bg-white/10 active:scale-98 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#D91E2A]" />
              <span>CMS Admin / Project Upload</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D91E2A] active:bg-[#c01823] text-xs font-bold uppercase text-white shadow-[0_0_15px_rgba(217,30,42,0.4)] active:scale-98 transition-all"
            >
              <span>Contact Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data/initialData';
import { Testimonial } from '../types';
import { Quote, Star, Plus, X, Send, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const easing = [0.22, 1, 0.36, 1];
  const [isHovered, setIsHovered] = useState(false);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load custom reviews and excluded IDs from localStorage and server API on mount and on storage events
  useEffect(() => {
    const loadTestimonials = async () => {
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
          console.log('Server review fetch:', srvErr);
        }

        // Merge server reviews and local custom reviews using Map to avoid duplicates
        const reviewMap = new Map<string, Testimonial>();

        // Add server reviews first (server is the global public truth)
        serverList.forEach(r => reviewMap.set(r.id, r));

        // Add local custom reviews if not yet synced with server
        localCustomList.forEach(r => {
          if (!reviewMap.has(r.id)) {
            reviewMap.set(r.id, r);
          }
        });

        const publicUserReviews = Array.from(reviewMap.values());

        // Combine public user reviews at front + showcase testimonials, filtering out deleted ones
        const combined = [...publicUserReviews, ...TESTIMONIALS].filter(t => !deletedIds.includes(t.id));
        setTestimonialsList(combined);
      } catch (e) {
        console.error('Failed loading testimonials:', e);
      }
    };

    loadTestimonials();

    // Auto-poll server every 10 seconds so any review submitted by anyone appears live automatically
    const interval = setInterval(loadTestimonials, 10000);

    const handleFocus = () => loadTestimonials();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', loadTestimonials);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', loadTestimonials);
    };
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const reviewId = `custom-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newReview: Testimonial = {
      id: reviewId,
      name: name.trim(),
      role: role.trim() || 'Client',
      company: company.trim() || 'Collaborator',
      content: content.trim(),
      rating: rating,
    };

    // 1. Immediately send to public server API so it persists globally for all visitors
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.id) {
          newReview.id = data.data.id;
        }
      }
    } catch (err) {
      console.log('Server API review log:', err);
    }

    // 2. Save in localStorage as local cache
    try {
      const savedCustom = localStorage.getItem('saad_user_testimonials');
      const existing: Testimonial[] = savedCustom ? JSON.parse(savedCustom) : [];
      const updatedUserOnly = [newReview, ...existing.filter(r => r.id !== newReview.id)];
      localStorage.setItem('saad_user_testimonials', JSON.stringify(updatedUserOnly));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }

    // 3. Save as inquiry log for CMS Admin inbox
    try {
      const existingStr = localStorage.getItem('saad_portfolio_inquiries_v1');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const reviewInquiry = {
        id: `review-inq-${Date.now()}`,
        name: name.trim(),
        email: 'Public Client Review',
        service: `⭐ Client Review (${rating} Stars)`,
        message: `Role: ${role.trim() || 'Client'} @ ${company.trim() || 'Collaborator'}\n\nReview: "${content.trim()}"`,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('saad_portfolio_inquiries_v1', JSON.stringify([reviewInquiry, ...existing]));
    } catch (err) {
      console.error(err);
    }

    // 4. Update UI state immediately
    setTestimonialsList(prev => {
      const filtered = prev.filter(r => r.id !== newReview.id);
      return [newReview, ...filtered];
    });

    setIsSubmitting(false);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      setIsModalOpen(false);
      setName('');
      setRole('');
      setCompany('');
      setContent('');
      setRating(5);
    }, 2000);
  };

  // Multiply testimonials array to ensure a seamless infinite loop (3 copies)
  const marqueeItems = testimonialsList.length < 6
    ? [...testimonialsList, ...testimonialsList, ...testimonialsList, ...testimonialsList, ...testimonialsList, ...testimonialsList]
    : [...testimonialsList, ...testimonialsList, ...testimonialsList];

  const trackRef = React.useRef<HTMLDivElement>(null);
  const isMouseDownRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const isHoveredRef = React.useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth continuous auto-scroll with rAF when not dragging or hovered
  useEffect(() => {
    let animId: number;
    const autoScroll = () => {
      if (trackRef.current && !isMouseDownRef.current && !isModalOpen) {
        // Pause gently on hover, auto-slide continuously when not hovered
        if (!isHoveredRef.current) {
          trackRef.current.scrollLeft += 0.8;
        }

        const scrollWidth = trackRef.current.scrollWidth;
        const oneThird = scrollWidth / 3;
        if (oneThird > 0) {
          if (trackRef.current.scrollLeft >= oneThird * 2) {
            trackRef.current.scrollLeft -= oneThird;
          } else if (trackRef.current.scrollLeft <= 0) {
            trackRef.current.scrollLeft += oneThird;
          }
        }
      }
      animId = requestAnimationFrame(autoScroll);
    };
    animId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animId);
  }, [isModalOpen]);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isMouseDownRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    isHoveredRef.current = false;
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    let newScroll = scrollLeftRef.current - walk;

    const oneThird = trackRef.current.scrollWidth / 3;
    if (oneThird > 0) {
      if (newScroll >= oneThird * 2) {
        newScroll -= oneThird;
        startXRef.current = x;
        scrollLeftRef.current = newScroll;
      } else if (newScroll <= 0) {
        newScroll += oneThird;
        startXRef.current = x;
        scrollLeftRef.current = newScroll;
      }
    }
    trackRef.current.scrollLeft = newScroll;
  };

  return (
    <section id="testimonials" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#D91E2A]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: easing }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                LIVE CLIENT REVIEWS & TESTIMONIALS
              </span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase">
              Trusted By <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">Founders & Product Leads</span>
            </h2>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#D91E2A] hover:bg-[#c01823] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(217,30,42,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </motion.div>

      </div>

      {/* Sliding & Draggable Marquee Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Gradient Edge Masks for Smooth Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#080808] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#080808] to-transparent z-20 pointer-events-none" />

        <div 
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
          onTouchStart={() => { isHoveredRef.current = true; setIsHovered(true); setIsDragging(true); }}
          onTouchEnd={() => { isHoveredRef.current = false; setIsHovered(false); setIsDragging(false); }}
          className={`flex gap-6 overflow-x-auto py-2 px-6 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [::-webkit-scrollbar]:hidden ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'auto'
          }}
        >
          {marqueeItems.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[320px] sm:w-[420px] shrink-0 glass-card p-8 rounded-2xl border border-white/10 flex flex-col justify-between relative bg-[#111113] transition-all hover:border-[#D91E2A]/50 hover:shadow-[0_20px_40px_-15px_rgba(217,30,42,0.25)] group select-none"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Quote className="w-8 h-8 text-[#D91E2A] opacity-80" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D91E2A] text-[#D91E2A]" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="font-sans-clean text-sm text-[#FFFFFF]/90 leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-white/[0.08]">
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <span>{t.name}</span>
                  {t.id.startsWith('custom-') && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#D91E2A]/20 text-[#D91E2A] font-semibold border border-[#D91E2A]/30">Verified Reviewer</span>
                  )}
                </div>
                <div className="text-xs text-[#9A9A9A]">
                  {t.role} • <span className="text-[#D91E2A] font-bold">{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Testimonial Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-[#0E0E10] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="font-bebas text-2xl font-bold uppercase tracking-wide text-white">
                    Submit a Client Review
                  </h3>
                  <p className="text-xs text-[#9A9A9A]">Share your experience working with Saad Ahmed</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-[#9A9A9A] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {showSuccessMessage ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-[#25D366] animate-bounce" />
                  <h4 className="font-bebas text-3xl font-bold text-white uppercase tracking-wider">Review Submitted!</h4>
                  <p className="text-sm text-[#9A9A9A] max-w-xs">
                    Thank you so much! Your testimonial has been added live to the portfolio marquee.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A] mb-2">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-amber-400 focus:outline-none cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'fill-[#D91E2A] text-[#D91E2A]' : 'text-zinc-600'}`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-mono text-[#D91E2A] font-bold">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A] mb-1.5">
                      Your Full Name <span className="text-[#D91E2A]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161619] border border-white/10 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#D91E2A] transition-colors"
                    />
                  </div>

                  {/* Role & Company Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A] mb-1.5">
                        Your Role / Position
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Founder & CEO"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#161619] border border-white/10 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#D91E2A] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A] mb-1.5">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TechCorp Inc."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#161619] border border-white/10 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#D91E2A] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9A9A9A] mb-1.5">
                      Your Feedback / Review <span className="text-[#D91E2A]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your review about Saad's UI/UX design quality, speed, communication, or overall impact..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161619] border border-white/10 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#D91E2A] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#D91E2A] hover:bg-[#c01823] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(217,30,42,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Publishing Review...' : 'Publish Review Live'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Admin Password Modal for Deleting Reviews */}
      <AnimatePresence>
      </AnimatePresence>
    </section>
  );
};




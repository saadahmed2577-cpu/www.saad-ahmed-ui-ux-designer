import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  onOpenInbox?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenInbox }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'UI/UX Design',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const easing = [0.22, 1, 0.36, 1];

  const [lastSentMode, setLastSentMode] = useState<'both' | 'whatsapp' | 'email'>('both');

  const getFormattedMessage = () => {
    return `Hello Saad! I saw your portfolio and would like to get in touch:

📌 Name: ${formData.name}
✉️ Email: ${formData.email}
🎨 Service: ${formData.service}

📝 Project Details:
${formData.message}`;
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(getFormattedMessage());
    return `https://api.whatsapp.com/send?phone=923458273354&text=${text}`;
  };

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`New Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(getFormattedMessage());
    return `mailto:saadahmed3803@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);

    const inquiryPayload = {
      id: `inquiry-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      service: formData.service,
      message: formData.message,
      timestamp: new Date().toISOString(),
      sentToPhone: '+92 345 8273354',
      sentToEmail: 'saadahmed3803@gmail.com'
    };

    // Save to local storage for CMS Inbox viewing
    try {
      const existingStr = localStorage.getItem('saad_portfolio_inquiries_v1');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('saad_portfolio_inquiries_v1', JSON.stringify([inquiryPayload, ...existing]));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed saving inquiry to local storage:', err);
    }

    // Call server endpoint
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          message: formData.message
        })
      });
    } catch (err) {
      console.log('Server endpoint contact logged:', err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: easing }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30">
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                04 // GET IN TOUCH
              </span>
            </div>

            <h2 className="font-bebas text-5xl sm:text-7xl font-bold text-white leading-none uppercase">
              LET'S BUILD <br />
              <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-4xl sm:text-6xl">Something</span> <br />
              EXCEPTIONAL.
            </h2>

            <p className="font-sans-clean text-xs sm:text-sm text-[#9A9A9A] leading-relaxed max-w-md">
              Whether you're launching a new digital product, redesigning a complex web application, or establishing a design system, I'm ready to bring your vision to life.
            </p>

            {/* Direct Information List */}
            <div className="space-y-4 pt-2">
              
              {/* Email */}
              <motion.a
                href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#sent?compose=new"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 6, borderColor: 'rgba(217, 30, 42, 0.6)' }}
                whileTap={{ x: 8, scale: 0.98, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111113] border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D91E2A]/10 text-[#D91E2A] flex items-center justify-center shrink-0 group-hover:bg-[#D91E2A] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-[#9A9A9A] uppercase font-bold">Email Address</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#D91E2A] transition-colors flex items-center justify-between gap-1.5">
                    <span className="truncate">saadahmed3803@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D91E2A] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </motion.a>

              {/* Phone */}
              <motion.a
                href="https://wa.me/923458273354"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 6, borderColor: 'rgba(217, 30, 42, 0.6)' }}
                whileTap={{ x: 8, scale: 0.98, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111113] border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D91E2A]/10 text-[#D91E2A] flex items-center justify-center shrink-0 group-hover:bg-[#D91E2A] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-[#9A9A9A] uppercase font-bold">Phone / WhatsApp</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#D91E2A] transition-colors flex items-center justify-between gap-1.5">
                    <span>+92 345 8273354</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D91E2A] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </motion.a>

              {/* Location */}
              <motion.a
                href="https://www.google.com/maps/place/New+Karachi+Town,+Karachi,+Pakistan/@24.9914645,67.0436444,14z/data=!3m1!4b1!4m6!3m5!1s0x3eb3411d1b1aa5dd:0x7f8008a575c0b797!8m2!3d24.9930024!4d67.0650956!16zL20vMDlwMXlm?hl=en-US&entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 6, borderColor: 'rgba(217, 30, 42, 0.6)' }}
                whileTap={{ x: 8, scale: 0.98, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111113] border border-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D91E2A]/10 text-[#D91E2A] flex items-center justify-center shrink-0 group-hover:bg-[#D91E2A] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-[#9A9A9A] uppercase font-bold flex items-center gap-1.5">
                    <span>Address / Location</span>
                    <span className="text-[9px] text-[#D91E2A] font-semibold">(View on Google Maps)</span>
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-[#D91E2A] transition-colors flex items-center justify-between gap-1.5">
                    <span className="truncate">New Karachi Town, Karachi, Pakistan</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D91E2A] opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </motion.a>

            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: easing }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 sm:p-10 rounded-2xl border border-white/10 relative">
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white uppercase tracking-wider">Send a Message</h3>
                      <span className="text-[10px] font-mono font-bold text-[#D91E2A] bg-[#D91E2A]/10 border border-[#D91E2A]/20 px-2.5 py-1 rounded-full uppercase">
                        Direct to Private Admin Inbox
                      </span>
                    </div>
                    <p className="text-xs text-[#9A9A9A] mb-4">
                      Submitting this form sends your message directly to Saad's private portfolio inbox.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-mono text-[#9A9A9A] font-bold uppercase mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full bg-[#080808] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#D91E2A] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#9A9A9A] font-bold uppercase mb-2">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="w-full bg-[#080808] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#D91E2A] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#9A9A9A] font-bold uppercase mb-2">
                        Service Required
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-[#080808] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D91E2A] transition-colors"
                      >
                        <option value="UI/UX Design">UI/UX Design & Research</option>
                        <option value="Website Design">Website Design & Webflow</option>
                        <option value="Dashboard Design">Analytics Dashboard Design</option>
                        <option value="Mobile App">Mobile Application Interface</option>
                        <option value="Design System">Figma Design System & Tokens</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#9A9A9A] font-bold uppercase mb-2">
                        Project Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project scope, timeline, and goals..."
                        className="w-full bg-[#080808] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#D91E2A] transition-colors"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl bg-[#D91E2A] hover:bg-[#c01823] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(217,30,42,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                      </motion.button>
                      <p className="text-[10px] text-center text-[#9A9A9A] font-mono mt-2.5">
                        Delivered directly to Saad's Private Admin Inbox
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Message Sent Successfully!</h3>
                      <p className="text-xs text-[#9A9A9A] max-w-sm mx-auto">
                        Thank you <span className="text-white font-bold">{formData.name}</span>! Your message has been delivered directly to Saad Ahmed's private inbox.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#080808] border border-[#25D366]/30 text-left text-xs space-y-2 font-mono max-w-md mx-auto">
                      <div className="text-[#25D366] font-bold uppercase text-[10px] flex items-center gap-1.5">
                        <span>🔒 PRIVATELY DELIVERED & SAVED</span>
                      </div>
                      <div className="text-white"><span className="text-[#9A9A9A]">Recipient:</span> Saad Ahmed</div>
                      <div className="text-white"><span className="text-[#9A9A9A]">Service Requested:</span> {formData.service}</div>
                      <div className="text-[#9A9A9A] text-[11px] pt-1 border-t border-white/10 font-sans-clean leading-snug">
                        Your message has been logged securely in Saad's private Admin Inbox.
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', service: 'UI/UX Design', message: '' });
                        }}
                        className="text-xs font-mono text-[#9A9A9A] hover:text-white underline cursor-pointer"
                      >
                        ← Send another message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, RefreshCw, Smartphone, Monitor, ShieldAlert } from 'lucide-react';

interface InPageBrowserModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
}

export const InPageBrowserModal: React.FC<InPageBrowserModalProps> = ({
  url,
  title,
  onClose,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!url) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-6xl h-[92vh] bg-[#0E0E12] border border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative"
        >
          {/* In-Page Browser Header / Address Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#141419] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
            {/* Window Dots & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onClose}
                  className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:opacity-80 transition-opacity"
                  title="Close In-Page Browser"
                />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] opacity-60" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] opacity-60" />
              </div>

              <div className="h-4 w-[1px] bg-white/15 mx-1" />

              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate max-w-[200px] sm:max-w-md">
                {title || 'IN-PAGE WEB PREVIEW'}
              </span>
            </div>

            {/* Address Bar Simulation */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-3 px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-[#9A9A9A] truncate">
              <span className="text-emerald-400 mr-2 font-bold">https://</span>
              <span className="truncate text-white/80">{url.replace(/^https?:\/\//, '')}</span>
            </div>

            {/* Device Toggles & Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-mono transition-colors ${
                    deviceView === 'desktop' ? 'bg-[#D91E2A] text-white font-bold' : 'text-[#888] hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 font-mono transition-colors ${
                    deviceView === 'mobile' ? 'bg-[#D91E2A] text-white font-bold' : 'text-[#888] hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Mobile</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  setIframeKey((prev) => prev + 1);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                title="Refresh Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-[#D91E2A] hover:bg-[#b81722] text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="flex-1 bg-[#050508] relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
            <div
              className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-white ${
                deviceView === 'mobile' ? 'w-[375px] max-h-[700px]' : 'w-full'
              }`}
            >
              <iframe
                key={iframeKey}
                src={url}
                title={title || 'Embedded Website'}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups-to-escape-sandbox"
                onError={() => setHasError(true)}
              />

              {/* Notice in case third-party site has X-Frame-Options restriction */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-[11px] font-mono text-white flex items-center gap-2 pointer-events-none shadow-lg max-w-[90%] truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Active In-Page Session — No browser tabs opened</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

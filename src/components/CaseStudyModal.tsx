import React, { useState } from 'react';
import { Project } from '../types';
import { X, ExternalLink, Figma, CheckCircle, ArrowRight, Maximize2, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenPreview?: (url: string, title: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onOpenPreview }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/[0.12] rounded-3xl overflow-hidden my-auto shadow-2xl text-white">
        
        {/* Sticky Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] uppercase bg-[#D91E2A]/10 px-2.5 py-1 rounded-full border border-[#D91E2A]/20 font-bold">
              {project.category}
            </span>
            <span className="text-xs font-mono text-[#9A9A9A]">Year {project.year}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#111113] hover:bg-white/10 text-white transition-colors"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-12">
          
          {/* Header Title & Short Description */}
          <div>
            <h1 className="font-bebas text-4xl sm:text-6xl font-bold text-white mb-4 uppercase">
              {project.title}
            </h1>
            <p className="font-sans-clean text-base sm:text-lg text-[#9A9A9A] max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Large Cover Hero */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#111113]">
            <img
              src={project.coverImage}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-2xl bg-[#111113] border border-white/10">
            <div>
              <div className="text-[10px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">Client</div>
              <div className="text-xs font-bold text-white">{project.clientName || 'N/A'}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">Category</div>
              <div className="text-xs font-bold text-white">{project.category}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">Year</div>
              <div className="text-xs font-bold text-white">{project.year}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#9A9A9A] uppercase mb-1 font-bold">Tools Used</div>
              <div className="text-xs font-bold text-[#D91E2A] flex flex-wrap gap-1">
                {project.toolsUsed.join(', ')}
              </div>
            </div>
          </div>

          {/* Problem & Research Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-[#111113] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-[#D91E2A] font-bold uppercase tracking-wider">
                01 // PROBLEM STATEMENT
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">The Core Challenge</h3>
              <p className="text-sm text-[#9A9A9A] leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#111113] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-[#D91E2A] font-bold uppercase tracking-wider">
                02 // USER RESEARCH
              </span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Research Insights</h3>
              <p className="text-sm text-[#9A9A9A] leading-relaxed">
                {project.research}
              </p>
            </div>
          </div>

          {/* Design Process Timeline */}
          {project.designProcess && project.designProcess.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D91E2A]" />
                <h3 className="text-xl font-bold uppercase tracking-wider text-white">Design Process Workflow</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.designProcess.map((proc, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#111113] border border-white/10 space-y-2"
                  >
                    <div className="text-xs font-mono font-bold text-[#D91E2A]">
                      STEP 0{idx + 1}
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">{proc.phase}</div>
                    <p className="text-xs text-[#9A9A9A] leading-relaxed">
                      {proc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography & Color Palette Specs if present */}
          {(project.typography || project.colorPalette) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-[#111113] border border-white/10">
              {project.typography && (
                <div>
                  <span className="text-xs font-mono text-[#D91E2A] font-bold uppercase tracking-wider block mb-3">
                    TYPOGRAPHY SPEC
                  </span>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#9A9A9A]">Heading Font: </span>
                      <span className="font-bebas text-white text-lg">
                        {project.typography.headingFont}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#9A9A9A]">Body Font: </span>
                      <span className="text-white">{project.typography.bodyFont}</span>
                    </div>
                    <div className="p-3 bg-black/50 rounded-xl italic text-white/90 border border-white/5">
                      "{project.typography.sampleText}"
                    </div>
                  </div>
                </div>
              )}

              {project.colorPalette && (
                <div>
                  <span className="text-xs font-mono text-[#D91E2A] font-bold uppercase tracking-wider block mb-3">
                    COLOR PALETTE
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {project.colorPalette.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5">
                        <div
                          className="w-6 h-6 rounded-lg border border-white/20 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div className="text-[11px]">
                          <div className="font-semibold text-white">{col.name}</div>
                          <div className="font-mono text-[#9A9A9A] text-[10px]">{col.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UI Screens Gallery */}
          {project.uiScreens && project.uiScreens.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white">Final UI Screens Showcase</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.uiScreens.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#111113] border border-white/10 cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`Screen ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full bg-black/80 text-white text-xs font-medium flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-[#D91E2A]" />
                        <span>Zoom Screen</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              {project.prototypeLink && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPreview && project.prototypeLink) {
                      onOpenPreview(project.prototypeLink, `${project.title} - Figma Prototype`);
                    }
                  }}
                  className="px-6 py-3 rounded-full bg-[#D91E2A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#c01823] transition-colors shadow-[0_0_20px_rgba(217,30,42,0.4)] cursor-pointer"
                >
                  <Figma className="w-4 h-4" />
                  <span>Figma Prototype</span>
                </button>
              )}
              {project.liveLink && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPreview && project.liveLink) {
                      onOpenPreview(project.liveLink, `${project.title} - Live Website`);
                    }
                  }}
                  className="px-6 py-3 rounded-full bg-[#111113] border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#D91E2A]" />
                  <span>Visit Live Website</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[#9A9A9A] text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>

      {/* Lightbox for Zoomed Image */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={activeImage}
            alt="Enlarged screen"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

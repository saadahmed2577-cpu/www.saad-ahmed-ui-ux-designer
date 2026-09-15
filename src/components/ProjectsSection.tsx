import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { Search, ArrowUpRight, Sliders, ExternalLink, Filter } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenCms: () => void;
  onOpenPreview?: (url: string, title: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenCms,
  onOpenPreview
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Website Design',
    'Dashboard Design',
    'UX Case Study',
    'Corporate Website',
    'Mobile App',
    'Branding'
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const easing = [0.22, 1, 0.36, 1];

  return (
    <section id="projects" className="py-24 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: easing }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 mb-4">
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                FEATURED WORK & CASE STUDIES
              </span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none uppercase">
              SELECTED <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-3xl sm:text-5xl">PROJECTS</span>
            </h2>
          </div>

        </motion.div>

        {/* Filters & Search Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: easing }}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-12 bg-[#111113] p-3 rounded-xl border border-white/[0.08]"
        >
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all relative cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D91E2A] text-white shadow-[0_0_15px_rgba(217,30,42,0.4)]'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies..."
              className="w-full bg-[#080808] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-[#9A9A9A] focus:outline-none focus:border-[#D91E2A] transition-colors"
            />
          </div>
        </motion.div>

        {/* Project Cards Grid with Layout Animations */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const formattedIndex = String(idx + 1).padStart(2, '0');
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: easing }}
                  whileHover={{ y: -10, borderColor: 'rgba(217, 30, 42, 0.6)', boxShadow: '0 20px 40px -15px rgba(217,30,42,0.25)' }}
                  whileTap={{ scale: 0.98, y: -4, borderColor: 'rgba(217, 30, 42, 0.8)' }}
                  className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border border-white/10 transition-colors cursor-pointer"
                >
                  <div>
                    {/* Large Cover Container with Image Zoom Mask */}
                    <div
                      onClick={() => onSelectProject(project)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-[#080808] cursor-pointer group/img"
                    >
                      <motion.img
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: easing }}
                        src={project.coverImage}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-80" />
                      
                      {/* Category Pill Tag */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-white uppercase font-bold">
                          {project.category}
                        </span>
                      </div>

                      {/* Year Tag */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#D91E2A] font-bold">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Card Information Body */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bebas text-3xl font-bold text-[#D91E2A] leading-none">
                          {formattedIndex}
                        </span>
                        <h3
                          onClick={() => onSelectProject(project)}
                          className="text-xl font-bold text-white hover:text-[#D91E2A] transition-colors cursor-pointer uppercase tracking-wide"
                        >
                          {project.title}
                        </h3>
                      </div>

                      <p className="font-sans-clean text-xs text-[#9A9A9A] leading-relaxed mb-4 line-clamp-2">
                        {project.shortDescription}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[#9A9A9A] uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                    <motion.button
                      onClick={() => onSelectProject(project)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#D91E2A] hover:bg-[#D91E2A] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </motion.button>

                    {project.liveLink && (
                      <motion.button
                        type="button"
                        onClick={() => {
                          if (onOpenPreview && project.liveLink) {
                            onOpenPreview(project.liveLink, project.title);
                          } else {
                            onSelectProject(project);
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-lg bg-[#111113] border border-white/10 hover:border-[#D91E2A] text-[#D91E2A] hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Open Live Preview in Portfolio"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-[#9A9A9A] text-sm">No projects match your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#D91E2A] text-white text-xs rounded font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { Project } from './types';
import { INITIAL_PROJECTS } from './data/initialData';
import { portfolioApi } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { DesignProcessSection } from './components/DesignProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MapSection } from './components/MapSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CmsAdminModal } from './components/CmsAdminModal';
import { ScrollProgress } from './components/ScrollProgress';
import { CursorGlow } from './components/CursorGlow';
import { GlassCrackEffect } from './components/GlassCrackEffect';

const STORAGE_KEY = 'saad_portfolio_projects_v1';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  // Real-time backend fetch
  const refreshProjectsFromBackend = useCallback(async () => {
    try {
      const serverProjects = await portfolioApi.getProjects();
      if (serverProjects && serverProjects.length > 0) {
        setProjects(serverProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverProjects));
      }
    } catch (err) {
      console.warn('Real-time sync notice: Using cached portfolio projects');
    }
  }, []);

  useEffect(() => {
    refreshProjectsFromBackend();
  }, [refreshProjectsFromBackend]);

  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState<'list' | 'form' | 'inquiries'>('list');
  const [activeSection, setActiveSection] = useState('about');

  const handleOpenCms = (tab: 'list' | 'form' | 'inquiries' = 'list') => {
    setCmsTab(tab);
    setIsCmsOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'process', 'testimonials', 'location', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const handleResetData = () => {
    if (confirm('Reset all CMS portfolio data back to initial showcase projects?')) {
      setProjects(INITIAL_PROJECTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#FFFFFF] font-sans-clean selection:bg-[#D91E2A] selection:text-white relative overflow-x-hidden">
      {/* Top Luxury Animated Scroll Progress Bar */}
      <ScrollProgress />

      {/* Hover-Only Cursor Follow Line */}
      <CursorGlow />

      {/* Click-Only Glass Crack Animation Controller for Designated Glass Elements */}
      <GlassCrackEffect />

      {/* Fixed Luxury Navigation */}
      <Navbar
        onOpenCms={handleOpenCms}
        activeSection={activeSection}
      />

      {/* Main Page Layout Sections */}
      <main>
        {/* 01 Hero Section */}
        <HeroSection onOpenCms={() => handleOpenCms('list')} />

        {/* 02 About Section */}
        <AboutSection />

        {/* 03 Experience Section */}
        <ExperienceSection />

        {/* 04 Core Skills & Capabilities */}
        <SkillsSection />

        {/* 04 Featured Projects Showcase */}
        <ProjectsSection
          projects={projects}
          onSelectProject={(project) => setSelectedCaseStudy(project)}
          onOpenCms={() => handleOpenCms('list')}
        />

        {/* 05 Design Process Workflow */}
        <DesignProcessSection />

        {/* 06 Testimonials */}
        <TestimonialsSection />

        {/* 07 Studio Map & Global Reach */}
        <MapSection />

        {/* 08 Contact Section */}
        <ContactSection onOpenInbox={() => handleOpenCms('inquiries')} />
      </main>

      {/* Footer */}
      <Footer onOpenInbox={() => handleOpenCms('inquiries')} />

      {/* Full Interactive Case Study Drawer Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* CMS Project Upload & Management Modal */}
      {isCmsOpen && (
        <CmsAdminModal
          projects={projects}
          onClose={() => setIsCmsOpen(false)}
          onSaveProjects={handleSaveProjects}
          onResetData={handleResetData}
          initialTab={cmsTab}
        />
      )}
    </div>
  );
}

export interface Project {
  id: string;
  title: string;
  category: 'Website Design' | 'Dashboard Design' | 'UX Case Study' | 'Mobile App' | 'Corporate Website' | 'Branding';
  year: string;
  clientName?: string;
  coverImage: string;
  galleryImages: string[];
  shortDescription: string;
  problemStatement: string;
  research: string;
  designProcess: {
    phase: string;
    description: string;
  }[];
  wireframeImages: string[];
  uiScreens: string[];
  prototypeLink?: string;
  liveLink?: string;
  toolsUsed: string[];
  tags: string[];
  typography?: {
    headingFont: string;
    bodyFont: string;
    sampleText: string;
  };
  colorPalette?: {
    name: string;
    hex: string;
  }[];
  featured?: boolean;
}

export interface Skill {
  name: string;
  percentage: number;
  category?: 'Core' | 'Tools' | 'Specialization';
  icon?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
}

import path from 'path';
import fs from 'fs';
import { Project, Skill, ExperienceItem, Testimonial } from '../../src/types';
import {
  SERVER_SEED_PROJECTS,
  SERVER_SEED_SKILLS,
  SERVER_SEED_EXPERIENCE,
  SERVER_SEED_TESTIMONIALS,
} from './seedData';

export interface AboutInfo {
  name: string;
  title: string;
  tagline: string;
  location: string;
  experienceYears: number;
  bio: string;
  resumeUrl: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  fiverrUrl?: string;
  freelancerUrl?: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export interface AdminUserConfig {
  username: string;
  passwordHash: string; // bcrypt hash
  updatedAt: string;
}

export interface PortfolioDatabase {
  projects: Project[];
  skills: Skill[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  about: AboutInfo;
  inquiries: InquiryMessage[];
  admin: AdminUserConfig;
}

const DB_FILE = path.join(process.cwd(), 'database.json');

// Default initial data structure
const DEFAULT_ABOUT: AboutInfo = {
  name: 'Saad Ahmed',
  title: 'UI/UX & Digital Product Designer',
  tagline: 'Crafting Digital Products With Simplicity, Precision & Purpose.',
  location: 'Karachi, North Karachi, Sector 5A2, Pakistan',
  experienceYears: 3,
  bio: 'Passionate UI/UX Designer with practical experience in creating clean, modern, and user-friendly designs for websites. Skilled in Figma and Adobe Photoshop, with the ability to understand client requirements and turn ideas into attractive and easy-to-use interfaces. Always eager to learn new design trends and improve creative skills to deliver better user experiences.',
  resumeUrl: '/uploads/Saad_Ahmed_UIUX_Resume.pdf',
  email: 'saadahmed2577@gmail.com',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  fiverrUrl: 'https://fiverr.com',
  freelancerUrl: 'https://freelancer.com',
};

// Default password hash for "UI/UXSAQ" with bcrypt salt 10
// $2a$10$w8.48j.c8P8t0M4w6h4Wce0hJ.. (we can also compute dynamically or generate at startup)
export const db = {
  load(): PortfolioDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          projects: Array.isArray(parsed.projects) ? parsed.projects : SERVER_SEED_PROJECTS,
          skills: Array.isArray(parsed.skills) ? parsed.skills : SERVER_SEED_SKILLS,
          experience: Array.isArray(parsed.experience) ? parsed.experience : SERVER_SEED_EXPERIENCE,
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : SERVER_SEED_TESTIMONIALS,
          about: parsed.about ? { ...DEFAULT_ABOUT, ...parsed.about } : DEFAULT_ABOUT,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
          admin: parsed.admin || {
            username: 'saad_admin',
            // Default hash placeholder; initialized on startup in db.init()
            passwordHash: '',
            updatedAt: new Date().toISOString(),
          },
        };
      }
    } catch (err) {
      console.error('Failed to read database.json, initializing fresh defaults:', err);
    }

    const initialDb: PortfolioDatabase = {
      projects: SERVER_SEED_PROJECTS,
      skills: SERVER_SEED_SKILLS,
      experience: SERVER_SEED_EXPERIENCE,
      testimonials: SERVER_SEED_TESTIMONIALS,
      about: DEFAULT_ABOUT,
      inquiries: [],
      admin: {
        username: 'saad_admin',
        passwordHash: '',
        updatedAt: new Date().toISOString(),
      },
    };
    this.save(initialDb);
    return initialDb;
  },

  save(data: PortfolioDatabase): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to database.json:', err);
    }
  },
};

import { Project, Skill, ExperienceItem, Testimonial } from '../types';

const TOKEN_KEY = 'saad_cms_jwt_token_v1';

export const portfolioApi = {
  // Auth Token Management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth Endpoints
  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        this.setToken(data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login.' };
    }
  },

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async forgotPassword(): Promise<{ success: boolean; message?: string; email?: string; phone?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      return {
        success: res.ok,
        message: data.message,
        email: data.email,
        phone: data.phone,
        error: data.error,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to request OTP.' };
    }
  },

  async verifyOtp(otp: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to verify OTP.' };
    }
  },

  async resetPassword(otp: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reset password.' };
    }
  },

  // Projects Endpoints
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch (err) {
      console.warn('Backend /api/projects fetch failed, fallback to local storage:', err);
    }
    return [];
  },

  async createProject(project: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(project),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error || 'Failed to create project.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error || 'Failed to update project.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to delete project.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // File Upload (Images & PDF Resumes)
  async uploadFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = this.getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.data?.url) {
        return { success: true, url: data.data.url };
      }
      return { success: false, error: data.error || 'Upload failed.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Inquiries / Messages
  async getMessages(): Promise<any[]> {
    try {
      const res = await fetch('/api/contact/messages', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.data) ? data.data : [];
      }
    } catch (err) {
      console.error('Failed to get inquiries:', err);
    }
    return [];
  },

  async deleteMessage(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/contact/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.data) ? data.data : [];
      }
    } catch {}
    return [];
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.data) ? data.data : [];
      }
    } catch {}
    return [];
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

import type {
  AuthToken,
  AuthUser,
  LoginPayload,
  AdminProfile,
  AdminProfilePayload,
  AdminExperience,
  AdminExperiencePayload,
  AdminProject,
  AdminProjectPayload,
  AdminSkill,
  AdminSkillPayload,
  AdminCertification,
  AdminCertificationPayload,
  AdminEducation,
  AdminEducationPayload,
  AdminIam,
  AdminIamPayload
} from '../types';

import { supabase } from '../lib/supabase';

// ── Base Config ───────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

// ── HTTP Client ───────────────────────────────────────────────────────────
// Función envoltorio para fetch que inyecta el token de Supabase
export async function _request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorBody.detail ?? `HTTP ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────
// PROFILE SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const profileService = {
  async getProfile(): Promise<AdminProfile> {
    return _request<AdminProfile>('/profile');
  },

  async updateProfile(id: string, payload: AdminProfilePayload): Promise<AdminProfile> {
    return _request<AdminProfile>(`/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async get(): Promise<AdminProfile> {
    return this.getProfile();
  },

  async update(id: string, payload: AdminProfilePayload): Promise<AdminProfile> {
    return this.updateProfile(id, payload);
  },
};

// ─────────────────────────────────────────────────────────────────────────
// IAM SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const iamService = {
  async list(): Promise<AdminIam[]> {
    return _request<AdminIam[]>('/iam');
  },

  async create(payload: AdminIamPayload): Promise<AdminIam> {
    return _request<AdminIam>('/iam', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminIamPayload): Promise<AdminIam> {
    return _request<AdminIam>(`/iam/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/iam/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const experienceService = {
  async list(): Promise<AdminExperience[]> {
    return _request<AdminExperience[]>('/experience');
  },

  async create(payload: AdminExperiencePayload): Promise<AdminExperience> {
    return _request<AdminExperience>('/experience', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminExperiencePayload): Promise<AdminExperience> {
    return _request<AdminExperience>(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/experience/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// SKILLS SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const skillsService = {
  async list(): Promise<AdminSkill[]> {
    return _request<AdminSkill[]>('/skills');
  },

  async create(payload: AdminSkillPayload): Promise<AdminSkill> {
    return _request<AdminSkill>('/skills', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminSkillPayload): Promise<AdminSkill> {
    return _request<AdminSkill>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/skills/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// PROJECTS SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const projectsService = {
  async list(): Promise<AdminProject[]> {
    return _request<AdminProject[]>('/projects');
  },

  async create(payload: AdminProjectPayload): Promise<AdminProject> {
    return _request<AdminProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminProjectPayload): Promise<AdminProject> {
    return _request<AdminProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/projects/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const certificationsService = {
  async list(): Promise<AdminCertification[]> {
    return _request<AdminCertification[]>('/certifications');
  },

  async create(payload: AdminCertificationPayload): Promise<AdminCertification> {
    return _request<AdminCertification>('/certifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminCertificationPayload): Promise<AdminCertification> {
    return _request<AdminCertification>(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/certifications/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// EDUCATION / TRAINING SERVICE
// ─────────────────────────────────────────────────────────────────────────
export const educationService = {
  async list(): Promise<AdminEducation[]> {
    return _request<AdminEducation[]>('/training');
  },

  async create(payload: AdminEducationPayload): Promise<AdminEducation> {
    return _request<AdminEducation>('/training', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: AdminEducationPayload): Promise<AdminEducation> {
    return _request<AdminEducation>(`/training/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string): Promise<void> {
    return _request<void>(`/training/${id}`, { method: 'DELETE' });
  },
};

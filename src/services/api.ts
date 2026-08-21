import type {
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
  AdminIamPayload,
} from '../types';

import { supabase } from '../lib/supabase';

// ── Base URL ──────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

// ── HTTP Wrapper ──────────────────────────────────────────────────────────
export async function _request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ───────────────────────────────────────────────────────────────────────────
const API_BASE_PUBLIC = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

/**
 * Obtiene el perfil públicamente (sin token) — para Hero y Contact.
 * El router devuelve list[ProfileResponse]; tomamos el primer elemento.
 */
export async function getPublicProfile(): Promise<AdminProfile> {
  const res = await fetch(`${API_BASE_PUBLIC}/profile/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const list: AdminProfile[] = await res.json();
  if (!list || list.length === 0) throw new Error('Perfil no encontrado');
  return list[0];
}

// ───────────────────────────────────────────────────────────────────────────
// PROFILE SERVICE (autenticado — para el panel de admin)
// ───────────────────────────────────────────────────────────────────────────
export const profileService = {
  /** GET autenticado: devuelve el primer (y único) perfil de la tabla. */
  async get(): Promise<AdminProfile> {
    const list = await _request<AdminProfile[]>('/profile/');
    if (!list || list.length === 0) throw new Error('Perfil no encontrado');
    return list[0];
  },
  async update(id: string, payload: AdminProfilePayload): Promise<AdminProfile> {
    return _request<AdminProfile>(`/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// IAM SERVICE  (/api/iam)
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
  async update(iam_id: string, payload: AdminIamPayload): Promise<AdminIam> {
    return _request<AdminIam>(`/iam/${iam_id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async remove(iam_id: string): Promise<void> {
    return _request<void>(`/iam/${iam_id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE SERVICE  (/api/experience)
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
// SKILLS SERVICE  (/api/skills)
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
// PROJECTS SERVICE  (/api/projects)
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
// CERTIFICATIONS SERVICE  (/api/certifications)
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
// EDUCATION / TRAINING SERVICE  (/api/training)
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

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
} from '../types';

// ── Base Config ───────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'admin_access_token';

// ── HTTP Client ───────────────────────────────────────────────────────────
// NOTE: _request is the future FastAPI client — currently mocked below.
export async function _request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

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

// ── Simulated delay for mock mode ─────────────────────────────────────────
const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────────
// AUTH SERVICE
// POST /auth/login  →  returns JWT token
// POST /auth/logout →  invalidates token server-side
// ─────────────────────────────────────────────────────────────────────────
export const authService = {
  /** Login with username + password. Returns JWT token and user info. */
  async login(payload: LoginPayload): Promise<{ token: AuthToken; user: AuthUser }> {
    // ── MOCK (remove when FastAPI is ready) ───────────────────────────
    await delay(800);
    if (payload.username === 'admin' && payload.password === 'admin123') {
      return {
        token: {
          access_token: 'mock_jwt_token_' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
        },
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@portfolio.dev',
          role: 'admin',
        },
      };
    }
    throw new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    // ── REAL (uncomment when FastAPI is ready) ────────────────────────
    // return request<{ token: AuthToken; user: AuthUser }>('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
  },

  /** Logout — invalidates the server-side session. */
  async logout(): Promise<void> {
    // ── MOCK ──────────────────────────────────────────────────────────
    await delay(200);
    // ── REAL ──────────────────────────────────────────────────────────
    // return request<void>('/auth/logout', { method: 'POST' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// PROFILE SERVICE
// GET    /profile      → get admin profile (single record)
// PUT    /profile/{id} → update profile
// ─────────────────────────────────────────────────────────────────────────
export const profileService = {
  async get(): Promise<AdminProfile> {
    // ── MOCK ──────────────────────────────────────────────────────────
    await delay();
    return {
      id: '1',
      first_name: 'Alexander',
      last_name: 'Lee',
      email: 'melgarejorom@gmail.com',
      description: 'Data Engineer & Full-Stack Developer apasionado por construir soluciones escalables.',
      occupation: 'Data Engineer Intern',
      cv_url: '#',
      linkedin_url: 'https://www.linkedin.com/in/alexander-lee',
      github_url: 'https://github.com/alexlee-dev',
      is_open_to_work: true,
      avatar_url: '',
    };
    // ── REAL ──────────────────────────────────────────────────────────
    // return request<AdminProfile>('/profile');
  },

  async update(id: string, payload: AdminProfilePayload): Promise<AdminProfile> {
    await delay();
    return { id, ...payload };
    // return request<AdminProfile>(`/profile/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(payload),
    // });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// EXPERIENCE SERVICE
// GET    /experience        → list all
// POST   /experience        → create
// PUT    /experience/{id}   → update
// DELETE /experience/{id}   → delete
// ─────────────────────────────────────────────────────────────────────────
export const experienceService = {
  async list(): Promise<AdminExperience[]> {
    await delay();
    return [
      {
        id: '1',
        role: 'Data Engineer Intern',
        company: 'OPCOMP E.I.R.L.',
        location: 'Lima, PE',
        start_date: '2026-02',
        end_date: '2026-06',
        is_current: false,
        responsibilities: [
          { id: 'r1', experience_id: '1', description: 'Modelado de bases de datos relacionales (SQL) siguiendo estándares de normalización hasta 3FN.', order: 1 },
          { id: 'r2', experience_id: '1', description: 'Diseño y ejecución de consultas SQL complejas para procesos ETL internos.', order: 2 },
          { id: 'r3', experience_id: '1', description: 'Diseño de landing pages optimizadas usando el modelo AIDA con asistencia de IA generativa.', order: 3 },
        ],
      },
    ];
    // return request<AdminExperience[]>('/experience');
  },

  async create(payload: AdminExperiencePayload): Promise<AdminExperience> {
    await delay();
    return { id: crypto.randomUUID(), ...payload, responsibilities: payload.responsibilities.map((r) => ({ ...r, id: crypto.randomUUID(), experience_id: 'new' })) };
    // return request<AdminExperience>('/experience', { method: 'POST', body: JSON.stringify(payload) });
  },

  async update(id: string, payload: AdminExperiencePayload): Promise<AdminExperience> {
    await delay();
    return { id, ...payload, responsibilities: payload.responsibilities.map((r) => ({ ...r, id: crypto.randomUUID(), experience_id: id })) };
    // return request<AdminExperience>(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  async remove(_id: string): Promise<void> {
    await delay(300);
    // return request<void>(`/experience/${_id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// SKILLS SERVICE
// GET    /skills        → list all
// POST   /skills        → create
// PUT    /skills/{id}   → update
// DELETE /skills/{id}   → delete
// ─────────────────────────────────────────────────────────────────────────
export const skillsService = {
  async list(): Promise<AdminSkill[]> {
    await delay();
    return [
      { id: 's1', name: 'Python', category: 'language' },
      { id: 's2', name: 'TypeScript', category: 'language' },
      { id: 's3', name: 'React', category: 'framework' },
      { id: 's4', name: 'FastAPI', category: 'framework' },
      { id: 's5', name: 'PostgreSQL', category: 'database' },
      { id: 's6', name: 'Supabase', category: 'database' },
      { id: 's7', name: 'Docker', category: 'cloud_devops' },
      { id: 's8', name: 'PySpark', category: 'framework' },
      { id: 's9', name: 'Power BI', category: 'visualization' },
      { id: 's10', name: 'Trabajo en equipo', category: 'soft_skill' },
    ];
    // return request<AdminSkill[]>('/skills');
  },

  async create(payload: AdminSkillPayload): Promise<AdminSkill> {
    await delay();
    return { id: crypto.randomUUID(), ...payload };
    // return request<AdminSkill>('/skills', { method: 'POST', body: JSON.stringify(payload) });
  },

  async update(id: string, payload: AdminSkillPayload): Promise<AdminSkill> {
    await delay();
    return { id, ...payload };
    // return request<AdminSkill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  async remove(_id: string): Promise<void> {
    await delay(300);
    // return request<void>(`/skills/${_id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// PROJECTS SERVICE
// GET    /projects        → list all
// POST   /projects        → create
// PUT    /projects/{id}   → update
// DELETE /projects/{id}   → delete
// ─────────────────────────────────────────────────────────────────────────
export const projectsService = {
  async list(): Promise<AdminProject[]> {
    await delay();
    return [
      {
        id: 'p1',
        title: 'MarketPulse ETL',
        subtitle: 'Pipeline Data Lakehouse Financiero',
        description: 'Pipeline de datos end-to-end sobre arquitectura Medallón.',
        long_description: 'Arquitectura Medallón completa: extracción de APIs REST financieras...',
        start_date: '2026-02',
        end_date: '2026-05',
        is_current: false,
        is_featured: true,
        accent_color: '#c9a96e',
        icon: '🏗️',
        github_url: '#',
        video_url: '#',
        skill_ids: ['s1', 's8', 's9'],
      },
      {
        id: 'p2',
        title: 'ERSOFT ERP',
        subtitle: 'Sistema SaaS ERP Empresarial',
        description: 'Sistema ERP SaaS de alto rendimiento con FastAPI y React.',
        long_description: 'Backend RESTful construido con Python y FastAPI...',
        start_date: '2025-10',
        end_date: null,
        is_current: true,
        is_featured: true,
        accent_color: '#8b5cf6',
        icon: '⚙️',
        github_url: '#',
        skill_ids: ['s1', 's3', 's4', 's5', 's6'],
      },
    ];
    // return request<AdminProject[]>('/projects');
  },

  async create(payload: AdminProjectPayload): Promise<AdminProject> {
    await delay();
    return { id: crypto.randomUUID(), ...payload };
    // return request<AdminProject>('/projects', { method: 'POST', body: JSON.stringify(payload) });
  },

  async update(id: string, payload: AdminProjectPayload): Promise<AdminProject> {
    await delay();
    return { id, ...payload };
    // return request<AdminProject>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  async remove(_id: string): Promise<void> {
    await delay(300);
    // return request<void>(`/projects/${_id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS SERVICE
// GET    /certifications        → list all
// POST   /certifications        → create
// PUT    /certifications/{id}   → update
// DELETE /certifications/{id}   → delete
// ─────────────────────────────────────────────────────────────────────────
export const certificationsService = {
  async list(): Promise<AdminCertification[]> {
    await delay();
    return [
      { id: 'c1', name: 'Advanced Level American English', issuer: 'SENATI Language Center', issued_date: '2022-06', icon: '🌐' },
      { id: 'c2', name: 'Python Essentials 1 & 2', issuer: 'Cisco Networking Academy', issued_date: '2022-09', icon: '🐍' },
      { id: 'c3', name: 'Agile PM: SCRUM & Kanban', issuer: 'LinkedIn Learning', issued_date: '2022-11', icon: '⚡' },
    ];
    // return request<AdminCertification[]>('/certifications');
  },

  async create(payload: AdminCertificationPayload): Promise<AdminCertification> {
    await delay();
    return { id: crypto.randomUUID(), ...payload };
    // return request<AdminCertification>('/certifications', { method: 'POST', body: JSON.stringify(payload) });
  },

  async update(id: string, payload: AdminCertificationPayload): Promise<AdminCertification> {
    await delay();
    return { id, ...payload };
    // return request<AdminCertification>(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  async remove(_id: string): Promise<void> {
    await delay(300);
    // return request<void>(`/certifications/${_id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────
// EDUCATION SERVICE
// GET    /education        → list all
// POST   /education        → create
// PUT    /education/{id}   → update
// DELETE /education/{id}   → delete
// ─────────────────────────────────────────────────────────────────────────
export const educationService = {
  async list(): Promise<AdminEducation[]> {
    await delay();
    return [
      {
        id: 'e1',
        institution: 'SENATI',
        degree: 'Ingeniería de Software con Inteligencia Artificial',
        field_of_study: 'Software Engineering & AI',
        start_date: '2024-03',
        end_date: null,
        status: 'in_progress',
        institution_url: 'https://www.senati.edu.pe',
      },
    ];
    // return request<AdminEducation[]>('/education');
  },

  async create(payload: AdminEducationPayload): Promise<AdminEducation> {
    await delay();
    return { id: crypto.randomUUID(), ...payload };
    // return request<AdminEducation>('/education', { method: 'POST', body: JSON.stringify(payload) });
  },

  async update(id: string, payload: AdminEducationPayload): Promise<AdminEducation> {
    await delay();
    return { id, ...payload };
    // return request<AdminEducation>(`/education/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  async remove(_id: string): Promise<void> {
    await delay(300);
    // return request<void>(`/education/${_id}`, { method: 'DELETE' });
  },
};

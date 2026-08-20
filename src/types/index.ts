// ── Project & Skill Types ─────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  date: string;              // ISO date for sorting: "2026-05"
  dateLabel: string;         // Human label end date: "Mayo 2026"
  startDateLabel: string;    // Human label start: "Octubre 2025"
  endDateLabel: string;      // Human label end: "Mayo 2026" | "Presente"
  description: string;
  longDescription: string;
  stack: string[];
  githubUrl: string;
  videoUrl: string;
  accentColor: string;       // CSS color for card top border
  icon: string;              // emoji fallback for logo
  logoUrl?: string;          // optional project logo image URL
}

export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  responsibilities: string[];
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  dateLabel: string;
  icon: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  status: string;
}

// ── Timeline Types ────────────────────────────────────────────────────────
export type TimelineCategory = 'project' | 'education' | 'work' | 'certification';

export interface TimelineEvent {
  id: string;
  date: string;          // ISO date for sorting
  dateLabel: string;     // Human readable
  title: string;
  subtitle: string;
  description: string;
  category: TimelineCategory;
  icon: string;
}

// ── Contact Types ─────────────────────────────────────────────────────────
export type ContactIconId = 'mail' | 'linkedin' | 'github';

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: ContactIconId;
}

// ── Navigation ────────────────────────────────────────────────────────────
export type View = 'home' | 'projects' | 'timeline' | 'contact';

export interface NavItem {
  view: View;
  label: string;     // c:\home>
  shortLabel: string; // Home
}

// ═══════════════════════════════════════════════════════════════════════════
// ── ADMIN PANEL TYPES ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ── Generic API Response Wrappers ─────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

// ── Admin: Profile ────────────────────────────────────────────────────────
export interface AdminProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  cv_url: string;
  linkedin_url: string;
  github_url: string;
  is_open_to_work: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type AdminProfilePayload = Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>;

// ── Admin: Experience ─────────────────────────────────────────────────────
export interface AdminResponsibility {
  id: string;
  experience_id: string;
  description: string;
  order: number;
}

export interface AdminExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;  // ISO: "2026-02"
  end_date: string | null;  // null = current job
  is_current: boolean;
  responsibilities: AdminResponsibility[];
  created_at?: string;
  updated_at?: string;
}

export type AdminExperiencePayload = Omit<AdminExperience, 'id' | 'created_at' | 'updated_at' | 'responsibilities'> & {
  responsibilities: Omit<AdminResponsibility, 'id' | 'experience_id'>[];
};

// ── Admin: Skills ─────────────────────────────────────────────────────────
export type SkillCategory =
  | 'hard_skill'
  | 'soft_skill'
  | 'language'
  | 'framework'
  | 'database'
  | 'cloud_devops'
  | 'visualization'
  | 'other';

export interface AdminSkill {
  id: string;
  name: string;
  category: SkillCategory;
  icon_url?: string;
  created_at?: string;
}

export type AdminSkillPayload = Omit<AdminSkill, 'id' | 'created_at'>;

// ── Admin: Projects ───────────────────────────────────────────────────────
export interface AdminProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  long_description: string;
  start_date: string;   // ISO: "2025-10"
  end_date: string | null;   // null = present
  is_current: boolean;
  is_featured: boolean;
  accent_color: string;
  icon: string;
  image_url?: string;
  logo_url?: string;
  github_url?: string;
  video_url?: string;
  drive_url?: string;
  web_url?: string;
  skill_ids: string[];   // IDs of associated skills (projects_skills)
  created_at?: string;
  updated_at?: string;
}

export type AdminProjectPayload = Omit<AdminProject, 'id' | 'created_at' | 'updated_at'>;

// ── Admin: Certifications ─────────────────────────────────────────────────
export interface AdminCertification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;  // ISO: "2022-06"
  expiry_date?: string | null;
  credential_url?: string;
  icon?: string;
  created_at?: string;
}

export type AdminCertificationPayload = Omit<AdminCertification, 'id' | 'created_at'>;

// ── Admin: Education ──────────────────────────────────────────────────────
export type EducationStatus = 'in_progress' | 'completed' | 'dropped';

export interface AdminEducation {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;  // ISO: "2024-03"
  end_date: string | null;  // null = in progress
  status: EducationStatus;
  institution_url?: string;
  certificate_url?: string;
  created_at?: string;
}

export type AdminEducationPayload = Omit<AdminEducation, 'id' | 'created_at'>;

// ── Admin: IAM ────────────────────────────────────────────────────────────
export interface AdminIAM {
  id: string;
  user_id: string;
  role: 'admin' | 'viewer';
  last_login?: string;
  created_at?: string;
}

export interface AdminIam {
  iam_id: string;
  occupation_name: string;
  profile_id: string;
}

export type AdminIamPayload = Omit<AdminIam, 'iam_id' | 'profile_id'>;

// ── Admin Navigation ──────────────────────────────────────────────────────
export type AdminSection =
  | 'profile'
  | 'iam'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'education';

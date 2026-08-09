// ── Project & Skill Types ─────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  date: string;        // ISO date for sorting: "2026-05"
  dateLabel: string;   // Human label: "Mayo 2026"
  description: string;
  longDescription: string;
  stack: string[];
  githubUrl: string;
  videoUrl: string;
  accentColor: string; // CSS color for card top border
  icon: string;        // emoji
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

// ── Navigation ────────────────────────────────────────────────────────────
export type View = 'home' | 'projects' | 'timeline' | 'contact';

export interface NavItem {
  view: View;
  label: string;     // c:\home>
  shortLabel: string; // Home
}

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

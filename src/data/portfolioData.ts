import type {
  Project,
  Experience,
  SkillGroup,
  Certification,
  Education,
  TimelineEvent,
  NavItem,
} from '../types';

// ── Navigation ────────────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { view: 'home',     label: 'c:\\home>',       shortLabel: 'Home'     },
  { view: 'projects', label: 'c:\\projects>',   shortLabel: 'Projects' },
  { view: 'timeline', label: 'c:\\timeline>',   shortLabel: 'Timeline' },
  { view: 'contact',  label: 'c:\\contact_me>', shortLabel: 'Contact'  },
];

// ── Experience ────────────────────────────────────────────────────────────
export const EXPERIENCES: Experience[] = [
  {
    company: 'OPCOMP E.I.R.L.',
    location: 'Lima, PE',
    role: 'Data Engineer Intern',
    period: 'Feb 2026 – Jun 2026',
    startDate: '2026-02',
    endDate: '2026-06',
    responsibilities: [
      'Modelado de bases de datos relacionales (SQL) siguiendo estándares de normalización hasta 3FN.',
      'Diseño y ejecución de consultas SQL complejas para procesos ETL internos.',
      'Diseño de landing pages optimizadas usando el modelo AIDA con asistencia de IA generativa.',
      'Colaboración en equipos ágiles para la entrega de soluciones de datos de alto impacto.',
    ],
  },
];

// ── Skills ────────────────────────────────────────────────────────────────
export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages & Data',
    skills: ['Python', 'Java', 'SQL', 'TypeScript', 'JavaScript'],
  },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'MySQL', 'BigQuery', 'Supabase'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['FastAPI', 'React', 'Vite', 'PySpark', 'Pandas', 'NumPy', 'Node.js'],
  },
  {
    label: 'Cloud & DevOps',
    skills: ['Google Cloud (GCS)', 'BigQuery', 'Docker', 'Apache Airflow', 'Git / GitHub'],
  },
  {
    label: 'Visualization',
    skills: ['Power BI'],
  },
  {
    label: 'Soft Skills',
    skills: [
      'Aprendizaje autónomo',
      'Resolución de problemas complejos',
      'Código limpio (POO)',
      'Trabajo en equipo',
      'Comunicación efectiva',
    ],
  },
];

// ── Projects ──────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: 'marketpulse-etl',
    title: 'MarketPulse ETL',
    subtitle: 'Pipeline Data Lakehouse Financiero',
    date: '2026-05',
    dateLabel: 'Mayo 2026',
    description:
      'Pipeline de datos end-to-end sobre arquitectura Medallón para ingesta, procesamiento y visualización de datos financieros de mercado.',
    longDescription:
      'Arquitectura Medallón completa: extracción de APIs REST financieras con Python/Pandas hacia Google Cloud Storage (capa Bronze). Procesamiento distribuido con PySpark para limpieza y transformación (capa Silver). Data Warehouse analítico en BigQuery (capa Gold). Orquestación con Apache Airflow en Docker, visualización de KPIs en Power BI.',
    stack: ['Python', 'Pandas', 'PySpark', 'GCS', 'BigQuery', 'Docker', 'Apache Airflow', 'Power BI'],
    githubUrl: '#',
    videoUrl: '#',
    accentColor: '#c9a96e',
    icon: '🏗️',
  },
  {
    id: 'ersoft-erp',
    title: 'ERSOFT ERP',
    subtitle: 'Sistema SaaS ERP Empresarial',
    date: '2025-10',
    dateLabel: 'Octubre 2025',
    description:
      'Sistema ERP SaaS de alto rendimiento con backend en FastAPI, base de datos relacional en Supabase/PostgreSQL y frontend modular en React + Vite.',
    longDescription:
      'Backend RESTful de alto rendimiento construido con Python y FastAPI, siguiendo principios de Clean Architecture. Base de datos relacional modelada y optimizada en Supabase (PostgreSQL). Frontend construido con React + Vite enfocado en el "Panel Principal" con componentes reutilizables, autenticación JWT y manejo de estados complejos.',
    stack: ['Python', 'FastAPI', 'Supabase', 'PostgreSQL', 'React', 'Vite', 'TypeScript'],
    githubUrl: '#',
    videoUrl: '#',
    accentColor: '#8b5cf6',
    icon: '⚙️',
  },
];

// ── Certifications ────────────────────────────────────────────────────────
export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Advanced Level American English',
    issuer: 'SENATI Language Center',
    date: '2022-06',
    dateLabel: 'Junio 2022',
    icon: '🌐',
  },
  {
    name: 'Python Essentials 1 & 2',
    issuer: 'Cisco Networking Academy',
    date: '2022-09',
    dateLabel: 'Septiembre 2022',
    icon: '🐍',
  },
  {
    name: 'Agile PM: SCRUM & Kanban',
    issuer: 'LinkedIn Learning',
    date: '2022-11',
    dateLabel: 'Noviembre 2022',
    icon: '⚡',
  },
];

// ── Education ─────────────────────────────────────────────────────────────
export const EDUCATION: Education[] = [
  {
    institution: 'SENATI',
    degree: 'Ingeniería de Software con Inteligencia Artificial',
    period: '2024 – Presente',
    status: 'En curso',
  },
];

// ── Timeline ──────────────────────────────────────────────────────────────
export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'senati-start',
    date: '2024-03',
    dateLabel: 'Marzo 2024',
    title: 'Inicio en SENATI',
    subtitle: 'Ingeniería de Software con IA',
    description:
      'Comienzo del programa de Ingeniería de Software con énfasis en Inteligencia Artificial. Fundamentos de programación, POO, algoritmos y bases de datos.',
    category: 'education',
    icon: '🎓',
  },
  {
    id: 'ersoft-start',
    date: '2025-10',
    dateLabel: 'Octubre 2025',
    title: 'ERSOFT ERP',
    subtitle: 'Sistema SaaS — Proyecto Personal',
    description:
      'Inicio del desarrollo del sistema ERP SaaS con FastAPI, Supabase y React. Primer proyecto full-stack de escala empresarial.',
    category: 'project',
    icon: '⚙️',
  },
  {
    id: 'opcomp-start',
    date: '2026-02',
    dateLabel: 'Febrero 2026',
    title: 'Data Engineer Intern',
    subtitle: 'OPCOMP E.I.R.L. — Lima, PE',
    description:
      'Primera experiencia laboral formal en ingeniería de datos. Modelado de BD relacionales, consultas ETL y diseño de landing pages con IA.',
    category: 'work',
    icon: '🏢',
  },
  {
    id: 'marketpulse-complete',
    date: '2026-05',
    dateLabel: 'Mayo 2026',
    title: 'MarketPulse ETL',
    subtitle: 'Pipeline Data Lakehouse Financiero',
    description:
      'Finalización del pipeline de datos completo con arquitectura Medallón: GCS → PySpark → BigQuery, orquestado con Airflow en Docker.',
    category: 'project',
    icon: '🏗️',
  },
  {
    id: 'opcomp-end',
    date: '2026-06',
    dateLabel: 'Junio 2026',
    title: 'Fin de Internship — OPCOMP',
    subtitle: 'Completado con éxito',
    description:
      'Cierre exitoso de la práctica profesional en OPCOMP E.I.R.L. con entrega de modelos de datos y documentación técnica completa.',
    category: 'work',
    icon: '✅',
  },
  {
    id: 'cisco-python',
    date: '2022-09',
    dateLabel: 'Septiembre 2022',
    title: 'Python Essentials — Cisco',
    subtitle: 'Certificación Técnica',
    description:
      'Certificación oficial de Cisco Networking Academy en Python Essentials 1 & 2. Fundamentos de programación y lógica.',
    category: 'certification',
    icon: '🐍',
  },
  {
    id: 'english-cert',
    date: '2022-06',
    dateLabel: 'Junio 2022',
    title: 'Advanced American English',
    subtitle: 'Nivel Avanzado — SENATI',
    description:
      'Certificación de nivel avanzado en inglés americano. Comunicación técnica y profesional en entornos internacionales.',
    category: 'certification',
    icon: '🌐',
  },
  {
    id: 'scrum-cert',
    date: '2022-11',
    dateLabel: 'Noviembre 2022',
    title: 'SCRUM & Kanban',
    subtitle: 'Agile Project Management',
    description:
      'Certificación en metodologías ágiles de gestión de proyectos: SCRUM y Kanban. Aplicación en proyectos de software.',
    category: 'certification',
    icon: '⚡',
  },
];

// ── Contact Info ──────────────────────────────────────────────────────────
export const CONTACT_EMAIL = 'melgarejorom@gmail.com';
export const CONTACT_SUBJECT = 'Estoy en busca de contactarte';

export const CONTACT_LINKS = [
  {
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
    icon: '✉️',
  },
  {
    label: 'LinkedIn',
    value: 'Alexander Lee',
    href: 'https://www.linkedin.com/in/alexander-lee',
    icon: '💼',
  },
  {
    label: 'GitHub',
    value: '@alexlee-dev',
    href: 'https://github.com/alexlee-dev',
    icon: '🐙',
  },
];

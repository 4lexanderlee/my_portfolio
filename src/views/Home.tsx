import React, { useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import SectionTitle from '../components/ui/SectionTitle';
import TechBadge from '../components/ui/TechBadge';
import {
  EXPERIENCES,
  PROJECTS,
  CERTIFICATIONS,
  EDUCATION,
} from '../data/portfolioData';
import { skillsService, certificationsService } from '../services/api';
import type { AdminSkill, SkillGroup, AdminCertification } from '../types';
import { Award, GraduationCap, ChevronLeft, ChevronRight, ArrowRight, Building2, MapPin, CalendarDays } from 'lucide-react';
import type { View } from '../types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const skillScrollRef = useRef<HTMLDivElement>(null);
  const [skillGroups, setSkillGroups] = React.useState<SkillGroup[]>([]);
  const [certifications, setCertifications] = React.useState<AdminCertification[]>([]);

  React.useEffect(() => {
    skillsService.list().then((data: AdminSkill[]) => {
      const CATEGORY_LABELS: Record<string, string> = {
        language: 'Lenguaje de Programación',
        framework: 'Framework / Librería',
        database: 'Base de Datos',
        cloud_devops: 'Cloud & DevOps',
        visualization: 'Visualización',
        soft_skill: 'Soft Skills',
        hard_skill: 'Hard Skills',
        other: 'Otro'
      };

      const grouped = data.reduce((acc, skill) => {
        const label = CATEGORY_LABELS[skill.category] || skill.category;
        if (!acc[label]) {
          acc[label] = [];
        }
        acc[label].push(skill.skill_name);
        return acc;
      }, {} as Record<string, string[]>);
      
      const groups: SkillGroup[] = Object.entries(grouped).map(([label, skills]) => ({
        label,
        skills,
      }));
      setSkillGroups(groups);
    }).catch(console.error);

    certificationsService.list().then((data) => {
      const sorted = [...data].sort((a, b) => {
        if (!a.date_issue) return 1;
        if (!b.date_issue) return -1;
        return a.date_issue.localeCompare(b.date_issue);
      });
      setCertifications(sorted);
    }).catch(console.error);
  }, []);

  const scrollSkills = (dir: 'left' | 'right') => {
    if (skillScrollRef.current) {
      skillScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="container-main py-8 flex flex-col gap-20">

      {/* ══════════════ EXPERIENCIA PROFESIONAL ══════════════ */}
      <section id="experience-section" className="flex flex-col gap-6 animate-fade-in-up">
        <SectionTitle label="// 01 — Experiencia" title="Experiencia Profesional" />

        {EXPERIENCES.map((exp, i) => (
          <GlassCard key={i} className="p-6 md:p-8" accentTop="var(--color-accent-gold)">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Company info */}
              <div className="flex gap-4 items-start">
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center mt-1"
                  style={{
                    background: 'rgba(201,169,110,0.1)',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}
                >
                  <Building2 size={20} style={{ color: 'var(--color-accent-gold)' }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: 'var(--color-accent-gold)' }}
                    >
                      {exp.company}
                    </span>
                    <span style={{ color: 'var(--color-text-dim)' }}>·</span>
                    <span
                      className="text-xs flex items-center gap-1"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <MapPin size={11} /> {exp.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Period badge */}
              <span
                className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap self-start"
                style={{
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.2)',
                  color: 'var(--color-accent-gold)',
                }}
              >
                <CalendarDays size={11} />
                {exp.period}
              </span>
            </div>

            {/* Responsibilities */}
            <ul className="mt-6 flex flex-col gap-2.5">
              {exp.responsibilities.map((r, j) => (
                <li key={j} className="flex gap-3 items-start">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--color-accent-gold)', opacity: 0.7 }}
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </section>

      {/* ══════════════ SKILLS ══════════════ */}
      <section className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SectionTitle label="// 02 — Habilidades" title="Skills & Competencias" />
          <div className="flex gap-2">
            <button
              onClick={() => scrollSkills('left')}
              className="btn-icon px-3"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollSkills('right')}
              className="btn-icon px-3"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={skillScrollRef}
          className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {skillGroups.map((group) => (
            <GlassCard
              key={group.label}
              className="p-5 flex-shrink-0"
              style={{
                minWidth: '220px',
                maxWidth: '260px',
                scrollSnapAlign: 'start',
              } as React.CSSProperties}
            >
              <h4
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-accent-gold)', opacity: 0.8 }}
              >
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        <p className="text-xs font-mono text-center" style={{ color: 'var(--color-text-dim)' }}>
          ← Desliza para ver más →
        </p>
      </section>

      {/* ══════════════ PROYECTOS PREVIEW ══════════════ */}
      <section className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SectionTitle label="// 03 — Proyectos" title="Proyectos Destacados" />
          <button
            className="btn-ghost flex items-center gap-2 text-xs"
            onClick={() => onNavigate('projects')}
          >
            Ver todos <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {PROJECTS.map((proj) => (
            <GlassCard
              key={proj.id}
              hover
              accentTop={proj.accentColor}
              className="p-6 flex flex-col gap-4"
              onClick={() => onNavigate('projects')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-2xl">{proj.icon}</span>
                  <h3
                    className="text-base font-bold mt-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {proj.title}
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: proj.accentColor, opacity: 0.9 }}
                  >
                    {proj.subtitle}
                  </p>
                </div>
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-lg whitespace-nowrap"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--color-text-dim)',
                  }}
                >
                  {proj.dateLabel}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {proj.stack.slice(0, 5).map((t) => (
                  <TechBadge key={t} label={t} size="sm" />
                ))}
                {proj.stack.length > 5 && (
                  <span
                    className="text-[0.65rem] px-2 py-0.5 rounded-full"
                    style={{ color: 'var(--color-text-dim)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    +{proj.stack.length - 5}
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>


      {/* ══════════════ CERTIFICACIONES ══════════════ */}
      <section className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <SectionTitle label="// 04 — Certificaciones" title="Certificaciones & Logros" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.length > 0 ? certifications.map((cert) => (
            <GlassCard 
              key={cert.id} 
              hover 
              className="p-5 flex gap-4 items-start cursor-pointer"
              onClick={() => {
                if (cert.reference_link) {
                  window.open(cert.reference_link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl overflow-hidden"
                style={{
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.15)',
                }}
              >
                {cert.icon_url?.startsWith('http') ? (
                  <img src={cert.icon_url} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  cert.icon_url || '📜'
                )}
              </div>
              <div>
                <Award size={11} className="mb-1" style={{ color: 'var(--color-accent-gold)' }} />
                <h4
                  className="text-sm font-semibold leading-tight hover:underline"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {cert.title}
                </h4>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {cert.awarded_by}
                </p>
                <p
                  className="text-xs mt-1.5 font-mono"
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  {cert.date_issue ? (() => {
                    const [year, month] = cert.date_issue.split('-');
                    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                    return `${months[parseInt(month, 10) - 1]} ${year}`;
                  })() : 'Presente'}
                </p>
              </div>
            </GlassCard>
          )) : <p className="text-sm text-gray-500">Cargando certificaciones...</p>}
        </div>
      </section>

      {/* ══════════════ FORMACIÓN ══════════════ */}
      <section className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <SectionTitle label="// 05 — Educación" title="Formación Profesional" />

        {EDUCATION.map((edu, i) => (
          <GlassCard key={i} className="p-6 md:p-8" accentTop="rgba(59,130,246,0.6)">
            <div className="flex gap-4 items-start">
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <GraduationCap size={22} style={{ color: '#3b82f6' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: '#3b82f6' }}
                    >
                      {edu.institution}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="text-xs font-mono px-3 py-1 rounded-lg"
                      style={{
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        color: '#3b82f6',
                      }}
                    >
                      {edu.period}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: 'var(--color-console-green)' }}
                    >
                      ● {edu.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default Home;

import React, { useState, useMemo, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import SectionTitle from '../components/ui/SectionTitle';
import TechBadge from '../components/ui/TechBadge';
import { projectsService, skillsService } from '../services/api';
import type { AdminProject, AdminSkill } from '../types';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Code2,
  Play,
  ExternalLink,
  CalendarDays,
  Loader2,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────
function formatMonthLabel(iso: string | null | undefined): string {
  if (!iso) return 'Presente';
  // ISO can be "YYYY-MM" or "YYYY-MM-DD"
  const [year, month] = iso.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function isoForSort(iso: string | null | undefined): string {
  return iso ? iso.substring(0, 7) : '9999-99';
}

// ── Component ──────────────────────────────────────────────────────────────
const Projects: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [skillsMap, setSkillsMap] = useState<Record<string, AdminSkill>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [projs, skills] = await Promise.all([
          projectsService.list(),
          skillsService.list(),
        ]);
        if (cancelled) return;
        setProjects(projs);
        const map: Record<string, AdminSkill> = {};
        skills.forEach((s) => { map[s.id] = s; });
        setSkillsMap(map);
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message ?? 'Error al cargar proyectos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let list = q
      ? projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.subtitle ?? '').toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q) ||
            (p.skill_ids ?? []).some((id) =>
              (skillsMap[id]?.name ?? '').toLowerCase().includes(q)
            )
        )
      : [...projects];

    list.sort((a, b) => {
      const diff = isoForSort(a.end_date ?? a.start_date).localeCompare(
        isoForSort(b.end_date ?? b.start_date)
      );
      return sortOrder === 'desc' ? -diff : diff;
    });

    return list;
  }, [searchQuery, sortOrder, projects, skillsMap]);

  const toggleSort = () => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-main py-16 flex flex-col items-center gap-4" style={{ color: 'var(--color-text-muted)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent-gold)' }} />
        <p className="font-mono text-sm">Cargando proyectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-main py-16 flex flex-col items-center gap-3">
        <p className="text-3xl">⚠️</p>
        <p className="font-mono text-sm" style={{ color: '#f87171' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="container-main py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <SectionTitle
          label="// c:\projects>"
          title="Dashboard de Proyectos"
          subtitle="Una colección de mis proyectos más significativos, desde pipelines de datos hasta sistemas ERP."
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-text-dim)' }}
          />
          <input
            id="projects-search"
            type="text"
            className="input-dark pl-10"
            placeholder="Buscar por nombre, tecnología..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button id="btn-sort-projects" onClick={toggleSort} className="btn-ghost flex items-center gap-2 whitespace-nowrap">
          {sortOrder === 'desc' ? <><ArrowDown size={14} /> Más reciente</> : <><ArrowUp size={14} /> Más antiguo</>}
          <ArrowUpDown size={12} style={{ opacity: 0.5 }} />
        </button>
      </div>

      {/* Count */}
      <p className="text-xs font-mono -mt-6" style={{ color: 'var(--color-text-dim)' }}>
        {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado
        {filteredProjects.length !== 1 ? 's' : ''}
        {searchQuery && ` para "${searchQuery}"`}
      </p>

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {filteredProjects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron proyectos para "{searchQuery}"</p>
          </GlassCard>
        ) : (
          filteredProjects.map((proj, index) => {
            const isExpanded = expanded === proj.id;
            const accentColor = proj.accent_color ?? '#c9a96e';
            const projSkills = (proj.skill_ids ?? []).map((id) => skillsMap[id]?.name).filter(Boolean) as string[];

            return (
              <GlassCard
                key={proj.id}
                accentTop={accentColor}
                className="p-6 md:p-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="flex flex-col gap-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl"
                        style={{
                          background: `${accentColor}18`,
                          border: `1.5px solid ${accentColor}45`,
                          boxShadow: `0 0 18px ${accentColor}20`,
                        }}
                      >
                        {proj.image_url ? (
                          <img src={proj.image_url} alt={proj.title} className="w-8 h-8 object-contain rounded-lg" />
                        ) : (
                          proj.icon ?? '🚀'
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{proj.title}</h2>
                        <p className="text-sm mt-0.5 font-semibold" style={{ color: accentColor }}>{proj.subtitle}</p>
                      </div>
                    </div>

                    {/* Date badge */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className="font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                        style={{
                          background: `${accentColor}12`,
                          border: `1px solid ${accentColor}30`,
                          color: accentColor,
                        }}
                      >
                        <CalendarDays size={11} />
                        {formatMonthLabel(proj.start_date)} – {proj.is_current ? 'Presente' : formatMonthLabel(proj.end_date)}
                      </span>
                      {proj.is_featured && (
                        <span className="text-[0.6rem] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ background: `${accentColor}20`, color: accentColor }}>
                          ★ Destacado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {isExpanded ? (proj.long_description ?? proj.description) : proj.description}
                  </p>

                  <button
                    onClick={() => setExpanded(isExpanded ? null : proj.id)}
                    className="text-xs font-mono self-start"
                    style={{ color: 'var(--color-accent-gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.8 }}
                  >
                    {isExpanded ? '↑ Ver menos' : '↓ Ver más detalles'}
                  </button>

                  {/* Stack */}
                  {projSkills.length > 0 && (
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--color-text-dim)' }}>
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projSkills.map((t) => <TechBadge key={t} label={t} />)}
                      </div>
                    </div>
                  )}

                  <div className="section-line" />

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {proj.github_url && proj.github_url !== '#' && (
                      <a href={proj.github_url} target="_blank" rel="noopener noreferrer" id={`btn-github-${proj.id}`} className="btn-icon">
                        <Code2 size={15} /> GitHub <ExternalLink size={11} style={{ opacity: 0.5 }} />
                      </a>
                    )}
                    {proj.video_url && proj.video_url !== '#' && (
                      <a href={proj.video_url} target="_blank" rel="noopener noreferrer" id={`btn-video-${proj.id}`} className="btn-icon"
                        style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.25)', color: '#a78bfa' }}>
                        <Play size={13} /> Ver Video <ExternalLink size={11} style={{ opacity: 0.5 }} />
                      </a>
                    )}
                    {proj.web_url && (
                      <a href={proj.web_url} target="_blank" rel="noopener noreferrer" className="btn-icon">
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default Projects;

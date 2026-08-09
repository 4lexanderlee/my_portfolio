import React, { useState, useMemo } from 'react';
import GlassCard from '../components/ui/GlassCard';
import SectionTitle from '../components/ui/SectionTitle';
import TechBadge from '../components/ui/TechBadge';
import { PROJECTS } from '../data/portfolioData';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Code2,
  Play,
  ExternalLink,
} from 'lucide-react';

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let list = q
      ? PROJECTS.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.stack.some((s) => s.toLowerCase().includes(q))
        )
      : [...PROJECTS];

    list.sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sortOrder === 'desc' ? -diff : diff;
    });

    return list;
  }, [searchQuery, sortOrder]);

  const toggleSort = () => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));

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

      {/* Controls: Search + Sort */}
      <div
        className="flex flex-col sm:flex-row gap-3 animate-fade-in-up"
        style={{ animationDelay: '0.05s' }}
      >
        {/* Search */}
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

        {/* Sort toggle */}
        <button
          id="btn-sort-projects"
          onClick={toggleSort}
          className="btn-ghost flex items-center gap-2 whitespace-nowrap"
        >
          {sortOrder === 'desc' ? (
            <><ArrowDown size={14} /> Más reciente</>
          ) : (
            <><ArrowUp size={14} /> Más antiguo</>
          )}
          <ArrowUpDown size={12} style={{ opacity: 0.5 }} />
        </button>
      </div>

      {/* Results count */}
      <p
        className="text-xs font-mono -mt-6"
        style={{ color: 'var(--color-text-dim)' }}
      >
        {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado
        {filteredProjects.length !== 1 ? 's' : ''}
        {searchQuery && ` para "${searchQuery}"`}
      </p>

      {/* Project Cards */}
      <div className="flex flex-col gap-6">
        {filteredProjects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              No se encontraron proyectos para "{searchQuery}"
            </p>
          </GlassCard>
        ) : (
          filteredProjects.map((proj, index) => {
            const isExpanded = expanded === proj.id;
            return (
              <GlassCard
                key={proj.id}
                accentTop={proj.accentColor}
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
                          background: `${proj.accentColor}18`,
                          border: `1px solid ${proj.accentColor}35`,
                        }}
                      >
                        {proj.icon}
                      </div>
                      <div>
                        <h2
                          className="text-xl font-bold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {proj.title}
                        </h2>
                        <p
                          className="text-sm mt-0.5 font-semibold"
                          style={{ color: proj.accentColor }}
                        >
                          {proj.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className="font-mono text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      📅 {proj.dateLabel}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {isExpanded ? proj.longDescription : proj.description}
                  </p>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : proj.id)}
                    className="text-xs font-mono self-start"
                    style={{
                      color: 'var(--color-accent-gold)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: 0.8,
                    }}
                  >
                    {isExpanded ? '↑ Ver menos' : '↓ Ver más detalles'}
                  </button>

                  {/* Stack badges */}
                  <div>
                    <p
                      className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2"
                      style={{ color: 'var(--color-text-dim)' }}
                    >
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proj.stack.map((t) => (
                        <TechBadge key={t} label={t} />
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="section-line" />

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`btn-github-${proj.id}`}
                      className="btn-icon"
                    >
                      <Code2 size={15} />
                      GitHub
                      <ExternalLink size={11} style={{ opacity: 0.5 }} />
                    </a>
                    <a
                      href={proj.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`btn-video-${proj.id}`}
                      className="btn-icon"
                      style={{
                        background: 'rgba(139,92,246,0.1)',
                        borderColor: 'rgba(139,92,246,0.25)',
                        color: '#a78bfa',
                      }}
                    >
                      <Play size={13} />
                      Ver Video
                      <ExternalLink size={11} style={{ opacity: 0.5 }} />
                    </a>
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

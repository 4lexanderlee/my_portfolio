import React, { useState, useMemo, useEffect, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import SectionTitle from '../components/ui/SectionTitle';
import { TIMELINE_EVENTS } from '../data/portfolioData';
import type { TimelineCategory } from '../types';

type FilterType = 'all' | TimelineCategory;

const FILTERS: { key: FilterType; label: string; emoji: string }[] = [
  { key: 'all', label: 'Todos', emoji: '🌐' },
  { key: 'project', label: 'Proyectos', emoji: '💻' },
  { key: 'education', label: 'Educación', emoji: '🎓' },
  { key: 'work', label: 'Trabajo', emoji: '🏢' },
  { key: 'certification', label: 'Certs', emoji: '📜' },
];

const CATEGORY_COLORS: Record<TimelineCategory, string> = {
  project:       '#8b5cf6',
  education:     '#3b82f6',
  work:          '#f59e0b',
  certification: '#10b981',
};

const CATEGORY_BG: Record<TimelineCategory, string> = {
  project:       'rgba(139,92,246,0.12)',
  education:     'rgba(59,130,246,0.12)',
  work:          'rgba(245,158,11,0.12)',
  certification: 'rgba(16,185,129,0.12)',
};

const Timeline: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sortedEvents = useMemo(() => {
    const base = filter === 'all'
      ? [...TIMELINE_EVENTS]
      : TIMELINE_EVENTS.filter((e) => e.category === filter);
    return base.sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sortDir === 'asc' ? diff : -diff;
    });
  }, [filter, sortDir]);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    nodeRefs.current.forEach((el) => {
      if (el) {
        el.classList.add('reveal');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sortedEvents]);

  return (
    <div className="container-main py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <SectionTitle
          label="// c:\timeline>"
          title="Línea de Tiempo"
          subtitle="Mi trayectoria profesional y académica, desde el inicio hasta hoy."
        />
      </div>

      {/* Controls: Filter Pills + Sort toggle */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.05s' }}
      >
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ key, label, emoji }) => (
            <button
              key={key}
              id={`timeline-filter-${key}`}
              className={`pill-filter ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span className="mr-1.5">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Chronological order toggle */}
        <button
          id="timeline-sort-toggle"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap self-start sm:self-auto"
          style={{
            background: 'rgba(201,169,110,0.08)',
            border: '1px solid rgba(201,169,110,0.25)',
            color: 'var(--color-accent-gold)',
            cursor: 'pointer',
          }}
        >
          <span style={{ opacity: 0.7 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
          {sortDir === 'asc' ? 'Inicio → Presente' : 'Presente → Inicio'}
        </button>
      </div>

      {/* Count */}
      <p
        className="text-xs font-mono -mt-6"
        style={{ color: 'var(--color-text-dim)' }}
      >
        {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''}
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="timeline-line absolute left-1/2 -translate-x-1/2 hidden md:block"
          style={{ top: 0, bottom: 0 }}
        />
        {/* Mobile line */}
        <div
          className="timeline-line absolute left-5 md:hidden"
          style={{ top: 0, bottom: 0 }}
        />

        <div className="flex flex-col gap-12">
          {sortedEvents.map((event, index) => {
            const isRight = index % 2 === 0;
            const color = CATEGORY_COLORS[event.category];
            const bg = CATEGORY_BG[event.category];
            const isLast = index === sortedEvents.length - 1;

            return (
              <div
                key={event.id}
                ref={(el) => { nodeRefs.current[index] = el; }}
                className={`
                  relative flex items-start gap-0
                  md:grid md:grid-cols-2 md:gap-8
                  ${isLast ? 'mb-0' : ''}
                `}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* ── Mobile layout ── */}
                <div className="md:hidden flex items-start gap-4 pl-0 w-full">
                  {/* Node */}
                  <div
                    className="timeline-node flex-shrink-0 mt-1 z-10"
                    style={{
                      borderColor: color,
                      background: bg,
                      color,
                      width: '40px',
                      height: '40px',
                      fontSize: '1.1rem',
                    }}
                  >
                    {event.icon}
                  </div>
                  {/* Card */}
                  <GlassCard
                    className="p-4 flex-1"
                    style={{ borderLeft: `3px solid ${color}` } as React.CSSProperties}
                  >
                    <span
                      className="font-mono text-[0.65rem] uppercase tracking-widest"
                      style={{ color }}
                    >
                      {event.dateLabel}
                    </span>
                    <h3
                      className="text-sm font-bold mt-1"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {event.title}
                    </h3>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color, opacity: 0.85 }}
                    >
                      {event.subtitle}
                    </p>
                    <p
                      className="text-xs mt-2 leading-relaxed"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {event.description}
                    </p>
                  </GlassCard>
                </div>

                {/* ── Desktop layout: alternating left/right ── */}
                {isRight ? (
                  <>
                    {/* Left: Card */}
                    <div className="hidden md:flex justify-end pr-8">
                      <GlassCard
                        className="p-5 w-full max-w-xs"
                        style={{ borderRight: `2px solid ${color}` } as React.CSSProperties}
                      >
                        <span
                          className="font-mono text-[0.65rem] uppercase tracking-widest"
                          style={{ color }}
                        >
                          {event.dateLabel}
                        </span>
                        <h3
                          className="text-sm font-bold mt-1.5"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="text-xs mt-0.5 font-semibold"
                          style={{ color, opacity: 0.85 }}
                        >
                          {event.subtitle}
                        </p>
                        <p
                          className="text-xs mt-2 leading-relaxed"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {event.description}
                        </p>
                      </GlassCard>
                    </div>
                    {/* Right: Node + empty */}
                    <div className="hidden md:flex items-start pl-8">
                      <div
                        className="timeline-node"
                        style={{
                          borderColor: color,
                          background: bg,
                          color,
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        {event.icon}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left: Node + empty */}
                    <div className="hidden md:flex items-start justify-end pr-8">
                      <div
                        className="timeline-node"
                        style={{
                          borderColor: color,
                          background: bg,
                          color,
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        {event.icon}
                      </div>
                    </div>
                    {/* Right: Card */}
                    <div className="hidden md:flex justify-start pl-8">
                      <GlassCard
                        className="p-5 w-full max-w-xs"
                        style={{ borderLeft: `2px solid ${color}` } as React.CSSProperties}
                      >
                        <span
                          className="font-mono text-[0.65rem] uppercase tracking-widest"
                          style={{ color }}
                        >
                          {event.dateLabel}
                        </span>
                        <h3
                          className="text-sm font-bold mt-1.5"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {event.title}
                        </h3>
                        <p
                          className="text-xs mt-0.5 font-semibold"
                          style={{ color, opacity: 0.85 }}
                        >
                          {event.subtitle}
                        </p>
                        <p
                          className="text-xs mt-2 leading-relaxed"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {event.description}
                        </p>
                      </GlassCard>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="flex justify-center mt-4">
        <div
          className="flex flex-col items-center gap-2"
          style={{ color: 'var(--color-text-dim)' }}
        >
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'var(--color-accent-gold)', opacity: 0.5 }} />
          <span className="font-mono text-[0.6rem] uppercase tracking-widest">
            Presente
          </span>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
};

export default Timeline;

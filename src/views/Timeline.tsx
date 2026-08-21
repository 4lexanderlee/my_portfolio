import React, { useState, useMemo, useEffect, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import SectionTitle from '../components/ui/SectionTitle';
import { experienceService, educationService, certificationsService, projectsService } from '../services/api';
import type { TimelineCategory } from '../types';
import { Loader2 } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────
interface TimelineEvent {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  description: string;
  category: TimelineCategory;
  icon: string;
  link?: string;
}

type FilterType = 'all' | TimelineCategory;

// ── Constants ─────────────────────────────────────────────────────────────
const FILTERS: { key: FilterType; label: string; emoji: string }[] = [
  { key: 'all',           label: 'Todos',      emoji: '🌐' },
  { key: 'project',       label: 'Proyectos',  emoji: '💻' },
  { key: 'education',     label: 'Educación',  emoji: '🎓' },
  { key: 'work',          label: 'Trabajo',    emoji: '🏢' },
  { key: 'certification', label: 'Certs',      emoji: '📜' },
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

// ── Helpers ───────────────────────────────────────────────────────────────
function formatMonthLabel(iso: string | null | undefined): string {
  if (!iso) return 'Presente';
  const [year, month] = iso.split('-');
  const months = ['Enero','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

// ── Component ─────────────────────────────────────────────────────────────
const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [experiences, trainings, certifications, projects] = await Promise.all([
          experienceService.list().catch(() => []),
          educationService.list().catch(() => []),
          certificationsService.list().catch(() => []),
          projectsService.list().catch(() => []),
        ]);

        if (cancelled) return;

        const timelineEvents: TimelineEvent[] = [];

        // Experiencias → 'work'
        experiences.forEach((exp) => {
          timelineEvents.push({
            id: `work-${exp.id}`,
            date: exp.start_date,
            dateLabel: formatMonthLabel(exp.start_date),
            title: exp.role,
            subtitle: `${exp.company} — ${exp.location ?? ''}`,
            description: exp.responsibilities?.[0]?.description ?? '',
            category: 'work',
            icon: '🏢',
          });
        });

        // Educación → 'education'
        trainings.forEach((edu) => {
          timelineEvents.push({
            id: `edu-${edu.id}`,
            date: edu.start_date,
            dateLabel: formatMonthLabel(edu.start_date),
            title: edu.institution ?? edu.degree ?? 'Educación',
            subtitle: edu.degree ?? '',
            description: edu.field_of_study ?? '',
            category: 'education',
            icon: '🎓',
          });
        });

        // Certificaciones → 'certification'
        certifications.forEach((cert) => {
          timelineEvents.push({
            id: `cert-${cert.id}`,
            date: cert.date_issue ?? '2022-01',
            dateLabel: formatMonthLabel(cert.date_issue),
            title: cert.title,
            subtitle: cert.awarded_by,
            description: '',
            category: 'certification',
            icon: cert.icon_url ?? '📜',
            link: cert.reference_link,
          });
        });

        // Proyectos → 'project'
        projects.filter((p) => p.is_featured).forEach((proj) => {
          timelineEvents.push({
            id: `proj-${proj.id}`,
            date: proj.start_date ?? '2025-01',
            dateLabel: formatMonthLabel(proj.start_date),
            title: proj.title,
            subtitle: proj.subtitle ?? '',
            description: proj.description ?? '',
            category: 'project',
            icon: proj.icon ?? '💻',
          });
        });

        setEvents(timelineEvents);
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message ?? 'Error al cargar timeline');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sortedEvents = useMemo(() => {
    const base =
      filter === 'all' ? [...events] : events.filter((e) => e.category === filter);
    return base.sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sortDir === 'asc' ? diff : -diff;
    });
  }, [events, filter, sortDir]);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    nodeRefs.current.forEach((el) => {
      if (el) { el.classList.add('reveal'); observer.observe(el); }
    });

    return () => observer.disconnect();
  }, [sortedEvents]);

  if (loading) {
    return (
      <div className="container-main py-16 flex flex-col items-center gap-4" style={{ color: 'var(--color-text-muted)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent-gold)' }} />
        <p className="font-mono text-sm">Cargando timeline...</p>
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
          label="// c:\timeline>"
          title="Línea de Tiempo"
          subtitle="Mi trayectoria profesional y académica, desde el inicio hasta hoy."
        />
      </div>

      {/* Controls */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.05s' }}
      >
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
      <p className="text-xs font-mono -mt-6" style={{ color: 'var(--color-text-dim)' }}>
        {sortedEvents.length} evento{sortedEvents.length !== 1 ? 's' : ''}
      </p>

      {/* Timeline */}
      <div className="relative">
        <div className="timeline-line absolute left-1/2 -translate-x-1/2 hidden md:block" style={{ top: 0, bottom: 0 }} />
        <div className="timeline-line absolute left-5 md:hidden" style={{ top: 0, bottom: 0 }} />

        <div className="flex flex-col gap-12">
          {sortedEvents.map((event, index) => {
            const isRight = index % 2 === 0;
            const color = CATEGORY_COLORS[event.category];
            const bg = CATEGORY_BG[event.category];
            const isLast = index === sortedEvents.length - 1;

            const CardContent = () => (
              <>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest" style={{ color }}>
                  {event.dateLabel}
                </span>
                <h3 className="text-sm font-bold mt-1.5" style={{ color: 'var(--color-text-primary)' }}>{event.title}</h3>
                <p className="text-xs mt-0.5 font-semibold" style={{ color, opacity: 0.85 }}>{event.subtitle}</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{event.description}</p>
              </>
            );

            return (
              <div
                key={event.id}
                ref={(el) => { nodeRefs.current[index] = el; }}
                className={`relative flex items-start gap-0 md:grid md:grid-cols-2 md:gap-8 ${isLast ? 'mb-0' : ''}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Mobile */}
                <div className="md:hidden flex items-start gap-4 pl-0 w-full">
                  <div className="timeline-node flex-shrink-0 mt-1 z-10 overflow-hidden"
                    style={{ borderColor: color, background: bg, color, width: '40px', height: '40px', fontSize: '1.1rem' }}>
                    {event.icon?.startsWith('http') ? <img src={event.icon} alt={event.title} className="w-full h-full object-cover" /> : event.icon}
                  </div>
                  <GlassCard 
                    className={`p-4 flex-1 ${event.link ? 'cursor-pointer' : ''}`} 
                    style={{ borderLeft: `3px solid ${color}` } as React.CSSProperties}
                    hover={!!event.link}
                    onClick={() => event.link && window.open(event.link, '_blank', 'noopener,noreferrer')}
                  >
                    <CardContent />
                  </GlassCard>
                </div>

                {/* Desktop alternating */}
                {isRight ? (
                  <>
                    <div className="hidden md:flex justify-end pr-8">
                      <GlassCard 
                        className={`p-5 w-full max-w-xs ${event.link ? 'cursor-pointer' : ''}`} 
                        style={{ borderRight: `2px solid ${color}` } as React.CSSProperties}
                        hover={!!event.link}
                        onClick={() => event.link && window.open(event.link, '_blank', 'noopener,noreferrer')}
                      >
                        <CardContent />
                      </GlassCard>
                    </div>
                    <div className="hidden md:flex items-start pl-8">
                      <div className="timeline-node overflow-hidden" style={{ borderColor: color, background: bg, color, fontSize: '1.1rem', flexShrink: 0 }}>
                        {event.icon?.startsWith('http') ? <img src={event.icon} alt={event.title} className="w-full h-full object-cover" /> : event.icon}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:flex items-start justify-end pr-8">
                      <div className="timeline-node overflow-hidden" style={{ borderColor: color, background: bg, color, fontSize: '1.1rem', flexShrink: 0 }}>
                        {event.icon?.startsWith('http') ? <img src={event.icon} alt={event.title} className="w-full h-full object-cover" /> : event.icon}
                      </div>
                    </div>
                    <div className="hidden md:flex justify-start pl-8">
                      <GlassCard 
                        className={`p-5 w-full max-w-xs ${event.link ? 'cursor-pointer' : ''}`} 
                        style={{ borderLeft: `2px solid ${color}` } as React.CSSProperties}
                        hover={!!event.link}
                        onClick={() => event.link && window.open(event.link, '_blank', 'noopener,noreferrer')}
                      >
                        <CardContent />
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
        <div className="flex flex-col items-center gap-2" style={{ color: 'var(--color-text-dim)' }}>
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'var(--color-accent-gold)', opacity: 0.5 }} />
          <span className="font-mono text-[0.6rem] uppercase tracking-widest">Presente</span>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
};

export default Timeline;

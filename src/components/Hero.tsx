import React, { useEffect, useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import type { View } from '../types';

// ── Inline brand SVGs (lucide-react no incluye iconos de redes sociales) ──
const GitHubIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface HeroProps {
  onNavigate: (view: View) => void;
}

const ROLES = [
  'Software Engineer Student',
  'Data Engineer Intern',
  'Full-Stack Developer',
  'ETL Pipeline Builder',
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typing, setTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    if (typing) {
      if (charIndex < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + currentRole[charIndex]);
          setCharIndex((i) => i + 1);
        }, 60);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
          setCharIndex((i) => i - 1);
        }, 32);
        return () => clearTimeout(timeout);
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
  }, [charIndex, typing, roleIndex]);

  return (
    <section
      className="relative"
      style={{ minHeight: '100vh', paddingTop: '64px' }}
      id="hero"
    >
      <div
        className="flex"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* ══════════════ LEFT: Profile Photo (sticky) ══════════════ */}
        <div
          className="hidden lg:block flex-shrink-0 relative"
          style={{ width: '44%' }}
        >
          <div
            style={{
              position: 'sticky',
              top: '64px',
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
            }}
          >
            <img
              src="/alexandelee_profile.png"
              alt="Alexander Lee"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                display: 'block',
              }}
            />
            {/* Top gradient: blends photo with navbar/top of page */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(6,8,16,0.85) 0%, transparent 20%)',
                pointerEvents: 'none',
              }}
            />
            {/* Right edge gradient: blends photo into content side */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, transparent 40%, rgba(6,8,16,0.9) 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(6,8,16,0.5) 0%, transparent 20%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* ══════════════ RIGHT: Text Content (NO glass) ══════════════ */}
        <div
          className="flex-1 flex flex-col justify-center animate-fade-in-right"
          style={{
            padding: 'clamp(32px, 5vw, 80px)',
            paddingTop: '40px',
            paddingBottom: '40px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* Available badge */}
          <div
            className="flex items-center gap-3 w-fit mb-6"
            style={{
              background: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.22)',
              borderRadius: '99px',
              padding: '6px 18px',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: 'var(--color-console-green)',
                boxShadow: '0 0 6px var(--color-console-green)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              className="font-mono text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--color-accent-gold)' }}
            >
              Disponible para oportunidades
            </span>
          </div>

          {/* Hello tag */}
          <p
            className="font-mono text-sm mb-3 tracking-widest"
            style={{ color: 'var(--color-console-green)' }}
          >
            &lt; hello, I'm /&gt;
          </p>

          {/* Name — ONE LINE */}
          <h1
            className="font-black leading-[1.0] tracking-tight mb-4 whitespace-nowrap"
            style={{
              fontSize: 'clamp(3.2rem, 5.5vw, 6rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Alexander{' '}
            <span className="text-gradient-gold">Lee</span>
          </h1>

          {/* Role typewriter */}
          <div
            className="font-mono text-base md:text-lg font-medium flex items-center gap-1 mb-6"
            style={{ color: 'var(--color-text-muted)', minHeight: '2rem' }}
          >
            <span style={{ color: 'var(--color-accent-gold)', marginRight: 4 }}>{'>'}</span>
            {displayText}
            <span
              className="inline-block w-0.5 h-5 ml-0.5"
              style={{
                background: 'var(--color-console-green)',
                animation: 'blink 1s step-start infinite',
              }}
            />
          </div>

          {/* Description */}
          <p
            className="text-sm md:text-base leading-relaxed mb-8"
            style={{
              color: 'var(--color-text-muted)',
              maxWidth: '440px',
            }}
          >
            Estudiante de Ingeniería de Software con IA en SENATI y Data Engineer Intern
            en OPCOMP E.I.R.L. Apasionado por construir pipelines de datos escalables,
            APIs de alto rendimiento y experiencias web memorables.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-5 mb-8">
            <button
              id="hero-btn-projects"
              className="btn-primary flex items-center gap-2"
              onClick={() => onNavigate('projects')}
            >
              Ver Proyectos
              <ChevronDown size={14} />
            </button>
            <button
              id="hero-btn-contact"
              className="btn-ghost flex items-center gap-2"
              onClick={() => onNavigate('contact')}
            >
              Contactar
            </button>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/alexlee-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              aria-label="GitHub"
            >
              <GitHubIcon size={15} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/alexander-lee"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={15} />
              LinkedIn
            </a>
            <a
              href="/cv-alexander-lee.pdf"
              download
              className="btn-icon"
              aria-label="Descargar CV"
            >
              <Download size={15} />
              CV
            </a>
          </div>

          {/* Scroll hint */}
          <div className="mt-12 flex items-center gap-2" style={{ opacity: 0.35 }}>
            <ChevronDown size={14} style={{ color: 'var(--color-text-muted)' }} className="animate-bounce" />
            <span className="font-mono text-[0.65rem] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
              scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

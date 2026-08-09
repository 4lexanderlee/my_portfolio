import React, { useEffect, useState } from 'react';
import { ChevronDown, Download, Code2, Briefcase } from 'lucide-react';
import type { View } from '../types';

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
            {/* Right edge gradient: blends photo into dark content side */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, transparent 50%, rgba(6,8,16,0.95) 100%)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(6,8,16,0.6) 0%, transparent 30%)',
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
          <div className="flex flex-wrap gap-3 mb-6">
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
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/alexlee-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              aria-label="GitHub"
            >
              <Code2 size={15} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/alexander-lee"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              aria-label="LinkedIn"
            >
              <Briefcase size={15} />
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

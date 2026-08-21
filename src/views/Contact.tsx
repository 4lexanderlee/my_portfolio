import React, { useEffect, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { getPublicProfile } from '../services/api';
import type { AdminProfile } from '../types';
import { Send, ExternalLink, Mail } from 'lucide-react';
import type { ContactIconId, ContactLink } from '../types';

// ── Inline brand SVGs ──
const GitHubSVG: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInSVG: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Map typed icon identifiers → component renderers
const CONTACT_ICON_MAP: Record<ContactIconId, { render: (size: number, color: string) => React.ReactNode; color: string; bg: string }> = {
  mail:     { render: (s, c) => <Mail size={s} style={{ color: c }} />,       color: '#c9a96e', bg: 'rgba(201,169,110,0.1)'  },
  linkedin: { render: (s, c) => <LinkedInSVG size={s} color={c} />,           color: '#0a66c2', bg: 'rgba(10,102,194,0.12)'  },
  github:   { render: (s, c) => <GitHubSVG size={s} color={c} />,             color: '#e6edf3', bg: 'rgba(230,237,243,0.07)' },
};

/** Construye los links de contacto dinámicamente desde el perfil de la BD */
function buildContactLinks(profile: AdminProfile): ContactLink[] {
  const CONTACT_SUBJECT = 'Estoy en busca de contactarte';
  const links: ContactLink[] = [];

  links.push({
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`,
    icon: 'mail',
  });

  if (profile.linkedin_url) {
    const displayValue = profile.linkedin_url.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
    links.push({
      label: 'LinkedIn',
      value: displayValue || 'Alexander Lee',
      href: profile.linkedin_url,
      icon: 'linkedin',
    });
  }

  if (profile.github_url) {
    const displayValue = profile.github_url.replace(/https?:\/\/(www\.)?github\.com\//, '@').replace(/\/$/, '');
    links.push({
      label: 'GitHub',
      value: displayValue || '@alexlee-dev',
      href: profile.github_url,
      icon: 'github',
    });
  }

  return links;
}

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  // ── Carga el perfil real desde la API para los links de contacto ──────
  useEffect(() => {
    getPublicProfile().then(setProfile).catch(console.error);
  }, []);

  const contactLinks = profile ? buildContactLinks(profile) : [];
  const contactEmail = profile?.email ?? '';
  const CONTACT_SUBJECT = 'Estoy en busca de contactarte';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Hola Alexander,\n\nMi nombre es ${name} (${email}).\n\n${message}`;
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(CONTACT_SUBJECT)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div
      className="relative min-h-screen flex items-center"
      style={{ paddingTop: '80px', paddingBottom: '40px' }}
    >
      {/* Giant watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-black text-[clamp(6rem,20vw,18rem)] leading-none tracking-tighter"
          style={{
            color: 'rgba(255,255,255,0.025)',
            letterSpacing: '-0.05em',
          }}
        >
          CONTACT
        </span>
      </div>

      <div className="container-main w-full relative z-10">
        {/* Page title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span
            className="font-mono text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: 'var(--color-accent-gold)', opacity: 0.8 }}
          >
            // c:\contact_me&gt;
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mt-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Contacta{''}
            <span className="text-gradient-gold">me</span>
          </h1>
          <p
            className="mt-3 text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            ¿Tienes un proyecto en mente o quieres hablar sobre Data Engineering y desarrollo?
            Estoy disponible y con gusto me pongo en contacto.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* ── Left: Contact Info ── */}
          <div
            className="lg:col-span-2 flex flex-col gap-5 animate-fade-in-left"
            style={{ animationDelay: '0.1s' }}
          >
            <GlassCard className="p-6" accentTop="var(--color-accent-gold)">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={14} style={{ color: 'var(--color-accent-gold)' }} />
                <span
                  className="font-mono text-xs uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--color-accent-gold)' }}
                >
                  Contacto Directo
                </span>
              </div>
              <h2
                className="text-lg font-bold mt-2 mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Hablemos
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Abierto a oportunidades de Data Engineering, proyectos freelance o simplemente
                una conversación sobre tecnología.
              </p>
            </GlassCard>

            {/* Contact links — dinámicos desde la BD */}
            {contactLinks.length > 0 ? (
              contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  id={`contact-link-${link.label.toLowerCase()}`}
                  className="block"
                >
                  <GlassCard hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: CONTACT_ICON_MAP[link.icon].bg,
                            border: `1px solid ${CONTACT_ICON_MAP[link.icon].color}30`,
                          }}
                        >
                          {CONTACT_ICON_MAP[link.icon].render(18, CONTACT_ICON_MAP[link.icon].color)}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--color-text-dim)' }}
                          >
                            {link.label}
                          </p>
                          <p
                            className="text-sm mt-0.5"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {link.value}
                          </p>
                        </div>
                      </div>
                      <ExternalLink
                        size={14}
                        style={{ color: 'var(--color-text-dim)', flexShrink: 0 }}
                      />
                    </div>
                  </GlassCard>
                </a>
              ))
            ) : (
              /* Skeleton mientras carga el perfil */
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '72px' }}
                />
              ))
            )}
          </div>

          {/* ── Right: Form ── */}
          <div
            className="lg:col-span-3 animate-fade-in-right"
            style={{ animationDelay: '0.15s' }}
          >
            <GlassCard className="p-6 md:p-8" accentTop="rgba(139,92,246,0.5)">
              <h3
                className="text-base font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Enviarme un mensaje
              </h3>

              {sent && (
                <div
                  className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    color: '#34d399',
                  }}
                >
                  ✓ Cliente de email abierto con tu mensaje.
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Nombre
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className="input-dark"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="input-dark"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="contact-message"
                      className="input-dark code-placeholder resize-none"
                      style={{ minHeight: '180px', fontFamily: 'inherit' }}
                      placeholder={`// profile.ts\nconst profile = {\n  name: "Alexander Lee",\n  role: "Data Eng Intern",\n  stack: ["Python","React","SQL"],\n  status: "Available ✓"\n}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                </div>

                {/* Submit */}
                <button
                  id="btn-contact-submit"
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 w-full mt-2 py-3"
                  style={{ fontSize: '0.9rem' }}
                  disabled={!contactEmail}
                >
                  <Send size={15} />
                  Enviar Mensaje
                </button>

                <p
                  className="text-center text-xs"
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  Se abrirá tu cliente de correo con el mensaje listo.
                </p>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

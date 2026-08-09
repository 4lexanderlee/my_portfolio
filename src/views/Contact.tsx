import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { CONTACT_EMAIL, CONTACT_SUBJECT, CONTACT_LINKS } from '../data/portfolioData';
import { Send, ExternalLink, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Hola Alexander,\n\nMi nombre es ${name} (${email}).\n\n${message}`;
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(CONTACT_SUBJECT)}&body=${encodeURIComponent(body)}`;
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
            Get in{' '}
            <span className="text-gradient-gold">Touch</span>
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

            {/* Contact links */}
            {CONTACT_LINKS.map((link) => (
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
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          background: 'rgba(201,169,110,0.08)',
                          border: '1px solid rgba(201,169,110,0.15)',
                        }}
                      >
                        {link.icon}
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
            ))}
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

import React, { useState, useEffect } from 'react';
import type { View } from '../types';
import { NAV_ITEMS } from '../data/portfolioData';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: View) => {
    onNavigate(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(6, 8, 16, 0.92)'
            : 'rgba(6, 8, 16, 0.7)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          borderBottom: scrolled
            ? '1px solid rgba(201, 169, 110, 0.12)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16">

            {/* ── Desktop Nav — centrado con separación amplia ── */}
            <nav className="hidden md:flex items-center gap-8 flex-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav-${item.view}`}
                    onClick={() => handleNav(item.view)}
                    className="console-path relative py-2 rounded-lg transition-all duration-200 group"
                    style={{
                      background: 'transparent',
                      color: isActive
                        ? 'var(--color-console-green)'
                        : 'var(--color-text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px 0',
                    }}
                  >
                    <span className="group-hover:text-[var(--color-console-green)] transition-colors">
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        className="absolute -bottom-px left-0 right-0 h-px"
                        style={{ background: 'var(--color-accent-gold)', borderRadius: '99px' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ── Right: Login + Hamburger ── */}
            <div className="flex items-center gap-3">
              <button
                id="btn-acceder"
                onClick={onLoginClick}
                className="btn-primary hidden sm:block text-xs px-4 py-2 animate-glow-pulse"
                style={{ fontSize: '0.78rem', letterSpacing: '0.08em' }}
              >
                ACCEDER
              </button>

              {/* Mobile menu toggle */}
              <button
                id="btn-mobile-menu"
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu — Fullscreen Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col animate-fade-in"
          style={{
            background: 'rgba(6, 8, 16, 0.97)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Close button — top right */}
          <div className="flex justify-end p-5">
            <button
              id="btn-mobile-close"
              className="p-2 rounded-xl transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav items — centered vertically and horizontally */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className="console-path w-full max-w-xs text-center px-6 py-5 rounded-2xl transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(201, 169, 110, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? 'var(--color-console-green)' : 'var(--color-text-muted)',
                    border: `1px solid ${isActive ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    letterSpacing: '0.03em',
                  }}
                >
                  {item.label}
                </button>
              );
            })}

            {/* ACCEDER button at bottom */}
            <div className="mt-6 w-full max-w-xs">
              <button
                onClick={() => { onLoginClick(); setMobileOpen(false); }}
                className="btn-primary w-full text-sm py-4"
                style={{ letterSpacing: '0.1em' }}
              >
                ACCEDER
              </button>
            </div>
          </nav>

          {/* Bottom hint */}
          <div className="py-6 text-center">
            <p className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
              alexander@portfolio
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

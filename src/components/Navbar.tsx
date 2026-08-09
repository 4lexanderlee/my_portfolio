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

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-16 animate-fade-in"
          style={{
            background: 'rgba(6, 8, 16, 0.97)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <nav className="flex flex-col p-6 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className="console-path text-left px-4 py-4 rounded-xl transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(201, 169, 110, 0.1)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? 'var(--color-console-green)' : 'var(--color-text-muted)',
                    border: `1px solid ${isActive ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="mt-4">
              <button
                onClick={() => { onLoginClick(); setMobileOpen(false); }}
                className="btn-primary w-full text-sm"
              >
                ACCEDER
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;

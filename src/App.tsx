import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Hero from './components/Hero';
import Home from './views/Home';
import Projects from './views/Projects';
import Timeline from './views/Timeline';
import Contact from './views/Contact';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showLogin, setShowLogin] = useState(false);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Fixed background layers ── */}
      <div className="bg-profile" aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />

      {/* ── Navbar ── */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* ── Main Content ── */}
      <main>
        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <Home onNavigate={handleNavigate} />
          </>
        )}
        {currentView === 'projects' && (
          <div style={{ paddingTop: '80px' }}>
            <Projects />
          </div>
        )}
        {currentView === 'timeline' && (
          <div style={{ paddingTop: '80px' }}>
            <Timeline />
          </div>
        )}
        {currentView === 'contact' && <Contact />}
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-6 text-center"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(6,8,16,0.6)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
          <span style={{ color: 'var(--color-console-green)' }}>alexander@lee</span>
          <span>:~$  </span>
          <span style={{ color: 'var(--color-accent-gold)' }}>echo</span>
          <span>  "© 2026 Alexander Lee"</span>
        </p>
      </footer>

      {/* ── Login Modal ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default App;

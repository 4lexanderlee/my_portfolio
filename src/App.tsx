import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Hero from './components/Hero';
import Home from './views/Home';
import Projects from './views/Projects';
import Timeline from './views/Timeline';
import Contact from './views/Contact';
import AdminDashboard from './views/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import type { View } from './types';

// ── Hook: detect #admin hash ───────────────────────────────────────────────
function useAdminRoute(): boolean {
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === '#admin'
  );

  useEffect(() => {
    const handler = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return isAdmin;
}

// ── Portfolio App ─────────────────────────────────────────────────────────
const PortfolioApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showLogin, setShowLogin] = useState(false);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Fixed background layers ── */}
      <div
        className={`bg-profile${currentView === 'home' ? ' home-clear' : ''}`}
        aria-hidden="true"
      />
      <div
        className={`bg-overlay${currentView === 'home' ? ' home-clear' : ''}`}
        aria-hidden="true"
      />
      {currentView === 'home' && (
        <div className="bg-home-desktop" aria-hidden="true" />
      )}

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

// ── Root App with Auth + Route switching ──────────────────────────────────
const App: React.FC = () => {
  const isAdminRoute = useAdminRoute();

  return (
    <AuthProvider>
      {isAdminRoute ? (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ) : (
        <PortfolioApp />
      )}
    </AuthProvider>
  );
};

export default App;

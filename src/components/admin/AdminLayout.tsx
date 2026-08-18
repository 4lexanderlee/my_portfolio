import React, { useState } from 'react';
import {
  User,
  Briefcase,
  FolderKanban,
  Zap,
  Award,
  GraduationCap,
  LogOut,
  Menu,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { AdminSection } from '../../types';

// ── Sidebar Nav Items ─────────────────────────────────────────────────────
interface SidebarItem {
  section: AdminSection;
  label: string;
  icon: React.ReactNode;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { section: 'profile',        label: 'Perfil',          icon: <User size={18} /> },
  { section: 'experience',     label: 'Experiencia',     icon: <Briefcase size={18} /> },
  { section: 'projects',       label: 'Proyectos',       icon: <FolderKanban size={18} /> },
  { section: 'skills',         label: 'Habilidades',     icon: <Zap size={18} /> },
  { section: 'certifications', label: 'Certificaciones', icon: <Award size={18} /> },
  { section: 'education',      label: 'Educación',       icon: <GraduationCap size={18} /> },
];

// ── Props ─────────────────────────────────────────────────────────────────
interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────
const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeSection,
  onSectionChange,
  children,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = SIDEBAR_ITEMS.find((i) => i.section === activeSection);

  const handleNav = (section: AdminSection) => {
    onSectionChange(section);
    setSidebarOpen(false);
  };

  // ── Sidebar content (shared between desktop & mobile) ────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div
        className="px-5 py-6 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.08))',
              border: '1px solid rgba(201,169,110,0.3)',
            }}
          >
            <LayoutDashboard size={16} style={{ color: 'var(--color-accent-gold)' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Admin Panel
            </p>
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>
              portfolio.admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3 px-2"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Contenido
        </p>
        <ul className="flex flex-col gap-1" role="list">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.section === activeSection;
            return (
              <li key={item.section}>
                <button
                  id={`admin-nav-${item.section}`}
                  onClick={() => handleNav(item.section)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                  style={{
                    background: isActive
                      ? 'rgba(201,169,110,0.12)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(201,169,110,0.22)'
                      : '1px solid transparent',
                    color: isActive
                      ? 'var(--color-accent-gold)'
                      : 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* User info */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #c9a96e, #e8b86d)', color: '#060810' }}
          >
            {user?.username?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {user?.username ?? 'admin'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-dim)' }}>
              {user?.role ?? 'Administrador'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          id="btn-admin-logout"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
          style={{
            background: 'transparent',
            border: '1px solid transparent',
            color: 'var(--color-text-dim)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-dim)';
          }}
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>

        {/* Back to portfolio */}
        <button
          onClick={() => { window.location.hash = ''; }}
          className="w-full text-center text-xs mt-2 py-1.5 transition-colors"
          style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-dim)'; }}
        >
          ← Volver al portafolio
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="admin-sidebar" aria-label="Menú de administración">
        <SidebarContent />
      </aside>

      {/* ── Mobile: Hamburger Overlay ─────────────────────────── */}
      {sidebarOpen && (
        <div className="admin-sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)}>
          <aside
            className="admin-sidebar-mobile"
            onClick={(e) => e.stopPropagation()}
            aria-label="Menú de administración móvil"
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Area ────────────────────────────────────────── */}
      <div className="admin-main">
        {/* Sticky Top Header */}
        <header className="admin-header">
          {/* Mobile hamburger */}
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--color-accent-gold)', opacity: 0.6 }}>
              {activeItem?.icon}
            </span>
            <h1 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {activeItem?.label ?? 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                color: 'var(--color-console-green)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Modo Mock activo
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

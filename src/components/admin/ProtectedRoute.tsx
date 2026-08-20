import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Terminal, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Local login state for the inline form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });

      if (error) {
        throw error;
      }
      
      // Supabase listener en AuthContext actualizará isAuthenticated
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show the login gate
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--color-bg-deep)' }}
      >
        {/* Background glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,169,110,0.08) 0%, transparent 70%)',
          }}
        />

        <div
          className="glass animate-scale-in w-full max-w-sm relative"
          style={{
            borderTop: '2px solid rgba(201,169,110,0.5)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1)',
            padding: '36px',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}
            >
              <Lock size={18} style={{ color: 'var(--color-accent-gold)' }} />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Acceso Restringido
              </h1>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Panel de administración — Solo acceso autorizado
              </p>
            </div>
          </div>

          {/* Terminal hint */}
          <div
            className="rounded-lg p-3 mb-6 font-mono text-xs"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ color: 'var(--color-console-green)', opacity: 0.8 }}>
              <Terminal size={10} className="inline mr-1" />
              $ ssh admin@portfolio.local
            </div>
            <div style={{ color: 'var(--color-text-dim)', opacity: 0.7 }} className="mt-0.5">
              {'>'} Introduce tus credenciales para continuar
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="protected-username"
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Usuario
              </label>
              <input
                id="protected-username"
                type="text"
                className="input-dark"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="protected-password"
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="protected-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-dark pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}
                  aria-label="Toggle visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-xs rounded-lg px-3 py-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                {error}
              </p>
            )}

            <button
              id="btn-protected-login"
              type="submit"
              className="btn-primary w-full mt-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                'ACCEDER AL PANEL'
              )}
            </button>
          </form>

          <button
            onClick={() => { window.location.hash = ''; }}
            className="w-full text-center text-xs mt-4 transition-colors"
            style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', cursor: 'pointer' }}
          >
            ← Volver al portafolio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

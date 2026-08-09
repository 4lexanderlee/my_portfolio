import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, Terminal } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lines, setLines] = useState<string[]>([]);

  // Typing effect for terminal lines
  useEffect(() => {
    const terminalLines = [
      '> Iniciando sesión segura...',
      '> Cargando credenciales...',
      '> Conectando con el servidor...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < terminalLines.length) {
        setLines((prev) => [...prev, terminalLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setError('Sistema de autenticación en desarrollo. ¡Vuelve pronto!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass animate-scale-in w-full max-w-sm relative"
        style={{
          borderTop: '2px solid rgba(201,169,110,0.5)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1)',
          padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          id="btn-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Cerrar modal"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(201,169,110,0.12)',
              border: '1px solid rgba(201,169,110,0.25)',
            }}
          >
            <Lock size={18} style={{ color: 'var(--color-accent-gold)' }} />
          </div>
          <div>
            <h2
              className="text-base font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Acceso Seguro
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Panel de administración
            </p>
          </div>
        </div>

        {/* Terminal mini preview */}
        <div
          className="rounded-lg p-3 mb-6 font-mono text-xs"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            minHeight: '70px',
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className="mb-0.5"
              style={{ color: 'var(--color-console-green)', opacity: 0.8 }}
            >
              {line}
            </div>
          ))}
          {lines.length > 0 && (
            <span
              className="cursor-blink"
              style={{ color: 'var(--color-console-green)' }}
            />
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-username"
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Terminal size={10} className="inline mr-1" />
              Usuario
            </label>
            <input
              id="login-username"
              type="text"
              className="input-dark"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Lock size={10} className="inline mr-1" />
              Contraseña
            </label>
            <div className="relative">
              <input
                id="login-password"
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              {error}
            </p>
          )}

          <button
            id="btn-login-submit"
            type="submit"
            className="btn-primary w-full mt-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
                />
                Autenticando...
              </>
            ) : (
              'INICIAR SESIÓN'
            )}
          </button>
        </form>

        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Sistema protegido — Solo acceso autorizado
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

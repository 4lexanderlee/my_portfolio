import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { profileService } from '../../../services/api';
import { uploadFile } from '../../../services/storage';
import type { AdminProfile, AdminProfilePayload } from '../../../types';
import { InputField, TextareaField, ToggleField } from '../../../components/admin/FormField';

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employmentStatus, setEmploymentStatus] = useState(false);
  // Valor original del toggle — para detectar cambios sin react-hook-form
  const [initialEmploymentStatus, setInitialEmploymentStatus] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AdminProfilePayload>();

  // ── Carga inicial del perfil desde la API ──────────────────────────────
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.get();
      setProfile(data);
      setEmploymentStatus(data.employment_status);
      setInitialEmploymentStatus(data.employment_status);
      // Inicializar el formulario con los datos reales de la BD
      reset({
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        description: data.description,
        cv_url: data.cv_url ?? '',
        linkedin_url: data.linkedin_url ?? '',
        github_url: data.github_url ?? '',
        employment_status: data.employment_status,
      });
    } catch (err) {
      console.error('[ProfileSection] Error cargando perfil:', err);
      setError('No se pudo cargar el perfil. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // ── Envío del formulario: subida de CV + PUT al backend ────────────────
  const onSubmit = async (data: AdminProfilePayload) => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      let cv_url = data.cv_url;

      // 1. Si hay un archivo PDF nuevo, súbelo al bucket 'portfolio'
      if (cvFile) {
        setUploadingCv(true);
        try {
          cv_url = await uploadFile(cvFile, 'cv');
        } finally {
          setUploadingCv(false);
        }
        setCvFile(null);
      }

      // 2. Construye el payload completo y envía el PUT
      const payload: AdminProfilePayload = {
        ...data,
        cv_url: cv_url || null,
        employment_status: employmentStatus,
      };

      const updated = await profileService.update(profile.profile_id, payload);
      setProfile(updated);
      reset({
        name: updated.name,
        last_name: updated.last_name,
        email: updated.email,
        description: updated.description,
        cv_url: updated.cv_url ?? '',
        linkedin_url: updated.linkedin_url ?? '',
        github_url: updated.github_url ?? '',
        employment_status: updated.employment_status,
      });
      setEmploymentStatus(updated.employment_status);
      setInitialEmploymentStatus(updated.employment_status);

      // 3. Feedback visual de éxito
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('[ProfileSection] Error guardando perfil:', err);
      const msg = err instanceof Error ? err.message : 'Error desconocido al guardar.';
      setError(`Error al guardar: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Estados de carga / error ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span
          className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-accent-gold)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-mono" style={{ color: 'var(--color-text-muted)' }}>
          Cargando perfil desde la base de datos...
        </p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 gap-4 rounded-2xl p-8"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <AlertCircle size={32} style={{ color: '#f87171' }} />
        <p className="text-sm text-center" style={{ color: '#f87171' }}>{error}</p>
        <button onClick={fetchProfile} className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw size={13} /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Información de Perfil</h2>
          <p className="admin-section-subtitle">
            Datos personales y URLs de contacto que se muestran en el portafolio.
          </p>
        </div>
        <button type="button" onClick={fetchProfile} className="btn-icon" aria-label="Recargar datos">
          <RefreshCw size={14} />
          Sincronizar
        </button>
      </div>

      {/* Notificación de error inline */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* ── Datos Personales ─────────────────────────────────────────── */}
        <div className="admin-card">
          <p className="admin-card-title">Datos Personales</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre"
              id="profile-name"
              required
              error={errors.name}
              registration={register('name', { required: 'Campo requerido' })}
              placeholder="Alexander"
            />
            <InputField
              label="Apellidos"
              id="profile-last-name"
              required
              error={errors.last_name}
              registration={register('last_name', { required: 'Campo requerido' })}
              placeholder="Lee"
            />
          </div>
          <InputField
            label="Email"
            id="profile-email"
            type="email"
            required
            error={errors.email}
            registration={register('email', {
              required: 'Campo requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
            })}
            placeholder="admin@portfolio.dev"
          />
          <TextareaField
            label="Descripción / Bio"
            id="profile-description"
            rows={4}
            required
            error={errors.description}
            registration={register('description', { required: 'La descripción del perfil es requerida' })}
            placeholder="Describe tu perfil profesional..."
          />
        </div>

        {/* ── URLs y Links ──────────────────────────────────────────────── */}
        <div className="admin-card">
          <p className="admin-card-title">URLs y Links</p>

          {/* CV — file input con vista previa de la URL actual */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
              CV / Currículum (PDF)
            </label>
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => cvInputRef.current?.click()}
            >
              <FileText size={16} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
              <span className="text-sm truncate" style={{ color: cvFile ? 'var(--color-text-primary)' : 'var(--color-text-dim)' }}>
                {cvFile
                  ? cvFile.name
                  : profile?.cv_url
                  ? 'CV actual — clic para reemplazar'
                  : 'Seleccionar archivo PDF...'}
              </span>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
            </div>
            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline w-fit"
                style={{ color: 'var(--color-accent-gold)' }}
              >
                Ver CV actual ↗
              </a>
            )}
          </div>

          <InputField
            label="LinkedIn"
            id="profile-linkedin-url"
            type="url"
            error={errors.linkedin_url}
            registration={register('linkedin_url')}
            placeholder="https://linkedin.com/in/..."
          />
          <InputField
            label="GitHub"
            id="profile-github-url"
            type="url"
            error={errors.github_url}
            registration={register('github_url')}
            placeholder="https://github.com/..."
          />
        </div>

        {/* ── Estado Laboral ────────────────────────────────────────────── */}
        <div className="admin-card">
          <p className="admin-card-title">Estado Laboral</p>
          <ToggleField
            id="profile-employment-status"
            label="Disponible para nuevas oportunidades"
            description='Activa el badge "Open to Work" visible en el portafolio.'
            checked={employmentStatus}
            onChange={setEmploymentStatus}
          />
        </div>

        {/* ── Acciones ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <button
            id="btn-profile-save"
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={saving || uploadingCv || (!isDirty && !cvFile && !success && employmentStatus === initialEmploymentStatus)}
          >
            {saving || uploadingCv ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {uploadingCv ? 'Subiendo CV...' : saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          {success && (
            <p className="text-sm animate-fade-in" style={{ color: 'var(--color-console-green)' }}>
              ✓ Perfil actualizado correctamente
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { profileService } from '../../../services/api';
import { uploadFile } from '../../../services/storage';
import type { AdminProfile, AdminProfilePayload } from '../../../types';
import { InputField, TextareaField, ToggleField } from '../../../components/admin/FormField';

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpenToWork, setIsOpenToWork] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AdminProfilePayload>();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.get();
      setProfile(data);
      setIsOpenToWork(data.is_open_to_work);
      reset({ ...data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const onSubmit = async (data: AdminProfilePayload) => {
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    try {
      let cv_url = data.cv_url;

      // Si hay un archivo PDF nuevo, súbelo primero
      if (cvFile) {
        setUploadingCv(true);
        cv_url = await uploadFile(cvFile, 'cv');
        setUploadingCv(false);
        setCvFile(null);
      }

      const updated = await profileService.update(profile.id, {
        ...data,
        cv_url,
        is_open_to_work: isOpenToWork,
      });
      setProfile(updated);
      reset({ ...updated });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span
          className="inline-block w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-accent-gold)', borderTopColor: 'transparent' }}
        />
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Datos Personales */}
        <div className="admin-card">
          <p className="admin-card-title">Datos Personales</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre"
              id="profile-first-name"
              required
              error={errors.first_name}
              registration={register('first_name', { required: 'Campo requerido' })}
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

        {/* URLs y Links */}
        <div className="admin-card">
          <p className="admin-card-title">URLs y Links</p>

          {/* CV — ahora es un file input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
              CV / Currículum (PDF)
            </label>
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
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
                rel="noreferrer"
                className="text-xs underline"
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

        {/* Estado Laboral */}
        <div className="admin-card">
          <p className="admin-card-title">Estado Laboral</p>
          <ToggleField
            id="profile-open-to-work"
            label="Disponible para nuevas oportunidades"
            description='Activa el badge "Open to Work" visible en el portafolio.'
            checked={isOpenToWork}
            onChange={setIsOpenToWork}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            id="btn-profile-save"
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={saving || uploadingCv || (!isDirty && !cvFile && !success)}
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

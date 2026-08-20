import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, RefreshCw } from 'lucide-react';
import { profileService } from '../../../services/api';
import type { AdminProfile, AdminProfilePayload } from '../../../types';
import { InputField, TextareaField, ToggleField } from '../../../components/admin/FormField';

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpenToWork, setIsOpenToWork] = useState(false);

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
      const updated = await profileService.update(profile.id, {
        ...data,
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
        <span className="inline-block w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Información de Perfil</h2>
          <p className="admin-section-subtitle">Datos personales y URLs de contacto que se muestran en el portafolio.</p>
        </div>
        <button
          type="button"
          onClick={fetchProfile}
          className="btn-icon"
          aria-label="Recargar datos"
        >
          <RefreshCw size={14} />
          Sincronizar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Personal */}
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
            error={errors.description}
            registration={register('description')}
            placeholder="Describe tu perfil profesional..."
          />
        </div>

        {/* URLs */}
        <div className="admin-card">
          <p className="admin-card-title">URLs y Links</p>
          <InputField
            label="CV / Currículum (URL)"
            id="profile-cv-url"
            type="url"
            error={errors.cv_url}
            registration={register('cv_url')}
            placeholder="https://drive.google.com/..."
          />
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
          <InputField
            label="Avatar / Foto (URL)"
            id="profile-avatar-url"
            type="url"
            error={errors.avatar_url}
            registration={register('avatar_url')}
            placeholder="https://..."
          />
        </div>

        {/* Employment status */}
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
            disabled={saving || (!isDirty && !success)}
          >
            {saving ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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

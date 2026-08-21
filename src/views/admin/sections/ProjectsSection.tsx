import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Star, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { projectsService, skillsService } from '../../../services/api';
import { uploadFile } from '../../../services/storage';
import type { AdminProject, AdminProjectPayload, AdminSkill } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField, TextareaField, ToggleField } from '../../../components/admin/FormField';

// ── Multi-Select Skills ───────────────────────────────────────────────────
interface SkillMultiSelectProps {
  allSkills: AdminSkill[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const SkillMultiSelect: React.FC<SkillMultiSelectProps> = ({ allSkills, selectedIds, onChange }) => {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    );
  };
  const categories = [...new Set(allSkills.map((s) => s.category))];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
        Habilidades del Proyecto
        <span className="ml-2 text-xs normal-case font-normal" style={{ color: 'var(--color-text-dim)' }}>
          ({selectedIds.length} seleccionadas)
        </span>
      </label>
      <div className="rounded-xl p-3 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs mb-2 capitalize" style={{ color: 'var(--color-text-dim)' }}>{cat.replace('_', ' ')}</p>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.filter((s) => s.category === cat).map((skill) => {
                const active = selectedIds.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggle(skill.id)}
                    className="text-xs px-2.5 py-1 rounded-full transition-all"
                    style={{
                      background: active ? 'rgba(201,169,110,0.18)' : 'rgba(255,255,255,0.04)',
                      border: active ? '1px solid rgba(201,169,110,0.45)' : '1px solid rgba(255,255,255,0.08)',
                      color: active ? 'var(--color-accent-gold)' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {skill.skill_name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── File Picker ────────────────────────────────────────────────────────────
interface FilePickerProps {
  label: string;
  accept?: string;
  file: File | null;
  currentUrl?: string;
  onChange: (f: File | null) => void;
  hint?: string;
}

const FilePicker: React.FC<FilePickerProps> = ({ label, accept = 'image/png,image/webp,image/*', file, currentUrl, onChange, hint }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={() => ref.current?.click()}
      >
        <ImageIcon size={15} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
        <span className="text-sm truncate flex-1" style={{ color: file ? 'var(--color-text-primary)' : 'var(--color-text-dim)' }}>
          {file ? file.name : currentUrl ? 'Imagen actual — clic para reemplazar' : 'Seleccionar imagen PNG...'}
        </span>
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
      </div>
      {currentUrl && !file && (
        <div className="flex items-center gap-2">
          <img src={currentUrl} alt="preview" className="w-8 h-8 object-contain rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span className="text-xs" style={{ color: 'var(--color-console-green)' }}>Imagen guardada</span>
        </div>
      )}
      {hint && <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{hint}</p>}
    </div>
  );
};

// ── Form Values ────────────────────────────────────────────────────────────
type ProjectFormValues = {
  title: string;
  subtitle: string;
  description: string;
  start_date: string;
  end_date: string;
  github_url: string;
  video_url: string;
  drive_url: string;
  web_url: string;
};

// ── Main Component ─────────────────────────────────────────────────────────
const ProjectsSection: React.FC = () => {
  const [rows, setRows] = useState<AdminProject[]>([]);
  const [allSkills, setAllSkills] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projects, skills] = await Promise.all([projectsService.list(), skillsService.list()]);
      setRows(projects);
      setAllSkills(skills);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIsFeatured(false);
    setIsCurrent(false);
    setSelectedSkillIds([]);
    setIconFile(null);
    setImageFile(null);
    reset({ title: '', subtitle: '', description: '', start_date: '', end_date: '', github_url: '', video_url: '', drive_url: '', web_url: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminProject) => {
    setEditTarget(row);
    setIsFeatured(row.is_featured);
    setIsCurrent(row.is_current);
    setSelectedSkillIds(row.skill_ids);
    setIconFile(null);
    setImageFile(null);
    reset({
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      start_date: row.start_date,
      end_date: row.end_date ?? '',
      github_url: row.github_url ?? '',
      video_url: row.video_url ?? '',
      drive_url: row.drive_url ?? '',
      web_url: row.web_url ?? '',
    });
    setSlideOpen(true);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setSaving(true);
    try {
      // Subir icono PNG si se seleccionó uno
      let iconUrl = editTarget?.icon ?? '';
      if (iconFile) {
        iconUrl = await uploadFile(iconFile, 'project-icons');
      }

      // Subir imagen del proyecto si se seleccionó una
      let imageUrl = editTarget?.image_url ?? '';
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'projects');
      }

      const payload: AdminProjectPayload = {
        ...data,
        // description es el único campo de descripción
        long_description: data.description,
        icon: iconUrl,
        image_url: imageUrl,
        logo_url: '',
        accent_color: '#c9a96e', // valor por defecto, el usuario no lo edita
        is_featured: isFeatured,
        is_current: isCurrent,
        end_date: isCurrent ? null : data.end_date || null,
        skill_ids: selectedSkillIds,
      };

      if (editTarget) {
        const updated = await projectsService.update(editTarget.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await projectsService.create(payload);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminProject>[] = [
    {
      key: 'title', header: 'Proyecto',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.icon && row.icon.startsWith('http') ? (
            <img src={row.icon} alt={row.title} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
          ) : (
            <span className="text-lg">{row.icon || '🚀'}</span>
          )}
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{row.title}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period', header: 'Período', width: '160px',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {row.start_date} → {row.is_current ? 'Presente' : (row.end_date ?? '—')}
        </span>
      ),
    },
    {
      key: 'skill_ids', header: 'Skills', width: '80px',
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--color-accent-gold)', border: '1px solid rgba(201,169,110,0.2)' }}>
          {row.skill_ids.length} skills
        </span>
      ),
    },
    {
      key: 'is_featured', header: 'Destacado', width: '90px',
      render: (row) => row.is_featured
        ? <Star size={14} style={{ color: 'var(--color-accent-gold)' }} />
        : <span style={{ color: 'var(--color-text-dim)' }}>—</span>,
    },
    {
      key: 'github_url', header: 'GitHub', width: '80px',
      render: (row) => row.github_url && row.github_url !== '#'
        ? <a href={row.github_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-gold)' }}><ExternalLink size={13} /></a>
        : <span style={{ color: 'var(--color-text-dim)' }}>—</span>,
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Proyectos</h2>
          <p className="admin-section-subtitle">{rows.length} proyectos — Gestiona tu portafolio de trabajo</p>
        </div>
        <button id="btn-project-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nuevo Proyecto
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="No hay proyectos registrados. ¡Añade el primero!" />

      {/* ── Slide-over Form ──── */}
      <SlideOver
        isOpen={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editTarget ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        subtitle={editTarget ? editTarget.title : 'Completa la información del proyecto'}
        width="600px"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Basic Info */}
          <div className="admin-card">
            <p className="admin-card-title">Información General</p>
            <InputField label="Título" id="proj-title" required error={errors.title} registration={register('title', { required: 'Campo requerido' })} placeholder="MarketPulse ETL" />
            <InputField label="Subtítulo" id="proj-subtitle" error={errors.subtitle} registration={register('subtitle')} placeholder="Pipeline Data Lakehouse Financiero" />
            <TextareaField
              label="Descripción"
              id="proj-desc"
              rows={5}
              required
              error={errors.description}
              registration={register('description', { required: 'La descripción es requerida' })}
              placeholder="Describe el proyecto, tecnologías utilizadas y tu rol en él..."
            />
          </div>

          {/* Dates & Status */}
          <div className="admin-card">
            <p className="admin-card-title">Fechas y Estado</p>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Fecha de Inicio" id="proj-start" type="date" required error={errors.start_date} registration={register('start_date', { required: 'Campo requerido' })} />
              {!isCurrent && (
                <InputField label="Fecha de Fin" id="proj-end" type="date" error={errors.end_date} registration={register('end_date')} />
              )}
            </div>
            <ToggleField id="proj-is-current" label="Proyecto en desarrollo" description="Muestra 'Presente' como fecha de fin" checked={isCurrent} onChange={setIsCurrent} />
            <ToggleField id="proj-is-featured" label="Proyecto destacado" description='Aparece con badge "Featured" en el portafolio' checked={isFeatured} onChange={setIsFeatured} />
          </div>

          {/* Visual */}
          <div className="admin-card">
            <p className="admin-card-title">Identidad Visual</p>
            <FilePicker
              label="Ícono / Logo (PNG)"
              accept="image/png,image/webp,image/svg+xml"
              file={iconFile}
              currentUrl={editTarget?.icon?.startsWith('http') ? editTarget.icon : undefined}
              onChange={setIconFile}
              hint="Imagen PNG o SVG que representa el proyecto"
            />
            <FilePicker
              label="Imagen de Portada"
              accept="image/*"
              file={imageFile}
              currentUrl={editTarget?.image_url ?? undefined}
              onChange={setImageFile}
              hint="Imagen principal del proyecto (banner, screenshot)"
            />
          </div>

          {/* URLs */}
          <div className="admin-card">
            <p className="admin-card-title">Links del Proyecto</p>
            <InputField label="GitHub" id="proj-github" type="url" error={errors.github_url} registration={register('github_url')} placeholder="https://github.com/..." />
            <InputField label="Demo / Web" id="proj-web" type="url" error={errors.web_url} registration={register('web_url')} placeholder="https://..." />
            <InputField label="Video" id="proj-video" type="url" error={errors.video_url} registration={register('video_url')} placeholder="https://youtube.com/..." />
            <InputField label="Google Drive" id="proj-drive" type="url" error={errors.drive_url} registration={register('drive_url')} placeholder="https://drive.google.com/..." />
          </div>

          {/* Skills */}
          <div className="admin-card">
            <SkillMultiSelect allSkills={allSkills} selectedIds={selectedSkillIds} onChange={setSelectedSkillIds} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-project-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="¿Eliminar proyecto?"
        message={`Se eliminará permanentemente "${deleteTarget?.title}".`}
        loading={deleting}
      />
    </>
  );
};

export default ProjectsSection;

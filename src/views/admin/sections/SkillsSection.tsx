import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { skillsService } from '../../../services/api';
import type { AdminSkill, AdminSkillPayload, SkillCategory } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField, SelectField } from '../../../components/admin/FormField';

const CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: 'language',      label: 'Lenguaje de Programación' },
  { value: 'framework',     label: 'Framework / Librería' },
  { value: 'database',      label: 'Base de Datos' },
  { value: 'cloud_devops',  label: 'Cloud & DevOps' },
  { value: 'visualization', label: 'Visualización' },
  { value: 'soft_skill',    label: 'Soft Skill' },
  { value: 'hard_skill',    label: 'Hard Skill' },
  { value: 'other',         label: 'Otro' },
];

const CATEGORY_COLORS: Record<SkillCategory, { bg: string; color: string; border: string }> = {
  language:      { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  framework:     { bg: 'rgba(139,92,246,0.1)',  color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
  database:      { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  cloud_devops:  { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  visualization: { bg: 'rgba(236,72,153,0.1)',  color: '#f472b6', border: 'rgba(236,72,153,0.25)' },
  soft_skill:    { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  hard_skill:    { bg: 'rgba(201,169,110,0.1)', color: 'var(--color-accent-gold)', border: 'rgba(201,169,110,0.25)' },
  other:         { bg: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', border: 'rgba(255,255,255,0.1)' },
};

const SkillsSection: React.FC = () => {
  const [rows, setRows] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminSkill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSkill | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminSkillPayload>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await skillsService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    reset({ skill_name: '', category: 'language' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminSkill) => {
    setEditTarget(row);
    reset({ skill_name: row.skill_name, category: row.category });
    setSlideOpen(true);
  };

  const onSubmit = async (data: AdminSkillPayload) => {
    setSaving(true);
    try {
      if (editTarget) {
        const updated = await skillsService.update(editTarget.id, data);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await skillsService.create(data);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await skillsService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  const columns: Column<AdminSkill>[] = [
    { key: 'skill_name', header: 'Habilidad' },
    {
      key: 'category', header: 'Categoría',
      render: (row) => {
        const style = CATEGORY_COLORS[row.category];
        const label = CATEGORY_OPTIONS.find((o) => o.value === row.category)?.label ?? row.category;
        return (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'icon_url', header: 'Ícono', width: '70px',
      render: (row) => row.icon_url
        ? <img src={row.icon_url} alt={row.skill_name} className="w-6 h-6 object-contain" />
        : <span style={{ color: 'var(--color-text-dim)' }}>—</span>,
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Habilidades</h2>
          <p className="admin-section-subtitle">{rows.length} habilidades — Hard skills, soft skills y más</p>
        </div>
        <button id="btn-skill-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva Habilidad
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="Sin habilidades registradas." />

      <SlideOver isOpen={slideOpen} onClose={() => setSlideOpen(false)} title={editTarget ? 'Editar Habilidad' : 'Nueva Habilidad'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <InputField label="Nombre" id="skill-skill_name" required error={errors.skill_name} registration={register('skill_name', { required: 'Campo requerido' })} placeholder="Python" />
          <SelectField label="Categoría" id="skill-category" required error={errors.category} registration={register('category', { required: 'Campo requerido' })} options={CATEGORY_OPTIONS} />
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-skill-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} title="¿Eliminar habilidad?" message={`Se eliminará "${deleteTarget?.skill_name}" de todas las asociaciones con proyectos.`} loading={deleting} />
    </>
  );
};

export default SkillsSection;

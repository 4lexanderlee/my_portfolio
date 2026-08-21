import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { educationService } from '../../../services/api';
import type { AdminEducation, AdminEducationPayload } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField, ToggleField } from '../../../components/admin/FormField';

// ── Form values simplificado ───────────────────────────────────────────────
type EducationFormValues = {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
};

const EducationSection: React.FC = () => {
  const [rows, setRows] = useState<AdminEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminEducation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEducation | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EducationFormValues>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await educationService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIsInProgress(true);
    reset({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminEducation) => {
    setEditTarget(row);
    setIsInProgress(row.status === 'in_progress');
    reset({
      institution: row.institution,
      degree: row.degree,
      field_of_study: row.field_of_study,
      start_date: row.start_date,
      end_date: row.end_date ?? '',
    });
    setSlideOpen(true);
  };

  const onSubmit = async (data: EducationFormValues) => {
    setSaving(true);
    try {
      const payload: AdminEducationPayload = {
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study,
        start_date: data.start_date,
        end_date: isInProgress ? null : data.end_date || null,
        status: isInProgress ? 'in_progress' : 'completed',
        institution_url: '',
        certificate_url: '',
      };
      if (editTarget) {
        const updated = await educationService.update(editTarget.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await educationService.create(payload);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } catch (e) {
      console.error(e);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await educationService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  const columns: Column<AdminEducation>[] = [
    {
      key: 'degree', header: 'Formación',
      render: (row) => (
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{row.degree}</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.institution}</p>
        </div>
      ),
    },
    { key: 'field_of_study', header: 'Campo de Estudio' },
    {
      key: 'period', header: 'Período', width: '160px',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {row.start_date} → {row.status === 'in_progress' ? 'Presente' : (row.end_date ?? '—')}
        </span>
      ),
    },
    {
      key: 'status', header: 'Estado', width: '120px',
      render: (row) => {
        const isActive = row.status === 'in_progress';
        return (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={isActive
              ? { background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }
              : { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }
            }>
            {isActive ? 'En Curso' : 'Completado'}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Educación</h2>
          <p className="admin-section-subtitle">{rows.length} registros — Formación académica y estudios</p>
        </div>
        <button id="btn-edu-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva Formación
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="Sin registros educativos." />

      <SlideOver isOpen={slideOpen} onClose={() => setSlideOpen(false)} title={editTarget ? 'Editar Formación' : 'Nueva Formación'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <InputField label="Institución" id="edu-institution" required error={errors.institution} registration={register('institution', { required: 'Campo requerido' })} placeholder="SENATI" />
          <InputField label="Título / Grado" id="edu-degree" required error={errors.degree} registration={register('degree', { required: 'Campo requerido' })} placeholder="Ingeniería de Software con IA" />
          <InputField label="Campo de Estudio" id="edu-field" error={errors.field_of_study} registration={register('field_of_study')} placeholder="Software Engineering & AI" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Fecha de Inicio" id="edu-start" type="date" required error={errors.start_date} registration={register('start_date', { required: 'Campo requerido' })} />
            {!isInProgress && (
              <InputField label="Fecha de Fin" id="edu-end" type="date" error={errors.end_date} registration={register('end_date')} />
            )}
          </div>
          <ToggleField id="edu-in-progress" label="Actualmente en curso" description="Muestra 'Presente' como fecha de fin" checked={isInProgress} onChange={setIsInProgress} />

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-edu-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} title="¿Eliminar formación?" message={`Se eliminará "${deleteTarget?.degree}" de ${deleteTarget?.institution}.`} loading={deleting} />
    </>
  );
};

export default EducationSection;

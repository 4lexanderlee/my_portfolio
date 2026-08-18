import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, ExternalLink } from 'lucide-react';
import { educationService } from '../../../services/api';
import type { AdminEducation, AdminEducationPayload, EducationStatus } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField, SelectField, ToggleField } from '../../../components/admin/FormField';

const STATUS_OPTIONS: { value: EducationStatus; label: string }[] = [
  { value: 'in_progress', label: 'En Curso' },
  { value: 'completed',   label: 'Completado' },
  { value: 'dropped',     label: 'Abandonado' },
];

const STATUS_STYLES: Record<EducationStatus, { bg: string; color: string; border: string }> = {
  in_progress: { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  completed:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
  dropped:     { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.25)' },
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminEducationPayload>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await educationService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIsInProgress(false);
    reset({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', status: 'in_progress', institution_url: '', certificate_url: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminEducation) => {
    setEditTarget(row);
    setIsInProgress(row.status === 'in_progress');
    reset({
      institution: row.institution, degree: row.degree, field_of_study: row.field_of_study,
      start_date: row.start_date, end_date: row.end_date ?? '', status: row.status,
      institution_url: row.institution_url ?? '', certificate_url: row.certificate_url ?? '',
    });
    setSlideOpen(true);
  };

  const onSubmit = async (data: AdminEducationPayload) => {
    setSaving(true);
    try {
      const payload: AdminEducationPayload = {
        ...data,
        status: isInProgress ? 'in_progress' : data.status,
        end_date: isInProgress ? null : data.end_date || null,
      };
      if (editTarget) {
        const updated = await educationService.update(editTarget.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await educationService.create(payload);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
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
        const st = STATUS_STYLES[row.status];
        const label = STATUS_OPTIONS.find((o) => o.value === row.status)?.label ?? row.status;
        return (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'institution_url', header: 'Link', width: '70px',
      render: (row) => row.institution_url
        ? <a href={row.institution_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-gold)' }}><ExternalLink size={13} /></a>
        : <span style={{ color: 'var(--color-text-dim)' }}>—</span>,
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
            <InputField label="Fecha de Inicio" id="edu-start" type="month" required error={errors.start_date} registration={register('start_date', { required: 'Campo requerido' })} />
            {!isInProgress && (
              <InputField label="Fecha de Fin" id="edu-end" type="month" error={errors.end_date} registration={register('end_date')} />
            )}
          </div>
          <ToggleField id="edu-in-progress" label="Actualmente en curso" description="Muestra 'Presente' como fecha de fin" checked={isInProgress} onChange={setIsInProgress} />
          {!isInProgress && (
            <SelectField label="Estado" id="edu-status" error={errors.status} registration={register('status')} options={STATUS_OPTIONS} />
          )}
          <InputField label="URL de la Institución" id="edu-inst-url" type="url" error={errors.institution_url} registration={register('institution_url')} placeholder="https://www.senati.edu.pe" />
          <InputField label="URL del Certificado" id="edu-cert-url" type="url" error={errors.certificate_url} registration={register('certificate_url')} placeholder="https://..." hint="Opcional" />
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

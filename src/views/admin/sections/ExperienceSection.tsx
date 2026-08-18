import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { experienceService } from '../../../services/api';
import type { AdminExperience, AdminExperiencePayload } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField, ToggleField } from '../../../components/admin/FormField';

// ── Form values ────────────────────────────────────────────────────────────
type ExperienceFormValues = Omit<AdminExperiencePayload, 'responsibilities'> & {
  responsibilities: { description: string; order: number }[];
};

// ── Main Component ────────────────────────────────────────────────────────
const ExperienceSection: React.FC = () => {
  const [rows, setRows] = useState<AdminExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminExperience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminExperience | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    defaultValues: { responsibilities: [{ description: '', order: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'responsibilities' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await experienceService.list());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIsCurrent(false);
    reset({ role: '', company: '', location: '', start_date: '', end_date: '', is_current: false, responsibilities: [{ description: '', order: 1 }] });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminExperience) => {
    setEditTarget(row);
    setIsCurrent(row.is_current);
    reset({
      role: row.role,
      company: row.company,
      location: row.location,
      start_date: row.start_date,
      end_date: row.end_date ?? '',
      is_current: row.is_current,
      responsibilities: row.responsibilities.map((r) => ({ description: r.description, order: r.order })),
    });
    setSlideOpen(true);
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    setSaving(true);
    try {
      const payload: AdminExperiencePayload = {
        ...data,
        is_current: isCurrent,
        end_date: isCurrent ? null : data.end_date || null,
        responsibilities: data.responsibilities.map((r, i) => ({ description: r.description, order: i + 1 })),
      };
      if (editTarget) {
        const updated = await experienceService.update(editTarget.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await experienceService.create(payload);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await experienceService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminExperience>[] = [
    { key: 'role', header: 'Rol / Cargo' },
    { key: 'company', header: 'Empresa' },
    { key: 'location', header: 'Ubicación', width: '130px' },
    {
      key: 'period', header: 'Período', width: '160px',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {row.start_date} → {row.is_current ? 'Presente' : (row.end_date ?? '—')}
        </span>
      ),
    },
    {
      key: 'is_current', header: 'Estado', width: '100px',
      render: (row) => (
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={row.is_current
            ? { background: 'rgba(74,222,128,0.1)', color: 'var(--color-console-green)', border: '1px solid rgba(74,222,128,0.2)' }
            : { background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-dim)', border: '1px solid rgba(255,255,255,0.07)' }
          }
        >
          {row.is_current ? 'Activo' : 'Finalizado'}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Experiencia Laboral</h2>
          <p className="admin-section-subtitle">{rows.length} registros — Gestiona tu historial profesional</p>
        </div>
        <button id="btn-experience-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva Experiencia
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No hay experiencias registradas. ¡Añade la primera!"
      />

      {/* Slide-over Form */}
      <SlideOver
        isOpen={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editTarget ? 'Editar Experiencia' : 'Nueva Experiencia'}
        subtitle={editTarget ? `${editTarget.role} en ${editTarget.company}` : 'Completa los datos del puesto'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <InputField label="Rol / Cargo" id="exp-role" required error={errors.role} registration={register('role', { required: 'Campo requerido' })} placeholder="Data Engineer Intern" />
          <InputField label="Empresa" id="exp-company" required error={errors.company} registration={register('company', { required: 'Campo requerido' })} placeholder="OPCOMP E.I.R.L." />
          <InputField label="Ubicación" id="exp-location" error={errors.location} registration={register('location')} placeholder="Lima, PE" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Fecha de Inicio" id="exp-start-date" type="month" required error={errors.start_date} registration={register('start_date', { required: 'Campo requerido' })} />
            {!isCurrent && (
              <InputField label="Fecha de Fin" id="exp-end-date" type="month" error={errors.end_date} registration={register('end_date')} />
            )}
          </div>

          <ToggleField
            id="exp-is-current"
            label="Trabajo actual"
            description="Activa si sigues trabajando aquí"
            checked={isCurrent}
            onChange={setIsCurrent}
          />

          {/* Dynamic Responsibilities */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
                Responsabilidades
              </label>
              <button
                type="button"
                onClick={() => append({ description: '', order: fields.length + 1 })}
                className="btn-icon text-xs"
              >
                <Plus size={12} /> Añadir
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <GripVertical size={16} className="mt-3 flex-shrink-0" style={{ color: 'var(--color-text-dim)' }} />
                  <textarea
                    className="input-dark flex-1 text-sm"
                    rows={2}
                    placeholder={`Responsabilidad ${index + 1}...`}
                    style={{ resize: 'none' }}
                    {...register(`responsibilities.${index}.description`, { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-2 p-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer' }}
                    disabled={fields.length === 1}
                    aria-label="Eliminar responsabilidad"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-experience-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="¿Eliminar experiencia?"
        message={`Se eliminará permanentemente "${deleteTarget?.role} en ${deleteTarget?.company}" junto con todas sus responsabilidades.`}
        loading={deleting}
      />
    </>
  );
};

export default ExperienceSection;

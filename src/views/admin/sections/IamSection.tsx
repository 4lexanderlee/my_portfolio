import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { iamService } from '../../../services/api';
import type { AdminIam, AdminIamPayload } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField } from '../../../components/admin/FormField';

const IamSection: React.FC = () => {
  const [rows, setRows] = useState<AdminIam[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminIam | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminIam | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminIamPayload>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await iamService.list();
      setRows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    reset({ occupation_name: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminIam) => {
    setEditTarget(row);
    reset({ occupation_name: row.occupation_name });
    setSlideOpen(true);
  };

  const onSubmit = async (data: AdminIamPayload) => {
    setSaving(true);
    try {
      if (editTarget) {
        const updated = await iamService.update(editTarget.iam_id, data);
        setRows((prev) => prev.map((r) => (r.iam_id === editTarget.iam_id ? updated : r)));
      } else {
        const created = await iamService.create(data);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await iamService.remove(deleteTarget.iam_id);
      setRows((prev) => prev.filter((r) => r.iam_id !== deleteTarget.iam_id));
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminIam>[] = [
    {
      key: 'occupation_name',
      header: 'Ocupación',
      render: (row) => (
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {row.occupation_name}
        </span>
      ),
    },
    {
      key: 'iam_id',
      header: 'ID',
      width: '300px',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {row.iam_id}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">IAM (Ocupaciones)</h2>
          <p className="admin-section-subtitle">
            {rows.length} registros — Gestiona las ocupaciones mostradas en el Hero.
          </p>
        </div>
        <button id="btn-iam-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva Ocupación
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No hay ocupaciones registradas."
      />

      {/* Slide-over Form */}
      <SlideOver
        isOpen={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editTarget ? 'Editar Ocupación' : 'Nueva Ocupación'}
        subtitle="Define el nombre del rol a mostrar en el Typewriter."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="admin-card">
            <InputField
              label="Nombre de Ocupación"
              id="iam-occupation"
              required
              error={errors.occupation_name}
              registration={register('occupation_name', { required: 'Campo requerido' })}
              placeholder="Ej. Software Engineer Student"
            />
          </div>

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button
              id="btn-iam-save"
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : (editTarget ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title="¿Eliminar ocupación?"
        message={`Se eliminará permanentemente "${deleteTarget?.occupation_name}".`}
        loading={deleting}
      />
    </>
  );
};

export default IamSection;

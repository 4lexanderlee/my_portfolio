import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, ExternalLink } from 'lucide-react';
import { certificationsService } from '../../../services/api';
import type { AdminCertification, AdminCertificationPayload } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField } from '../../../components/admin/FormField';

const CertificationsSection: React.FC = () => {
  const [rows, setRows] = useState<AdminCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCertification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCertification | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminCertificationPayload>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await certificationsService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    reset({ name: '', issuer: '', issued_date: '', expiry_date: '', credential_url: '', icon: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminCertification) => {
    setEditTarget(row);
    reset({ name: row.name, issuer: row.issuer, issued_date: row.issued_date, expiry_date: row.expiry_date ?? '', credential_url: row.credential_url ?? '', icon: row.icon ?? '' });
    setSlideOpen(true);
  };

  const onSubmit = async (data: AdminCertificationPayload) => {
    setSaving(true);
    try {
      if (editTarget) {
        const updated = await certificationsService.update(editTarget.id, data);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await certificationsService.create(data);
        setRows((prev) => [...prev, created]);
      }
      setSlideOpen(false);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await certificationsService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  const columns: Column<AdminCertification>[] = [
    {
      key: 'name', header: 'Certificación',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xl">{row.icon || '📜'}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.name}</span>
        </div>
      ),
    },
    { key: 'issuer', header: 'Institución Emisora' },
    {
      key: 'issued_date', header: 'Fecha', width: '120px',
      render: (row) => (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{row.issued_date}</span>
      ),
    },
    {
      key: 'credential_url', header: 'Credencial', width: '90px',
      render: (row) => row.credential_url
        ? <a href={row.credential_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-gold)' }}><ExternalLink size={13} /></a>
        : <span style={{ color: 'var(--color-text-dim)' }}>—</span>,
    },
  ];

  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Certificaciones</h2>
          <p className="admin-section-subtitle">{rows.length} certificaciones — Credenciales y logros</p>
        </div>
        <button id="btn-cert-create" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Nueva Certificación
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="Sin certificaciones registradas." />

      <SlideOver isOpen={slideOpen} onClose={() => setSlideOpen(false)} title={editTarget ? 'Editar Certificación' : 'Nueva Certificación'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <InputField label="Nombre de la Certificación" id="cert-name" required error={errors.name} registration={register('name', { required: 'Campo requerido' })} placeholder="Python Essentials 1 & 2" />
          <InputField label="Institución Emisora" id="cert-issuer" required error={errors.issuer} registration={register('issuer', { required: 'Campo requerido' })} placeholder="Cisco Networking Academy" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Fecha de Emisión" id="cert-issued" type="month" required error={errors.issued_date} registration={register('issued_date', { required: 'Campo requerido' })} />
            <InputField label="Fecha de Expiración" id="cert-expiry" type="month" error={errors.expiry_date} registration={register('expiry_date')} hint="Opcional" />
          </div>
          <InputField label="URL de la Credencial" id="cert-url" type="url" error={errors.credential_url} registration={register('credential_url')} placeholder="https://..." />
          <InputField label="Emoji / Ícono" id="cert-icon" error={errors.icon} registration={register('icon')} placeholder="🐍" hint="Emoji representativo de la certificación" />
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-cert-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} title="¿Eliminar certificación?" message={`Se eliminará "${deleteTarget?.name}" emitida por ${deleteTarget?.issuer}.`} loading={deleting} />
    </>
  );
};

export default CertificationsSection;

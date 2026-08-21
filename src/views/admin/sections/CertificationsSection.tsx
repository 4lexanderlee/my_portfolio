import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { certificationsService } from '../../../services/api';
import { uploadFile } from '../../../services/storage';
import type { AdminCertification, AdminCertificationPayload } from '../../../types';
import DataTable, { type Column } from '../../../components/admin/DataTable';
import SlideOver from '../../../components/admin/SlideOver';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import { InputField } from '../../../components/admin/FormField';

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
          <img src={currentUrl} alt="icono" className="w-8 h-8 object-contain rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span className="text-xs" style={{ color: 'var(--color-console-green)' }}>Imagen guardada</span>
        </div>
      )}
      {hint && <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{hint}</p>}
    </div>
  );
};

const CertificationsSection: React.FC = () => {
  const [rows, setRows] = useState<AdminCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCertification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCertification | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<AdminCertificationPayload, 'icon'>>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await certificationsService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIconFile(null);
    reset({ name: '', issuer: '', issued_date: '', credential_url: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminCertification) => {
    setEditTarget(row);
    setIconFile(null);
    reset({ name: row.name, issuer: row.issuer, issued_date: row.issued_date, credential_url: row.credential_url ?? '' });
    setSlideOpen(true);
  };

  const onSubmit = async (data: Omit<AdminCertificationPayload, 'icon'>) => {
    setSaving(true);
    try {
      // Subir icono PNG al bucket si se seleccionó uno
      let iconUrl = editTarget?.icon ?? '';
      if (iconFile) {
        iconUrl = await uploadFile(iconFile, 'cert-icons');
      }

      const payload: AdminCertificationPayload = { ...data, icon: iconUrl };

      if (editTarget) {
        const updated = await certificationsService.update(editTarget.id, payload);
        setRows((prev) => prev.map((r) => (r.id === editTarget.id ? updated : r)));
      } else {
        const created = await certificationsService.create(payload);
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
      await certificationsService.remove(deleteTarget.id);
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  // Helper: detect if icon is a URL or a text emoji
  const isIconUrl = (icon?: string) => icon?.startsWith('http');

  const columns: Column<AdminCertification>[] = [
    {
      key: 'name', header: 'Certificación',
      render: (row) => (
        <div className="flex items-center gap-2">
          {isIconUrl(row.icon) ? (
            <img src={row.icon} alt={row.name} className="w-7 h-7 object-contain rounded-lg flex-shrink-0" />
          ) : (
            <span className="text-xl">{row.icon || '📜'}</span>
          )}
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.name}</span>
        </div>
      ),
    },
    { key: 'issuer', header: 'Institución Emisora' },
    {
      key: 'issued_date', header: 'Fecha', width: '120px',
      render: (row) => <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{row.issued_date}</span>,
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
          <InputField label="Fecha de Emisión" id="cert-issued" type="date" required error={errors.issued_date} registration={register('issued_date', { required: 'Campo requerido' })} />
          <InputField label="URL de la Credencial" id="cert-url" type="url" required error={errors.credential_url} registration={register('credential_url', { required: 'El enlace de credencial es requerido' })} placeholder="https://..." />
          <FilePicker
            label="Ícono / Logo (PNG)"
            accept="image/png,image/webp,image/svg+xml"
            file={iconFile}
            currentUrl={isIconUrl(editTarget?.icon) ? editTarget?.icon : undefined}
            onChange={setIconFile}
            hint="Imagen PNG del logo o insignia de la certificación"
          />
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

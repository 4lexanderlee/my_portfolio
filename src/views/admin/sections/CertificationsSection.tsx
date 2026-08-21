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
  const [iconError, setIconError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<AdminCertificationPayload, 'icon_url'>>();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setRows(await certificationsService.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditTarget(null);
    setIconFile(null);
    setIconError(null);
    reset({ title: '', awarded_by: '', date_issue: '', reference_link: '' });
    setSlideOpen(true);
  };

  const openEdit = (row: AdminCertification) => {
    setEditTarget(row);
    setIconFile(null);
    setIconError(null);
    reset({ title: row.title, awarded_by: row.awarded_by, date_issue: row.date_issue ?? '', reference_link: row.reference_link ?? '' });
    setSlideOpen(true);
  };

  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img.width === 600 && img.height === 600);
      };
      img.onerror = () => resolve(false);
    });
  };

  const onSubmit = async (data: Omit<AdminCertificationPayload, 'icon_url'>) => {
    setIconError(null);
    
    if (iconFile) {
      const isValidSize = await validateImageSize(iconFile);
      if (!isValidSize) {
        setIconError('La imagen debe ser de exactamente 600x600 píxeles.');
        return;
      }
    }

    setSaving(true);
    try {
      // Subir icono PNG al bucket si se seleccionó uno
      let newIconUrl = editTarget?.icon_url ?? '';
      if (iconFile) {
        newIconUrl = await uploadFile(iconFile, 'cert-icons');
      }

      const payload: AdminCertificationPayload = { ...data, icon_url: newIconUrl };

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
      key: 'title', header: 'Certificación',
      render: (row) => (
        <div className="flex items-center gap-2">
          {isIconUrl(row.icon_url) ? (
            <img src={row.icon_url} alt={row.title} className="w-4 h-4 object-contain flex-shrink-0" />
          ) : (
            <span className="text-sm">{row.icon_url || '📜'}</span>
          )}
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{row.title}</span>
        </div>
      ),
    },
    { key: 'awarded_by', header: 'Institución Emisora' },
    {
      key: 'date_issue', header: 'Fecha', width: '120px',
      render: (row) => <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{row.date_issue}</span>,
    },
    {
      key: 'reference_link', header: 'Credencial', width: '90px',
      render: (row) => row.reference_link
        ? <a href={row.reference_link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-gold)' }}><ExternalLink size={13} /></a>
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
          <InputField label="Nombre de la Certificación" id="cert-title" required error={errors.title} registration={register('title', { required: 'Campo requerido' })} placeholder="Python Essentials 1 & 2" />
          <InputField label="Institución Emisora" id="cert-awarded_by" required error={errors.awarded_by} registration={register('awarded_by', { required: 'Campo requerido' })} placeholder="Cisco Networking Academy" />
          <InputField label="Fecha de Emisión" id="cert-date_issue" type="date" required error={errors.date_issue} registration={register('date_issue', { required: 'Campo requerido' })} />
          <InputField label="URL de la Credencial" id="cert-reference_link" type="url" required error={errors.reference_link} registration={register('reference_link', { required: 'El enlace de credencial es requerido' })} placeholder="https://..." />
          <div>
            <FilePicker
              label="Ícono / Logo (PNG) 600x600"
              accept="image/png"
              file={iconFile}
              currentUrl={isIconUrl(editTarget?.icon_url) ? editTarget?.icon_url : undefined}
              onChange={setIconFile}
              hint="Imagen PNG obligatoria de 600x600px del logo de la certificación."
            />
            {iconError && <p className="text-xs text-red-400 mt-1">{iconError}</p>}
          </div>
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={() => setSlideOpen(false)} className="btn-ghost flex-1">Cancelar</button>
            <button id="btn-cert-save" type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving && <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} title="¿Eliminar certificación?" message={`Se eliminará "${deleteTarget?.title}" emitida por ${deleteTarget?.awarded_by}.`} loading={deleting} />
    </>
  );
};

export default CertificationsSection;

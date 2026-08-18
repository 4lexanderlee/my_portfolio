import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function DataTable<T extends { id: string }>({
  columns,
  rows,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No hay registros todavía.',
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="inline-block w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
            {hasActions && <th style={{ width: '100px', textAlign: 'right' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-dim)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
                {hasActions && (
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="admin-action-btn"
                          aria-label="Editar"
                          title="Editar"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="admin-action-btn admin-action-btn--danger"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

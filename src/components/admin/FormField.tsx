import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  id: string;
  error?: FieldError;
  required?: boolean;
  hint?: string;
  children?: React.ReactNode;
}

/** Wrapper label + error — use children for custom inputs */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required,
  hint,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {label}
      {required && <span style={{ color: 'var(--color-accent-gold)' }}>*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{hint}</p>
    )}
    {error && (
      <p className="text-xs" style={{ color: '#f87171' }}>{error.message}</p>
    )}
  </div>
);

// ── Convenience Input connected to react-hook-form ───────────────────────
interface InputFieldProps extends FormFieldProps {
  registration: UseFormRegisterReturn;
  type?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label, id, error, required, hint, registration, type = 'text', placeholder,
}) => (
  <FormField label={label} id={id} error={error} required={required} hint={hint}>
    <input
      id={id}
      type={type}
      className="input-dark"
      placeholder={placeholder}
      style={error ? { borderColor: 'rgba(239,68,68,0.5)' } : undefined}
      {...registration}
    />
  </FormField>
);

// ── Textarea ─────────────────────────────────────────────────────────────
interface TextareaFieldProps extends FormFieldProps {
  registration: UseFormRegisterReturn;
  rows?: number;
  placeholder?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label, id, error, required, hint, registration, rows = 4, placeholder,
}) => (
  <FormField label={label} id={id} error={error} required={required} hint={hint}>
    <textarea
      id={id}
      rows={rows}
      className="input-dark"
      placeholder={placeholder}
      style={{
        resize: 'vertical',
        ...(error ? { borderColor: 'rgba(239,68,68,0.5)' } : {}),
      }}
      {...registration}
    />
  </FormField>
);

// ── Select ────────────────────────────────────────────────────────────────
interface SelectFieldProps extends FormFieldProps {
  registration: UseFormRegisterReturn;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label, id, error, required, hint, registration, options,
}) => (
  <FormField label={label} id={id} error={error} required={required} hint={hint}>
    <select
      id={id}
      className="input-dark"
      style={{
        cursor: 'pointer',
        ...(error ? { borderColor: 'rgba(239,68,68,0.5)' } : {}),
      }}
      {...registration}
    >
      <option value="">Seleccionar...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </FormField>
);

// ── Toggle Switch ─────────────────────────────────────────────────────────
interface ToggleFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label, id, checked, onChange, description,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {description && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>{description}</p>
      )}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200"
      style={{
        background: checked ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.1)',
        border: '1px solid',
        borderColor: checked ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.12)',
        cursor: 'pointer',
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
        style={{
          background: checked ? '#060810' : 'rgba(255,255,255,0.5)',
          transform: checked ? 'translateX(20px)' : 'translateX(0)',
        }}
      />
    </button>
  </div>
);

import React from 'react';

interface SectionTitleProps {
  label: string;          // small label above (e.g. "// EXPERIENCIA")
  title: string;          // main title
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  label,
  title,
  subtitle,
  align = 'left',
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-2 ${alignClass}`}>
      <span
        className="font-mono text-xs font-semibold tracking-[0.15em] uppercase"
        style={{ color: 'var(--color-accent-gold)', opacity: 0.8 }}
      >
        {label}
      </span>
      <h2
        className="text-2xl md:text-3xl font-bold leading-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm max-w-lg leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {subtitle}
        </p>
      )}
      <div className="section-line w-16 mt-1" />
    </div>
  );
};

export default SectionTitle;

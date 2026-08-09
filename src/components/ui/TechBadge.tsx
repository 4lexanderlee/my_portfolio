import React from 'react';

interface TechBadgeProps {
  label: string;
  size?: 'sm' | 'md';
}

const TechBadge: React.FC<TechBadgeProps> = ({ label, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'text-[0.65rem] px-2 py-0.5' : '';
  return (
    <span className={`tech-badge ${sizeClass}`}>
      {label}
    </span>
  );
};

export default TechBadge;

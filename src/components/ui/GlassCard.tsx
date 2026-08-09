import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  accentTop?: string; // CSS color for top border accent
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  accentTop,
  onClick,
  style,
}) => {
  const borderStyle: React.CSSProperties = accentTop
    ? { borderTop: `2px solid ${accentTop}` }
    : {};
  return (
    <div
      className={`glass ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
      style={{ ...borderStyle, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;

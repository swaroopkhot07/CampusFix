import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  accentColor = 'wood',
  onClick,
}) {
  const accentClasses = {
    wood: {
      border: 'border-l-4 border-amber-800',
      iconBg: 'bg-[#FAF3EC] text-[#6B3A1C]',
      valColor: 'text-[#2C180B]',
    },
    amber: {
      border: 'border-l-4 border-amber-600',
      iconBg: 'bg-[#FEF3C7] text-[#B45309]',
      valColor: 'text-[#92400E]',
    },
    blue: {
      border: 'border-l-4 border-blue-600',
      iconBg: 'bg-[#EFF6FF] text-[#1D4ED8]',
      valColor: 'text-[#1E40AF]',
    },
    green: {
      border: 'border-l-4 border-emerald-600',
      iconBg: 'bg-[#ECFDF5] text-[#047857]',
      valColor: 'text-[#065F46]',
    },
    red: {
      border: 'border-l-4 border-red-600',
      iconBg: 'bg-[#FEF2F2] text-[#B91C1C]',
      valColor: 'text-[#991B1B]',
    },
  }[accentColor] || {
    border: '',
    iconBg: 'bg-[#FAF3EC] text-[#6B3A1C]',
    valColor: 'text-[#2C180B]',
  };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--ivory-300)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
      }}
      className="stat-card"
    >
      <div>
        <p
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--charcoal-500)',
            marginBottom: '0.35rem',
          }}
        >
          {title}
        </p>
        <h3
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--wood-900)',
          }}
        >
          {value}
        </h3>
        {subtitle && (
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--charcoal-500)',
              marginTop: '0.35rem',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--wood-50)',
            color: 'var(--wood-700)',
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}

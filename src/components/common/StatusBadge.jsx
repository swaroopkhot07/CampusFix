import React from 'react';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const norm = (status || '').toLowerCase();

  let className = 'badge badge-pending';
  let Icon = Clock;
  let label = 'Pending';

  if (norm.includes('progress')) {
    className = 'badge badge-in-progress';
    Icon = Loader2;
    label = 'In Progress';
  } else if (norm.includes('resolved') || norm.includes('completed')) {
    className = 'badge badge-resolved';
    Icon = CheckCircle2;
    label = 'Resolved';
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`${className} ${size === 'sm' ? 'badge-sm' : ''}`}>
      <Icon size={iconSize} className={norm.includes('progress') ? 'animate-spin-slow' : ''} />
      <span>{label}</span>
    </span>
  );
}

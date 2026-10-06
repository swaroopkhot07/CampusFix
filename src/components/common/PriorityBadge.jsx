import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, Check } from 'lucide-react';

export default function PriorityBadge({ priority, size = 'md', showIcon = true }) {
  const norm = (priority || '').toLowerCase();

  let className = 'badge badge-medium';
  let Icon = AlertCircle;
  let label = 'Medium';

  if (norm === 'critical') {
    className = 'badge badge-critical';
    Icon = AlertOctagon;
    label = 'Critical';
  } else if (norm === 'high') {
    className = 'badge badge-high';
    Icon = AlertTriangle;
    label = 'High';
  } else if (norm === 'low') {
    className = 'badge badge-low';
    Icon = Check;
    label = 'Low';
  }

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`${className} ${size === 'sm' ? 'badge-sm' : ''}`}>
      {showIcon && <Icon size={iconSize} />}
      <span>{label}</span>
    </span>
  );
}

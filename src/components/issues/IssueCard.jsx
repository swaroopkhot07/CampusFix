import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { formatRelativeTime } from '../../utils/formatters';

export default function IssueCard({ issue, viewMode = 'student', onSelect }) {
  const detailLink = viewMode === 'admin' 
    ? `/admin/issues/${issue.id}` 
    : `/student/issues`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--ivory-300)',
        boxShadow: 'var(--shadow-xs)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'all var(--transition-fast)',
      }}
      className="card card-hoverable"
    >
      {/* Top Header: ID & Badges */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.65rem',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'var(--wood-700)',
              backgroundColor: 'var(--wood-50)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--wood-200)',
            }}
          >
            {issue.id}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PriorityBadge priority={issue.priority} size="sm" />
            <StatusBadge status={issue.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h4
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            color: 'var(--wood-900)',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
          }}
        >
          {issue.title}
        </h4>

        {/* Location snippet */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--charcoal-600)',
            marginBottom: '0.75rem',
          }}
        >
          <MapPin size={15} style={{ color: 'var(--wood-600)', flexShrink: 0 }} />
          <span>
            <strong>{issue.building}</strong>
            {issue.floor && ` • ${issue.floor}`}
            {issue.location && ` (${issue.location})`}
          </span>
        </div>

        {/* Description snippet */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--charcoal-600)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {issue.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div
        style={{
          borderTop: '1px solid var(--ivory-200)',
          paddingTop: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--charcoal-500)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} /> {formatRelativeTime(issue.createdAt)}
          </span>
          <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>
            {issue.category}
          </span>
        </div>

        {viewMode === 'admin' ? (
          <Link
            to={`/admin/issues/${issue.id}`}
            className="btn btn-sm btn-outline-wood"
            style={{ padding: '0.35rem 0.75rem' }}
          >
            Manage <ArrowRight size={14} />
          </Link>
        ) : onSelect ? (
          <button
            onClick={() => onSelect(issue)}
            className="btn btn-sm btn-secondary"
            style={{ padding: '0.35rem 0.75rem' }}
          >
            View Details <ArrowRight size={14} />
          </button>
        ) : (
          <Link
            to="/student/issues"
            className="btn btn-sm btn-secondary"
            style={{ padding: '0.35rem 0.75rem' }}
          >
            Details <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

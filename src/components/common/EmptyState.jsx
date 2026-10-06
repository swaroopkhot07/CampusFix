import React from 'react';
import { Inbox, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No issues found',
  description = 'There are no reported issues matching your current criteria.',
  actionText,
  actionLink,
  onActionClick,
  icon: Icon = Inbox,
}) {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px dashed var(--ivory-400)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--wood-50)',
          color: 'var(--wood-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon size={32} />
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--wood-900)',
          marginBottom: '0.4rem',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: 'var(--charcoal-600)',
          maxWidth: '460px',
          fontSize: '0.92rem',
          marginBottom: actionText ? '1.5rem' : '0',
        }}
      >
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          <PlusCircle size={18} />
          {actionText}
        </Link>
      )}

      {actionText && !actionLink && onActionClick && (
        <button onClick={onActionClick} className="btn btn-primary">
          <PlusCircle size={18} />
          {actionText}
        </button>
      )}
    </div>
  );
}

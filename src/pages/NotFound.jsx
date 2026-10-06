import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, User, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '4rem auto',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--wood-50)',
          color: 'var(--wood-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}
      >
        <HelpCircle size={38} />
      </div>

      <h1 style={{ fontSize: '2rem', color: 'var(--wood-900)', marginBottom: '0.5rem' }}>
        Page Not Found
      </h1>

      <p style={{ color: 'var(--charcoal-600)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The requested campus resource or URL could not be located.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Home
        </Link>
        <Link to="/student" className="btn btn-secondary">
          <User size={16} /> Student Portal
        </Link>
        <Link to="/admin" className="btn btn-secondary">
          <ShieldCheck size={16} /> Admin Portal
        </Link>
      </div>
    </div>
  );
}

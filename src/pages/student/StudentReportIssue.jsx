import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import IssueForm from '../../components/issues/IssueForm';

export default function StudentReportIssue() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Navigation header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/student"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--wood-700)',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Student Dashboard
        </Link>

        <h1 style={{ fontSize: '1.85rem', color: 'var(--wood-900)', marginBottom: '0.35rem' }}>
          Report a Campus Issue
        </h1>
        <p style={{ color: 'var(--charcoal-600)', fontSize: '0.95rem' }}>
          Help maintain a safe and functioning campus environment at Chhatrapati Shivaji Maharaj University.
        </p>
      </div>

      {/* Campus reporting guidelines notice */}
      <div
        style={{
          backgroundColor: 'var(--ivory-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--ivory-300)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start',
        }}
      >
        <Info size={20} style={{ color: 'var(--wood-700)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-700)', lineHeight: 1.5 }}>
          <strong>Reporting Guidelines:</strong> Provide accurate building names (e.g. <em>Rajgad, Pratapgad, Sindhudurg, Shivneri, or Pharmacy Block</em>) and floor levels. Critical hazards such as electrical sparks, live wires, or active flooding will be prioritized immediately by the automated priority engine.
        </div>
      </div>

      {/* Main Issue Form */}
      <IssueForm />
    </div>
  );
}

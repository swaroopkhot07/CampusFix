import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ListFilter, 
  Building2, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useIssues } from '../../context/IssueContext';
import StatCard from '../../components/common/StatCard';
import IssueTable from '../../components/issues/IssueTable';
import PriorityBadge from '../../components/common/PriorityBadge';
import { ACADEMIC_BUILDINGS, ISSUE_CATEGORIES } from '../../data/campusData';

export default function AdminDashboard() {
  const { issues, stats, updateIssueStatus } = useIssues();

  // Recent 5 issues for quick action
  const recentIssues = issues.slice(0, 5);

  // Critical issues needing urgent attention
  const criticalPending = issues.filter(
    (i) => i.priority === 'Critical' && i.status !== 'Resolved'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Executive Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--wood-900) 0%, var(--wood-800) 100%)',
          color: '#FFFFFF',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--gold-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(194, 146, 39, 0.25)',
                color: 'var(--gold-primary)',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid var(--gold-primary)',
              }}
            >
              Administrative Panel
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--ivory-300)' }}>
              Estate & Facilities Directorate
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800 }}>
            CSMU CampusFix Management Console
          </h1>
          <p style={{ color: 'var(--ivory-300)', fontSize: '0.92rem', maxWidth: '650px' }}>
            Central operations desk for triage, departmental assignment, and live maintenance workflows across Panvel campus.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/issues" className="btn btn-gold">
            <ListFilter size={18} />
            <span>Manage All Tickets ({stats.total})</span>
          </Link>
        </div>
      </div>

      {/* Critical Issues Alert (if any pending) */}
      {criticalPending.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--priority-critical-bg)',
            border: '2px solid var(--priority-critical-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertOctagon size={24} />
            </div>

            <div>
              <h4 style={{ color: '#991B1B', fontSize: '1.05rem', fontWeight: 700 }}>
                {criticalPending.length} Critical Safety Issue{criticalPending.length > 1 ? 's' : ''} Require Immediate Action
              </h4>
              <p style={{ color: '#7F1D1D', fontSize: '0.85rem' }}>
                Electrical hazard or life-safety risk reported. Technicians must be dispatched immediately.
              </p>
            </div>
          </div>

          <Link
            to={`/admin/issues/${criticalPending[0].id}`}
            className="btn btn-accent btn-sm"
          >
            Review Urgent Issue ({criticalPending[0].id}) →
          </Link>
        </div>
      )}

      {/* Primary KPI Stats Cards */}
      <section>
        <div className="stats-grid">
          <StatCard
            title="Total Issues"
            value={stats.total}
            icon={ListFilter}
            subtitle="Campus reports registered"
            accentColor="wood"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            subtitle="Require department allocation"
            accentColor="amber"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Loader2}
            subtitle="Field teams active"
            accentColor="blue"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            subtitle="Verified complete"
            accentColor="green"
          />
          <StatCard
            title="Critical Priority"
            value={stats.critical}
            icon={AlertOctagon}
            subtitle="Safety hazards"
            accentColor="red"
          />
        </div>
      </section>

      {/* Priority & Category Analytics Distribution Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Priority Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--wood-900)' }}>
              Priority Distribution
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)', fontWeight: 600 }}>
              Auto-Engine Output
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Critical', count: stats.byPriority.Critical, color: '#DC2626', bg: '#FEE2E2' },
              { label: 'High', count: stats.byPriority.High, color: '#EA580C', bg: '#FFEDD5' },
              { label: 'Medium', count: stats.byPriority.Medium, color: '#D97706', bg: '#FEF3C7' },
              { label: 'Low', count: stats.byPriority.Low, color: '#16A34A', bg: '#DCFCE7' },
            ].map((p) => {
              const pct = stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0;
              return (
                <div key={p.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--wood-900)' }}>{p.label} Priority</span>
                    <span style={{ color: 'var(--charcoal-600)', fontWeight: 700 }}>
                      {p.count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: 'var(--ivory-300)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: p.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Building Heatmap Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--wood-900)' }}>
              Building Activity Breakdown
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)', fontWeight: 600 }}>
              5 Academic Blocks
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ACADEMIC_BUILDINGS.map((b) => {
              const count = stats.byBuilding[b.name] || 0;
              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--ivory-50)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--ivory-300)',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--wood-900)', fontSize: '0.9rem' }}>{b.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--charcoal-500)' }}>
                      {b.name === 'Pharmacy Block' ? 'Pharmacy & Law College' : b.description}
                    </div>
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: count > 0 ? 'var(--wood-800)' : 'var(--charcoal-400)',
                      backgroundColor: count > 0 ? 'var(--wood-100)' : 'transparent',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {count} {count === 1 ? 'ticket' : 'tickets'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Issues Table with direct status transition actions */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--wood-900)' }}>
              Recent Incident Reports
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>
              Update ticket statuses directly using the dropdown or click Details for full management
            </p>
          </div>

          <Link to="/admin/issues" className="btn btn-sm btn-secondary">
            View All Issues Table ({issues.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <IssueTable
          issues={recentIssues}
          viewMode="admin"
          onStatusChange={(id, newStatus) => updateIssueStatus(id, newStatus)}
        />
      </section>
    </div>
  );
}

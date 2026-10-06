import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ListFilter, 
  Info,
  Calendar,
  Building2,
  ArrowRight,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import StatCard from '../../components/common/StatCard';
import IssueCard from '../../components/issues/IssueCard';
import Modal from '../../components/common/Modal';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { issues, stats, isLoadingIssues } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);

  // First name extraction e.g. "Swaroop" from "Swaroop Patil"
  const studentFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  // Recent 4 issues reported by this student
  const recentIssues = issues.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner Personalized to Logged-in Student */}
      <div
        className="card card-cream"
        style={{
          borderLeft: '5px solid var(--wood-700)',
          padding: '1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-category" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={13} /> CSMU Verified Student
              </span>
              {currentUser?.enrollmentNumber && (
                <span style={{ fontSize: '0.8rem', color: 'var(--wood-800)', fontWeight: 600 }}>
                  Roll: {currentUser.enrollmentNumber}
                </span>
              )}
              {currentUser?.department && (
                <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
                  • {currentUser.department} ({currentUser.year || 'Student'})
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.9rem', color: 'var(--wood-900)', fontWeight: 800 }}>
              Welcome, {studentFirstName}
            </h1>
            <p style={{ color: 'var(--charcoal-600)', maxWidth: '650px', fontSize: '0.95rem', marginTop: '2px' }}>
              Have you noticed an infrastructure defect or maintenance need on campus? Submit a report with photo evidence, and our automatic priority engine will route it directly to the estate maintenance department.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/student/report" className="btn btn-primary btn-lg">
              <PlusCircle size={20} />
              <span>Report an Issue</span>
            </Link>
            <Link to="/student/issues" className="btn btn-secondary btn-lg">
              <ListFilter size={20} />
              <span>My Reports ({stats.total})</span>
            </Link>
          </div>
        </div>

        {/* Maintenance notice */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--ivory-300)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: 'var(--charcoal-700)',
          }}
        >
          <Info size={18} style={{ color: 'var(--wood-600)', flexShrink: 0 }} />
          <span>
            <strong>CSMU Estate Operations:</strong> Routine inspections are active in <strong>Rajgad</strong>, <strong>Pratapgad</strong>, and <strong>Pharmacy Block</strong>. Critical safety issues are prioritized within 4 hours.
          </span>
        </div>
      </div>

      {/* Stats Counters: Real counts from student's issues */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--wood-900)' }}>
            My Issue Statistics
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
            Real-time status updates from estate staff
          </span>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Reports"
            value={stats.total}
            icon={ListFilter}
            subtitle="Issues submitted by you"
            accentColor="wood"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            subtitle="Awaiting administrative review"
            accentColor="amber"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Loader2}
            subtitle="Maintenance staff assigned"
            accentColor="blue"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            subtitle="Successfully rectified"
            accentColor="green"
          />
        </div>
      </section>

      {/* Recent Issues Section */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--wood-900)' }}>
              My Recent Reports
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>
              Track progress and official resolution remarks on your tickets
            </p>
          </div>

          {issues.length > 0 && (
            <Link to="/student/issues" className="btn btn-sm btn-secondary">
              View All My Reports ({issues.length}) <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {isLoadingIssues ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--wood-700)' }}>
            <Loader2 size={32} className="animate-spin-slow" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.9rem' }}>Loading your reports from backend...</p>
          </div>
        ) : issues.length === 0 ? (
          <EmptyState
            title="You haven't reported any issues yet"
            description="Notice any broken benches, projector faults, or plumbing leaks on campus? Click below to submit your first report."
            actionText="Report an Issue"
            actionLink="/student/report"
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {recentIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                viewMode="student"
                onSelect={(iss) => setSelectedIssue(iss)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal for Student */}
      {selectedIssue && (
        <Modal
          isOpen={Boolean(selectedIssue)}
          onClose={() => setSelectedIssue(null)}
          title={`Ticket Details: ${selectedIssue.id}`}
          footer={
            <button
              onClick={() => setSelectedIssue(null)}
              className="btn btn-primary"
            >
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PriorityBadge priority={selectedIssue.priority} />
                <StatusBadge status={selectedIssue.status} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
                {formatDateTime(selectedIssue.createdAt)}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--wood-900)' }}>
              {selectedIssue.title}
            </h3>

            <div
              style={{
                backgroundColor: 'var(--ivory-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ivory-300)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.88rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--charcoal-500)', display: 'block', fontSize: '0.78rem' }}>Building:</span>
                <strong>{selectedIssue.building}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--charcoal-500)', display: 'block', fontSize: '0.78rem' }}>Floor & Room:</span>
                <strong>{selectedIssue.floor || 'Ground'} {selectedIssue.location ? `• ${selectedIssue.location}` : ''}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--charcoal-500)', display: 'block', fontSize: '0.78rem' }}>Category:</span>
                <strong>{selectedIssue.category}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--charcoal-500)', display: 'block', fontSize: '0.78rem' }}>Assigned Dept:</span>
                <strong>{selectedIssue.assignedDepartment || 'Estate Office'}</strong>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', marginBottom: '0.35rem' }}>Description:</h5>
              <p style={{ fontSize: '0.92rem', color: 'var(--charcoal-800)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                {selectedIssue.description}
              </p>
            </div>

            {selectedIssue.priorityReason && (
              <div style={{ backgroundColor: 'var(--ivory-100)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--charcoal-700)' }}>
                <strong>Priority Reason:</strong> {selectedIssue.priorityReason}
              </div>
            )}

            {selectedIssue.image && (
              <div>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', marginBottom: '0.35rem' }}>Attached Photo:</h5>
                <img
                  src={selectedIssue.image}
                  alt="Issue photo"
                  style={{
                    maxHeight: '220px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--ivory-300)',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {selectedIssue.resolutionNotes && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h5 style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '0.25rem' }}>
                  Administration Resolution Remarks:
                </h5>
                <p style={{ fontSize: '0.88rem', color: '#14532D' }}>
                  {selectedIssue.resolutionNotes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

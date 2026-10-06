import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Save, 
  ShieldCheck,
  FileText,
  AlertOctagon,
  Sparkles,
  ExternalLink,
  MessageSquare,
  History
} from 'lucide-react';
import { useIssues } from '../../context/IssueContext';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';
import { DEPARTMENTS } from '../../data/campusData';

export default function AdminIssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIssueById, updateIssueStatus } = useIssues();

  const issue = getIssueById(id);

  const [currentStatus, setCurrentStatus] = useState(issue ? issue.status : 'Pending');
  const [resolutionNotes, setResolutionNotes] = useState(issue ? issue.resolutionNotes || '' : '');
  const [assignedDepartment, setAssignedDepartment] = useState(
    issue ? issue.assignedDepartment || DEPARTMENTS[0] : DEPARTMENTS[0]
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (issue) {
      setCurrentStatus(issue.status);
      setResolutionNotes(issue.resolutionNotes || '');
      setAssignedDepartment(issue.assignedDepartment || DEPARTMENTS[0]);
    }
  }, [issue]);

  if (!issue) {
    return (
      <div style={{ maxWidth: '650px', margin: '3rem auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--wood-900)', marginBottom: '0.75rem' }}>
          Issue Not Found
        </h2>
        <p style={{ color: 'var(--charcoal-600)', marginBottom: '1.5rem' }}>
          Could not locate ticket "{id}". It may have been deleted or reset.
        </p>
        <Link to="/admin/issues" className="btn btn-primary">
          Back to All Issues
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateIssueStatus(issue.id, currentStatus, resolutionNotes, assignedDepartment);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Link
          to="/admin/issues"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--wood-700)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to All Issues
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
            Ticket ID: <strong style={{ fontFamily: 'monospace' }}>{issue.id}</strong>
          </span>
          <Link
            to="/student/issues"
            className="btn btn-sm btn-secondary"
            title="Inspect how this issue looks in the Student portal"
          >
            Preview in Student Portal <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Main Issue Summary Card */}
      <div
        className="card"
        style={{
          border: '1.5px solid var(--ivory-300)',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--wood-50)',
                  color: 'var(--wood-800)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--wood-200)',
                }}
              >
                {issue.id}
              </span>
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
              <span className="badge badge-category">{issue.category}</span>
            </div>

            <h1 style={{ fontSize: '1.65rem', color: 'var(--wood-900)', fontWeight: 800, lineHeight: 1.25 }}>
              {issue.title}
            </h1>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-500)', textAlign: 'right' }}>
            <div>Submitted: <strong>{formatDateTime(issue.createdAt)}</strong></div>
            {issue.updatedAt && (
              <div style={{ marginTop: '3px' }}>
                Last Updated: <strong>{formatDateTime(issue.updatedAt)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Location & Reporter Breakdown Grid */}
        <div
          style={{
            backgroundColor: 'var(--ivory-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--ivory-300)',
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Location info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-800)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <MapPin size={16} /> Campus Location
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--wood-900)', fontWeight: 600 }}>
              {issue.building}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-600)' }}>
              {issue.floor ? `${issue.floor}` : 'Ground / Outdoor'}
              {issue.location ? ` • ${issue.location}` : ''}
            </div>
          </div>

          {/* Reporter info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-800)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <User size={16} /> Student Reporter
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--wood-900)', fontWeight: 600 }}>
              {issue.reporterName || issue.reporter || 'Student (CSMU)'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-600)' }}>
              {issue.reporterId ? `ID: ${issue.reporterId}` : ''} {issue.reporterEmail ? `• ${issue.reporterEmail}` : ''}
            </div>
          </div>

          {/* Department allocation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--wood-800)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Building2 size={16} /> Assigned Dept
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--wood-900)', fontWeight: 600 }}>
              {issue.assignedDepartment || 'Estate & Maintenance Office'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--charcoal-600)' }}>
              Panvel Estate Unit
            </div>
          </div>
        </div>

        {/* Detailed Issue Description */}
        <div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--wood-900)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={18} style={{ color: 'var(--wood-600)' }} /> Problem Description
          </h3>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--ivory-300)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              color: 'var(--charcoal-800)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {issue.description}
          </div>
        </div>

        {/* Uploaded Evidence Image */}
        {issue.image && (
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--wood-900)', marginBottom: '0.5rem' }}>
              Attached Photo Evidence
            </h3>
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--ivory-300)',
                maxWidth: '450px',
                backgroundColor: 'var(--ivory-50)',
              }}
            >
              <img
                src={issue.image}
                alt="Issue photograph"
                style={{ width: '100%', height: 'auto', maxHeight: '320px', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Admin Management & Resolution Control Card */}
      <form
        onSubmit={handleSave}
        className="card"
        style={{
          border: '2px solid var(--wood-300)',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--ivory-300)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} style={{ color: 'var(--gold-hover)' }} />
            <h2 style={{ fontSize: '1.3rem', color: 'var(--wood-900)', fontWeight: 800 }}>
              Administration Resolution Controls
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', marginTop: '2px' }}>
            Change status, dispatch departments, and append resolution remarks. Updates immediately sync to the student's dashboard.
          </p>
        </div>

        {/* Interactive Status Transition Selector */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.65rem' }}>
            <span>Update Ticket Status <span className="required">*</span></span>
            <span className="form-hint">Pending → In Progress → Resolved</span>
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {/* Pending Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('Pending')}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: currentStatus === 'Pending' ? '2px solid #C2410C' : '1.5px solid var(--ivory-300)',
                backgroundColor: currentStatus === 'Pending' ? 'var(--status-pending-bg)' : '#FFFFFF',
                color: currentStatus === 'Pending' ? 'var(--status-pending-text)' : 'var(--charcoal-700)',
                fontWeight: currentStatus === 'Pending' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Clock size={18} />
              <span>Pending Review</span>
            </button>

            {/* In Progress Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('In Progress')}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: currentStatus === 'In Progress' ? '2px solid #1D4ED8' : '1.5px solid var(--ivory-300)',
                backgroundColor: currentStatus === 'In Progress' ? 'var(--status-progress-bg)' : '#FFFFFF',
                color: currentStatus === 'In Progress' ? 'var(--status-progress-text)' : 'var(--charcoal-700)',
                fontWeight: currentStatus === 'In Progress' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Loader2 size={18} className={currentStatus === 'In Progress' ? 'animate-spin-slow' : ''} />
              <span>In Progress (Dispatched)</span>
            </button>

            {/* Resolved Button */}
            <button
              type="button"
              onClick={() => handleStatusChange('Resolved')}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: currentStatus === 'Resolved' ? '2px solid #15803D' : '1.5px solid var(--ivory-300)',
                backgroundColor: currentStatus === 'Resolved' ? 'var(--status-resolved-bg)' : '#FFFFFF',
                color: currentStatus === 'Resolved' ? 'var(--status-resolved-text)' : 'var(--charcoal-700)',
                fontWeight: currentStatus === 'Resolved' ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <CheckCircle2 size={18} />
              <span>Resolved (Verified)</span>
            </button>
          </div>
        </div>

        {/* Assigned Department Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="assigned-department">
            <span>Assigned Campus Department</span>
          </label>
          <select
            id="assigned-department"
            className="form-select"
            value={assignedDepartment}
            onChange={(e) => setAssignedDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Resolution Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="resolution-notes">
            <span>Resolution Notes & Official Remarks</span>
            <span className="form-hint">Visible to the student reporter</span>
          </label>
          <textarea
            id="resolution-notes"
            className="form-textarea"
            rows={3}
            placeholder="e.g. Electrician replaced the 16A modular breaker; projector bulb was replaced and HDMI switch recalibrated; pipeline repaired and corridor sanitized."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
          />
        </div>

        {/* Save CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            {isSaved && (
              <span style={{ color: '#15803D', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Status and notes successfully saved!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
          >
            <Save size={18} />
            <span>Save & Apply Updates</span>
          </button>
        </div>
      </form>

      {/* Activity Audit Log History */}
      {issue.activityLog && issue.activityLog.length > 0 && (
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--ivory-300)',
            padding: '1.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              color: 'var(--wood-900)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <History size={18} style={{ color: 'var(--wood-600)' }} /> Ticket Audit Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {issue.activityLog.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--ivory-50)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--ivory-300)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: 'var(--charcoal-800)' }}>{log.text}</div>
                <div style={{ color: 'var(--charcoal-500)', fontSize: '0.78rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                  {formatDateTime(log.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

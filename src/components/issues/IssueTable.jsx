import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ExternalLink, MapPin } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { formatRelativeTime } from '../../utils/formatters';

export default function IssueTable({
  issues,
  viewMode = 'admin',
  onSelectIssue,
  onStatusChange,
}) {
  return (
    <div className="table-responsive">
      <table className="table-custom">
        <thead>
          <tr>
            <th style={{ width: '110px' }}>Issue ID</th>
            <th>Title & Location</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              {/* ID */}
              <td>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: 'var(--wood-700)',
                    backgroundColor: 'var(--wood-50)',
                    padding: '3px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--wood-200)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {issue.id}
                </span>
              </td>

              {/* Title & Location */}
              <td>
                <div style={{ maxWidth: '340px' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: 'var(--wood-900)',
                      marginBottom: '2px',
                    }}
                  >
                    {issue.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--charcoal-500)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <MapPin size={12} style={{ color: 'var(--wood-600)' }} />
                    <span>
                      {issue.building}
                      {issue.floor ? ` • ${issue.floor}` : ''}
                      {issue.location ? ` (${issue.location})` : ''}
                    </span>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td>
                <span className="badge badge-category">{issue.category}</span>
              </td>

              {/* Priority */}
              <td>
                <PriorityBadge priority={issue.priority} size="sm" />
              </td>

              {/* Status */}
              <td>
                {viewMode === 'admin' && onStatusChange ? (
                  <select
                    className="form-select"
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--ivory-400)',
                      backgroundColor:
                        issue.status === 'Resolved'
                          ? 'var(--status-resolved-bg)'
                          : issue.status === 'In Progress'
                          ? 'var(--status-progress-bg)'
                          : 'var(--status-pending-bg)',
                      color:
                        issue.status === 'Resolved'
                          ? 'var(--status-resolved-text)'
                          : issue.status === 'In Progress'
                          ? 'var(--status-progress-text)'
                          : 'var(--status-pending-text)',
                      cursor: 'pointer',
                    }}
                    value={issue.status}
                    onChange={(e) => onStatusChange(issue.id, e.target.value)}
                    aria-label={`Change status for ${issue.id}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                ) : (
                  <StatusBadge status={issue.status} size="sm" />
                )}
              </td>

              {/* Submitted Time */}
              <td style={{ fontSize: '0.82rem', color: 'var(--charcoal-600)', whiteSpace: 'nowrap' }}>
                {formatRelativeTime(issue.createdAt)}
              </td>

              {/* Actions */}
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                {viewMode === 'admin' ? (
                  <Link
                    to={`/admin/issues/${issue.id}`}
                    className="btn btn-sm btn-outline-wood"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                  >
                    <ExternalLink size={13} />
                    <span>Details</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    className="btn btn-sm btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

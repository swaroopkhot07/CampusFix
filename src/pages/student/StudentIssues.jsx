import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutGrid, 
  List, 
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { useIssues } from '../../context/IssueContext';
import IssueCard from '../../components/issues/IssueCard';
import IssueTable from '../../components/issues/IssueTable';
import FilterBar from '../../components/issues/FilterBar';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

export default function StudentIssues() {
  const { issues } = useIssues();

  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search matches
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        issue.id.toLowerCase().includes(searchLower) ||
        issue.title.toLowerCase().includes(searchLower) ||
        issue.building.toLowerCase().includes(searchLower) ||
        (issue.location && issue.location.toLowerCase().includes(searchLower));

      // Status
      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;

      // Priority
      const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;

      // Category
      const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;

      // Building
      const matchesBuilding = buildingFilter === 'All' || issue.building === buildingFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesBuilding;
    });
  }, [issues, search, statusFilter, priorityFilter, categoryFilter, buildingFilter]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setBuildingFilter('All');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link
            to="/student"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--wood-700)',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--wood-900)' }}>
            My Reported Issues
          </h1>
          <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem' }}>
            Track resolution status, assigned maintenance units, and administrative updates
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--ivory-400)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'cards' ? 'var(--wood-700)' : 'transparent',
                color: viewMode === 'cards' ? '#FFFFFF' : 'var(--charcoal-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <LayoutGrid size={15} /> Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'table' ? 'var(--wood-700)' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : 'var(--charcoal-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <List size={15} /> Table
            </button>
          </div>

          <Link to="/student/report" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        buildingFilter={buildingFilter}
        onBuildingChange={setBuildingFilter}
        onReset={handleResetFilters}
      />

      {/* Issues Display */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          title="No issues found"
          description="There are no reported issues matching your current search or filter criteria."
          actionText="Clear Filters"
          onActionClick={handleResetFilters}
        />
      ) : viewMode === 'cards' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              viewMode="student"
              onSelect={(iss) => setSelectedIssue(iss)}
            />
          ))}
        </div>
      ) : (
        <IssueTable
          issues={filteredIssues}
          viewMode="student"
          onSelectIssue={(iss) => setSelectedIssue(iss)}
        />
      )}

      {/* Modal for viewing detail */}
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
              Done
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PriorityBadge priority={selectedIssue.priority} />
                <StatusBadge status={selectedIssue.status} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
                {formatDateTime(selectedIssue.createdAt)}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--wood-900)' }}>
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
                <span style={{ color: 'var(--charcoal-500)', display: 'block', fontSize: '0.78rem' }}>Assigned Department:</span>
                <strong>{selectedIssue.assignedDepartment || 'Estate Office'}</strong>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', marginBottom: '0.35rem' }}>Description:</h5>
              <p style={{ fontSize: '0.92rem', color: 'var(--charcoal-800)', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                {selectedIssue.description}
              </p>
            </div>

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

            {/* Resolution updates */}
            {selectedIssue.resolutionNotes && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h5 style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '0.25rem' }}>
                  Administration Resolution Notes:
                </h5>
                <p style={{ fontSize: '0.88rem', color: '#14532D' }}>
                  {selectedIssue.resolutionNotes}
                </p>
              </div>
            )}

            {/* Activity Log */}
            {selectedIssue.activityLog && selectedIssue.activityLog.length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', marginBottom: '0.5rem' }}>Activity History:</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedIssue.activityLog.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--charcoal-700)',
                        backgroundColor: 'var(--ivory-100)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{log.text}</span>
                      <span style={{ color: 'var(--charcoal-500)', fontSize: '0.75rem' }}>
                        {formatDateTime(log.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

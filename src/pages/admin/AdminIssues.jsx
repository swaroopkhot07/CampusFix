import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  Download,
  RotateCcw,
  Layers,
  Filter
} from 'lucide-react';
import { useIssues } from '../../context/IssueContext';
import FilterBar from '../../components/issues/FilterBar';
import IssueTable from '../../components/issues/IssueTable';
import IssueCard from '../../components/issues/IssueCard';
import EmptyState from '../../components/common/EmptyState';

export default function AdminIssues() {
  const { issues, updateIssueStatus } = useIssues();

  const [viewMode, setViewMode] = useState('table'); // default table for admin efficiency
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [buildingFilter, setBuildingFilter] = useState('All');

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        issue.id.toLowerCase().includes(searchLower) ||
        issue.title.toLowerCase().includes(searchLower) ||
        issue.building.toLowerCase().includes(searchLower) ||
        (issue.reporter && issue.reporter.toLowerCase().includes(searchLower)) ||
        (issue.location && issue.location.toLowerCase().includes(searchLower));

      const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
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
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link
            to="/admin"
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
            <ArrowLeft size={16} /> Back to Admin Overview
          </Link>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--wood-900)' }}>
            All Campus Issue Reports
          </h1>
          <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem' }}>
            Showing {filteredIssues.length} of {issues.length} total issues logged across CSMU Panvel
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
              <List size={15} /> Table View
            </button>
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
              <LayoutGrid size={15} /> Card Grid
            </button>
          </div>

          <Link to="/student/report" className="btn btn-secondary">
            <PlusCircle size={18} />
            <span>Simulate New Report</span>
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

      {/* Issues Table or Cards */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          title="No matching campus issues"
          description="Try broadening your search term or clearing one of the active filters."
          actionText="Reset Filters"
          onActionClick={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <IssueTable
          issues={filteredIssues}
          viewMode="admin"
          onStatusChange={(id, newStatus) => updateIssueStatus(id, newStatus)}
        />
      ) : (
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
              viewMode="admin"
            />
          ))}
        </div>
      )}
    </div>
  );
}

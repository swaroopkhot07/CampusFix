import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ISSUE_CATEGORIES, ALL_LOCATIONS } from '../../data/campusData';

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  buildingFilter,
  onBuildingChange,
  onReset,
  showPriorityFilter = true,
  showBuildingFilter = true,
}) {
  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    buildingFilter !== 'All';

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--ivory-300)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', gridColumn: 'span 1' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--charcoal-400)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by ID, title, room..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        {showPriorityFilter && (
          <div>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
              aria-label="Filter by Priority"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="All">All Categories</option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Building Filter */}
        {showBuildingFilter && (
          <div>
            <select
              className="form-select"
              value={buildingFilter}
              onChange={(e) => onBuildingChange(e.target.value)}
              aria-label="Filter by Location"
            >
              <option value="All">All Buildings / Zones</option>
              {ALL_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filter summary & reset button */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--ivory-200)',
            paddingTop: '0.75rem',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: 'var(--charcoal-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} /> Filter criteria active
          </span>
          <button
            onClick={onReset}
            className="btn btn-sm btn-secondary"
            style={{ color: 'var(--maroon-primary)', borderColor: 'var(--maroon-border)' }}
          >
            <X size={14} /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

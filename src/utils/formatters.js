/**
 * Formatting utilities for CampusFix
 */

/**
 * Generates an issue ID in format: CF-2026-XXX
 * @param {number} sequenceNumber
 * @returns {string}
 */
export function generateIssueId(sequenceNumber) {
  const padded = String(sequenceNumber).padStart(3, '0');
  const year = new Date().getFullYear();
  return `CF-${year}-${padded}`;
}

/**
 * Formats ISO date string to readable Indian standard / campus format
 * e.g., "05 Oct 2026, 02:45 PM"
 * @param {string} isoString
 * @returns {string}
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return isoString;
  }
}

/**
 * Formats relative time (e.g. "2 hours ago", "Yesterday")
 * @param {string} isoString
 * @returns {string}
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const date = new Date(isoString);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDateTime(isoString).split(',')[0];
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const IssueContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export function IssueProvider({ children }) {
  const { token, currentUser, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Fetch issues from backend
   */
  const fetchIssues = useCallback(async () => {
    if (!token) {
      setIssues([]);
      return;
    }

    setIsLoadingIssues(true);
    try {
      const res = await fetch(`${API_BASE}/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.issues)) {
          setIssues(data.issues);
        }
      } else {
        console.warn('Failed to fetch issues from backend:', res.status);
      }
    } catch (err) {
      console.error('Error fetching issues from backend:', err);
    } finally {
      setIsLoadingIssues(false);
    }
  }, [token]);

  // Refetch when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchIssues();
    } else {
      setIssues([]);
    }
  }, [isAuthenticated, fetchIssues]);

  /**
   * Report a new issue via backend
   */
  const addIssue = async (formData) => {
    if (!token) {
      addToast('Please login to report an issue.', 'error');
      throw new Error('Not authenticated');
    }

    try {
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit issue report.');
      }

      const created = data.issue;
      setIssues(prev => [created, ...prev]);
      addToast(`Ticket ${created.id} registered successfully!`, 'success');
      return created;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  /**
   * Update issue status / notes via backend (admin)
   */
  const updateIssueStatus = async (id, newStatus, resolutionNotes = '', assignedDepartment = '') => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/issues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          resolutionNotes,
          assignedDepartment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update issue status.');
      }

      const updated = data.issue;
      setIssues(prev => prev.map(i => (i.id === id ? updated : i)));
      addToast(`Ticket ${id} status updated to "${newStatus}"`, 'info');
      return updated;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  /**
   * Delete issue via backend (admin)
   */
  const deleteIssue = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/issues/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete issue.');
      }

      setIssues(prev => prev.filter(i => i.id !== id));
      addToast(`Ticket ${id} deleted successfully.`, 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const getIssueById = (id) => {
    return issues.find(i => i.id === id) || null;
  };

  // Aggregated dashboard statistics
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    critical: issues.filter(i => i.priority === 'Critical' && i.status !== 'Resolved').length,
    byPriority: {
      Critical: issues.filter(i => i.priority === 'Critical').length,
      High: issues.filter(i => i.priority === 'High').length,
      Medium: issues.filter(i => i.priority === 'Medium').length,
      Low: issues.filter(i => i.priority === 'Low').length,
    },
    byCategory: issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {}),
    byBuilding: issues.reduce((acc, i) => {
      acc[i.building] = (acc[i.building] || 0) + 1;
      return acc;
    }, {}),
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        stats,
        isLoadingIssues,
        fetchIssues,
        addIssue,
        updateIssueStatus,
        deleteIssue,
        getIssueById,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}

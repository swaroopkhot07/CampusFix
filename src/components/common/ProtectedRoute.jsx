import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--wood-700)',
        }}
      >
        <Loader2 size={36} className="animate-spin-slow" />
        <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>Verifying CSMU portal authorization...</p>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRole && currentUser?.role !== requiredRole) {
    // If a student tries to access admin, redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
}

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages (Public)
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Student Pages (Protected: student)
import StudentDashboard from './pages/student/StudentDashboard';
import StudentReportIssue from './pages/student/StudentReportIssue';
import StudentIssues from './pages/student/StudentIssues';

// Admin Pages (Protected: admin)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIssues from './pages/admin/AdminIssues';
import AdminIssueDetail from './pages/admin/AdminIssueDetail';

// 404
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
          <div className="app-container">
            {/* Header */}
            <Navbar />

            {/* Main Content Area */}
            <main className="main-content">
              <Routes>
                {/* Public Authentication & Welcome Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />

                {/* Protected Student Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/report"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentReportIssue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/issues"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <StudentIssues />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/issues"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminIssues />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/issues/:id"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminIssueDetail />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Toast Alerts */}
            <Toast />

            {/* University Footer */}
            <footer
              style={{
                backgroundColor: 'var(--wood-900)',
                color: 'var(--ivory-200)',
                borderTop: '2px solid var(--gold-primary)',
                marginTop: 'auto',
                padding: '2.5rem 1.5rem 1.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div
                style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem',
                }}
              >
                {/* Col 1: University Identity */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: 800, fontSize: '1.15rem' }}>
                      CampusFix
                    </span>
                    <span style={{ opacity: 0.6 }}>•</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gold-light)' }}>CSMU Panvel</span>
                  </div>
                  <p style={{ color: 'var(--ivory-400)', lineHeight: 1.5, fontSize: '0.82rem' }}>
                    Chhatrapati Shivaji Maharaj University, Near Shedung Toll Plaza, Old Mumbai-Pune Highway, Panvel, Navi Mumbai, Maharashtra 410206.
                  </p>
                </div>

                {/* Col 2: Fast Navigation */}
                <div>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Quick Portals
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <li><Link to="/" style={{ color: 'var(--ivory-200)' }}>Student Login</Link></li>
                    <li><Link to="/register" style={{ color: 'var(--ivory-200)' }}>Create Student Account</Link></li>
                    <li><Link to="/admin-login" style={{ color: 'var(--ivory-200)' }}>Administration Access</Link></li>
                  </ul>
                </div>

                {/* Col 3: Academic Blocks */}
                <div>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Campus Academic Wings
                  </h4>
                  <p style={{ color: 'var(--ivory-400)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    Rajgad • Pratapgad • Sindhudurg • Shivneri • Pharmacy Block & Law College
                  </p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                    Estate Helpdesk: hodvikaskumar@csmu.ac.in
                  </div>
                </div>
              </div>

              <div
                style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--ivory-500)',
                }}
              >
                <div>
                  © {new Date().getFullYear()} Chhatrapati Shivaji Maharaj University (CSMU). All rights reserved.
                </div>
                <div>
                  Full-Stack Hackathon Project • Live JWT Authentication & JSON DB
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}

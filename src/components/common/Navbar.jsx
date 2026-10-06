import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  PlusCircle, 
  ListFilter, 
  LayoutDashboard, 
  Menu, 
  X,
  LogOut,
  LogIn,
  UserPlus,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { stats } = useIssues();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/', { replace: true });
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2px solid var(--ivory-300)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Top University Identity Bar */}
      <div
        style={{
          backgroundColor: 'var(--wood-900)',
          color: 'var(--ivory-100)',
          padding: '0.35rem 1.5rem',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(194, 146, 39, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
            CSMU PANVEL
          </span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ opacity: 0.9 }}>Chhatrapati Shivaji Maharaj University Official Portal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>
            Campus Helpdesk: <strong style={{ color: 'var(--gold-primary)' }}>+91 22 2748 1000</strong>
          </span>

          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem' }}>
              <span
                style={{
                  backgroundColor: isAdmin ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.15)',
                  color: isAdmin ? 'var(--wood-900)' : '#FFFFFF',
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {isAdmin ? 'ADMIN' : 'STUDENT'}
              </span>
              <span style={{ color: 'var(--ivory-200)', fontWeight: 600 }}>
                {currentUser?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* University Brand Area */}
        <Link
          to={isAuthenticated ? (isAdmin ? '/admin' : '/student') : '/'}
          onClick={closeMobile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textDecoration: 'none',
          }}
        >
          {/* Official Emblem Frame Area */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--wood-800) 0%, var(--wood-900) 100%)',
              border: '2px solid var(--gold-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
              boxShadow: 'var(--shadow-xs)',
              flexShrink: 0,
            }}
          >
            <Building2 size={20} />
            <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              CSMU
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--wood-900)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Campus<span style={{ color: 'var(--gold-hover)' }}>Fix</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--wood-50)',
                  color: 'var(--wood-700)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--wood-200)',
                  textTransform: 'uppercase',
                }}
              >
                Panvel
              </span>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--charcoal-500)',
                fontWeight: 500,
                marginTop: '1px',
              }}
            >
              Smart Campus Issue Reporting & Resolution System
            </p>
          </div>
        </Link>

        {/* Center / Navigation Links for Desktop */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="nav-desktop"
        >
          {!isAuthenticated ? (
            /* Logged-out navigation */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/"
                className={`btn btn-sm ${location.pathname === '/' ? 'btn-secondary' : ''}`}
                style={{ color: 'var(--wood-900)', fontWeight: 600 }}
              >
                <LogIn size={15} /> Student Login
              </Link>
              <Link
                to="/register"
                className={`btn btn-sm ${location.pathname === '/register' ? 'btn-secondary' : ''}`}
                style={{ color: 'var(--charcoal-700)' }}
              >
                <UserPlus size={15} /> Register
              </Link>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--ivory-400)', margin: '0 0.25rem' }} />
              <Link
                to="/admin-login"
                className="btn btn-sm btn-gold"
                style={{ padding: '0.35rem 0.85rem' }}
              >
                <KeyRound size={14} /> Admin Access
              </Link>
            </div>
          ) : isStudent ? (
            /* Student-only navigation */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link
                to="/student"
                className={`btn btn-sm ${location.pathname === '/student' ? 'btn-secondary' : ''}`}
                style={{
                  color: location.pathname === '/student' ? 'var(--wood-900)' : 'var(--charcoal-600)',
                  fontWeight: location.pathname === '/student' ? 700 : 500,
                }}
              >
                <User size={15} /> Student Dashboard
              </Link>
              <Link
                to="/student/issues"
                className={`btn btn-sm ${location.pathname === '/student/issues' ? 'btn-secondary' : ''}`}
                style={{
                  color: location.pathname === '/student/issues' ? 'var(--wood-900)' : 'var(--charcoal-600)',
                  fontWeight: location.pathname === '/student/issues' ? 700 : 500,
                }}
              >
                <ListFilter size={15} /> My Reports
              </Link>
              <Link
                to="/student/report"
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={15} /> Report an Issue
              </Link>
            </div>
          ) : (
            /* Admin-only navigation */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link
                to="/admin"
                className={`btn btn-sm ${location.pathname === '/admin' ? 'btn-secondary' : ''}`}
                style={{
                  color: location.pathname === '/admin' ? 'var(--wood-900)' : 'var(--charcoal-600)',
                  fontWeight: location.pathname === '/admin' ? 700 : 500,
                }}
              >
                <ShieldCheck size={15} /> Admin Portal
              </Link>
              <Link
                to="/admin/issues"
                className={`btn btn-sm ${location.pathname.startsWith('/admin/issues') ? 'btn-secondary' : ''}`}
                style={{
                  color: location.pathname.startsWith('/admin/issues') ? 'var(--wood-900)' : 'var(--charcoal-600)',
                  fontWeight: location.pathname.startsWith('/admin/issues') ? 700 : 500,
                }}
              >
                <LayoutDashboard size={15} /> All Campus Issues
                {stats.critical > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--maroon-primary)',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '1px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      marginLeft: '4px',
                    }}
                    title={`${stats.critical} Critical safety issues`}
                  >
                    {stats.critical}
                  </span>
                )}
              </Link>
            </div>
          )}
        </nav>

        {/* Right CTA Actions: Logout if authenticated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-secondary"
              title="Sign out of CampusFix"
              style={{
                color: 'var(--maroon-primary)',
                borderColor: 'var(--maroon-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--wood-900)',
              display: 'none',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--ivory-300)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={closeMobile} className="btn btn-primary">
                <LogIn size={16} /> Student Login
              </Link>
              <Link to="/register" onClick={closeMobile} className="btn btn-secondary">
                <UserPlus size={16} /> Create Student Account
              </Link>
              <Link to="/admin-login" onClick={closeMobile} className="btn btn-gold">
                <KeyRound size={16} /> Administration Access
              </Link>
            </>
          ) : isStudent ? (
            <>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--wood-700)' }}>
                STUDENT: {currentUser?.name}
              </div>
              <Link to="/student" onClick={closeMobile} className="btn btn-secondary">
                <User size={16} /> Student Dashboard
              </Link>
              <Link to="/student/issues" onClick={closeMobile} className="btn btn-secondary">
                <ListFilter size={16} /> My Reports
              </Link>
              <Link to="/student/report" onClick={closeMobile} className="btn btn-primary">
                <PlusCircle size={16} /> Report an Issue
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--maroon-primary)' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--wood-700)' }}>
                ADMINISTRATOR: {currentUser?.name}
              </div>
              <Link to="/admin" onClick={closeMobile} className="btn btn-secondary">
                <ShieldCheck size={16} /> Admin Portal
              </Link>
              <Link to="/admin/issues" onClick={closeMobile} className="btn btn-secondary">
                <LayoutDashboard size={16} /> All Campus Issues
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--maroon-primary)' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS for mobile menu */}
      <style>{`
        @media (max-width: 900px) {
          .nav-desktop {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

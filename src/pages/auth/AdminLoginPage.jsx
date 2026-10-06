import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Building2,
  Sparkles,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, isAdmin, isStudent } = useAuth();

  const [identifier, setIdentifier] = useState('hodvikaskumar');
  const [password, setPassword] = useState('CSMU@HOD');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Administrator username or email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);
    const res = await adminLogin({
      identifier: identifier.trim(),
      password,
    });
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.error || 'Invalid administrative credentials.');
    }
  };

  const fillDemoAdmin = () => {
    setIdentifier('hodvikaskumar');
    setPassword('CSMU@HOD');
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '1.5rem auto 3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Back to Student Login link */}
      <div>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--wood-700)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Student Login
        </Link>
      </div>

      {/* University Identity Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '58px',
            height: '58px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--wood-900) 0%, var(--wood-800) 100%)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <ShieldCheck size={28} />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--gold-light)',
            border: '1px solid var(--gold-border)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--wood-900)',
            marginBottom: '0.65rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Sparkles size={12} style={{ color: 'var(--gold-hover)' }} />
          CSMU Panvel • Administration Directorate
        </div>

        <h1 style={{ fontSize: '1.9rem', color: 'var(--wood-900)', fontWeight: 800 }}>
          Estate & Facilities Console
        </h1>
        <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Authorized administrator login for university facilities management
        </p>
      </div>

      {/* Admin Card */}
      <div
        className="card"
        style={{
          border: '2px solid var(--gold-border)',
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--ivory-200)', paddingBottom: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--gold-light)',
              color: 'var(--wood-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyRound size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--wood-900)', fontWeight: 700 }}>
              Administrator Authentication
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-500)' }}>
              Restricted to HOD, Dean, and Estate Maintenance Engineers
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--priority-critical-bg)',
              border: '1px solid var(--priority-critical-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'var(--priority-critical-text)',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Username or Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="admin-identifier">
              <span>Username or Email <span className="required">*</span></span>
              <span className="form-hint">hodvikaskumar or email</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--charcoal-400)',
                }}
              />
              <input
                id="admin-identifier"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="hodvikaskumar or hodvikaskumar@csmu.ac.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '0.25rem' }}>
            <label className="form-label" htmlFor="admin-password">
              <span>Password <span className="required">*</span></span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--charcoal-400)',
                }}
              />
              <input
                id="admin-password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold btn-lg"
            style={{ width: '100%', marginTop: '0.25rem' }}
          >
            <span>{isSubmitting ? 'Verifying Admin Clearance...' : 'Access Admin Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Pill */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--ivory-200)',
            backgroundColor: 'var(--ivory-50)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontSize: '0.82rem',
            color: 'var(--charcoal-700)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <strong style={{ color: 'var(--wood-900)' }}>Seeded Admin Credentials:</strong>
            <button
              type="button"
              onClick={fillDemoAdmin}
              style={{
                fontSize: '0.75rem',
                color: 'var(--wood-700)',
                fontWeight: 700,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Fill In Fields
            </button>
          </div>
          <div>• Username: <code>hodvikaskumar</code></div>
          <div>• Password: <code>CSMU@HOD</code></div>
          <div style={{ fontSize: '0.74rem', color: 'var(--charcoal-500)', marginTop: '4px' }}>
            Account assigned to Vikas Kumar (HOD Estate & Facilities).
          </div>
        </div>
      </div>
    </div>
  );
}

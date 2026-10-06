import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  CreditCard, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin, isStudent } = useAuth();

  const [email, setEmail] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isStudent) {
        navigate('/student', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isStudent, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() && !enrollmentNumber.trim()) {
      setError('Please provide your college email or enrollment number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({
      email: email.trim() || undefined,
      enrollmentNumber: enrollmentNumber.trim() || undefined,
      password,
    });

    setIsSubmitting(false);

    if (res.success) {
      const target = location.state?.from?.pathname || '/student';
      navigate(target, { replace: true });
    } else {
      setError(res.error || 'Invalid credentials. Please verify your details.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '1.5rem auto 3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* University Identity Header */}
      <div style={{ textAlign: 'center' }}>
        {/* Emblem */}
        <div
          style={{
            width: '62px',
            height: '62px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--wood-800) 0%, var(--wood-900) 100%)',
            border: '2.5px solid var(--gold-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            boxShadow: 'var(--shadow-md)',
            margin: '0 auto 1rem',
          }}
        >
          <Building2 size={26} />
          <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em' }}>
            CSMU
          </span>
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
          Chhatrapati Shivaji Maharaj University • Panvel
        </div>

        <h1
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: 'var(--wood-900)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Campus<span style={{ color: 'var(--gold-hover)' }}>Fix</span>
        </h1>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--charcoal-600)',
            marginTop: '0.35rem',
          }}
        >
          Smart Campus Issue Reporting & Resolution System
        </p>
      </div>

      {/* Main Student Login Card */}
      <div
        className="card"
        style={{
          border: '1.5px solid var(--ivory-300)',
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--ivory-200)', paddingBottom: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--wood-50)',
              color: 'var(--wood-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--wood-900)', fontWeight: 700 }}>
              Student Portal Login
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>
              Sign in with your CSMU credentials to track and report issues
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* College Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="student-email">
              <span>College Email</span>
              <span className="form-hint">e.g. name@csmu.ac.in</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
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
                id="student-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="your.name@csmu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Or Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.1rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--ivory-300)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--charcoal-500)', fontWeight: 600, textTransform: 'uppercase' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--ivory-300)' }} />
          </div>

          {/* Enrollment Number */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="student-enrollment">
              <span>Enrollment Number</span>
              <span className="form-hint">e.g. CSMU2024881</span>
            </label>
            <div style={{ position: 'relative' }}>
              <CreditCard
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
                id="student-enrollment"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="CSMU2024881"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label" htmlFor="student-password">
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
                id="student-password"
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
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.25rem' }}
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Login as Student'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Create Student Account Link */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--ivory-200)',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--charcoal-600)',
          }}
        >
          <span>New to CampusFix? </span>
          <Link
            to="/register"
            style={{
              fontWeight: 700,
              color: 'var(--wood-700)',
              textDecoration: 'underline',
            }}
          >
            Create Student Account
          </Link>
        </div>
      </div>

      {/* Administration Access - Dedicated Secondary Portal Entry */}
      <div
        className="card card-cream"
        style={{
          border: '1.5px dashed var(--gold-border)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--gold-light)',
              color: 'var(--wood-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--wood-900)' }}>
              Administration Access
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--charcoal-600)' }}>
              Estate & Facilities Directorate login portal
            </div>
          </div>
        </div>

        <Link
          to="/admin-login"
          className="btn btn-sm btn-gold"
          style={{ padding: '0.45rem 1rem' }}
        >
          Admin Login →
        </Link>
      </div>

      {/* Demo Credentials Helper Pill for Hackathon Judges */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--ivory-300)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--charcoal-600)',
          lineHeight: 1.45,
        }}
      >
        <strong style={{ color: 'var(--wood-800)' }}>Hackathon Quick Demo:</strong>
        <div style={{ marginTop: '3px' }}>
          • Student demo: Register a new account via <Link to="/register" style={{ fontWeight: 600, color: 'var(--wood-700)' }}>Create Student Account</Link>.
        </div>
        <div>
          • Admin demo: Use <Link to="/admin-login" style={{ fontWeight: 600, color: 'var(--wood-700)' }}>Admin Login</Link> with <code>hodvikaskumar</code> / <code>CSMU@HOD</code>.
        </div>
      </div>
    </div>
  );
}

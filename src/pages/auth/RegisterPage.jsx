import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  Mail, 
  CreditCard, 
  Lock, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNumber: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('College email is required.');
      return;
    }
    if (!formData.enrollmentNumber.trim()) {
      setError('Enrollment number is required.');
      return;
    }
    if (!formData.password) {
      setError('Password is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await register(formData);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/student', { replace: true });
    } else {
      setError(res.error || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '1.5rem auto 3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Back to Login link */}
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
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>

      {/* University Identity Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--wood-800) 0%, var(--wood-900) 100%)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            margin: '0 auto 0.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Building2 size={24} />
          <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>CSMU</span>
        </div>

        <h1 style={{ fontSize: '1.9rem', color: 'var(--wood-900)', fontWeight: 800 }}>
          Create Student Account
        </h1>
        <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Join the Chhatrapati Shivaji Maharaj University issue resolution network
        </p>
      </div>

      {/* Registration Card */}
      <div
        className="card"
        style={{
          border: '1.5px solid var(--ivory-300)',
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
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
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="reg-name">
              <span>Full Name <span className="required">*</span></span>
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
                id="reg-name"
                name="name"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="e.g. Swaroop Patil"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email & Enrollment Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Email */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-email">
                <span>College Email <span className="required">*</span></span>
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
                  id="reg-email"
                  name="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="student@csmu.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Enrollment Number */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-enrollment">
                <span>Enrollment Number <span className="required">*</span></span>
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
                  id="reg-enrollment"
                  name="enrollmentNumber"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="CSMU2024881"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Department & Year Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Department */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-dept">
                <span>Faculty / Department</span>
              </label>
              <select
                id="reg-dept"
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Mechanical & Civil Engineering">Mechanical & Civil Engineering</option>
                <option value="Pharmacy">Faculty of Pharmacy</option>
                <option value="Law (Law College)">Faculty of Law (Law College)</option>
                <option value="Management & Commerce">Commerce & Management</option>
                <option value="Science & Humanities">Science & Humanities</option>
                <option value="Architecture & Planning">Architecture & Planning</option>
              </select>
            </div>

            {/* Year */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-year">
                <span>Year of Study</span>
              </label>
              <select
                id="reg-year"
                name="year"
                className="form-select"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Post Graduate">Post Graduate / Masters</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-password">
                <span>Password <span className="required">*</span></span>
                <span className="form-hint">Min 6 chars</span>
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
                  id="reg-password"
                  name="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="reg-confirm">
                <span>Confirm Password <span className="required">*</span></span>
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
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Creating Student Account...' : 'Register as Student'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

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
          <span>Already have an account? </span>
          <Link
            to="/"
            style={{
              fontWeight: 700,
              color: 'var(--wood-700)',
              textDecoration: 'underline',
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

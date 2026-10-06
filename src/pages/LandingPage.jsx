import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  PlusCircle, 
  Zap, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowRight,
  Sparkles,
  School,
  AlertCircle
} from 'lucide-react';
import { useIssues } from '../context/IssueContext';
import { ACADEMIC_BUILDINGS } from '../data/campusData';

export default function LandingPage() {
  const { stats, issues } = useIssues();

  const resolutionRate = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--wood-900) 0%, var(--wood-800) 50%, var(--wood-700) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2.5rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid var(--gold-border)',
        }}
      >
        {/* Subtle decorative background watermarks */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <Building2 size={360} />
        </div>

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(194, 146, 39, 0.2)',
              border: '1px solid var(--gold-primary)',
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--gold-primary)',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={14} /> Chhatrapati Shivaji Maharaj University • Panvel
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Campus<span style={{ color: 'var(--gold-primary)' }}>Fix</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--gold-light)',
              marginBottom: '1rem',
            }}
          >
            Smart Campus Issue Reporting & Resolution System
          </p>

          <p
            style={{
              fontSize: '1.02rem',
              color: 'var(--ivory-200)',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
              maxWidth: '680px',
            }}
          >
            A unified, transparent portal for students and administration of CSMU Panvel. 
            Report broken classroom equipment, water leakages, electrical hazards, or hostel issues with exact campus locations and watch them get resolved in real time.
          </p>

          {/* Direct CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/student/report" className="btn btn-gold btn-lg">
              <PlusCircle size={20} />
              <span>Report an Issue Now</span>
            </Link>

            <Link to="/student" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#FFFFFF' }}>
              <User size={20} />
              <span>Student Portal</span>
            </Link>

            <Link
              to="/admin"
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <ShieldCheck size={20} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Campus Health Metrics */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--wood-900)' }}>Campus Operations Health</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-600)' }}>
              Live metrics across CSMU academic blocks and facilities
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--wood-700)', fontWeight: 600 }}>
            Panvel Campus Live Feed
          </span>
        </div>

        <div className="stats-grid">
          <div className="card card-cream" style={{ borderLeft: '4px solid var(--wood-600)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', fontWeight: 600 }}>TOTAL ISSUES LOGGED</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--wood-900)', margin: '0.3rem 0' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>All verified reports</div>
          </div>

          <div className="card card-cream" style={{ borderLeft: '4px solid #D97706' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', fontWeight: 600 }}>PENDING ACTION</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D97706', margin: '0.3rem 0' }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>Awaiting maintenance dispatch</div>
          </div>

          <div className="card card-cream" style={{ borderLeft: '4px solid #2563EB' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', fontWeight: 600 }}>IN PROGRESS</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563EB', margin: '0.3rem 0' }}>
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>Technician assigned on campus</div>
          </div>

          <div className="card card-cream" style={{ borderLeft: '4px solid #16A34A' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)', fontWeight: 600 }}>RESOLVED & VERIFIED</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16A34A', margin: '0.3rem 0' }}>
              {stats.resolved}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-500)' }}>{resolutionRate}% resolution efficiency</div>
          </div>
        </div>
      </section>

      {/* Dual Portal Gateway Section */}
      <section>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--wood-900)', marginBottom: '0.5rem' }}>
            Choose Your Experience
          </h2>
          <p style={{ color: 'var(--charcoal-600)', fontSize: '0.95rem' }}>
            CampusFix provides dedicated workflows tailored specifically for students and university facilities staff.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {/* Student Experience Card */}
          <div
            className="card"
            style={{
              border: '2px solid var(--ivory-300)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--wood-50)',
                  color: 'var(--wood-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--wood-200)',
                }}
              >
                <User size={28} />
              </div>

              <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                For CSMU Students
              </span>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--wood-900)', margin: '0.4rem 0 0.75rem' }}>
                Student Issue Portal
              </h3>

              <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                Encountered a non-working projector, faulty Wi-Fi router, damaged bench, or water leak? Submit reports in under 60 seconds with automatic priority analysis and track live progress.
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--charcoal-700)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--wood-600)' }} />
                  <span>Interactive building & floor selector (Ground to 4th Floor)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--charcoal-700)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--wood-600)' }} />
                  <span>Automatic deterministic priority calculation</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--charcoal-700)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--wood-600)' }} />
                  <span>Live ticket tracking and resolution updates</span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/student" className="btn btn-primary" style={{ flex: 1 }}>
                Open Student Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Admin Experience Card */}
          <div
            className="card"
            style={{
              border: '2px solid var(--ivory-300)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2rem',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--gold-light)',
                  color: 'var(--wood-900)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--gold-border)',
                }}
              >
                <ShieldCheck size={28} />
              </div>

              <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                For Estate & Facilities Staff
              </span>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--wood-900)', margin: '0.4rem 0 0.75rem' }}>
                Administration Control Panel
              </h3>

              <p style={{ color: 'var(--charcoal-600)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                Complete administrative overview of all reported campus defects. Filter by severity, assign maintenance units, log status changes, and resolve bottlenecks across university blocks.
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--charcoal-700)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span>Immediate alerts for Critical electrical & safety hazards</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--gold-primary)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span>Multi-criteria filtering: Building, Category, Priority, Status</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--gold-primary)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span>Audit logging & direct status updates to student portals</span>
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/admin" className="btn btn-gold" style={{ flex: 1 }}>
                Open Admin Panel <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Monitored Campus Buildings Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--ivory-300)',
          padding: '2rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--wood-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <School size={22} style={{ color: 'var(--wood-700)' }} />
            Monitored Academic Blocks & Facilities
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--charcoal-600)' }}>
            Each five-story academic building (Ground to 4th Floor) is mapped for precise location pinpointing:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {ACADEMIC_BUILDINGS.map((b) => {
            const count = issues.filter(i => i.building === b.name).length;
            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--ivory-50)',
                  border: '1px solid var(--ivory-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--wood-900)', fontSize: '0.98rem' }}>{b.name}</strong>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: count > 0 ? 'var(--wood-100)' : 'var(--ivory-200)',
                      color: 'var(--wood-800)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {count} {count === 1 ? 'ticket' : 'tickets'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-600)' }}>{b.description}</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--wood-600)', fontWeight: 600 }}>
                  5 Floors (Ground to 4th)
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

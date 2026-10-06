import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Info,
  ShieldAlert,
  Send,
  Zap,
  UserCheck
} from 'lucide-react';
import { 
  ACADEMIC_BUILDINGS, 
  OTHER_LOCATIONS, 
  ALL_LOCATIONS, 
  FLOORS, 
  ISSUE_CATEGORIES, 
  COMMON_ISSUE_PRESETS 
} from '../../data/campusData';
import { calculatePriority } from '../../utils/priorityEngine';
import PriorityBadge from '../common/PriorityBadge';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';

// Sample demonstration images for students/judges who don't have a local file ready
const DEMO_PHOTOS = [
  {
    name: 'Classroom Projector',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Corridor Pipeline Leak',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electrical Switchboard',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  },
];

export default function IssueForm({ onSuccess }) {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const { currentUser, isAdmin } = useAuth();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [building, setBuilding] = useState('Rajgad');
  const [floor, setFloor] = useState('Ground Floor');
  const [specificLocation, setSpecificLocation] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  // Check if current building has multiple floors
  const selectedLocationObj = useMemo(() => {
    return ALL_LOCATIONS.find((l) => l.name === building) || { hasFloors: true };
  }, [building]);

  // Real-time automatic deterministic priority calculation
  const priorityCalculation = useMemo(() => {
    return calculatePriority(category, title, description);
  }, [category, title, description]);

  // Handle Quick Presets
  const applyPreset = (preset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    if (!description) {
      setDescription(`Observed ${preset.title.toLowerCase()} requiring facilities attention.`);
    }
  };

  // Handle Local Image Upload (FileReader to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide an issue title.');
      return;
    }
    if (!description.trim()) {
      alert('Please describe the problem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newIssue = await addIssue({
        title,
        description,
        category,
        building,
        floor: selectedLocationObj.hasFloors ? floor : null,
        location: specificLocation,
        image: imagePreview,
      });

      setCreatedIssue(newIssue);
      if (onSuccess) onSuccess(newIssue);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submission Success Confirmation Screen
  if (createdIssue) {
    return (
      <div
        className="card"
        style={{
          maxWidth: '680px',
          margin: '2rem auto',
          padding: '2.5rem',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--ivory-300)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--wood-700)',
            backgroundColor: 'var(--wood-50)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--wood-200)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Ticket Logged Successfully
        </span>

        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: 'var(--wood-900)',
            margin: '0.75rem 0 0.5rem',
          }}
        >
          Issue Reported to Administration
        </h2>

        <p style={{ color: 'var(--charcoal-600)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          Your ticket has been registered in the centralized CSMU Estate and Maintenance ledger.
        </p>

        {/* Issue Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--ivory-100)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--ivory-300)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>Reference ID:</span>
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--wood-800)',
              }}
            >
              {createdIssue.id}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>Title:</span>
            <span style={{ fontWeight: 600, color: 'var(--charcoal-900)' }}>{createdIssue.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>Campus Location:</span>
            <span style={{ color: 'var(--charcoal-800)', fontSize: '0.9rem' }}>
              {createdIssue.building} {createdIssue.floor ? `• ${createdIssue.floor}` : ''}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>Auto-Priority:</span>
            <PriorityBadge priority={createdIssue.priority} size="sm" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--charcoal-600)' }}>Status:</span>
            <span className="badge badge-pending">Pending Admin Review</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setCreatedIssue(null);
              setTitle('');
              setDescription('');
              setSpecificLocation('');
              setImagePreview(null);
            }}
            className="btn btn-secondary"
          >
            Report Another Issue
          </button>

          <button
            onClick={() => navigate('/student/issues')}
            className="btn btn-primary"
          >
            View in My Reports
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate(`/admin/issues/${createdIssue.id}`)}
              className="btn btn-gold"
              title="Open issue details in administration console"
            >
              Open in Admin Panel →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Quick Presets Section */}
      <div
        style={{
          backgroundColor: 'var(--ivory-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--ivory-300)',
          padding: '1rem 1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            color: 'var(--wood-800)',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--gold-hover)' }} />
          <span>Quick Issue Presets (Click to autofill common CSMU issues):</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {COMMON_ISSUE_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.title}
              onClick={() => applyPreset(preset)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--ivory-400)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                color: 'var(--wood-900)',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--wood-500)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ivory-400)')}
            >
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Fields Grid */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--ivory-300)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--wood-900)',
            borderBottom: '1px solid var(--ivory-200)',
            paddingBottom: '0.75rem',
          }}
        >
          Issue Details
        </h3>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-title">
            <span>Issue Title <span className="required">*</span></span>
            <span className="form-hint">Brief summary of the issue</span>
          </label>
          <input
            id="issue-title"
            type="text"
            className="form-input"
            placeholder="e.g., Projector not turning on in Rajgad 204, or Major water leakage in Pratapgad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Location Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="issue-category">
              <span>Category <span className="required">*</span></span>
            </label>
            <select
              id="issue-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Building */}
          <div className="form-group">
            <label className="form-label" htmlFor="issue-building">
              <span>Building / Campus Zone <span className="required">*</span></span>
            </label>
            <select
              id="issue-building"
              className="form-select"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              required
            >
              <optgroup label="Academic Buildings">
                {ACADEMIC_BUILDINGS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.name === 'Pharmacy Block' ? 'Pharmacy & Law College' : b.description})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other Campus Locations & Sports">
                {OTHER_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Floor (conditional) & Specific Location */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {selectedLocationObj.hasFloors ? (
            <div className="form-group">
              <label className="form-label" htmlFor="issue-floor">
                <span>Floor Level <span className="required">*</span></span>
              </label>
              <select
                id="issue-floor"
                className="form-select"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              >
                {FLOORS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">
                <span>Floor Level</span>
              </label>
              <input
                type="text"
                className="form-input"
                value="N/A (Outdoor / Ground Level)"
                disabled
                style={{ backgroundColor: 'var(--ivory-200)', color: 'var(--charcoal-500)' }}
              />
            </div>
          )}

          {/* Specific Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="issue-specific-location">
              <span>Specific Location / Room No.</span>
              <span className="form-hint">Room 204, Wing B, Washroom 3, etc.</span>
            </label>
            <input
              id="issue-specific-location"
              type="text"
              className="form-input"
              placeholder="e.g. Lecture Hall 204, Faculty Cabin 12, Court B"
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="issue-description">
            <span>Issue Description <span className="required">*</span></span>
            <span className="form-hint">Describe what is broken, malfunctioning, or hazardous</span>
          </label>
          <textarea
            id="issue-description"
            className="form-textarea"
            rows={4}
            placeholder="Provide clear details (e.g., HDMI port shows 'no signal', water is overflowing from valve, sparks came from the outer switchboard...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Deterministic Real-time Priority Engine Banner */}
        <div
          style={{
            backgroundColor:
              priorityCalculation.priority === 'Critical'
                ? 'var(--priority-critical-bg)'
                : priorityCalculation.priority === 'High'
                ? 'var(--priority-high-bg)'
                : priorityCalculation.priority === 'Medium'
                ? 'var(--priority-medium-bg)'
                : 'var(--priority-low-bg)',
            border: `1.5px solid ${
              priorityCalculation.priority === 'Critical'
                ? 'var(--priority-critical-border)'
                : priorityCalculation.priority === 'High'
                ? 'var(--priority-high-border)'
                : priorityCalculation.priority === 'Medium'
                ? 'var(--priority-medium-border)'
                : 'var(--priority-low-border)'
            }`,
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div style={{ marginTop: '2px' }}>
            <Zap size={22} style={{ color: 'var(--wood-700)' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wood-900)' }}>
                Automated System Priority:
              </span>
              <PriorityBadge priority={priorityCalculation.priority} />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal-700)', lineHeight: 1.4 }}>
              {priorityCalculation.reason}
            </p>

            <span
              style={{
                display: 'inline-block',
                marginTop: '0.35rem',
                fontSize: '0.72rem',
                color: 'var(--charcoal-500)',
                fontStyle: 'italic',
              }}
            >
              * Deterministically calculated by CSMU CampusFix priority algorithm based on category and description keywords.
            </span>
          </div>
        </div>

        {/* Optional Image Upload & Previews */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">
            <span>Optional Photo Upload</span>
            <span className="form-hint">PNG, JPG up to 5MB</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="issue-file-upload"
          />

          {!imagePreview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: '2px dashed var(--ivory-400)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--ivory-50)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <Upload size={28} style={{ color: 'var(--wood-600)', margin: '0 auto 0.5rem' }} />
                <p style={{ fontWeight: 600, color: 'var(--wood-900)', fontSize: '0.9rem' }}>
                  Click to choose a photo or drag and drop
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-500)' }}>
                  Attach a picture of the damaged infrastructure for faster dispatch
                </p>
              </div>

              {/* Demo Photos Quick Select for easy testing */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--charcoal-500)' }}>
                  Demo sample photos:
                </span>
                {DEMO_PHOTOS.map((demo) => (
                  <button
                    key={demo.name}
                    type="button"
                    onClick={() => setImagePreview(demo.url)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                  >
                    <ImageIcon size={12} /> {demo.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--ivory-400)',
                maxWidth: '280px',
              }}
            >
              <img
                src={imagePreview}
                alt="Issue preview"
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Reporter Information (Authenticated Student Identity) */}
        <div
          style={{
            backgroundColor: 'var(--ivory-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--ivory-300)',
            padding: '1.25rem',
            marginTop: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <UserCheck size={18} style={{ color: 'var(--wood-700)' }} />
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--wood-900)',
              }}
            >
              Authenticated Student Reporter
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--charcoal-500)', display: 'block' }}>Student Name</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--wood-900)' }}>
                {currentUser?.name || 'Student (CSMU)'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--charcoal-500)', display: 'block' }}>Enrollment / Roll ID</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--wood-900)' }}>
                {currentUser?.enrollmentNumber || 'CSMU-STUDENT'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--charcoal-500)', display: 'block' }}>Campus Email</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--wood-900)' }}>
                {currentUser?.email || 'student@csmu.ac.in'}
              </strong>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
          >
            <Send size={18} />
            <span>{isSubmitting ? 'Registering Ticket...' : 'Submit Issue Report'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

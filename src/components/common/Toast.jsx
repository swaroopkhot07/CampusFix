import React from 'react';
import { useIssues } from '../../context/IssueContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useIssues();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        let Icon = Info;
        let toastClass = 'toast toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          toastClass = 'toast toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertTriangle;
          toastClass = 'toast toast-error';
        }

        return (
          <div key={toast.id} className={toastClass}>
            <Icon size={18} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.88rem' }}>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'inherit',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

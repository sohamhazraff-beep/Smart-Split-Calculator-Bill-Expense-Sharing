import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fadeIn" onClick={onClose}>
      <div
        className="modal-content confirm-modal-box animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-icon-box">
          <AlertCircle size={32} className="text-danger" />
        </div>

        <h3 className="confirm-title">{title || 'Reset Calculator?'}</h3>
        <p className="confirm-message">
          {message ||
            'Are you sure you want to reset all bill amounts, participants, and payments? This action cannot be undone.'}
        </p>

        <div className="confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-icon-text"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <RotateCcw size={16} />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

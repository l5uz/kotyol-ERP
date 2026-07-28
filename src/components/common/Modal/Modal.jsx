import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : 'modal-md';

  return createPortal(
    <div
      className="modal fade show erp-glass"
      tabIndex="-1"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-dialog ${sizeClass}`} role="document">
        <div className="modal-content animate-fade-in shadow-lg border">
          <div className="modal-header py-3 px-3">
            <h5 className="modal-title fs-6 fw-semibold mb-0">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body p-3">{children}</div>
          {footer && (
            <div className="modal-footer py-2 px-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

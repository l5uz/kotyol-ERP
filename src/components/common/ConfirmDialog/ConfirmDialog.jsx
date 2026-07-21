import React from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { ERP_ICONS } from '@/shared/icons';

export const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="d-flex align-items-center gap-3">
        <i
          className={`bi ${isDanger ? ERP_ICONS.EXCLAMATION : ERP_ICONS.INFO} ${
            isDanger ? 'text-danger' : 'text-primary'
          }`}
          style={{ fontSize: '2rem' }}
        ></i>
        <p className="mb-0 fs-7 text-main">{message}</p>
      </div>
    </Modal>
  );
};

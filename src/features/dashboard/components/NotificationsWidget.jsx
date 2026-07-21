import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { MOCK_NOTIFICATIONS } from '../constants/dashboard.mock';
import { ERP_ICONS } from '@/shared/icons';

export const NotificationsWidget = () => {
  return (
    <Card title="Bildirishnomalar va Ogohlantirishlar">
      <div className="d-flex flex-column gap-2">
        {MOCK_NOTIFICATIONS.map((n) => {
          const bgClass =
            n.type === 'danger'
              ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25'
              : n.type === 'warning'
                ? 'bg-warning bg-opacity-15 text-warning-emphasis border-warning border-opacity-25'
                : n.type === 'success'
                  ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25'
                  : 'bg-info bg-opacity-10 text-info border-info border-opacity-25';

          const icon =
            n.type === 'danger' || n.type === 'warning'
              ? ERP_ICONS.EXCLAMATION
              : n.type === 'success'
                ? ERP_ICONS.CHECK
                : ERP_ICONS.INFO;

          return (
            <div key={n.id} className={`p-3 rounded-3 border ${bgClass}`}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${icon} fs-6`}></i>
                  <strong className="fs-7">{n.title}</strong>
                </div>
                <small className="fs-8 opacity-75">{n.time}</small>
              </div>
              <p className="fs-8 mb-0 opacity-90">{n.message}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

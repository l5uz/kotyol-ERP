import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { MOCK_SYSTEM_STATUS } from '../constants/dashboard.mock';

export const SystemStatusWidget = () => {
  return (
    <Card title="Tizim va API Operatsion Holati">
      <div className="d-flex flex-column gap-3">
        {MOCK_SYSTEM_STATUS.map((item, idx) => (
          <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-2 border-custom bg-body-custom">
            <div className="d-flex align-items-center gap-2">
              <span className="p-1 bg-success rounded-circle"></span>
              <span className="fs-7 fw-medium text-main">{item.name}</span>
            </div>
            <div className="text-end">
              <span className="fs-8 badge bg-success bg-opacity-10 text-success fw-semibold">{item.status}</span>
              {item.latency !== '0ms' && <small className="d-block text-muted-custom fs-8">{item.latency}</small>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

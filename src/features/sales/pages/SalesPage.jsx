import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ERP_ICONS } from '@/shared/icons';

const mockSales = [
  { id: 'SO-4401', client: 'Global Heavy Machinery Corp', total: '$48,500.00', date: '2026-07-18', status: 'APPROVED' },
  { id: 'SO-4402', client: 'Atlas Pipeline Solutions', total: '$12,300.00', date: '2026-07-19', status: 'PENDING' },
  { id: 'SO-4403', client: 'Apex Power Grid LLC', total: '$94,000.00', date: '2026-07-20', status: 'PROCESSING' },
];

const columns = [
  { header: 'Shartnoma #', accessor: 'id' },
  { header: 'Buyurtmachi kompaniya', accessor: 'client' },
  { header: 'Buyurtma qiymati', accessor: 'total' },
  { header: 'Tuzilgan sana', accessor: 'date' },
  { header: 'Hujjat holati', cell: (row) => <StatusBadge status={row.status} /> },
];

export const SalesPage = () => {
  return (
    <div className="sales-module animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Sotuv va tijorat buyurtmalari</h4>
          <p className="text-muted-custom fs-7 mb-0">Shartnomalar, tijorat takliflari va yetkazib berish nazorati</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className={`bi ${ERP_ICONS.PLUS} me-1`}></i> Tijorat taklifi yaratish
        </button>
      </div>

      <Card title="So'nggi shartnomalar va sotuv shartnomalari">
        <Table columns={columns} data={mockSales} emptyTitle="Ma'lumot topilmadi" emptyDescription="Shartnomalar mavjud emas." />
      </Card>
    </div>
  );
};

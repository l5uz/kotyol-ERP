import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ERP_ICONS } from '@/shared/icons';

const mockTx = [
  { id: 'TX-901', category: 'Xomashyo xaridi to\'lovi', amount: '-$14,200.00', date: '2026-07-19', status: 'COMPLETED' },
  { id: 'TX-902', category: 'Shartnoma to\'lovi tushumi', amount: '+$48,500.00', date: '2026-07-20', status: 'COMPLETED' },
  { id: 'TX-903', category: 'Ishlab chiqarish sexi oylik maoshi', amount: '-$32,000.00', date: '2026-07-20', status: 'SCHEDULED' },
];

const columns = [
  { header: 'Voucher #', accessor: 'id' },
  { header: 'Moliyaviy operatsiya', accessor: 'category' },
  { header: 'Summa', accessor: 'amount' },
  { header: 'O\'tkazilgan sana', accessor: 'date' },
  { header: 'Buxgalteriya holati', cell: (row) => <StatusBadge status={row.status} /> },
];

export const FinancePage = () => {
  return (
    <div className="finance-module animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Moliyaviy hisob va balans</h4>
          <p className="text-muted-custom fs-7 mb-0">Bosh daftar, ish haqi hisobi va hisob-kitoblar</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className={`bi ${ERP_ICONS.PLUS} me-1`}></i> Jurnal o'tkazmasini kiritish
        </button>
      </div>

      <Card title="Bosh daftar o'tkazmalari reyestri">
        <Table columns={columns} data={mockTx} emptyTitle="Ma'lumot topilmadi" emptyDescription="Moliyaviy operatsiyalar mavjud emas." />
      </Card>
    </div>
  );
};

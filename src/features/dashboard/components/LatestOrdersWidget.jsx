import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { MOCK_LATEST_ORDERS } from '../constants/dashboard.mock';

const columns = [
  { header: 'Buyurtma #', accessor: 'id' },
  { header: 'Buyurtmachi Kompaniya', accessor: 'client' },
  { header: 'Mahsulotlar va Tarkib', accessor: 'items' },
  { header: 'Umumiy Summa', accessor: 'total' },
  { header: 'Hujjat Holati', cell: (row) => <StatusBadge status={row.status} /> },
];

export const LatestOrdersWidget = () => {
  return (
    <Card title="So'nggi Kelib Tushgan Buyurtmalar">
      <Table columns={columns} data={MOCK_LATEST_ORDERS} />
    </Card>
  );
};

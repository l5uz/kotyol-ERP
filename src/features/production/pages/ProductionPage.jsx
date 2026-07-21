import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ERP_ICONS } from '@/shared/icons';

const mockOrders = [
  { id: 'WO-801', title: "Og'ir bosim klapanlarini yig'ish", line: 'Liniya A-1', qty: 1500, status: 'IN_PROGRESS' },
  { id: 'WO-802', title: 'Qozon quvurlari gidravlik sinovi', line: 'Liniya B-3', qty: 800, status: 'QUALITY_CHECK' },
  { id: 'WO-803', title: 'Pnevmatik aktuatorlar partiyasi', line: 'Liniya C-2', qty: 2500, status: 'SCHEDULED' },
];

const columns = [
  { header: 'Buyurtma #', accessor: 'id' },
  { header: 'Texnologik operatsiya', accessor: 'title' },
  { header: 'Biriktirilgan liniya', accessor: 'line' },
  { header: 'Reja miqdori', accessor: 'qty' },
  { header: 'Bosqich holati', cell: (row) => <StatusBadge status={row.status} /> },
];

export const ProductionPage = () => {
  return (
    <div className="production-module animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Ishlab chiqarish va rejalashtirish</h4>
          <p className="text-muted-custom fs-7 mb-0">Ish buyurtmalari navbati, liniyalar yuklamasi va texnologik retseptlar</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className={`bi ${ERP_ICONS.PLUS} me-1`}></i> Yangi topshiriq biriktirish
        </button>
      </div>

      <Card title="Zavod liniyalarining joriy ish buyurtmalari">
        <Table columns={columns} data={mockOrders} emptyTitle="Ma'lumot topilmadi" emptyDescription="Ish buyurtmalari mavjud emas." />
      </Card>
    </div>
  );
};

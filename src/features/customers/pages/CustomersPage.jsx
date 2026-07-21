import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ERP_ICONS } from '@/shared/icons';

const mockClients = [
  { id: 'CUST-101', company: 'Global Heavy Machinery Corp', contact: 'sarah.k@globalheavy.com', country: 'AQSH', status: 'ACTIVE' },
  { id: 'CUST-102', company: 'Atlas Pipeline Solutions', contact: 'david.m@atlaspipe.eu', country: 'Germaniya', status: 'ACTIVE' },
  { id: 'CUST-103', company: 'Apex Power Grid LLC', contact: 'procurement@apexpower.org', country: 'Buyuk Britaniya', status: 'ACTIVE' },
];

const columns = [
  { header: 'Hisob kodi', accessor: 'id' },
  { header: 'Buyurtmachi korxona nomi', accessor: 'company' },
  { header: 'Mas\'ul shaxs kontaktlari', accessor: 'contact' },
  { header: 'Mamlakat / Hudud', accessor: 'country' },
  { header: 'Hisob holati', cell: (row) => <StatusBadge status={row.status} /> },
];

export const CustomersPage = () => {
  return (
    <div className="customers-module animate-fade-in">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Mijozlar bazasi va kontragentlar</h4>
          <p className="text-muted-custom fs-7 mb-0">Kompaniyalar katalogi, tijorat shartnomalari va aloqa tarixi</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className={`bi ${ERP_ICONS.PLUS} me-1`}></i> Yangi kontragent qo'shish
        </button>
      </div>

      <Card title="Ro'yxatdan o'tgan korxonalar va buyurtmachilar">
        <Table columns={columns} data={mockClients} emptyTitle="Ma'lumot topilmadi" emptyDescription="Mijozlar mavjud emas." />
      </Card>
    </div>
  );
};

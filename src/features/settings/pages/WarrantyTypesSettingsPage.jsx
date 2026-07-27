import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_WARRANTY_TYPES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const WarrantyTypesSettingsPage = () => {
  const [warrantyTypes, setWarrantyTypes] = useState(MOCK_WARRANTY_TYPES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Kafolat Turi Nomi', accessor: 'name' },
    { header: 'Muddati', cell: (row) => <span className="fw-bold text-main">{row.duration} oy</span> },
    { header: 'Kafolat Shartlari Tavsifi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="warranty-types-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Kafolat Turlari va Muddatlari</h4>
          <p className="text-muted-custom fs-7 mb-0">Mahsulotlar va uskunalarga beriladigan kafolat turlari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Kafolat Turi Yaratish
        </Button>
      </div>

      <Card title="Kafolat Shartlari Katalogi">
        <Table columns={columns} data={warrantyTypes} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Kafolat Turi Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Kafolat turi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Kafolat Nomi" placeholder="6 Oylik Sinov Kafolati" />
        <Input label="Muddati" placeholder="6" type="number" />
        <Input label="Tavsifi" placeholder="Ehtiyot qismlarga 6 oylik almashtirish kafolati" />
      </Modal>
    </div>
  );
};

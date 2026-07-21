import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_INSURANCE_TYPES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const InsuranceTypesSettingsPage = () => {
  const [insuranceTypes, setInsuranceTypes] = useState(MOCK_INSURANCE_TYPES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Sug\'urta Turi Nomi', accessor: 'name' },
    { header: 'Tavsifi va Qamrovi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="insurance-types-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Sug'urta Turlari</h4>
          <p className="text-muted-custom fs-7 mb-0">Zavod mulki, yuklar va xavflarni sug'urtalash kategoriyalari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Sug'urta Turi Yaratish
        </Button>
      </div>

      <Card title="Sug'urta Kategoriyalari Reyestri">
        <Table columns={columns} data={insuranceTypes} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Sug'urta Turi Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Sug'urta turi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Sug'urta Nomi" placeholder="Xodimlar Baxtsiz Hodisalari Sug'urtasi" />
        <Input label="Tavsifi va Polis Shartlari" placeholder="Sex ishchilarini baxtsiz hodisalardan sug'urtalash" />
      </Modal>
    </div>
  );
};

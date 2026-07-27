import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_DEFECT_REASONS } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const DefectReasonsSettingsPage = () => {
  const [defectReasons, setDefectReasons] = useState(MOCK_DEFECT_REASONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Nuqson / Defekt Sababi Nomi', accessor: 'name' },
    { header: 'Tavsifi', accessor: 'description' },
    {
      header: 'Moliyaga Ta\'siri',
      cell: (row) =>
        row.affectsFinance ? (
          <span className="badge bg-danger bg-opacity-10 text-danger fw-semibold">Ha — Chiqim qilinadi</span>
        ) : (
          <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">Yo'q — Qayta ishlanadi</span>
        ),
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="defect-reasons-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Defekt va Nuqson Sabablari</h4>
          <p className="text-muted-custom fs-7 mb-0">Omborxona brak hisobi va ishlab chiqarish sifat nazorati sabablari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Sabab Qo'shish
        </Button>
      </div>

      <Card title="Defekt Sabablari Katalogi">
        <Table columns={columns} data={defectReasons} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Defekt Sababini Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Defekt sababi kiritildi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Sabab Nomi" placeholder="Harorat me'yori buzilishi" />
        <Input label="Tavsifi" placeholder="Pech harorati pastligi sababli to'liq pishmaslik" />
        <Select
          label="Moliyaviy Chiqimga Ta'siri"
          options={[
            { value: 'true', label: "Ha — Chiqim hisoblanadi" },
            { value: 'false', label: "Yo'q — Qayta ishlanadi" },
          ]}
        />
      </Modal>
    </div>
  );
};

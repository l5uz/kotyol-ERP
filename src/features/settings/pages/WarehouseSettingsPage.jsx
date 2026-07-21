import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_WAREHOUSES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const WarehouseSettingsPage = () => {
  const [warehouses, setWarehouses] = useState(MOCK_WAREHOUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Ombor Kodi', accessor: 'code' },
    { header: 'Ombor Nomi', accessor: 'name' },
    { header: 'Tavsifi', accessor: 'description' },
    {
      header: 'Standart Ombor',
      cell: (row) =>
        row.isDefault ? (
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">Asosiy Ombor</span>
        ) : (
          <span className="text-muted-custom fs-8">Qo'shimcha</span>
        ),
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="warehouse-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Omborlar Sozlamalari</h4>
          <p className="text-muted-custom fs-7 mb-0">Xomashyo va tayyor mahsulot omborlari ro'yxati</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Ombor Yaratish
        </Button>
      </div>

      <Card title="Korxona Omborlari Reyestri">
        <Table columns={columns} data={warehouses} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Ombor Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi ombor muvaffaqiyatli saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Ombor Kodi (masalan: WH-04)" placeholder="WH-04" />
        <Input label="Ombor Nomi" placeholder="Elektrotexnika Qismlari Ombori" />
        <Input label="Tavsif va Sex Biriktiruvi" placeholder="B-sexdagi omborxona" />
      </Modal>
    </div>
  );
};

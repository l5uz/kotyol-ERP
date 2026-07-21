import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_UNITS } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const UnitsSettingsPage = () => {
  const [units, setUnits] = useState(MOCK_UNITS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Birlik Nomi', accessor: 'name' },
    { header: 'Qisqa Belgisi', cell: (row) => <span className="badge bg-secondary bg-opacity-10 text-secondary fw-bold">{row.shortName}</span> },
    { header: 'Tavsifi', accessor: 'description' },
  ];

  return (
    <div className="units-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">O'lchov Birliklari</h4>
          <p className="text-muted-custom fs-7 mb-0">Omborxona va ishlab chiqarishda qo'llaniladigan standart o'lchov birliklari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Birlik Qo'shish
        </Button>
      </div>

      <Card title="Standart O'lchov Birliklari Reyestri">
        <Table columns={columns} data={units} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi O'lchov Birligi Qo'shish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("O'lchov birligi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Birlik Nomi (masalan: Tonna)" placeholder="Tonna" />
        <Input label="Qisqa Belgisi (t)" placeholder="t" />
        <Input label="Tavsifi" placeholder="Og'ir yuklar uchun tonna o'lchovi" />
      </Modal>
    </div>
  );
};

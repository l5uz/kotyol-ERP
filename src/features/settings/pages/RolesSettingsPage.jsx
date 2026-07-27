import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_ROLES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const RolesSettingsPage = () => {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Rol Nomi', accessor: 'name' },
    { header: 'Vazifasi va Qamrovi', accessor: 'description' },
    {
      header: 'Biriktirilgan Xodimlar',
      cell: (row) => <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">{row.userCount} nafar</span>,
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="roles-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Rollar Boshqaruvi</h4>
          <p className="text-muted-custom fs-7 mb-0">Tizim lavozimlari va ruxsat darajalari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Rol Yaratish
        </Button>
      </div>

      <Card title="Tizim Rollari Katalogi">
        <Table columns={columns} data={roles} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Rol Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi rol saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Rol Nomi (masalan: Nazoratchi)" placeholder="Nazoratchi" />
        <Input label="Tavsifi" placeholder="Sifat nazorati bo'limi xodimi" />
      </Modal>
    </div>
  );
};

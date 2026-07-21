import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_SERVICE_TYPES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const ServiceTypesSettingsPage = () => {
  const [serviceTypes, setServiceTypes] = useState(MOCK_SERVICE_TYPES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Servis / Xizmat Turi Nomi', accessor: 'name' },
    { header: 'Tavsifi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="service-types-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Servis va Texnik Xizmat Turlari</h4>
          <p className="text-muted-custom fs-7 mb-0">Uskunalarga xizmat ko'rsatish va diagnostika turlari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Servis Turi Yaratish
        </Button>
      </div>

      <Card title="Servis va Profilaktika Turlari Reyestri">
        <Table columns={columns} data={serviceTypes} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Servis Turi Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Servis turi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Servis Turi Nomi" placeholder="Kalibrlash va Sozlash" />
        <Input label="Tavsifi" placeholder="Klapan datchiklarini kalibrlash xizmati" />
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { employeesApi } from '../api/employeesApi';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const SalaryTypesPage = () => {
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSalaryTypes();
  }, []);

  const loadSalaryTypes = async () => {
    const res = await employeesApi.getSalaryTypes();
    if (res.success) setSalaryTypes(res.data);
  };

  const columns = [
    { header: 'Maosh Turi Kodi', accessor: 'code' },
    { header: 'Oylik Maosh Turi Nomi', accessor: 'name' },
    { header: 'Tavsifi va Hisoblash Usuli', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="salary-types-page animate-fade-in pb-5">

      <PageHeader
        title="Oylik Maosh Turlari va Modellari"
        subtitle="Xodimlarga maosh hisoblash shakllari: Oylik, kunlik, soatbay, bosqichbay va hajmbay"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Xodimlar', path: '/employees' },
          { label: 'Oylik Turlari' },
        ]}
        actions={
          <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
            Yangi Maosh Turi Qo'shish
          </Button>
        }
      />

      <Card title="Oylik Maosh Modellari Reyestri">
        <Table columns={columns} data={salaryTypes} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Maosh Turi Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi maosh turi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Maosh Turi Nomi" placeholder="Premiya / Bonus stavkasi" />
        <Input label="Maosh Kodi" placeholder="BONUS_RATE" />
        <Input label="Tavsifi" placeholder="Bajarilgan reja uchun qo'shimcha premiya" />
      </Modal>
    </div>
  );
};

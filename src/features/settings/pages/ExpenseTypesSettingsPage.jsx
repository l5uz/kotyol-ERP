import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_EXPENSE_TYPES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const ExpenseTypesSettingsPage = () => {
  const [expenseTypes, setExpenseTypes] = useState(MOCK_EXPENSE_TYPES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Xarajat Turi Nomi', accessor: 'name' },
    { header: 'Tavsifi va Maqsadi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="expense-types-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Xarajat Turlari va Kategoriyalari</h4>
          <p className="text-muted-custom fs-7 mb-0">Moliyaviy hisobotlar va buxgalteriya uchun xarajat toifalari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Xarajat Turi Yaratish
        </Button>
      </div>

      <Card title="Operatsion Xarajat Turlari Reyestri">
        <Table columns={columns} data={expenseTypes} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Xarajat Turi Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Xarajat turi saqlandi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Xarajat Turi Nomi" placeholder="Amortizatsiya xarajatlari" />
        <Input label="Tavsifi" placeholder="Asbob-uskunalar va stanoklar amortizatsiyasi" />
      </Modal>
    </div>
  );
};

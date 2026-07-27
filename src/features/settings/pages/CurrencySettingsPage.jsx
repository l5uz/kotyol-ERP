import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_CURRENCIES } from '../constants/settings.mock';
import { notifySuccess, notifyWarning } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const CurrencySettingsPage = () => {
  const [currencies, setCurrencies] = useState(MOCK_CURRENCIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSetDefault = (id) => {
    const updated = currencies.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    setCurrencies(updated);
    notifySuccess("Standart hisob-kitob valyutasi o'zgartirildi.");
  };

  const columns = [
    { header: 'Valyuta Kodu', accessor: 'code' },
    { header: 'Valyuta Nomi', accessor: 'name' },
    { header: 'Simvol', accessor: 'symbol' },
    { header: 'USD Kursi', cell: (row) => row.rateToUSD },
    {
      header: 'Asosiy Valyuta',
      cell: (row) =>
        row.isDefault ? (
          <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
            <i className="bi bi-star-fill me-1"></i> Asosiy Valyuta
          </span>
        ) : (
          <button
            className="btn btn-sm btn-outline-secondary py-0 px-2 fs-8"
            onClick={() => handleSetDefault(row.id)}
          >
            Asosiy qilish
          </button>
        ),
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="currency-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-main mb-1">Valyutalar va Kurslar Sozlamalari</h4>
          <p className="text-muted-custom fs-7 mb-0">Ko'p valyutali hisob-kitoblar va ayirboshlash kurslari</p>
        </div>
        <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
          Yangi Valyuta Qo'shish
        </Button>
      </div>

      <Card title="Tizimdagi Valyutalar Ro'yxati">
        <Table columns={columns} data={currencies} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Valyuta Qo'shish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi valyuta tizimga qo'shildi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Valyuta Kodu (masalan: UZS, USD)" placeholder="USD" />
        <Input label="Valyuta Nomi" placeholder="AQSH Dollari" />
        <Input label="Simvoli ($ / € / so'm)" placeholder="$" />
        <Input label="USD ga nisbatan kursi" placeholder="1.0" />
      </Modal>
    </div>
  );
};

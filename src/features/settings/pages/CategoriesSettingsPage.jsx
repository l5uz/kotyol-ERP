import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { Modal } from '@/components/common/Modal/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { Input } from '@/components/common/Input/Input';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_PRODUCT_CATEGORIES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const CategoriesSettingsPage = () => {
  const [categories, setCategories] = useState(MOCK_PRODUCT_CATEGORIES);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      header: 'Rang va Icon',
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded p-2 text-white d-flex align-items-center justify-content-center"
            style={{ backgroundColor: row.color, width: '32px', height: '32px' }}
          >
            <i className={`bi ${row.icon}`}></i>
          </div>
        </div>
      ),
    },
    { header: 'Kategoriya Nomi', accessor: 'name' },
    { header: 'Tavsifi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-danger p-1 border-0"
          onClick={() => {
            setSelectedCategory(row);
            setIsConfirmOpen(true);
          }}
        >
          <i className={`bi ${ERP_ICONS.TRASH}`}></i>
        </button>
      ),
    },
  ];

  return (
    <div className="categories-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-main mb-1">Mahsulot Kategoriyalari</h4>
          <p className="text-muted-custom fs-7 mb-0">Xomashyo va tayyor mahsulotlar toifalari boshqaruvi</p>
        </div>
        <div className="d-flex gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Kategoriyalar bo'yicha qidiruv..." />
          <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
            Kategoriya Yaratish
          </Button>
        </div>
      </div>

      <Card title="Kategoriyalar Reyestri">
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Kategoriya Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi kategoriya qo'shildi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Kategoriya Nomi" placeholder="Po'lat armaturalar" />
        <Input label="Tavsifi" placeholder="B-sex uchun armaturalar" />
        <Input label="Rang kodi (#0d6efd)" defaultValue="#0d6efd" />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setCategories(categories.filter((c) => c.id !== selectedCategory?.id));
          notifySuccess("Kategoriya o'chirib tashlandi.");
          setIsConfirmOpen(false);
        }}
        title="Kategoriyani O'chirish"
        message={`Haqiqatan ham '${selectedCategory?.name}' kategoriyasini o'chirib tashlamoqchimisiz?`}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

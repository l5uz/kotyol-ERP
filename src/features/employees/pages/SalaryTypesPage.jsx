import React, { useState, useEffect } from 'react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { employeesApi } from '../api/employeesApi';
import { notifySuccess, notifyError } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const SalaryTypesPage = () => {
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    loadSalaryTypes();
  }, []);

  const loadSalaryTypes = async () => {
    const res = await employeesApi.getSalaryTypes();
    if (res.success) {
      setSalaryTypes(Array.isArray(res.data) ? res.data : []);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setName(item.name || '');
      setCode(item.code || '');
      setAmount(item.amount ?? '');
      setDescription(item.description || '');
    } else {
      setName('');
      setCode('');
      setAmount('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      notifyError('Maosh turi nomini kiriting');
      return;
    }

    const payload = {
      name,
      code,
      amount: Number(amount) || 0,
      description,
    };

    if (editingItem) {
      const res = await employeesApi.updateSalaryType(editingItem.id, payload);
      if (res.success) {
        notifySuccess('Maosh turi va stavkasi tahrirlandi.');
        setIsModalOpen(false);
        loadSalaryTypes();
      }
    } else {
      const res = await employeesApi.createSalaryType(payload);
      if (res.success) {
        notifySuccess('Yangi maosh turi va narxi yaratildi.');
        setIsModalOpen(false);
        loadSalaryTypes();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    const res = await employeesApi.deleteSalaryType(deletingItem.id);
    if (res.success) {
      notifySuccess("Maosh turi o'chirildi.");
      setDeletingItem(null);
      loadSalaryTypes();
    }
  };

  const filtered = salaryTypes.filter((st) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (st.name && st.name.toLowerCase().includes(q)) ||
      (st.code && st.code.toLowerCase().includes(q)) ||
      (st.description && st.description.toLowerCase().includes(q))
    );
  });

  const columns = [
    { header: 'Maosh Turi Kodi', accessor: 'code' },
    { header: 'Oylik Maosh Turi Nomi', accessor: 'name' },
    {
      header: 'Standart Narx / Stavkasi ($)',
      cell: (row) => (
        <strong className="text-primary fs-7">
          ${(Number(row.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </strong>
      ),
    },
    { header: 'Tavsifi va Hisoblash Usuli', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status || 'ACTIVE'} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-link text-warning p-1"
            title="Tahrirlash"
            onClick={() => handleOpenModal(row)}
          >
            <LuPencil className="fs-6" />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-link text-danger p-1"
            title="O'chirish"
            onClick={() => setDeletingItem(row)}
          >
            <LuTrash2 className="fs-6" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="salary-types-page animate-fade-in pb-5">
      <PageHeader
        title="Oylik Maosh Turlari va Modellari"
        subtitle="Xodimlarga maosh hisoblash shakllari va narxlari stavkasi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Xodimlar', path: '/employees' },
          { label: 'Oylik Turlari' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={ERP_ICONS.PLUS}
            onClick={() => handleOpenModal(null)}
          >
            Yangi Maosh Turi Qo'shish
          </Button>
        }
      />

      <div className="mb-3" style={{ maxWidth: '380px' }}>
        <SearchInput
          placeholder="Maosh turi yoki kodi bo'yicha qidiruv..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <Card title={`Oylik Maosh Modellari va Narxlari (${filtered.length} ta)`}>
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Maosh Turini Tahrirlash' : 'Yangi Maosh Turi Yaratish'}
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingItem ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="d-flex flex-column gap-3">
          <Input
            label="Maosh Turi Nomi *"
            placeholder="Masalan: Qozon Yig'ish Operatsiyasi / Oylik Oklad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Maosh Stavkasi Narxi ($ yoki so'mda) *"
            placeholder="150000 yoki 50"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Maosh Kodi"
            placeholder="SALARY_RATE_01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            label="Tavsifi va Hisoblash Izohi"
            placeholder="Bajarilgan ish uchun to'lanadigan narx tavsifi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Maosh Turini O'chirish"
        message={`Haqiqatan ham '${deletingItem?.name}' maosh turini o'chirib tashlamoqchimisiz?`}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

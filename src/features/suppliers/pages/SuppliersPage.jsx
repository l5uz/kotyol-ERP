import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { Select } from '@/components/common/Select/Select';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { SupplierFormModal } from '../components/SupplierFormModal';
import { suppliersApi } from '../api/suppliersApi';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';
import { ROUTES } from '@/constants/routes.constants';

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, [search, statusFilter]);

  const loadSuppliers = async () => {
    const res = await suppliersApi.getSuppliers({ search, status: statusFilter });
    if (res.success) setSuppliers(res.data);
  };

  const handleSave = async (formData) => {
    if (editingSupplier) {
      const res = await suppliersApi.updateSupplier(editingSupplier.id, formData);
      notifySuccess(res.message);
    } else {
      const res = await suppliersApi.createSupplier(formData);
      notifySuccess(res.message);
    }
    setIsModalOpen(false);
    setEditingSupplier(null);
    loadSuppliers();
  };

  const handleDelete = async () => {
    if (deletingSupplier) {
      const res = await suppliersApi.deleteSupplier(deletingSupplier.id);
      notifySuccess(res.message);
      setIsConfirmOpen(false);
      setDeletingSupplier(null);
      loadSuppliers();
    }
  };

  const columns = [
    {
      header: 'Ta\'minotchi Kompaniya',
      cell: (row) => (
        <div>
          <Link to={`${ROUTES.PROTECTED.SUPPLIERS}/${row.id}`} className="fw-bold text-primary text-decoration-none fs-7">
            {row.companyName}
          </Link>
          <small className="d-block text-muted-custom fs-8">STIR: {row.tin}</small>
        </div>
      ),
    },
    { header: 'Mas\'ul Shaxs', accessor: 'contactPerson' },
    { header: 'Telefon', accessor: 'phone' },
    { header: 'Email', cell: (row) => row.email || '—' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${ROUTES.PROTECTED.SUPPLIERS}/${row.id}`}
            className="btn btn-sm btn-outline-primary p-1 border-0"
            title="Profilini ko'rish"
          >
            <i className={`bi ${ERP_ICONS.EYE}`}></i>
          </Link>
          <button
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            onClick={() => {
              setEditingSupplier(row);
              setIsModalOpen(true);
            }}
            title="Tahrirlash"
          >
            <i className={`bi ${ERP_ICONS.EDIT}`}></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger p-1 border-0"
            onClick={() => {
              setDeletingSupplier(row);
              setIsConfirmOpen(true);
            }}
            title="O'chirish"
          >
            <i className={`bi ${ERP_ICONS.TRASH}`}></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="suppliers-page animate-fade-in pb-5">
      <PageHeader
        title="Ta'minotchilar Katalogi (Suppliers)"
        subtitle="Xomashyo, po'lat, detallar va bo'yoq yetkazib beruvchi hamkor kompaniyalar"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Ta\'minotchilar' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={ERP_ICONS.PLUS}
            onClick={() => {
              setEditingSupplier(null);
              setIsModalOpen(true);
            }}
          >
            Yangi Ta'minotchi Qo'shish
          </Button>
        }
      />

      <div className="row g-2 mb-4 align-items-center">
        <div className="col-12 col-md-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Kompaniya nomi, mas'ul shaxs yoki STIR bo'yicha..."
          />
        </div>
        <div className="col-12 col-md-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Barcha Statuslar' },
              { value: 'ACTIVE', label: 'Faol' },
              { value: 'INACTIVE', label: 'Nofaol' },
            ]}
          />
        </div>
      </div>

      <Card title={`Ta'minotchi Korxonalar Reyestri (${suppliers.length} ta)`}>
        <Table columns={columns} data={suppliers} />
      </Card>

      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        supplier={editingSupplier}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Ta'minotchini O'chirish"
        message={`Haqiqatan ham '${deletingSupplier?.companyName}' ta'minotchisini tizimdan o'chirib tashlamoqchimisiz?`}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuPlus, LuEye, LuPencil, LuTrash2, LuUsers } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { CustomersSubNav } from '../components/CustomersSubNav';
import { CustomerFilterBar } from '../components/CustomerFilterBar';
import { CustomerFormModal } from '../components/CustomerFormModal';
import { customersApi } from '../api/customersApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { usePageAutoRefresh } from '@/hooks/usePageAutoRefresh';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const customerTypes = dynamicSettingsService.getCustomerTypes();
  const regions = dynamicSettingsService.getRegions();

  useEffect(() => {
    loadCustomersData();
  }, [search, customerTypeFilter, regionFilter, statusFilter]);

  const loadCustomersData = async () => {
    const res = await customersApi.getCustomers({
      search,
      customerTypeId: customerTypeFilter,
      region: regionFilter,
      status: statusFilter,
    });
    if (res.success) setCustomers(res.data);
  };

  // Background Auto-Refresh every 15s (Pauses while modal is open)
  usePageAutoRefresh(loadCustomersData, { intervalMs: 15000, isEditing: isModalOpen || isConfirmOpen });

  const handleCreateOrUpdate = async (formData) => {
    if (editingCustomer) {
      const res = await customersApi.updateCustomer(editingCustomer.id, formData);
      notifySuccess(res.message);
    } else {
      const res = await customersApi.createCustomer(formData);
      if (!res.success) {
        notifySuccess(res.message);
        return;
      }
      notifySuccess(res.message);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
    loadCustomersData();
  };

  const handleDelete = async () => {
    if (deletingCustomer) {
      const res = await customersApi.deleteCustomer(deletingCustomer.id);
      notifySuccess(res.message);
      setIsConfirmOpen(false);
      setDeletingCustomer(null);
      loadCustomersData();
    }
  };

  const columns = [
    {
      header: 'Mijoz Nomi',
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 bg-info bg-opacity-10 text-info p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <LuUsers className="fs-5" />
          </div>
          <div>
            <Link to={`${ROUTES.PROTECTED.CUSTOMERS}/${row.id}`} className="fw-bold text-primary text-decoration-none fs-7">
              {row.customerName}
            </Link>
            <small className="d-block text-muted-custom fs-8">{row.tin ? `STIR: ${row.tin}` : row.address}</small>
          </div>
        </div>
      ),
    },
    {
      header: 'Telefon Raqam',
      cell: (row) => <strong className="text-main fs-7">{row.phone}</strong>,
    },
    {
      header: 'Mijoz Turi',
      cell: (row) => <span className="badge bg-secondary bg-opacity-10 text-secondary fs-8">{row.customerTypeName}</span>,
    },
    { header: 'Viloyat / Hudud', accessor: 'region' },
    {
      header: 'So\'nggi Xarid',
      cell: (row) => <span className="text-muted-custom fs-8">{row.lastPurchaseDate}</span>,
    },
    {
      header: 'Jami Xaridlari ($)',
      cell: (row) => <strong className="text-primary fs-7">${(row.totalPurchases || 0).toLocaleString()}</strong>,
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${ROUTES.PROTECTED.CUSTOMERS}/${row.id}`}
            className="btn btn-sm btn-outline-primary p-1 border-0"
            title="Tafsilotini ko'rish"
          >
            <LuEye />
          </Link>
          <button
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            onClick={() => {
              setEditingCustomer(row);
              setIsModalOpen(true);
            }}
            title="Tahrirlash"
          >
            <LuPencil />
          </button>
          <button
            className="btn btn-sm btn-outline-danger p-1 border-0"
            onClick={() => {
              setDeletingCustomer(row);
              setIsConfirmOpen(true);
            }}
            title="O'chirish"
          >
            <LuTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="customers-page animate-fade-in pb-5">
      <CustomersSubNav />

      <PageHeader
        title="Mijozlar Boshqaruvi Moduli"
        subtitle="Yuridik korxonalar hamda jismoniy xaridorlar reyestri, alohida profil va aloqa ma'lumotlari"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Mijozlar' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
          >
            <LuPlus className="me-1" /> Yangi Mijoz Qo'shish
          </Button>
        }
      />

      <CustomerFilterBar
        search={search}
        onSearchChange={setSearch}
        customerTypeFilter={customerTypeFilter}
        onCustomerTypeChange={setCustomerTypeFilter}
        regionFilter={regionFilter}
        onRegionChange={setRegionFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        customerTypes={customerTypes}
        regions={regions}
      />

      <Card title={`Ro'yxatga Olingan Mijozlar Katalogi (${customers.length} ta)`}>
        <Table columns={columns} data={customers} tableKey="customers_list" />
      </Card>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleCreateOrUpdate}
        customer={editingCustomer}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Mijozni O'chirish"
        message={`Haqiqatan ham '${deletingCustomer?.customerName}' mijoz kartochkasi bazadan o'chirilsinmi?`}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

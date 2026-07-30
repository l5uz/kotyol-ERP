import { formatCurrency } from '@/utils/currency.utils';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuPlus, LuEye, LuPencil, LuTrash2, LuClipboardList, LuPlay, LuLock } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { OrdersSubNav } from '../components/OrdersSubNav';
import { OrderFilterBar } from '../components/OrderFilterBar';
import { OrderFormModal } from '../components/OrderFormModal';
import { ordersApi } from '../api/ordersApi';
import { customersApi } from '@/features/customers/api/customersApi';
import { boilersApi } from '@/features/boilers/api/boilersApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { usePageAutoRefresh } from '@/hooks/usePageAutoRefresh';
import { usePermission } from '@/hooks/usePermission';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const OrdersPage = () => {
  const { canCreate, canEdit, canDelete, isReadOnly } = usePermission('orders');

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [boilers, setBoilers] = useState([]);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const statuses = dynamicSettingsService.getOrderStatuses();
  const priorities = dynamicSettingsService.getOrderPriorities();

  useEffect(() => {
    loadOrdersData();
  }, [search, customerFilter, statusFilter, priorityFilter]);

  const loadOrdersData = async () => {
    const [ordRes, custRes, boilRes] = await Promise.all([
      ordersApi.getOrders({
        search,
        customerId: customerFilter,
        status: statusFilter,
        priority: priorityFilter,
      }),
      customersApi.getCustomers(),
      boilersApi.getBoilers(),
    ]);
    if (ordRes.success) setOrders(ordRes.data);
    if (custRes.success) setCustomers(custRes.data);
    if (boilRes.success) setBoilers(boilRes.data);
  };

  // Background Auto-Refresh every 15s (Pauses while modal is open)
  usePageAutoRefresh(loadOrdersData, { intervalMs: 15000, isEditing: isModalOpen || isConfirmOpen });

  const handleCreateOrUpdate = async (formData) => {
    if (editingOrder) {
      const res = await ordersApi.updateOrder(editingOrder.id, formData);
      notifySuccess(res.message);
    } else {
      const res = await ordersApi.createOrder(formData);
      if (!res.success) {
        notifySuccess(res.message);
        return;
      }
      notifySuccess(res.message);
    }
    setIsModalOpen(false);
    setEditingOrder(null);
    loadOrdersData();
  };

  const handleStartProduction = async (orderId) => {
    const res = await ordersApi.startProductionOrder(orderId);
    notifySuccess(res.message);
    loadOrdersData();
  };

  const handleDelete = async () => {
    if (deletingOrder) {
      const res = await ordersApi.deleteOrder(deletingOrder.id);
      notifySuccess(res.message);
      setIsConfirmOpen(false);
      setDeletingOrder(null);
      loadOrdersData();
    }
  };

  const columns = [
    {
      header: 'Buyurtma №',
      cell: (row) => (
        <div>
          <Link to={`${ROUTES.PROTECTED.ORDERS}/${row.id}`} className="fw-bold text-primary text-decoration-none fs-7">
            {row.orderNumber}
          </Link>
          <small className="d-block text-muted-custom fs-8">Sana: {row.orderDate}</small>
        </div>
      ),
    },
    {
      header: 'Mijoz Korxona',
      cell: (row) => (
        <Link to={`${ROUTES.PROTECTED.CUSTOMERS}/${row.customerId}`} className="fw-bold text-primary text-decoration-none fs-7">
          {row.customerName}
        </Link>
      ),
    },
    {
      header: 'Kotyol Modeli',
      cell: (row) => (
        <Link to={`${ROUTES.PROTECTED.BOILERS}/${row.boilerId}`} className="fw-bold text-primary text-decoration-none fs-7">
          {row.boilerModelName}
        </Link>
      ),
    },
    {
      header: 'Miqdor',
      cell: (row) => <strong className="text-main fs-7">{row.quantity} dona</strong>,
    },
    {
      header: 'Prioritet',
      cell: (row) => {
        const prioObj = priorities.find((p) => p.code === row.priority);
        return <span className={`badge ${prioObj ? prioObj.badgeClass : 'bg-secondary'} fs-8`}>{prioObj ? prioObj.name : row.priority}</span>;
      },
    },
    {
      header: 'Jami Summa ($)',
      cell: (row) => <strong className="text-primary fs-7">{formatCurrency(row.totalAmount || 0)}</strong>,
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${ROUTES.PROTECTED.ORDERS}/${row.id}`}
            className="btn btn-sm btn-outline-primary p-1 border-0"
            title="Tafsilotni ko'rish"
          >
            <LuEye />
          </Link>
          {canEdit && (
            <button
              className="btn btn-sm btn-outline-secondary p-1 border-0"
              onClick={() => {
                setEditingOrder(row);
                setIsModalOpen(true);
              }}
              title="Tahrirlash"
            >
              <LuPencil />
            </button>
          )}
          {canEdit && row.status !== 'IN_PRODUCTION' && row.status !== 'COMPLETED' && (
            <button
              className="btn btn-sm btn-outline-success p-1 border-0"
              onClick={() => handleStartProduction(row.id)}
              title="Ishlab Chiqarishni Boshlash"
            >
              <LuPlay />
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-sm btn-outline-danger p-1 border-0"
              onClick={() => {
                setDeletingOrder(row);
                setIsConfirmOpen(true);
              }}
              title="Bekor qilish / O'chirish"
            >
              <LuTrash2 />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="orders-page animate-fade-in pb-5">
      <OrdersSubNav />

      {isReadOnly && (
        <div className="alert alert-info d-flex align-items-center gap-2 mb-3 py-2 px-3 fs-7 rounded-3">
          <LuLock className="fs-5" />
          <span>Sizda ushbu modulni faqat ko'rish huquqi mavjud. Tahrirlash va o'chirish amallari yashirilgan (Read-Only Mode).</span>
        </div>
      )}

      <PageHeader
        title="Buyurtmalar Boshqaruvi"
        subtitle="Mijozlar buyurtmalarini qabul qilish, kotyol modellarini biriktirish va ishlab chiqarishga o'tkazish"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Buyurtmalar' },
        ]}
        actions={
          canCreate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingOrder(null);
                setIsModalOpen(true);
              }}
            >
              <LuPlus className="me-1" /> Yangi Buyurtma Rasmiylashtirish
            </Button>
          )
        }
      />

      <OrderFilterBar
        search={search}
        onSearchChange={setSearch}
        customerFilter={customerFilter}
        onCustomerChange={setCustomerFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        customers={customers}
        statuses={statuses}
        priorities={priorities}
      />

      <Card title={`Buyurtmalar Reyestri (${orders.length} ta)`}>
        <Table columns={columns} data={orders} tableKey="orders_list" />
      </Card>

      {canCreate && (
        <OrderFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingOrder(null);
          }}
          onSubmit={handleCreateOrUpdate}
          order={editingOrder}
          customers={customers}
          boilers={boilers}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Buyurtmani Bekor Qilish"
          message={`Haqiqatan ham '${deletingOrder?.orderNumber}' buyurtmasi bekor qilinsinmi?`}
          isDanger={true}
          confirmText="Bekor qilish"
          cancelText="Orqaga"
        />
      )}
    </div>
  );
};

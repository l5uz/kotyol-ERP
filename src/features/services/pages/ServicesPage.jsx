import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuWrench, LuPlus, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ServicesFilterBar } from '../components/ServicesFilterBar';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { ServiceFormModal } from '../components/ServiceFormModal';
import { servicesApi } from '../api/servicesApi';
import { usePermission } from '@/hooks/usePermission';
import { usePageAutoRefresh } from '@/hooks/usePageAutoRefresh';
import { notifySuccess, notifyError } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const { canCreate, canEdit, canDelete } = usePermission();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [customers, setCustomers] = useState([]);
  const [boilers, setBoilers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceStatuses, setServiceStatuses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadServicesData();
  }, [search, customerFilter, serviceTypeFilter, statusFilter]);

  const loadServicesData = async () => {
    const [srvRes, custRes, boilRes, empRes, stRes, statRes] = await Promise.all([
      servicesApi.getServices({
        search,
        customerId: customerFilter,
        serviceTypeId: serviceTypeFilter,
        status: statusFilter,
      }),
      servicesApi.getCustomersList(),
      servicesApi.getBoilersList(),
      servicesApi.getEmployeesList(),
      servicesApi.getServiceTypes(),
      servicesApi.getServiceStatuses(),
    ]);

    if (srvRes.success) setServices(srvRes.data);
    if (custRes.success) setCustomers(custRes.data);
    if (boilRes.success) setBoilers(boilRes.data);
    if (empRes.success) setEmployees(empRes.data);
    if (stRes.success) setServiceTypes(stRes.data);
    if (statRes.success) setServiceStatuses(statRes.data);
  };

  usePageAutoRefresh(loadServicesData, { intervalMs: 15000, isEditing: isModalOpen || isConfirmOpen });

  const handleOpenAddModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, srv) => {
    e.stopPropagation();
    setSelectedService(srv);
    setIsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (e, id) => {
    e.stopPropagation();
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleSaveService = async (formData) => {
    let res;
    if (selectedService?.id) {
      res = await servicesApi.updateService(selectedService.id, formData);
    } else {
      res = await servicesApi.createService(formData);
    }

    if (res.success) {
      notifySuccess(res.message || "Servis arizasi saqlandi.");
      setIsModalOpen(false);
      loadServicesData();
    } else {
      notifyError(res.message || "Servis arizasini saqlashda xatolik.");
    }
  };

  const handleDeleteService = async () => {
    if (!deleteId) return;
    const res = await servicesApi.deleteService(deleteId);
    if (res.success) {
      notifySuccess(res.message || "Servis arizasi o'chirildi.");
    } else {
      notifyError(res.message || "Servis arizasini o'chirishda xatolik.");
    }
    setIsConfirmOpen(false);
    setDeleteId(null);
    loadServicesData();
  };

  const columns = [
    {
      header: 'Servis № va Hujjat',
      cell: (row) => (
        <div>
          <strong className="text-main fs-7 d-block">{row.serviceNumber}</strong>
          <small className="text-muted-custom fs-8">Sana: {row.serviceDate}</small>
        </div>
      ),
    },
    {
      header: 'Mijoz Korxona',
      cell: (row) => (
        <div>
          <span className="fw-semibold text-main fs-7 d-block">{row.customerName}</span>
          <small className="text-secondary fs-8">Kotyol: {row.boilerModelName}</small>
        </div>
      ),
    },
    {
      header: 'Servis Xizmati Turi',
      cell: (row) => <span className="badge bg-primary bg-opacity-10 text-primary fs-8">{row.serviceTypeName}</span>,
    },
    {
      header: 'Biriktirilgan Usta',
      cell: (row) => <span className="fw-medium text-main fs-7">{row.assignedEmployeeName || '— (Biriktirilmagan)'}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span
          className={`badge ${
            row.status === 'COMPLETED'
              ? 'bg-success'
              : row.status === 'IN_PROGRESS'
              ? 'bg-warning text-dark'
              : 'bg-secondary'
          } fs-8`}
        >
          {row.statusName || row.status}
        </span>
      ),
    },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm btn-outline-primary p-1 border-0"
            onClick={() => navigate(`${ROUTES.PROTECTED.SERVICES}/${row.id}`)}
            title="Tafsilotini ko'rish"
          >
            <LuEye />
          </button>
          {canEdit && (
            <button
              className="btn btn-sm btn-outline-warning p-1 border-0"
              onClick={(e) => handleOpenEditModal(e, row)}
              title="Tahrirlash"
            >
              <LuPencil />
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-sm btn-outline-danger p-1 border-0"
              onClick={(e) => handleOpenDeleteConfirm(e, row.id)}
              title="O'chirish"
            >
              <LuTrash2 />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="services-page animate-fade-in pb-5">
      <PageHeader
        title="Servis va Kafolat Moduli"
        subtitle="Sotilgan sanoat kotyollari va pechlarining kafolatli va to'lovli texnik servisi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Servis' },
        ]}
        actions={
          canCreate && (
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={handleOpenAddModal}>
              <LuPlus />
              <span>Yangi Servis Ariza</span>
            </button>
          )
        }
      />

      <ServicesFilterBar
        search={search}
        onSearchChange={setSearch}
        customerFilter={customerFilter}
        onCustomerChange={setCustomerFilter}
        serviceTypeFilter={serviceTypeFilter}
        onServiceTypeChange={setServiceTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        customers={customers}
        serviceTypes={serviceTypes}
        serviceStatuses={serviceStatuses}
      />

      <Card title={`Servis Arizalari Ro'yxati (${services.length} ta)`}>
        <Table columns={columns} data={services} tableKey="services_list" />
      </Card>

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceRecord={selectedService}
        onSubmit={handleSaveService}
        customers={customers}
        boilers={boilers}
        employees={employees}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteService}
        title="Servis Arizasini O'chirish"
        message="Haqiqatan ham ushbu servis arizasini tizimdan o'chirmoqchimisiz?"
      />
    </div>
  );
};

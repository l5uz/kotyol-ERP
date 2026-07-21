import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { EmployeeSubNav } from '../components/EmployeeSubNav';
import { EmployeeFilterBar } from '../components/EmployeeFilterBar';
import { EmployeeFormModal } from '../components/EmployeeFormModal';
import { employeesApi } from '../api/employeesApi';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';
import { ROUTES } from '@/constants/routes.constants';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [search, statusFilter, positionFilter]);

  const loadData = async () => {
    const [empRes, posRes, salRes] = await Promise.all([
      employeesApi.getEmployees({ search, status: statusFilter, positionId: positionFilter }),
      employeesApi.getPositions(),
      employeesApi.getSalaryTypes(),
    ]);
    if (empRes.success) setEmployees(empRes.data);
    if (posRes.success) setPositions(posRes.data);
    if (salRes.success) setSalaryTypes(salRes.data);
  };

  const handleSaveEmployee = async (formData) => {
    if (editingEmployee) {
      const res = await employeesApi.updateEmployee(editingEmployee.id, formData);
      notifySuccess(res.message);
    } else {
      const res = await employeesApi.createEmployee(formData);
      notifySuccess(res.message);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
    loadData();
  };

  const handleDelete = async () => {
    if (deletingEmployee) {
      const res = await employeesApi.deleteEmployee(deletingEmployee.id);
      notifySuccess(res.message);
      setIsConfirmOpen(false);
      setDeletingEmployee(null);
      loadData();
    }
  };

  const columns = [
    {
      header: 'F.I.SH / Xodim',
      cell: (row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-8"
            style={{ width: '34px', height: '34px' }}
          >
            {row.firstName.charAt(0)}{row.lastName.charAt(0)}
          </div>
          <div>
            <Link to={`${ROUTES.PROTECTED.EMPLOYEES}/${row.id}`} className="fw-semibold text-primary text-decoration-none">
              {row.fullName}
            </Link>
            <small className="d-block text-muted-custom fs-8">{row.passportNumber}</small>
          </div>
        </div>
      ),
    },
    { header: 'Telefon va Email', cell: (row) => (
        <div>
          <span className="d-block text-main fs-8 fw-medium">{row.phone}</span>
          <small className="text-muted-custom fs-8">{row.email || '—'}</small>
        </div>
      )
    },
    { header: 'Lavozimi', cell: (row) => <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">{row.positionName}</span> },
    { header: 'Maosh Turi', accessor: 'salaryTypeName' },
    { header: 'Maosh Stavkasi', cell: (row) => <span className="fw-bold text-main">${row.salaryAmount.toFixed(2)}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            to={`${ROUTES.PROTECTED.EMPLOYEES}/${row.id}`}
            className="btn btn-sm btn-outline-primary p-1 border-0"
            title="Profilni ko'rish"
          >
            <i className={`bi ${ERP_ICONS.EYE}`}></i>
          </Link>
          <button
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            onClick={() => {
              setEditingEmployee(row);
              setIsModalOpen(true);
            }}
            title="Tahrirlash"
          >
            <i className={`bi ${ERP_ICONS.EDIT}`}></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger p-1 border-0"
            onClick={() => {
              setDeletingEmployee(row);
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
    <div className="employees-page animate-fade-in pb-5">
      <EmployeeSubNav />

      <PageHeader
        title="Xodimlar Ro'yxati va Kadrlar Hisobi"
        subtitle="Korxona barcha xodimlari, lavozimlar va ish stavkalari katalogi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Xodimlar' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={ERP_ICONS.PLUS}
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
          >
            Yangi Xodim Qo'shish
          </Button>
        }
      />

      <EmployeeFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        positionFilter={positionFilter}
        onPositionChange={setPositionFilter}
        positions={positions}
      />

      <Card title={`Xodimlar Reyestri (${employees.length} nafar)`}>
        <Table columns={columns} data={employees} />
      </Card>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEmployee}
        employee={editingEmployee}
        positions={positions}
        salaryTypes={salaryTypes}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xodimlarni O'chirish"
        message={`Haqiqatan ham '${deletingEmployee?.fullName}' xodimini tizimdan o'chirib tashlamoqchimisiz?`}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

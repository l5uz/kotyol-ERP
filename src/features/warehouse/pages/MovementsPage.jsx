import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuPlus, LuEye } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { Select } from '@/components/common/Select/Select';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { MovementFormModal } from '../components/MovementFormModal';
import { warehouseApi } from '../api/warehouseApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const MovementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const movementTypeOptions = dynamicSettingsService.getMovementTypeOptions();

  useEffect(() => {
    loadMovementsData();
  }, [search, movementTypeFilter]);

  const loadMovementsData = async () => {
    const [movRes, stockRes] = await Promise.all([
      warehouseApi.getMovements({ search, movementTypeCode: movementTypeFilter }),
      warehouseApi.getCurrentStock(),
    ]);
    if (movRes.success) setMovements(movRes.data);
    if (stockRes.success) setProducts(stockRes.data);
  };

  const handleCreateMovement = async (formData) => {
    const res = await warehouseApi.createMovement(formData);
    notifySuccess(res.message);
    setIsModalOpen(false);
    loadMovementsData();
  };

  const columns = [
    {
      header: 'Mahsulot',
      cell: (row) => (
        <span className="fw-bold text-main fs-7">
          {row.productName}
        </span>
      ),
    },
    { header: 'Ombor', accessor: 'warehouseName' },
    {
      header: 'Miqdor',
      cell: (row) => (
        <span className="fw-bold text-main">
          {row.quantity} {row.unitName}
        </span>
      ),
    },
    {
      header: 'Harakat Turi',
      cell: (row) => (
        <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
          {row.movementTypeName}
        </span>
      ),
    },
    { header: 'Sababi', cell: (row) => row.reason || row.notes || '-' },
    { header: 'Mas\'ul Xodim', accessor: 'createdBy' },
    { header: 'Sana', accessor: 'createdDate' },
    {
      header: 'Amal',
      cell: (row) => (
        <Link
          to={`${ROUTES.PROTECTED.WAREHOUSE_MOVEMENTS}/${row.id}`}
          className="btn btn-sm btn-outline-primary p-1 border-0"
          title="Tafsilotni ko'rish"
        >
          <LuEye />
        </Link>
      ),
    },
  ];

  return (
    <div className="movements-page animate-fade-in pb-5">
      <PageHeader
        title="Ombor Harakatlari Jurnali"
        subtitle="Xomashyo va mahsulotlarning kirim, chiqim, sarf va ko'chirish operatsiyalari"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Omborxona', path: ROUTES.PROTECTED.WAREHOUSE },
          { label: 'Harakatlar' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <LuPlus className="me-1" /> Omborga Mahsulot Kirim Qilish
          </Button>
        }
      />

      <div className="row g-2 mb-4 align-items-center">
        <div className="col-12 col-md-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Mahsulot yoki ombor nomi bo'yicha..."
          />
        </div>
        <div className="col-12 col-md-4">
          <Select
            value={movementTypeFilter}
            onChange={(e) => setMovementTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'Barcha Harakat Turlari' },
              ...movementTypeOptions,
            ]}
          />
        </div>
      </div>

      <Card title={`Bajarilgan Ombor Operatsiyalari Tarixi (${movements.length} ta)`}>
        <Table columns={columns} data={movements} />
      </Card>

      <MovementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMovement}
        products={products}
      />
    </div>
  );
};

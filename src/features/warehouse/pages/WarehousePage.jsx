import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuBoxes, LuBadgeDollarSign, LuTriangleAlert, LuCircleX, LuPlus, LuArrowLeftRight, LuClipboardCheck } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { StockFilterBar } from '../components/StockFilterBar';
import { MovementFormModal } from '../components/MovementFormModal';
import { RevaluationFormModal } from '../components/RevaluationFormModal';
import { InventoryCountModal } from '../components/InventoryCountModal';
import { warehouseApi } from '../api/warehouseApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const WarehousePage = () => {
  const [stats, setStats] = useState(null);
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isRevaluationModalOpen, setIsRevaluationModalOpen] = useState(false);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);

  const categories = dynamicSettingsService.getCategories();
  const warehouses = dynamicSettingsService.getWarehouses();
  const materialTypes = dynamicSettingsService.getMaterialTypes();

  useEffect(() => {
    loadWarehouseData();
  }, [search, categoryFilter, warehouseFilter, materialFilter, statusFilter]);

  const loadWarehouseData = async () => {
    const [statsRes, stockRes] = await Promise.all([
      warehouseApi.getWarehouseStats(),
      warehouseApi.getCurrentStock({
        search,
        categoryId: categoryFilter,
        warehouseId: warehouseFilter,
        materialTypeId: materialFilter,
        status: statusFilter,
      }),
    ]);
    if (statsRes.success) setStats(statsRes.data);
    if (stockRes.success) setStock(stockRes.data);
  };

  const handleSaveMovement = async (formData) => {
    const res = await warehouseApi.createMovement(formData);
    notifySuccess(res.message);
    setIsMovementModalOpen(false);
    loadWarehouseData();
  };

  const handleSaveRevaluation = async (formData) => {
    const res = await warehouseApi.createRevaluation(formData);
    notifySuccess(res.message);
    setIsRevaluationModalOpen(false);
    loadWarehouseData();
  };

  const handleSaveInventoryCount = async (formData) => {
    const res = await warehouseApi.createInventoryCount(formData);
    notifySuccess(res.message);
    setIsCountModalOpen(false);
    loadWarehouseData();
  };

  const lowStockItems = stock.filter((s) => s.quantity <= s.minQuantity);

  const columns = [
    {
      header: 'Mahsulot / Xomashyo',
      cell: (row) => (
        <div>
          <Link to={`${ROUTES.PROTECTED.WAREHOUSE_STOCK}/${row.id}`} className="fw-bold text-primary text-decoration-none fs-7">
            {row.productName}
          </Link>
          <small className="d-block text-muted-custom fs-8">SKU: {row.internalCode}</small>
        </div>
      ),
    },
    { header: 'Kategoriya', accessor: 'categoryName' },
    { header: 'Material Turi', cell: (row) => <span className="badge bg-info bg-opacity-10 text-info">{row.materialTypeName}</span> },
    { header: 'Ombor', accessor: 'warehouseName' },
    {
      header: 'Miqdor',
      cell: (row) => (
        <div>
          <strong className={row.quantity <= row.minQuantity ? 'text-danger' : 'text-success'}>
            {row.quantity} {row.unitName}
          </strong>
          <small className="d-block text-muted-custom fs-8">Min: {row.minQuantity}</small>
        </div>
      ),
    },
    {
      header: 'Joriy Qiymati ($)',
      cell: (row) => <span className="fw-bold text-main">${row.currentValue.toLocaleString()}</span>,
    },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Amal',
      cell: (row) => (
        <Link to={`${ROUTES.PROTECTED.WAREHOUSE_STOCK}/${row.id}`} className="btn btn-sm btn-outline-primary py-1 px-2 fs-8">
          Tafsilot
        </Link>
      ),
    },
  ];

  return (
    <div className="warehouse-page animate-fade-in pb-5">

      <PageHeader
        title="Omborxona va Zaxiralar Boshqaruvi"
        subtitle="Xomashyolar, komplektatsiya qismlari va tayyor mahsulotlar zaxirasi balansi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Omborxona' },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsRevaluationModalOpen(true)}
            >
              <LuBadgeDollarSign className="me-1" /> Qayta Baholash
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsCountModalOpen(true)}
            >
              <LuClipboardCheck className="me-1" /> Inventarizatsiya
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMovementModalOpen(true)}
            >
              <LuPlus className="me-1" /> Yangi Ombor Harakati
            </Button>
          </div>
        }
      />

      {/* Stats Cards Grid */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card-custom p-3 border-custom rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted-custom d-block mb-1 fs-8">Jami Nomenklatura</small>
                <h4 className="fw-bold text-main font-heading mb-0">{stats.totalProducts} ta</h4>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <LuBoxes className="fs-4" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card-custom p-3 border-custom rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted-custom d-block mb-1 fs-8">Jami Zaxira Qiymati ($)</small>
                <h4 className="fw-bold text-main font-heading mb-0">${stats.totalStockValue.toLocaleString()}</h4>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                <LuBadgeDollarSign className="fs-4" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card-custom p-3 border-custom rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted-custom d-block mb-1 fs-8">Kam Qolgan Pozitsiyalar</small>
                <h4 className="fw-bold text-warning font-heading mb-0">{stats.lowStockCount} ta</h4>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                <LuTriangleAlert className="fs-4" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card-custom p-3 border-custom rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted-custom d-block mb-1 fs-8">Tugagan Zaxiralar</small>
                <h4 className="fw-bold text-danger font-heading mb-0">{stats.outOfStockCount} ta</h4>
              </div>
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
                <LuCircleX className="fs-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Warning Cards Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <LuTriangleAlert className="text-warning fs-5" />
            <strong className="text-main fs-7">Diqqat! Minimal Chegaradan Kam Qolgan Zaxiralar Ogohlantirishi:</strong>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span key={item.id} className="badge bg-warning text-dark fs-8 p-2">
                {item.productName} — Qoldi: {item.quantity} {item.unitName} (Min: {item.minQuantity})
              </span>
            ))}
          </div>
        </div>
      )}

      <StockFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        warehouseFilter={warehouseFilter}
        onWarehouseChange={setWarehouseFilter}
        materialFilter={materialFilter}
        onMaterialChange={setMaterialFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
        warehouses={warehouses}
        materialTypes={materialTypes}
      />

      <Card title={`Ombordagi Mavjud Zaxiralar Reyestri (${stock.length} ta)`}>
        <Table columns={columns} data={stock} />
      </Card>

      <MovementFormModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSubmit={handleSaveMovement}
        products={stock}
      />

      <RevaluationFormModal
        isOpen={isRevaluationModalOpen}
        onClose={() => setIsRevaluationModalOpen(false)}
        onSubmit={handleSaveRevaluation}
        products={stock}
      />

      <InventoryCountModal
        isOpen={isCountModalOpen}
        onClose={() => setIsCountModalOpen(false)}
        onSubmit={handleSaveInventoryCount}
        products={stock}
      />
    </div>
  );
};

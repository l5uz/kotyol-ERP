import React, { useState, useEffect } from 'react';
import { LuPlus, LuBadgeDollarSign } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { WarehouseSubNav } from '../components/WarehouseSubNav';
import { RevaluationFormModal } from '../components/RevaluationFormModal';
import { warehouseApi } from '../api/warehouseApi';
import { notifySuccess } from '@/services/notification.service';

export const RevaluationPage = () => {
  const [revaluations, setRevaluations] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRevaluationsData();
  }, []);

  const loadRevaluationsData = async () => {
    const [revRes, stockRes] = await Promise.all([
      warehouseApi.getRevaluations(),
      warehouseApi.getCurrentStock(),
    ]);
    if (revRes.success) setRevaluations(revRes.data);
    if (stockRes.success) setProducts(stockRes.data);
  };

  const handleCreateRevaluation = async (formData) => {
    const res = await warehouseApi.createRevaluation(formData);
    notifySuccess(res.message);
    setIsModalOpen(false);
    loadRevaluationsData();
  };

  const columns = [
    { header: 'Mahsulot Nomi', accessor: 'productName' },
    {
      header: 'Oldingi Narx ($)',
      cell: (row) => <span>${row.previousPrice.toFixed(2)}</span>,
    },
    {
      header: 'Yangi Narx ($)',
      cell: (row) => <strong className="text-primary">${row.newPrice.toFixed(2)}</strong>,
    },
    {
      header: 'Farq (Diff)',
      cell: (row) => (
        <span className={`fw-bold ${row.priceDifference >= 0 ? 'text-success' : 'text-danger'}`}>
          {row.priceDifference >= 0 ? `+$${row.priceDifference.toFixed(2)}` : `-$${Math.abs(row.priceDifference).toFixed(2)}`}
        </span>
      ),
    },
    { header: 'Qayta Baholash Sababi (Dinamik)', accessor: 'reason' },
    { header: 'Bajaruvchi Xodim', accessor: 'createdBy' },
    { header: 'Sana', accessor: 'createdDate' },
  ];

  return (
    <div className="revaluation-page animate-fade-in pb-5">
      <WarehouseSubNav />

      <PageHeader
        title="Qayta Baholash Jurnali (Stock Revaluation Log)"
        subtitle="Xomashyo va mahsulotlar birlik tannarxini bozor narxlariga mos ravishda qayta baholash"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Omborxona', path: '/warehouse' },
          { label: 'Qayta Baholash' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <LuPlus className="me-1" /> Yangi Qayta Baholash
          </Button>
        }
      />

      <Card title={`Amalga Oshirilgan Qayta Baholash Hujjatlari (${revaluations.length} ta)`}>
        <Table columns={columns} data={revaluations} />
      </Card>

      <RevaluationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRevaluation}
        products={products}
      />
    </div>
  );
};

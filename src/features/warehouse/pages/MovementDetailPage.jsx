import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronLeft, LuArrowLeftRight } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { WarehouseSubNav } from '../components/WarehouseSubNav';
import { warehouseApi } from '../api/warehouseApi';
import { ROUTES } from '@/constants/routes.constants';

export const MovementDetailPage = () => {
  const { id } = useParams();
  const [movement, setMovement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMovementDetails();
  }, [id]);

  const loadMovementDetails = async () => {
    setIsLoading(true);
    const res = await warehouseApi.getMovementById(id);
    if (res.success) setMovement(res.data);
    setIsLoading(false);
  };

  if (isLoading || !movement) {
    return (
      <div className="movement-detail-page animate-fade-in pb-5">
        <WarehouseSubNav />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  const timelineItems = [
    {
      id: 'step_1',
      title: 'Harakat Tizimda Ro\'yxatga Olindi',
      description: `${movement.createdBy} tomonidan ${movement.movementNumber} hujjat raqami kiritildi.`,
      timestamp: movement.createdDate,
      icon: 'bi-file-earmark-check',
    },
    {
      id: 'step_2',
      title: 'Ombor Balansi Yangilandi',
      description: `${movement.warehouseName} zaxirasida ${movement.quantity} ${movement.unitName} miqdorida operatsiya bajarildi.`,
      timestamp: movement.createdDate,
      icon: 'bi-box-seam',
    },
  ];

  return (
    <div className="movement-detail-page animate-fade-in pb-5">
      <WarehouseSubNav />

      <PageHeader
        title={`Ombor Harakati Tafsiloti: ${movement.movementNumber}`}
        subtitle={`Mahsulot: ${movement.productName} — ${movement.movementTypeName}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Omborxona', path: ROUTES.PROTECTED.WAREHOUSE },
          { label: 'Harakatlar', path: ROUTES.PROTECTED.WAREHOUSE_MOVEMENTS },
          { label: movement.movementNumber },
        ]}
        actions={
          <Link to={ROUTES.PROTECTED.WAREHOUSE_MOVEMENTS} className="btn btn-outline-secondary btn-sm">
            <LuChevronLeft className="me-1" /> Ro'yxatga Qaytish
          </Link>
        }
      />

      <div className="row g-3">
        {/* Left Side: Summary */}
        <div className="col-12 col-lg-5">
          <Card className="p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                style={{ width: '56px', height: '56px' }}
              >
                <LuArrowLeftRight />
              </div>
              <div>
                <h6 className="fw-bold text-main mb-0 font-heading">{movement.movementNumber}</h6>
                <small className="text-muted-custom">Sana: {movement.createdDate}</small>
              </div>
            </div>

            <div className="mb-3">
              <span className="badge bg-primary fs-7 px-3 py-2">{movement.movementTypeName}</span>
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div>
                <small className="text-muted-custom d-block">Mahsulot Nomi:</small>
                <strong className="text-main">{movement.productName}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Bajarilgan Ombor:</small>
                <strong className="text-main">{movement.warehouseName}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Operatsiya Miqdori:</small>
                <strong className="text-success fs-5">{movement.quantity} {movement.unitName}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Operatsiya Sababi (Dinamik):</small>
                <strong className="text-main">{movement.reason}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Mas'ul Xodim (User):</small>
                <strong className="text-main">{movement.createdBy}</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Notes & Timeline */}
        <div className="col-12 col-lg-7">
          <div className="d-flex flex-column gap-3">
            <Card title="Harakat Bo'yicha Kiritilgan Izoh">
              <p className="fs-7 text-main mb-0">{movement.notes || 'Qo\'shimcha izoh kiritilmagan.'}</p>
            </Card>

            <Card title="Operatsiyaning Ishchi Taymlayni (Timeline)">
              <Timeline items={timelineItems} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

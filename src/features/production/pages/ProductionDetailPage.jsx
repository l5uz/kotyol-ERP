import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronLeft, LuSettings2, LuPlay, LuPause, LuCircleCheck, LuPrinter, LuBoxes, LuUsers, LuFileText } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { ProductionSubNav } from '../components/ProductionSubNav';
import { productionApi } from '../api/productionApi';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const ProductionDetailPage = () => {
  const { id } = useParams();
  const [production, setProduction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProductionDetails();
  }, [id]);

  const loadProductionDetails = async () => {
    setIsLoading(true);
    const res = await productionApi.getProductionOrderById(id);
    if (res.success) setProduction(res.data);
    setIsLoading(false);
  };

  const handleStartBatch = async () => {
    if (!production) return;
    const res = await productionApi.startProductionBatch(production.id);
    notifySuccess(res.message);
    loadProductionDetails();
  };

  const handlePrint = () => {
    notifySuccess("Ishlab chiqarish marshrut xaritasini va sex naryadi chop etishga yuborildi.");
  };

  if (isLoading || !production) {
    return (
      <div className="production-detail-page animate-fade-in pb-5">
        <ProductionSubNav />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  const ingredientColumns = [
    { header: 'Xomashyo Nomi', accessor: 'materialName' },
    {
      header: 'Sarflanadigan Miqdor',
      cell: (row) => <strong className="text-main fs-7">{row.requiredQty} {row.unit}</strong>,
    },
    {
      header: 'Taxminiy Xarajat ($)',
      cell: (row) => <span className="text-primary font-mono font-semibold">${row.cost.toFixed(2)}</span>,
    },
  ];

  const attachmentColumns = [
    { header: 'Hujjat Nomi', accessor: 'fileName' },
    { header: 'Hajmi', accessor: 'fileSize' },
    { header: 'Yuklangan Sana', accessor: 'uploadDate' },
    {
      header: 'Amal',
      cell: () => (
        <button className="btn btn-sm btn-outline-primary py-0 px-2 fs-8">Yuklab Olish</button>
      ),
    },
  ];

  const timelineItems = (production.timeline || []).map((tl) => ({
    id: tl.id,
    title: tl.title,
    description: tl.description,
    timestamp: tl.timestamp,
    icon: 'bi-gear',
  }));

  return (
    <div className="production-detail-page animate-fade-in pb-5">
      <ProductionSubNav />

      <PageHeader
        title={`Ishlab Chiqarish №: ${production.productionNumber}`}
        subtitle={`Topshiriq: ${production.title} — Liniya: ${production.line}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Ishlab chiqarish', path: ROUTES.PROTECTED.PRODUCTION },
          { label: production.productionNumber },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Link to={ROUTES.PROTECTED.PRODUCTION} className="btn btn-outline-secondary btn-sm">
              <LuChevronLeft className="me-1" /> Ro'yxatga Qaytish
            </Link>

            <Button variant="outline-dark" size="sm" onClick={handlePrint}>
              <LuPrinter className="me-1" /> Marshrut Xaritasini Chop Etish
            </Button>

            {production.status === 'SCHEDULED' && (
              <Button variant="success" size="sm" onClick={handleStartBatch}>
                <LuPlay className="me-1" /> Sexda Boshlash
              </Button>
            )}
          </div>
        }
      />

      <div className="row g-3">
        {/* Left Column: Production Overview Card */}
        <div className="col-12 col-lg-4">
          <Card className="p-4 mb-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: '64px', height: '64px' }}
              >
                <LuSettings2 />
              </div>
              <div>
                <h6 className="fw-bold text-main mb-0 font-heading">{production.productionNumber}</h6>
                <span className="badge bg-secondary bg-opacity-10 text-secondary fs-8">Boshlanish: {production.startDate}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <StatusBadge status={production.status} />
              <span className="badge bg-info bg-opacity-10 text-info fs-8">Versiya: v{production.version}</span>
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              {production.orderId && (
                <div>
                  <small className="text-muted-custom d-block">Tegishli Buyurtma №:</small>
                  <Link to={`${ROUTES.PROTECTED.ORDERS}/${production.orderId}`} className="fw-bold text-primary text-decoration-none">
                    {production.orderNumber}
                  </Link>
                </div>
              )}

              {production.customerId && (
                <div>
                  <small className="text-muted-custom d-block">Mijoz Korxona:</small>
                  <Link to={`${ROUTES.PROTECTED.CUSTOMERS}/${production.customerId}`} className="fw-bold text-primary text-decoration-none">
                    {production.customerName}
                  </Link>
                </div>
              )}

              {production.boilerId && (
                <div>
                  <small className="text-muted-custom d-block">Kotyol Modeli:</small>
                  <Link to={`${ROUTES.PROTECTED.BOILERS}/${production.boilerId}`} className="fw-bold text-primary text-decoration-none">
                    {production.boilerModelName}
                  </Link>
                </div>
              )}

              {production.recipeId && (
                <div>
                  <small className="text-muted-custom d-block">Retseptura Versiyasi:</small>
                  <Link to={`${ROUTES.PROTECTED.RECIPES}/${production.recipeId}`} className="badge bg-secondary bg-opacity-10 text-secondary text-decoration-none fs-8">
                    {production.recipeVersion} ({production.recipeName || 'Reseptura'})
                  </Link>
                </div>
              )}

              <div>
                <small className="text-muted-custom d-block">Ishlab Chiqarish Miqdori:</small>
                <strong className="text-main fs-6">{production.quantity} dona</strong>
              </div>

              <div>
                <small className="text-muted-custom d-block">Kutilayotgan Yakunlanish Sanasi:</small>
                <strong className="text-main">{production.expectedFinishDate}</strong>
              </div>
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-1 bg-body-custom p-3 rounded-3 border-custom">
              <div className="d-flex justify-content-between">
                <span className="text-muted-custom">Progress (Bajarilish):</span>
                <strong>{production.progressPercent}%</strong>
              </div>
              <div className="progress mt-1 mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${production.progressPercent}%` }}></div>
              </div>

              <div className="d-flex justify-content-between fw-bold pt-2 border-top border-custom text-primary fs-6">
                <span>Taxminiy Tannarx:</span>
                <span>${(production.estimatedCost || 0).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Assigned Employees, Material Consumption & Timeline */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {/* Assigned Employees */}
            <Card title="Biriktirilgan Usta va Ishchi Xodilar">
              <div className="d-flex align-items-center gap-2 p-3 bg-body-custom rounded-3 border-custom">
                <LuUsers className="fs-3 text-primary" />
                <div>
                  <strong className="fs-7 text-main d-block">Liniya Ishchi Brigadasi</strong>
                  {production.assignedEmployees && production.assignedEmployees.length > 0 ? (
                    production.assignedEmployees.map((emp, i) => (
                      <Link
                        key={i}
                        to={ROUTES.PROTECTED.EMPLOYEES}
                        className="badge bg-primary bg-opacity-10 text-primary text-decoration-none fs-7 me-1 mt-1 hover-opacity"
                      >
                        {emp}
                      </Link>
                    ))
                  ) : (
                    <span className="text-muted-custom fs-8">Hozircha xodim biriktirilmagan</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Recipe Material Consumption List */}
            <Card title="Reseptura Bo'yicha Xomashyo Sarfiyati Jurnali">
              <Table columns={ingredientColumns} data={production.ingredients || []} />
            </Card>

            {/* Notes */}
            <Card title="Texnologik Yo'riqnoma va Izoh">
              <p className="fs-7 text-main mb-0">{production.notes || 'Izoh kiritilmagan.'}</p>
            </Card>

            {/* Attachments */}
            <Card title="Texnik Chizmalar va Ilovalar (Attachments)">
              <Table columns={attachmentColumns} data={production.attachments || []} />
            </Card>

            {/* Audit Timeline */}
            <Card title="Ishlab Chiqarish Bosqichlari Tarixi (Audit Timeline)">
              <Timeline items={timelineItems} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

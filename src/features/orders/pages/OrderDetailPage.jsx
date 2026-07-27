import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronLeft, LuClipboardList, LuPlay, LuPrinter, LuX, LuBoxes, LuBookmarkCheck, LuDollarSign } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { OrdersSubNav } from '../components/OrdersSubNav';
import { ordersApi } from '../api/ordersApi';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    setIsLoading(true);
    const res = await ordersApi.getOrderById(id);
    if (res.success) setOrder(res.data);
    setIsLoading(false);
  };

  const handleStartProduction = async () => {
    if (!order) return;
    const res = await ordersApi.startProductionOrder(order.id);
    notifySuccess(res.message);
    loadOrderDetails();
  };

  const handlePrint = () => {
    notifySuccess("Buyurtma hujjati va schyot-faktura chop etishga yuborildi.");
  };

  if (isLoading || !order) {
    return (
      <div className="order-detail-page animate-fade-in pb-5">
        <OrdersSubNav />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

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

  const timelineItems = (order.timeline || []).map((tl) => ({
    id: tl.id,
    title: tl.title,
    description: tl.description,
    timestamp: tl.timestamp,
    icon: 'bi-clipboard-check',
  }));

  return (
    <div className="order-detail-page animate-fade-in pb-5">
      <OrdersSubNav />

      <PageHeader
        title={`Buyurtma №: ${order.orderNumber}`}
        subtitle={`Mijoz: ${order.customerName} — Kotyol Modeli: ${order.boilerModelName}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Buyurtmalar', path: ROUTES.PROTECTED.ORDERS },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Link to={ROUTES.PROTECTED.ORDERS} className="btn btn-outline-secondary btn-sm">
              <LuChevronLeft className="me-1" /> Ro'yxatga Qaytish
            </Link>

            <Button variant="outline-dark" size="sm" onClick={handlePrint}>
              <LuPrinter className="me-1" /> Chop Etish
            </Button>

            {order.status !== 'IN_PRODUCTION' && order.status !== 'COMPLETED' && (
              <Button variant="success" size="sm" onClick={handleStartProduction}>
                <LuPlay className="me-1" /> Ishlab Chiqarishni Boshlash
              </Button>
            )}
          </div>
        }
      />

      <div className="row g-3">
        {/* Left Column: Order Summary Card */}
        <div className="col-12 col-lg-4">
          <Card className="p-4 mb-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: '64px', height: '64px' }}
              >
                <LuClipboardList />
              </div>
              <div>
                <h6 className="fw-bold text-main mb-0 font-heading">{order.orderNumber}</h6>
                <span className="badge bg-secondary bg-opacity-10 text-secondary fs-8">Sana: {order.orderDate}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <StatusBadge status={order.status} />
              {order.isReserved && (
                <span className="badge bg-info bg-opacity-10 text-info fs-8 d-flex align-items-center gap-1">
                  <LuBookmarkCheck /> Materiallar Rezervda
                </span>
              )}
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div>
                <small className="text-muted-custom d-block">Buyurtmachi Mijoz:</small>
                <Link to={`${ROUTES.PROTECTED.CUSTOMERS}/${order.customerId}`} className="fw-bold text-primary text-decoration-none">
                  {order.customerName}
                </Link>
              </div>

              <div>
                <small className="text-muted-custom d-block">Kotyol Modeli:</small>
                <Link to={`${ROUTES.PROTECTED.BOILERS}/${order.boilerId}`} className="fw-bold text-primary text-decoration-none">
                  {order.boilerModelName}
                </Link>
              </div>

              <div>
                <small className="text-muted-custom d-block">Buyurtma Miqdori:</small>
                <strong className="text-main fs-6">{order.quantity} dona</strong>
              </div>

              <div>
                <small className="text-muted-custom d-block">Kutilayotgan Topshirish Sanasi:</small>
                <strong className="text-main">{order.expectedDeliveryDate}</strong>
              </div>
            </div>

            <hr className="border-custom my-3" />

            {/* Financial Summary */}
            <div className="text-start fs-7 d-flex flex-column gap-1 bg-body-custom p-3 rounded-3 border-custom">
              <div className="d-flex justify-content-between">
                <span className="text-muted-custom">1 Birlik Narxi:</span>
                <span>${order.unitPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold pt-2 border-top border-custom text-primary fs-6">
                <span>Jami Buyurtma Summasi:</span>
                <span>${(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Material Status, Production Flow & Timeline */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {/* Material Availability Banner */}
            <Card title="Materiallar va Ombordagi Resurslar Statusi">
              <div className="d-flex align-items-center justify-content-between p-3 bg-body-custom rounded-3 border-custom">
                <div className="d-flex align-items-center gap-2">
                  <LuBoxes className="fs-4 text-primary" />
                  <div>
                    <strong className="fs-7 text-main d-block">Xomashyo Zaxira Holati</strong>
                    <small className="text-muted-custom">
                      {order.materialAvailabilityStatus === 'AVAILABLE'
                        ? 'Reseptura bo\'yicha barcha kerakli xomashyolar omborda yetarli va rezervlangan.'
                        : 'Ba\'zi xomashyolar qisman yetarli emas.'}
                    </small>
                  </div>
                </div>
                <span className={`badge ${order.materialAvailabilityStatus === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'} fs-8`}>
                  {order.materialAvailabilityStatus === 'AVAILABLE' ? 'Mavjud va Rezervlangan' : 'Qisman Yetarli'}
                </span>
              </div>
            </Card>

            {/* Notes */}
            <Card title="Shartnoma Izohi va Eslatmalar">
              <p className="fs-7 text-main mb-0">{order.notes || 'Izoh kiritilmagan.'}</p>
            </Card>

            {/* Attachments */}
            <Card title="Buyurtma Ilovalari va Shartnomalar">
              <Table columns={attachmentColumns} data={order.attachments || []} />
            </Card>

            {/* Timeline */}
            <Card title="Buyurtma Bosqichlari Tarixi">
              <Timeline items={timelineItems} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

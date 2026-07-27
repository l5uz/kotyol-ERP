import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronLeft, LuShoppingCart, LuBuilding2, LuFlame, LuFileText, LuDollarSign, LuWarehouse } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { salesApi } from '../api/salesApi';
import { formatCurrency } from '@/utils/currency.utils';
import { ROUTES } from '@/constants/routes.constants';

export const SaleDetailPage = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSaleDetail();
  }, [id]);

  const loadSaleDetail = async () => {
    setIsLoading(true);
    const res = await salesApi.getSaleById(id);
    if (res.success) setSale(res.data);
    setIsLoading(false);
  };

  if (isLoading || !sale) {
    return (
      <div className="sale-detail-page animate-fade-in pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sale-detail-page animate-fade-in pb-5">
      <PageHeader
        title={`Sotuv Fakturasi №: ${sale.invoiceNumber}`}
        subtitle={`Mijoz: ${sale.customerName} — Status: ${sale.statusName}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Sotuvlar', path: ROUTES.PROTECTED.SALES },
          { label: sale.invoiceNumber },
        ]}
        actions={
          <Link to={ROUTES.PROTECTED.SALES} className="btn btn-outline-secondary btn-sm">
            <LuChevronLeft className="me-1" /> Sotuvlar Ro'yxatiga Qaytish
          </Link>
        }
      />

      <div className="row g-3">
        {/* Left Column - Summary Card */}
        <div className="col-12 col-lg-4">
          <Card className="p-4 mb-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: '64px', height: '64px' }}
              >
                <LuShoppingCart />
              </div>
              <div>
                <h5 className="fw-bold text-main mb-0 font-heading">{sale.invoiceNumber}</h5>
                <span className="badge bg-success fs-8">{sale.statusName}</span>
              </div>
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div>
                <small className="text-muted-custom d-block">Mijoz Korxona:</small>
                <strong className="text-primary">{sale.customerName}</strong>
              </div>

              <div>
                <small className="text-muted-custom d-block">Kotyol Modeli:</small>
                <span className="fw-bold text-main">{sale.boilerModelName}</span>
              </div>

              <div>
                <small className="text-muted-custom d-block">Sotuv Miqdori:</small>
                <span className="fw-semibold text-main">{sale.quantity} dona</span>
              </div>

              <div>
                <small className="text-muted-custom d-block">Sotuv Sanasi:</small>
                <span className="text-main">{sale.saleDate}</span>
              </div>

              <div>
                <small className="text-muted-custom d-block">Mas'ul Sotuvchi:</small>
                <span className="text-main fw-medium">{sale.createdBy}</span>
              </div>
            </div>

            <hr className="border-custom my-3" />

            <div className="bg-body-custom p-3 rounded-3 border-custom">
              <div className="d-flex justify-content-between mb-1 fs-7">
                <span className="text-muted-custom">Subtotal (Birlik × Miqdor):</span>
                <span>{formatCurrency(sale.subtotal, 'USD')}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 fs-7">
                <span>Chegirma:</span>
                <span className="text-danger">-{formatCurrency(sale.discountAmount, 'USD')}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 fs-7">
                <span>Soliq (QQS 12%):</span>
                <span>+{formatCurrency(sale.taxAmount, 'USD')}</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top border-custom fw-bold text-primary fs-6">
                <span>Umumiy Sotuv Summasi:</span>
                <span>{formatCurrency(sale.totalAmount, 'USD')}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Stock Dispatch & Documents */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            <Card title="Ombor Sarfiyati va Mahsulot Chiqimi">
              <div className="p-3 bg-body-custom rounded-3 border-custom d-flex align-items-center gap-3">
                <LuWarehouse className="text-success fs-3" />
                <div>
                  <strong className="text-main d-block fs-7">Tayyor Mahsulot Ombordan Chiqim Qilindi</strong>
                  <small className="text-muted-custom fs-8">
                    Ushbu sotuv rasmiylashtirilgach, {sale.quantity} dona {sale.boilerModelName} tayyor mahsulot omboridan avtomatik yechildi.
                  </small>
                </div>
              </div>
            </Card>

            <Card title="Sotuv Hujjatlari va Faktura Fayllari">
              <div className="d-flex align-items-center gap-2 p-2 bg-body-custom rounded border-custom">
                <LuFileText className="text-primary fs-5" />
                <div className="flex-grow-1">
                  <span className="fw-semibold fs-7 d-block">Schyot_Faktura_{sale.invoiceNumber}.pdf</span>
                  <small className="text-muted-custom fs-8">1.8 MB — Tasdiqlangan va imzolangan</small>
                </div>
                <button className="btn btn-sm btn-outline-primary border-0 fs-8">Yuklab olish</button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { suppliersApi } from '../api/suppliersApi';
import { ERP_ICONS } from '@/shared/icons';
import { ROUTES } from '@/constants/routes.constants';

export const SupplierDetailPage = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSupplierDetails();
  }, [id]);

  const loadSupplierDetails = async () => {
    setIsLoading(true);
    const [supRes, actRes] = await Promise.all([
      suppliersApi.getSupplierById(id),
      suppliersApi.getSupplierActivities(id),
    ]);
    if (supRes.success) setSupplier(supRes.data);
    if (actRes.success) setActivities(actRes.data);
    setIsLoading(false);
  };

  if (isLoading || !supplier) {
    return (
      <div className="supplier-detail-page animate-fade-in pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-detail-page animate-fade-in pb-5">
      <PageHeader
        title={`Ta'minotchi Profili: ${supplier.companyName}`}
        subtitle={`Mas'ul shaxs: ${supplier.contactPerson} — ${supplier.phone}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Ta\'minotchilar', path: ROUTES.PROTECTED.SUPPLIERS },
          { label: supplier.companyName },
        ]}
        actions={
          <Link to={ROUTES.PROTECTED.SUPPLIERS} className="btn btn-outline-secondary btn-sm">
            <i className={`bi ${ERP_ICONS.CHEVRON_LEFT} me-1`}></i> Ro'yxatga Qaytish
          </Link>
        }
      />

      <div className="row g-3">
        {/* Left Profile Overview Card */}
        <div className="col-12 col-lg-4">
          <Card className="p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                style={{ width: '54px', height: '54px' }}
              >
                <i className={`bi ${ERP_ICONS.WAREHOUSE}`}></i>
              </div>
              <div>
                <h5 className="fw-bold text-main mb-0 font-heading">{supplier.companyName}</h5>
                <small className="text-muted-custom">STIR: {supplier.tin}</small>
              </div>
            </div>

            <div className="mb-3">
              <StatusBadge status={supplier.status} />
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div>
                <small className="text-muted-custom d-block">Mas'ul Vakil:</small>
                <strong className="text-main">{supplier.contactPerson}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Telefon Raqami:</small>
                <strong className="text-main">{supplier.phone}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Email Manzili:</small>
                <strong className="text-main">{supplier.email || 'Ko\'rsatilmadi'}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Manzili:</small>
                <strong className="text-main">{supplier.address}</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Details & Placeholders Tabs */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {/* Notes Card */}
            <Card title="Hamkorlik va Shartnoma Shartlari">
              <p className="fs-7 text-main mb-0">{supplier.notes || 'Qo\'shimcha izoh kiritilmagan.'}</p>
            </Card>

            {/* Supplied Products Placeholder Card */}
            <Card title="Yetkazib Berilayotgan Xomashyo va Mahsulotlar (Supplied Products)">
              <div className="p-3 bg-body-custom rounded-3 border-custom text-center">
                <i className={`bi ${ERP_ICONS.WAREHOUSE} fs-3 text-muted-custom d-block mb-2`}></i>
                <p className="fs-7 text-muted-custom mb-0">
                  Ushbu ta'minotchi orqali kirim qilingan metall va detallar kelgusi **Omborxona (Warehouse)** modulida avtomatik bog'lanadi.
                </p>
              </div>
            </Card>

            {/* Purchase History Placeholder Card */}
            <Card title="Xaridlar va Shartnomalar Tarixi (Purchase History)">
              <div className="p-3 bg-body-custom rounded-3 border-custom text-center">
                <i className={`bi ${ERP_ICONS.FINANCE} fs-3 text-muted-custom d-block mb-2`}></i>
                <p className="fs-7 text-muted-custom mb-0">
                  Tijorat xaridlari va to'lov hisobotlari kelgusi **Moliya va Xaridlar (Purchasing & Finance)** modulida ko'rsatiladi.
                </p>
              </div>
            </Card>

            {/* Activity Timeline Card */}
            <Card title="Ta'minotchi Bilan Bog'liq Harakatlar Tarixi">
              <Timeline items={activities} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

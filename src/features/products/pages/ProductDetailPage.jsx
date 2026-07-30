import { formatCurrency } from '@/utils/currency.utils';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { productsApi } from '../api/productsApi';
import { ERP_ICONS } from '@/shared/icons';
import { ROUTES } from '@/constants/routes.constants';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    setIsLoading(true);
    const [prodRes, actRes] = await Promise.all([
      productsApi.getProductById(id),
      productsApi.getProductActivities(id),
    ]);
    if (prodRes.success) setProduct(prodRes.data);
    if (actRes.success) setActivities(actRes.data);
    setIsLoading(false);
  };

  if (isLoading || !product) {
    return (
      <div className="product-detail-page animate-fade-in pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page animate-fade-in pb-5">
      <PageHeader
        title={`Mahsulot Kartochkasi: ${product.name}`}
        subtitle={`Kodi: ${product.internalCode} — ${product.categoryName}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Mahsulotlar', path: ROUTES.PROTECTED.PRODUCTS },
          { label: product.name },
        ]}
        actions={
          <Link to={ROUTES.PROTECTED.PRODUCTS} className="btn btn-outline-secondary btn-sm">
            <i className={`bi ${ERP_ICONS.CHEVRON_LEFT} me-1`}></i> Ro'yxatga Qaytish
          </Link>
        }
      />

      <div className="row g-3">
        {/* Left Card: Basic Specs & QR Code */}
        <div className="col-12 col-lg-4">
          <Card className="p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                style={{ width: '56px', height: '56px' }}
              >
                <i className={`bi ${ERP_ICONS.WAREHOUSE}`}></i>
              </div>
              <div>
                <h6 className="fw-bold text-main mb-0 font-heading">{product.name}</h6>
                <small className="text-muted-custom">SKU: {product.internalCode}</small>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center justify-content-between">
              <StatusBadge status={product.status} />
              <span className="badge bg-secondary bg-opacity-10 text-secondary fs-8">{product.materialTypeName}</span>
            </div>

            <hr className="border-custom my-3" />

            {/* QR Code Indicator */}
            <div className="p-3 bg-body-custom rounded-3 border-custom text-center mb-3">
              <i className="bi bi-qr-code fs-1 text-primary d-block mb-1"></i>
              <strong className="fs-8 text-main d-block">{product.qrCode}</strong>
              <small className="text-muted-custom fs-8">Shtrix-kod: {product.barcode}</small>
            </div>

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div>
                <small className="text-muted-custom d-block">Xarid Stavkasi Narxi:</small>
                <strong className="text-primary fs-5">{formatCurrency(product.purchasePrice)}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Mavjud Ombor Zaxirasi:</small>
                <strong className="text-success fs-6">{product.currentStock} {product.unitName}</strong>
              </div>
              <div>
                <small className="text-muted-custom d-block">Minimal Zaxira Chegarasi:</small>
                <strong className="text-main">{product.minStock} {product.unitName}</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Details */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {/* Description & Supplier */}
            <Card title="Asosiy Xarakteristika va Ta'minotchi">
              <div className="row g-3 fs-7 mb-3">
                <div className="col-12 col-sm-6">
                  <small className="text-muted-custom d-block">Kategoriya:</small>
                  <strong className="text-main">{product.categoryName}</strong>
                </div>
                <div className="col-12 col-sm-6">
                  <small className="text-muted-custom d-block">Material Turi:</small>
                  <strong className="text-main">{product.materialTypeName}</strong>
                </div>
                <div className="col-12 col-sm-6">
                  <small className="text-muted-custom d-block">Rasmiy Ta'minotchi:</small>
                  <strong className="text-main">{product.supplierName}</strong>
                </div>
                <div className="col-12 col-sm-6">
                  <small className="text-muted-custom d-block">O'lchov Birligi:</small>
                  <strong className="text-main">{product.unitName}</strong>
                </div>
              </div>
              <p className="fs-7 text-main mb-0">{product.description || 'Texnik tavsif kiritilmagan.'}</p>
            </Card>

            {/* Warehouse Stock Location Placeholder */}
            <Card title="Omborxona va Sex Joylashuvi (Warehouse Location)">
              <div className="p-3 bg-body-custom rounded-3 border-custom text-center">
                <i className={`bi ${ERP_ICONS.WAREHOUSE} fs-3 text-muted-custom d-block mb-2`}></i>
                <p className="fs-7 text-muted-custom mb-0">
                  Ushbu xomashyoning muayyan ombor rastasi va yacheykalar bo'yicha harakatlari kelgusi **Omborxona va Zaxiralar (Warehouse)** modulida aks etadi.
                </p>
              </div>
            </Card>

            {/* Activity History */}
            <Card title="Mahsulot Harakatlari va Kirim Tarixi">
              <Timeline items={activities} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

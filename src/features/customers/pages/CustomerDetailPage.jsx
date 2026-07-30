import { formatCurrency } from '@/utils/currency.utils';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuChevronLeft, LuUsers, LuPhone, LuMail, LuMapPin, LuPlus, LuShoppingBag, LuShoppingCart, LuWrench, LuFileText } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { CustomersSubNav } from '../components/CustomersSubNav';
import { customersApi } from '../api/customersApi';
import { notifySuccess } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCustomerDetails();
  }, [id]);

  const loadCustomerDetails = async () => {
    setIsLoading(true);
    const res = await customersApi.getCustomerById(id);
    if (res.success) setCustomer(res.data);
    setIsLoading(false);
  };

  const handleQuickAction = (actionName) => {
    notifySuccess(`'${actionName}' funksiyasi kelgusi modullar integratsiyasida faollashtiriladi.`);
  };

  if (isLoading || !customer) {
    return (
      <div className="customer-detail-page animate-fade-in pb-5">
        <CustomersSubNav />
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

  const timelineItems = (customer.timeline || []).map((tl) => ({
    id: tl.id,
    title: tl.title,
    description: tl.description,
    timestamp: tl.timestamp,
    icon: 'bi-person-check',
  }));

  return (
    <div className="customer-detail-page animate-fade-in pb-5">
      <CustomersSubNav />

      <PageHeader
        title={`Mijoz Profili: ${customer.customerName}`}
        subtitle={`Mijoz Turi: ${customer.customerTypeName} — Hudud: ${customer.region}`}
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Mijozlar', path: ROUTES.PROTECTED.CUSTOMERS },
          { label: customer.customerName },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Link to={ROUTES.PROTECTED.CUSTOMERS} className="btn btn-outline-secondary btn-sm">
              <LuChevronLeft className="me-1" /> Katalogga Qaytish
            </Link>

            {/* Quick Action Placeholder Buttons */}
            <Button variant="outline-primary" size="sm" onClick={() => handleQuickAction("Yangi Buyurtma")}>
              <LuPlus className="me-1" /> Yangi Buyurtma
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleQuickAction("Yangi Sotuv")}>
              <LuPlus className="me-1" /> Yangi Sotuv
            </Button>
            <Button variant="outline-info" size="sm" onClick={() => handleQuickAction("Yangi Servis")}>
              <LuWrench className="me-1" /> Yangi Servis
            </Button>
          </div>
        }
      />

      <div className="row g-3">
        {/* Left Column: Customer Profile Card */}
        <div className="col-12 col-lg-4">
          <Card className="p-4 mb-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-3 bg-info text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: '64px', height: '64px' }}
              >
                <LuUsers />
              </div>
              <div>
                <h6 className="fw-bold text-main mb-0 font-heading">{customer.customerName}</h6>
                <span className="badge bg-secondary bg-opacity-10 text-secondary fs-8">{customer.customerTypeName}</span>
              </div>
            </div>

            <div className="mb-3">
              <span className={`badge ${customer.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'} fs-8`}>
                {customer.status === 'ACTIVE' ? 'Faol Hamkor' : 'Nofaol'}
              </span>
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <LuPhone className="text-primary" />
                <span>Asosiy Tel: <strong>{customer.phone}</strong></span>
              </div>
              {customer.altPhone && (
                <div className="d-flex align-items-center gap-2">
                  <LuPhone className="text-muted-custom" />
                  <span>Qo'shimcha: <strong>{customer.altPhone}</strong></span>
                </div>
              )}
              {customer.email && (
                <div className="d-flex align-items-center gap-2">
                  <LuMail className="text-info" />
                  <span>Email: <strong>{customer.email}</strong></span>
                </div>
              )}
              <div className="d-flex align-items-center gap-2">
                <LuMapPin className="text-danger" />
                <span>Manzil: <strong>{customer.region}, {customer.district || ''} {customer.address || ''}</strong></span>
              </div>
              {customer.tin && (
                <div>
                  <small className="text-muted-custom d-block">STIR / TIN:</small>
                  <strong className="text-main">{customer.tin}</strong>
                </div>
              )}
              {customer.passport && (
                <div>
                  <small className="text-muted-custom d-block">Pasport / JShSHIR:</small>
                  <strong className="text-main">{customer.passport}</strong>
                </div>
              )}
            </div>

            <hr className="border-custom my-3" />

            <div className="text-start fs-7 d-flex flex-column gap-1 bg-body-custom p-3 rounded-3 border-custom">
              <div className="d-flex justify-content-between">
                <span className="text-muted-custom">So'nggi Xarid Sanasi:</span>
                <span>{customer.lastPurchaseDate}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold pt-2 border-top border-custom text-primary fs-6">
                <span>Jami Xaridlari:</span>
                <span>{formatCurrency(customer.totalPurchases || 0)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Dynamic Tabs & Details */}
        <div className="col-12 col-lg-8">
          {/* Navigation Tabs */}
          <div className="bg-surface border-custom rounded-3 p-1 mb-3 shadow-sm">
            <ul className="nav nav-pills d-flex flex-wrap gap-1">
              <li className="nav-item">
                <button
                  className={`nav-link fs-7 py-2 px-3 ${activeTab === 'overview' ? 'active bg-primary text-white' : 'text-main'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Umumiy Ma'lumot
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fs-7 py-2 px-3 ${activeTab === 'purchases' ? 'active bg-primary text-white' : 'text-main'}`}
                  onClick={() => setActiveTab('purchases')}
                >
                  Xaridlar Tarixi
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link fs-7 py-2 px-3 ${activeTab === 'warranty' ? 'active bg-primary text-white' : 'text-main'}`}
                  onClick={() => setActiveTab('warranty')}
                >
                  Kafolat & Servis
                </button>
              </li>
            </ul>
          </div>

          <div className="d-flex flex-column gap-3">
            {activeTab === 'overview' && (
              <>
                <Card title="Mijoz Eslatmalari va Shartnoma Izohi">
                  <p className="fs-7 text-main mb-0">{customer.notes || 'Izoh kiritilmagan.'}</p>
                </Card>

                <Card title="Biriktirilgan Hujjatlar va Shartnomalar">
                  <Table columns={attachmentColumns} data={customer.attachments || []} />
                </Card>

                <Card title="Mijoz Harakatlari Tarixi">
                  <Timeline items={timelineItems} />
                </Card>
              </>
            )}

            {activeTab === 'purchases' && (
              <Card title="Mijoz Xaridlar va Buyurtmalar Tarixi">
                <div className="p-4 text-center text-muted-custom fs-7">
                  <LuShoppingCart className="fs-1 d-block mx-auto mb-2 text-primary opacity-50" />
                  Ushbu mijoz bo'yicha sotuvlar va buyurtmalar tarixi kelgusi Sales & Orders modullarida integratsiya qilinadi.
                </div>
              </Card>
            )}

            {activeTab === 'warranty' && (
              <Card title="Kafolat Muddatlari va Servis Jurnali">
                <div className="p-4 text-center text-muted-custom fs-7">
                  <LuWrench className="fs-1 d-block mx-auto mb-2 text-info opacity-50" />
                  Mijoz uskunalari kafolati va texnik servis xizmatlari jurnali kelgusi Warranty & Service modullarida ko'rinadi.
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

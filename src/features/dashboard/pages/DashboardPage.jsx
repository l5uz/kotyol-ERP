import React from 'react';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { StatCardsGrid } from '../components/StatCardsGrid';
import { SalesExpensesChart } from '../components/SalesExpensesChart';
import { ProductionWarehouseChart } from '../components/ProductionWarehouseChart';
import { LatestOrdersWidget } from '../components/LatestOrdersWidget';
import { NotificationsWidget } from '../components/NotificationsWidget';
import { RecentActivitiesWidget } from '../components/RecentActivitiesWidget';
import { SystemStatusWidget } from '../components/SystemStatusWidget';
import { ERP_ICONS } from '@/shared/icons';

export const DashboardPage = () => {
  return (
    <div className="dashboard-page animate-fade-in pb-5">
      <PageHeader
        title="Ijroiya Boshqaruv Paneli"
        subtitle="Ishlab chiqarish korxonasi operatsion ko'rsatkichlari va umumiy tahlili"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Boshqaruv paneli' },
        ]}
        actions={
          <button className="btn btn-outline-secondary btn-sm">
            <i className={`bi ${ERP_ICONS.CALENDAR} me-1`}></i> Joriy Oy
          </button>
        }
      />

      {/* 8 Statistics Cards Grid */}
      <StatCardsGrid />

      {/* Charts Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <SalesExpensesChart />
        </div>
        <div className="col-12 col-lg-6">
          <ProductionWarehouseChart />
        </div>
      </div>

      {/* Latest Orders & Notifications Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-7">
          <LatestOrdersWidget />
        </div>
        <div className="col-12 col-lg-5">
          <NotificationsWidget />
        </div>
      </div>

      {/* Recent Activities & System Status Row */}
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <RecentActivitiesWidget />
        </div>
        <div className="col-12 col-lg-5">
          <SystemStatusWidget />
        </div>
      </div>
    </div>
  );
};

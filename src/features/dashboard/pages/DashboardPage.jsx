import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { StatCardsGrid } from '../components/StatCardsGrid';
import { SalesExpensesChart } from '../components/SalesExpensesChart';
import { ProductionWarehouseChart } from '../components/ProductionWarehouseChart';
import { LatestOrdersWidget } from '../components/LatestOrdersWidget';
import { NotificationsWidget } from '../components/NotificationsWidget';
import { RecentActivitiesWidget } from '../components/RecentActivitiesWidget';
import { SystemStatusWidget } from '../components/SystemStatusWidget';
import { dashboardApi } from '../api/dashboardApi';
import { ordersApi } from '@/features/orders/api/ordersApi';
import { warehouseApi } from '@/features/warehouse/api/warehouseApi';
import { productionApi } from '@/features/production/api/productionApi';
import { activitiesApi } from '@/features/activities/api/activitiesApi';
import { ERP_ICONS } from '@/shared/icons';

export const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemStatus, setSystemStatus] = useState({});
  const [chartsData, setChartsData] = useState({ salesExpenses: [], prodWarehouse: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        ordersRes,
        warehouseStatsRes,
        productionOrdersRes,
        activitiesRes,
        notificationsRes,
        systemStatusRes,
        summaryRes,
        chartsRes
      ] = await Promise.all([
        ordersApi.getOrders().catch(() => ({ success: false, data: [] })),
        warehouseApi.getWarehouseStats().catch(() => ({ success: false, data: {} })),
        productionApi.getProductionOrders().catch(() => ({ success: false, data: [] })),
        activitiesApi.getActivities().catch(() => ({ success: false, data: [] })),
        dashboardApi.getNotifications().catch(() => ({ success: false, data: [] })),
        dashboardApi.getSystemStatus().catch(() => ({ success: false, data: {} })),
        dashboardApi.getSummary().catch(() => ({ success: false, data: {} })),
        dashboardApi.getCharts().catch(() => ({ success: false, data: {} }))
      ]);

      const activeOrdersCount = ordersRes.success ? ordersRes.data.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length : 0;
      const activeProdCount = productionOrdersRes.success ? productionOrdersRes.data.filter(b => b.status === 'IN_PROGRESS').length : 0;
      const totalQty = warehouseStatsRes.success ? warehouseStatsRes.data.totalQuantity : 0;
      const lowStock = warehouseStatsRes.success ? warehouseStatsRes.data.lowStockAlerts : 0;

      setStats({
        activeOrders: activeOrdersCount,
        activeProduction: activeProdCount,
        totalStockQuantity: totalQty,
        lowStockAlerts: lowStock,
      });

      if (ordersRes.success) setOrders(ordersRes.data);
      if (activitiesRes.success) setActivities(activitiesRes.data);
      if (notificationsRes.success) setNotifications(notificationsRes.data);
      if (systemStatusRes.success) setSystemStatus(systemStatusRes.data);

      if (chartsRes.success && chartsRes.data) {
        setChartsData({
          salesExpenses: chartsRes.data.salesExpenses || [],
          prodWarehouse: chartsRes.data.prodWarehouse || []
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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
          <button className="btn btn-outline-secondary btn-sm" onClick={loadDashboardData} disabled={isLoading}>
            <i className={`bi ${ERP_ICONS.CALENDAR} me-1`}></i> Yangilash
          </button>
        }
      />

      <StatCardsGrid stats={stats} />

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <SalesExpensesChart data={chartsData.salesExpenses} />
        </div>
        <div className="col-12 col-lg-6">
          <ProductionWarehouseChart data={chartsData.prodWarehouse} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-7">
          <LatestOrdersWidget orders={orders} />
        </div>
        <div className="col-12 col-lg-5">
          <NotificationsWidget notifications={notifications} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <RecentActivitiesWidget activities={activities} />
        </div>
        <div className="col-12 col-lg-5">
          <SystemStatusWidget status={systemStatus} />
        </div>
      </div>
    </div>
  );
};

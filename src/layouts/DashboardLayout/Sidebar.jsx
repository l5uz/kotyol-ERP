import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuBoxes,
  LuBookOpen,
  LuFlame,
  LuTruck,
  LuShoppingBag,
  LuWarehouse,
  LuSettings2,
  LuBadgeDollarSign,
  LuShoppingCart,
  LuWrench,
  LuFileText,
  LuActivity,
  LuShieldCheck,
  LuServer,
  LuUsers,
  LuUserCheck,
  LuSlidersHorizontal,
  LuCpu,
  LuClipboardList,
  LuChevronRight,
  LuChevronDown,
  LuChevronUp,
  LuX,
  LuArrowUpRight,
  LuArrowDownLeft,
  LuBriefcase,
  LuFilter,
} from 'react-icons/lu';
import { useSidebarStore } from '@/store/useSidebarStore';
import { ROUTES } from '@/constants/routes.constants';

const SETTINGS_SUB_PAGES = [
  { label: 'Kompaniya Sozlamalari', path: ROUTES.PROTECTED.SETTINGS_COMPANY, icon: LuSlidersHorizontal },
  { label: 'Valyuta va Kurslar', path: ROUTES.PROTECTED.SETTINGS_CURRENCY, icon: LuSlidersHorizontal },
  { label: 'Omborlar Sozlamalari', path: ROUTES.PROTECTED.SETTINGS_WAREHOUSE, icon: LuSlidersHorizontal },
  { label: 'Mahsulot Kategoriyalari', path: ROUTES.PROTECTED.SETTINGS_CATEGORIES, icon: LuSlidersHorizontal },
  { label: 'O\'lchov Birliklari', path: ROUTES.PROTECTED.SETTINGS_UNITS, icon: LuSlidersHorizontal },
  { label: 'Xarajat Turlari', path: ROUTES.PROTECTED.SETTINGS_EXPENSE_TYPES, icon: LuSlidersHorizontal },
  { label: 'Defekt Sabablari', path: ROUTES.PROTECTED.SETTINGS_DEFECT_REASONS, icon: LuSlidersHorizontal },
  { label: 'Texnologik Bosqichlar', path: ROUTES.PROTECTED.SETTINGS_PRODUCTION_STAGES, icon: LuSlidersHorizontal },
  { label: 'Servis Turlari', path: ROUTES.PROTECTED.SETTINGS_SERVICE_TYPES, icon: LuSlidersHorizontal },
  { label: 'Kafolat Turlari', path: ROUTES.PROTECTED.SETTINGS_WARRANTY_TYPES, icon: LuSlidersHorizontal },
  { label: 'Sug\'urta Turlari', path: ROUTES.PROTECTED.SETTINGS_INSURANCE_TYPES, icon: LuSlidersHorizontal },
  { label: 'Rollar va Lavozimlar', path: ROUTES.PROTECTED.SETTINGS_ROLES, icon: LuSlidersHorizontal },
  { label: 'Ruxsatlar Matritsasi', path: ROUTES.PROTECTED.SETTINGS_PERMISSIONS, icon: LuSlidersHorizontal },
  { label: 'Filiallar Boshqaruvi', path: ROUTES.PROTECTED.SETTINGS_BRANCHES, icon: LuSlidersHorizontal },
  { label: 'Filiallar Statistikasi', path: ROUTES.PROTECTED.SETTINGS_BRANCHES_STATS, icon: LuSlidersHorizontal },
];

const WAREHOUSE_SUB_PAGES = [
  { label: 'Mavjud Zaxiralar', path: ROUTES.PROTECTED.WAREHOUSE_STOCK, icon: LuBoxes },
  { label: 'Ombor Harakatlari', path: ROUTES.PROTECTED.WAREHOUSE_MOVEMENTS, icon: LuActivity },
  { label: 'Qayta Baholash', path: ROUTES.PROTECTED.WAREHOUSE_REVALUATION, icon: LuBadgeDollarSign },
  { label: 'Inventarizatsiya', path: ROUTES.PROTECTED.WAREHOUSE_INVENTORY_COUNT, icon: LuClipboardList },
];

const REPORTS_SUB_PAGES = [
  { label: 'Umumiy Hisobot', path: ROUTES.PROTECTED.REPORTS, icon: LuFileText },
  { label: 'Sotuv Hisoboti', path: ROUTES.PROTECTED.REPORTS_SALES, icon: LuShoppingCart },
  { label: 'Ombor Hisoboti', path: ROUTES.PROTECTED.REPORTS_WAREHOUSE, icon: LuWarehouse },
  { label: 'Ishlab Chiqarish Hisoboti', path: ROUTES.PROTECTED.REPORTS_PRODUCTION, icon: LuSettings2 },
  { label: 'Moliya Hisoboti', path: ROUTES.PROTECTED.REPORTS_FINANCE, icon: LuBadgeDollarSign },
  { label: 'Servis Hisoboti', path: ROUTES.PROTECTED.REPORTS_SERVICES, icon: LuWrench },
];

const FINANCE_SUB_PAGES = [
  { label: 'Moliya Boshqaruvi', path: ROUTES.PROTECTED.FINANCE, icon: LuLayoutDashboard },
  { label: 'Xarajatlar Reyestri', path: '/finance/expenses', icon: LuArrowUpRight },
  { label: 'Daromadlar Reyestri', path: '/finance/incomes', icon: LuArrowDownLeft },
];

const EMPLOYEES_SUB_PAGES = [
  { label: 'Xodimlar Ro\'yxati', path: ROUTES.PROTECTED.EMPLOYEES, icon: LuUsers },
  { label: 'Lavozimlar Boshqaruvi', path: ROUTES.PROTECTED.EMPLOYEES_POSITIONS, icon: LuBriefcase },
  { label: 'Oylik Turlari', path: ROUTES.PROTECTED.EMPLOYEES_SALARY_TYPES, icon: LuBadgeDollarSign },
  { label: 'Ish Faolligi', path: ROUTES.PROTECTED.EMPLOYEES_ACTIVITY, icon: LuActivity },
];

const SERVICES_SUB_PAGES = [
  { label: 'Servislar Reyestri', path: ROUTES.PROTECTED.SERVICES, icon: LuWrench },
  { label: 'Mijozlar Katalogi', path: ROUTES.PROTECTED.CUSTOMERS, icon: LuUserCheck },
  { label: 'Kotyol Modellari', path: ROUTES.PROTECTED.BOILERS, icon: LuFlame },
];

const MASTER_DATA_SUB_PAGES = [
  { label: 'Mahsulot Kategoriyalari', path: '/settings/master-data?type=productCategories', icon: LuBoxes },
  { label: 'O\'lchov Birliklari', path: '/settings/master-data?type=units', icon: LuSlidersHorizontal },
  { label: 'Mijoz Turlari', path: '/settings/master-data?type=customerTypes', icon: LuUsers },
  { label: 'Servis va Ta\'mir Turlari', path: '/settings/master-data?type=serviceTypes', icon: LuWrench },
  { label: 'Kafolat Turlari', path: '/settings/master-data?type=warrantyTypes', icon: LuSettings2 },
  { label: 'Ustuvorlik Darajalari', path: '/settings/master-data?type=priorities', icon: LuFilter },
  { label: 'Buyurtma Maqomlari', path: '/settings/master-data?type=orderStatuses', icon: LuSlidersHorizontal },
];

const MENU_CATEGORIES = [
  {
    id: 'dashboard',
    label: 'Asosiy',
    icon: LuLayoutDashboard,
    items: [
      { label: 'Boshqaruv', path: ROUTES.PROTECTED.DASHBOARD, icon: LuLayoutDashboard },
      { label: 'Faoliyatlar', path: ROUTES.PROTECTED.ACTIVITIES, icon: LuActivity },
      { label: 'Hisobotlar', path: ROUTES.PROTECTED.REPORTS, icon: LuFileText, isParent: true },
    ],
  },
  {
    id: 'sales',
    label: 'Savdo',
    icon: LuShoppingCart,
    items: [
      { label: 'Buyurtmalar', path: ROUTES.PROTECTED.ORDERS, icon: LuClipboardList },
      { label: 'Sotuv', path: ROUTES.PROTECTED.SALES, icon: LuShoppingCart },
      { label: 'Mijozlar', path: ROUTES.PROTECTED.CUSTOMERS, icon: LuUserCheck },
    ],
  },
  {
    id: 'production',
    label: 'Zavod',
    icon: LuSettings2,
    items: [
      { label: 'Ishlab chiqarish', path: ROUTES.PROTECTED.PRODUCTION, icon: LuSettings2 },
      { label: 'Retseptlar', path: ROUTES.PROTECTED.RECIPES, icon: LuBookOpen },
      { label: 'Kotyol Turlari', path: ROUTES.PROTECTED.BOILERS, icon: LuFlame },
      { label: 'Mahsulotlar', path: ROUTES.PROTECTED.PRODUCTS, icon: LuBoxes },
    ],
  },
  {
    id: 'warehouse',
    label: 'Ombor',
    icon: LuWarehouse,
    items: [
      { label: 'Omborxona', path: ROUTES.PROTECTED.WAREHOUSE_STOCK, icon: LuWarehouse, isParent: true },
      { label: 'Ta\'minotchilar', path: ROUTES.PROTECTED.SUPPLIERS, icon: LuTruck },
      { label: 'Xaridlar', path: ROUTES.PROTECTED.PURCHASING, icon: LuShoppingBag },
    ],
  },
  {
    id: 'finance',
    label: 'Moliya',
    icon: LuBadgeDollarSign,
    items: [
      { label: 'Moliya Boshqaruvi', path: ROUTES.PROTECTED.FINANCE, icon: LuBadgeDollarSign, isParent: true },
      { label: 'Xodimlar', path: ROUTES.PROTECTED.EMPLOYEES, icon: LuUsers, isParent: true },
      { label: 'Servis', path: ROUTES.PROTECTED.SERVICES, icon: LuWrench, isParent: true },
    ],
  },
  {
    id: 'settings',
    label: 'Sozlamalar',
    icon: LuSlidersHorizontal,
    items: [
      { label: 'Tizim Injini', path: ROUTES.PROTECTED.SYSTEM, icon: LuServer },
      { label: 'Audit Jurnali', path: ROUTES.PROTECTED.AUDIT, icon: LuShieldCheck },
      { label: 'Master Data Boshqaruvi', path: ROUTES.PROTECTED.MASTER_DATA, icon: LuBoxes, isParent: true },
      { label: 'Sozlamalar', path: ROUTES.PROTECTED.SETTINGS_COMPANY, icon: LuSlidersHorizontal, isParent: true },
    ],
  },
];

export const Sidebar = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Find active category based on current URL path
  const activeCategoryByRoute = MENU_CATEGORIES.find((cat) =>
    cat.items.some((item) => {
      if (item.path === '/') return location.pathname === '/';
      return location.pathname.startsWith(item.path);
    })
  ) || MENU_CATEGORIES[0];

  const getInitialNestedType = () => {
    if (location.pathname.startsWith('/settings/master-data')) return 'master-data';
    if (location.pathname.startsWith('/settings')) return 'settings';
    if (location.pathname.startsWith('/warehouse')) return 'warehouse';
    if (location.pathname.startsWith('/reports')) return 'reports';
    if (location.pathname.startsWith('/finance')) return 'finance';
    if (location.pathname.startsWith('/employees')) return 'employees';
    if (location.pathname.startsWith('/services')) return 'services';
    return null;
  };

  const [selectedCatId, setSelectedCatId] = useState(activeCategoryByRoute.id);
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [popoverTop, setPopoverTop] = useState(70);
  const [nestedType, setNestedType] = useState(getInitialNestedType());

  // Sync selected category if route changes
  useEffect(() => {
    if (activeCategoryByRoute) {
      setSelectedCatId(activeCategoryByRoute.id);
    }
  }, [location.pathname]);

  // Sync nested popover open state based on path
  useEffect(() => {
    if (selectedCatId === 'settings') {
      if (location.pathname.startsWith('/settings/master-data')) {
        setNestedType('master-data');
      } else if (location.pathname.startsWith('/settings')) {
        setNestedType('settings');
      } else {
        setNestedType(null);
      }
    } else if (selectedCatId === 'warehouse') {
      setNestedType(location.pathname.startsWith('/warehouse') ? 'warehouse' : null);
    } else if (selectedCatId === 'dashboard') {
      setNestedType(location.pathname.startsWith('/reports') ? 'reports' : null);
    } else if (selectedCatId === 'finance') {
      if (location.pathname.startsWith('/finance')) {
        setNestedType('finance');
      } else if (location.pathname.startsWith('/employees')) {
        setNestedType('employees');
      } else if (location.pathname.startsWith('/services')) {
        setNestedType('services');
      } else {
        setNestedType(null);
      }
    } else {
      setNestedType(null);
    }
  }, [location.pathname, selectedCatId]);

  // Click outside listener to close flyout popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsFlyoutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catId, event) => {
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopoverTop(rect.top);
    }

    if (selectedCatId === catId) {
      setIsFlyoutOpen((prev) => !prev);
    } else {
      setSelectedCatId(catId);
      setIsFlyoutOpen(true);
    }
  };

  const handleItemClick = (item, event) => {
    if (item.isParent) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      let targetType = null;
      if (selectedCatId === 'settings') {
        if (item.path.startsWith('/settings/master-data')) targetType = 'master-data';
        else targetType = 'settings';
      }
      else if (selectedCatId === 'warehouse') targetType = 'warehouse';
      else if (selectedCatId === 'dashboard') targetType = 'reports';
      else if (selectedCatId === 'finance') {
        if (item.path.startsWith('/finance')) targetType = 'finance';
        if (item.path.startsWith('/employees')) targetType = 'employees';
        if (item.path.startsWith('/services')) targetType = 'services';
      }

      setNestedType((prev) => (prev === targetType ? null : targetType));
      return;
    }
    setIsFlyoutOpen(false);
    setNestedType(null);
    closeMobileSidebar();
  };

  const selectedCategoryObj = MENU_CATEGORIES.find((c) => c.id === selectedCatId) || MENU_CATEGORIES[0];

  const renderItem = (item) => {
    const ItemIcon = item.icon;
    const isSettingsHub = item.path === ROUTES.PROTECTED.SETTINGS;
    const isActiveParent = item.isParent && (
      (selectedCatId === 'settings' && item.path.startsWith('/settings/master-data') && location.pathname.startsWith('/settings/master-data')) ||
      (selectedCatId === 'settings' && !item.path.startsWith('/settings/master-data') && location.pathname.startsWith('/settings') && !location.pathname.startsWith('/settings/master-data')) ||
      (selectedCatId === 'warehouse' && location.pathname.startsWith('/warehouse')) ||
      (selectedCatId === 'dashboard' && location.pathname.startsWith('/reports')) ||
      (selectedCatId === 'finance' && item.path.startsWith('/finance') && location.pathname.startsWith('/finance')) ||
      (selectedCatId === 'finance' && item.path.startsWith('/employees') && location.pathname.startsWith('/employees')) ||
      (selectedCatId === 'finance' && item.path.startsWith('/services') && location.pathname.startsWith('/services'))
    );

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === ROUTES.PROTECTED.DASHBOARD || isSettingsHub}
        onClick={(e) => handleItemClick(item, e)}
        className={({ isActive }) =>
          `d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-decoration-none transition-all ${
            isActive || isActiveParent
              ? 'bg-primary text-white shadow-sm fw-medium'
              : 'text-white-50 hover-bg-dark hover-text-white'
          }`
        }
      >
        <div className="d-flex align-items-center gap-2 text-truncate me-3">
          {ItemIcon && <ItemIcon className="fs-5 flex-shrink-0" />}
          <span className="text-truncate" style={{ fontSize: '0.82rem' }}>
            {item.label}
          </span>
        </div>
        <LuChevronRight className="fs-6 opacity-75 flex-shrink-0" />
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile & Click-outside Backdrop */}
      {isFlyoutOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 z-2"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            setIsFlyoutOpen(false);
            closeMobileSidebar();
          }}
        />
      )}

      <div ref={sidebarRef} className="position-relative z-3">
        {/* Fixed Compact Sidebar (80px) */}
        <aside
          className={`d-flex flex-column flex-shrink-0 transition-all ${
            isMobileOpen ? 'd-flex position-fixed start-0 top-0 h-100 z-3' : 'd-none d-md-flex'
          }`}
          style={{
            width: '80px',
            backgroundColor: 'var(--erp-sidebar-bg)',
            borderRight: '1px solid var(--erp-sidebar-border)',
            height: '100vh',
            position: 'sticky',
            top: 0,
          }}
        >
          {/* Brand Logo Header */}
          <div className="d-flex align-items-center justify-content-center p-2 border-bottom border-secondary border-opacity-25" style={{ height: '60px' }}>
            <div className="rounded-3 bg-primary text-white p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
              <LuCpu className="fs-4" />
            </div>
          </div>

          {/* Navigation Items (Category Buttons) */}
          <div className="flex-grow-1 overflow-y-auto py-2 px-1">
            <ul className="nav nav-pills flex-column gap-2 mb-auto">
              {MENU_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isCurrentCategoryRoute = cat.items.some((item) => item.path === location.pathname);
                const isSelected = selectedCatId === cat.id && isFlyoutOpen;

                return (
                  <li key={cat.id} className="nav-item">
                    <button
                      type="button"
                      onClick={(e) => handleCategoryClick(cat.id, e)}
                      className={`nav-link w-100 d-flex flex-column align-items-center text-center p-2 rounded-3 transition-all border-0 position-relative ${
                        isSelected || isCurrentCategoryRoute
                          ? 'active bg-primary text-white shadow-sm fw-bold'
                          : 'text-white-50 hover-bg-dark'
                      }`}
                      style={{ background: isSelected || isCurrentCategoryRoute ? 'var(--bs-primary)' : 'transparent' }}
                      title={cat.label}
                    >
                      <Icon className="fs-5" />
                      <span className="fw-medium text-truncate w-100 mt-1" style={{ fontSize: '0.68rem', lineHeight: '1.1' }}>
                        {cat.label}
                      </span>
                      {isCurrentCategoryRoute && (
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y bg-info rounded-pill"
                          style={{ width: '4px', height: '18px' }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Popover Sub-Menu Panel (Unclipped Fixed Position Aligned to Clicked Category Button) */}
        {isFlyoutOpen && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '84px',
              top: `${Math.min(Math.max(10, popoverTop - 10), Math.max(10, window.innerHeight - 240))}px`,
              width: '230px',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                BO'LIM SAHIFALARI
              </span>
              <button
                type="button"
                className="btn btn-sm text-white-50 p-0 text-decoration-none hover-text-white border-0 bg-transparent"
                onClick={() => setIsFlyoutOpen(false)}
              >
                <LuX className="fs-6" />
              </button>
            </div>

            {/* List of Sub-Items */}
            <div className="d-flex flex-column gap-1">
              {selectedCategoryObj.items.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Settings */}
        {isFlyoutOpen && selectedCatId === 'settings' && nestedType === 'settings' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 420))}px`,
              width: '500px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                SOZLAMALAR RO'YXATI
              </span>
            </div>

            {/* List of Sub-Settings Pages */}
            <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {SETTINGS_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Warehouse */}
        {isFlyoutOpen && selectedCatId === 'warehouse' && nestedType === 'warehouse' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 250))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                OMBOR RO'YXATI
              </span>
            </div>

            {/* List of Sub-Warehouse Pages */}
            <div className="d-flex flex-column gap-1">
              {WAREHOUSE_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Reports */}
        {isFlyoutOpen && selectedCatId === 'dashboard' && nestedType === 'reports' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 320))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                HISOBOTLAR RO'YXATI
              </span>
            </div>

            {/* List of Sub-Reports Pages */}
            <div className="d-flex flex-column gap-1">
              {REPORTS_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Finance */}
        {isFlyoutOpen && selectedCatId === 'finance' && nestedType === 'finance' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 250))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                MOLIYA RO'YXATI
              </span>
            </div>

            {/* List of Sub-Finance Pages */}
            <div className="d-flex flex-column gap-1">
              {FINANCE_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Employees */}
        {isFlyoutOpen && selectedCatId === 'finance' && nestedType === 'employees' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 250))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                XODIMLAR RO'YXATI
              </span>
            </div>

            {/* List of Sub-Employees Pages */}
            <div className="d-flex flex-column gap-1">
              {EMPLOYEES_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Services */}
        {isFlyoutOpen && selectedCatId === 'finance' && nestedType === 'services' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 250))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                SERVIS RO'YXATI
              </span>
            </div>

            {/* List of Sub-Services Pages */}
            <div className="d-flex flex-column gap-1">
              {SERVICES_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}

        {/* Second-Level Nested Popover for Master Data */}
        {isFlyoutOpen && selectedCatId === 'settings' && nestedType === 'master-data' && (
          <div
            className="position-fixed shadow-lg rounded-3 p-3 z-3 animate-fade-in"
            style={{
              left: '318px', // 84px + 230px + 4px gap = 318px
              top: `${Math.min(Math.max(10, popoverTop - 40), Math.max(10, window.innerHeight - 350))}px`,
              width: '250px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              backgroundColor: 'var(--erp-sidebar-bg)',
              border: '1px solid var(--erp-sidebar-border)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1060,
            }}
          >
            {/* Header Label */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1 pb-1 border-bottom border-secondary border-opacity-25">
              <span
                className="text-uppercase text-white-50 fw-bold"
                style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}
              >
                MASTER DATA RO'YXATI
              </span>
            </div>

            {/* List of Sub-Master-Data Pages */}
            <div className="d-flex flex-column gap-1">
              {MASTER_DATA_SUB_PAGES.map(renderItem)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

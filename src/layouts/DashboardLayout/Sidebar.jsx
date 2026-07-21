import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuBoxes,
  LuTruck,
  LuWarehouse,
  LuSettings2,
  LuBadgeDollarSign,
  LuShoppingCart,
  LuUsers,
  LuUserCheck,
  LuSlidersHorizontal,
  LuCpu,
} from 'react-icons/lu';
import { useSidebarStore } from '@/store/useSidebarStore';
import { ROUTES } from '@/constants/routes.constants';

const MENU_ITEMS = [
  { label: 'Boshqaruv', path: ROUTES.PROTECTED.DASHBOARD, icon: LuLayoutDashboard },
  { label: 'Mahsulot', path: ROUTES.PROTECTED.PRODUCTS, icon: LuBoxes },
  { label: 'Ta\'minot', path: ROUTES.PROTECTED.SUPPLIERS, icon: LuTruck },
  { label: 'Ombor', path: ROUTES.PROTECTED.WAREHOUSE, icon: LuWarehouse },
  { label: 'Ishlab ch.', path: ROUTES.PROTECTED.PRODUCTION, icon: LuSettings2 },
  { label: 'Moliya', path: ROUTES.PROTECTED.FINANCE, icon: LuBadgeDollarSign },
  { label: 'Sotuv', path: ROUTES.PROTECTED.SALES, icon: LuShoppingCart },
  { label: 'Xodimlar', path: ROUTES.PROTECTED.EMPLOYEES, icon: LuUsers },
  { label: 'Mijozlar', path: ROUTES.PROTECTED.CUSTOMERS, icon: LuUserCheck },
  { label: 'Sozlama', path: ROUTES.PROTECTED.SETTINGS, icon: LuSlidersHorizontal },
];

export const Sidebar = () => {
  const { isMobileOpen, closeMobileSidebar } = useSidebarStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2 d-md-none"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`d-flex flex-column flex-shrink-0 z-3 transition-all ${
          isMobileOpen ? 'd-flex position-fixed start-0 top-0 h-100' : 'd-none d-md-flex'
        }`}
        style={{
          width: '60px',
          backgroundColor: 'var(--erp-sidebar-bg)',
          borderRight: '1px solid var(--erp-sidebar-border)',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        {/* Header Branding Logo */}
        <div className="d-flex align-items-center justify-content-center p-2 border-bottom border-secondary border-opacity-25" style={{ height: '60px' }}>
          <div className="rounded-3 bg-primary text-white p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            <LuCpu className="fs-5" />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-grow-1 overflow-y-auto py-2 px-1">
          <ul className="nav nav-pills flex-column gap-2 mb-auto">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    end={item.path === ROUTES.PROTECTED.DASHBOARD}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `nav-link d-flex flex-column align-items-center text-center p-1 rounded-2 transition-all ${
                        isActive ? 'active bg-primary text-white shadow-sm' : 'text-white-50 hover-bg-dark'
                      }`
                    }
                    title={item.label}
                  >
                    <Icon className="fs-5" />
                    <span className="fw-medium text-truncate w-100 mt-1" style={{ fontSize: '0.62rem', lineHeight: '1' }}>
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuBoxes, LuArrowLeftRight, LuBadgeDollarSign, LuClipboardCheck } from 'react-icons/lu';
import { ROUTES } from '@/constants/routes.constants';

const SUB_NAV_ITEMS = [
  { label: 'Umumiy Ko\'rinish (Overview)', path: ROUTES.PROTECTED.WAREHOUSE, icon: LuLayoutDashboard },
  { label: 'Ombordagi Mahsulotlar (Stock)', path: ROUTES.PROTECTED.WAREHOUSE_STOCK, icon: LuBoxes },
  { label: 'Harakatlar (Movements)', path: ROUTES.PROTECTED.WAREHOUSE_MOVEMENTS, icon: LuArrowLeftRight },
  { label: 'Qayta Baholash (Revaluation)', path: ROUTES.PROTECTED.WAREHOUSE_REVALUATION, icon: LuBadgeDollarSign },
  { label: 'Inventarizatsiya (Count)', path: ROUTES.PROTECTED.WAREHOUSE_INVENTORY_COUNT, icon: LuClipboardCheck },
];

export const WarehouseSubNav = () => {
  return (
    <div className="warehouse-sub-nav bg-surface border-custom rounded-3 p-1 mb-4 shadow-sm">
      <ul className="nav nav-pills d-flex flex-wrap gap-1">
        {SUB_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                end={item.path === ROUTES.PROTECTED.WAREHOUSE}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 fs-7 px-3 py-2 fw-medium rounded-2 transition-all ${
                    isActive ? 'active bg-primary text-white shadow-sm' : 'text-main hover-bg-custom'
                  }`
                }
              >
                <Icon className="fs-6" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constants';

const SETTINGS_PAGES = [
  { label: 'General / Hub', path: ROUTES.PROTECTED.SETTINGS, icon: 'bi-grid-fill', end: true },
  { label: 'Kompaniya', path: ROUTES.PROTECTED.SETTINGS_COMPANY, icon: 'bi-building' },
  { label: 'Valyuta', path: ROUTES.PROTECTED.SETTINGS_CURRENCY, icon: 'bi-cash-stack' },
  { label: 'Omborlar', path: ROUTES.PROTECTED.SETTINGS_WAREHOUSE, icon: 'bi-box-seam' },
  { label: 'Kategoriyalar', path: ROUTES.PROTECTED.SETTINGS_CATEGORIES, icon: 'bi-tags' },
  { label: 'Birliklar', path: ROUTES.PROTECTED.SETTINGS_UNITS, icon: 'bi-rulers' },
  { label: 'Xarajat Turlari', path: ROUTES.PROTECTED.SETTINGS_EXPENSE_TYPES, icon: 'bi-receipt' },
  { label: 'Defekt Sabablari', path: ROUTES.PROTECTED.SETTINGS_DEFECT_REASONS, icon: 'bi-exclamation-triangle' },
  { label: 'Servis Turlari', path: ROUTES.PROTECTED.SETTINGS_SERVICE_TYPES, icon: 'bi-wrench' },
  { label: 'Kafolat Turlari', path: ROUTES.PROTECTED.SETTINGS_WARRANTY_TYPES, icon: 'bi-shield-check' },
  { label: 'Sug\'urta Turlari', path: ROUTES.PROTECTED.SETTINGS_INSURANCE_TYPES, icon: 'bi-file-earmark-medical' },
  { label: 'Bosqichlar (Stages)', path: ROUTES.PROTECTED.SETTINGS_PRODUCTION_STAGES, icon: 'bi-diagram-3' },
  { label: 'Rollar', path: ROUTES.PROTECTED.SETTINGS_ROLES, icon: 'bi-person-badge' },
  { label: 'Ruxsatlar Matritsasi', path: ROUTES.PROTECTED.SETTINGS_PERMISSIONS, icon: 'bi-lock' },
];

export const SettingsSubNav = () => {
  return (
    <div className="settings-subnav mb-4 border-bottom border-custom pb-2 overflow-x-auto">
      <ul className="nav nav-pills flex-nowrap gap-1">
        {SETTINGS_PAGES.map((item) => (
          <li key={item.path} className="nav-item">
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `nav-link fs-8 py-2 px-3 fw-medium d-inline-flex align-items-center gap-1 text-nowrap rounded-3 ${
                  isActive ? 'active bg-primary text-white shadow-sm' : 'text-muted-custom bg-body-custom border-custom'
                }`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { SUPPORTED_CURRENCIES } from '@/shared/currencies';
import { ERP_ICONS } from '@/shared/icons';
import { ROUTES } from '@/constants/routes.constants';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar = () => {
  const navigate = useNavigate();
  const { toggleMobileSidebar } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const { currency, setCurrency } = useCurrencyStore();
  const { user } = useUserStore();
  const { logout } = useAuthStore();
  const notifications = useNotificationStore((state) => state.notifications);

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  return (
    <>
      <header
        className="navbar navbar-expand bg-navbar-custom border-bottom border-custom sticky-top px-3"
        style={{ height: '60px', backgroundColor: 'var(--erp-navbar-bg)' }}
      >
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between">
          {/* Left Controls */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-light border-custom d-flex d-md-none align-items-center justify-content-center p-2"
              onClick={toggleMobileSidebar}
            >
              <i className="bi bi-list fs-5"></i>
            </button>

            {/* Global Search */}
            <div className="d-none d-sm-block" style={{ width: '280px' }}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Umumiy ERP qidiruv (Ctrl+K)..."
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Currency Selector (USD & UZS Only) */}
            <select
              className="form-select form-select-sm border-custom fs-8 fw-medium"
              style={{ width: '85px' }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(SUPPORTED_CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({SUPPORTED_CURRENCIES[code].symbol})
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              className="btn btn-sm btn-light border-custom p-2 d-flex align-items-center justify-content-center"
              onClick={toggleTheme}
              title={`${theme === 'light' ? 'Tungi' : 'Kunduzgi'} rejimga o'tish`}
            >
              <i className={`bi ${theme === 'light' ? ERP_ICONS.MOON : ERP_ICONS.SUN} text-warning fs-6`}></i>
            </button>

            {/* Notification Trigger */}
            <button
              className="btn btn-sm btn-light border-custom p-2 position-relative d-flex align-items-center justify-content-center"
              onClick={() => setIsNotifOpen(true)}
              title="Bildirishnomalar"
            >
              <i className={`bi ${ERP_ICONS.BELL} fs-6 text-main`}></i>
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">Yangi bildirishnomalar</span>
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="dropdown ms-2">
              <button
                className="btn btn-sm btn-light border-custom d-flex align-items-center gap-2 p-1 pe-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                >
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div className="d-none d-lg-block text-start" style={{ lineHeight: '1.2' }}>
                  <span className="fw-semibold text-main fs-8 d-block">{user?.name || 'Alex Vance'}</span>
                  <small className="text-muted-custom fs-8">{user?.role || 'Bosh administrator'}</small>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-custom shadow-sm p-1 fs-7">
                <li className="px-3 py-2 border-bottom border-custom">
                  <span className="fw-bold d-block text-main">{user?.name || 'Alex Vance'}</span>
                  <small className="text-muted-custom">{user?.email || 'alex.vance@kotyol.com'}</small>
                </li>
                <li>
                  <Link className="dropdown-item py-2 mt-1" to={ROUTES.PROTECTED.PROFILE}>
                    <i className="bi bi-person-circle me-2 text-primary"></i> Profil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2" to={ROUTES.PROTECTED.CHANGE_PASSWORD}>
                    <i className="bi bi-key-fill me-2 text-warning"></i> Parolni O'zgartirish
                  </Link>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                    <i className={`bi ${ERP_ICONS.LOGOUT} me-2`}></i> Chiqish
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};

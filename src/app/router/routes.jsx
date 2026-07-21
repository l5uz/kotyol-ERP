import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';
import { ChangePasswordPage } from '@/features/auth/pages/ChangePasswordPage';
import { SessionExpiredPage } from '@/features/auth/pages/SessionExpiredPage';

import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

import {
  WarehousePage,
  StockDetailPage,
  MovementsPage,
  MovementDetailPage,
  RevaluationPage,
  InventoryCountPage,
} from '@/features/warehouse';

import { ProductionPage } from '@/features/production/pages/ProductionPage';
import { SalesPage } from '@/features/sales/pages/SalesPage';
import { FinancePage } from '@/features/finance/pages/FinancePage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';

import { SuppliersPage, SupplierDetailPage } from '@/features/suppliers';
import { ProductsPage, ProductDetailPage } from '@/features/products';

import {
  EmployeesPage,
  EmployeeDetailPage,
  PositionsPage,
  SalaryTypesPage,
  EmployeeActivityPage,
} from '@/features/employees';

import {
  SettingsPage,
  CompanySettingsPage,
  CurrencySettingsPage,
  WarehouseSettingsPage,
  CategoriesSettingsPage,
  UnitsSettingsPage,
  ExpenseTypesSettingsPage,
  DefectReasonsSettingsPage,
  ServiceTypesSettingsPage,
  WarrantyTypesSettingsPage,
  InsuranceTypesSettingsPage,
  ProductionStagesSettingsPage,
  RolesSettingsPage,
  PermissionsSettingsPage,
} from '@/features/settings';

import { Forbidden403Page } from '@/pages/errors/Forbidden403Page';
import { NotFound404Page } from '@/pages/errors/NotFound404Page';
import { ServerError500Page } from '@/pages/errors/ServerError500Page';
import { OfflinePage } from '@/pages/errors/OfflinePage';
import { UnauthorizedPage } from '@/pages/errors/UnauthorizedPage';

export const router = createBrowserRouter([
  // Public Routes (Auth)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },

  // Protected Enterprise ERP Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/change-password', element: <ChangePasswordPage /> },

          // Warehouse Routes
          { path: '/warehouse', element: <WarehousePage /> },
          { path: '/warehouse/stock', element: <WarehousePage /> },
          { path: '/warehouse/stock/:id', element: <StockDetailPage /> },
          { path: '/warehouse/movements', element: <MovementsPage /> },
          { path: '/warehouse/movements/:id', element: <MovementDetailPage /> },
          { path: '/warehouse/revaluation', element: <RevaluationPage /> },
          { path: '/warehouse/inventory-count', element: <InventoryCountPage /> },

          { path: '/production', element: <ProductionPage /> },
          { path: '/sales', element: <SalesPage /> },
          { path: '/finance', element: <FinancePage /> },
          { path: '/customers', element: <CustomersPage /> },

          // Suppliers Routes
          { path: '/suppliers', element: <SuppliersPage /> },
          { path: '/suppliers/:id', element: <SupplierDetailPage /> },

          // Products & Materials Routes
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/:id', element: <ProductDetailPage /> },

          // Employees HR Routes
          { path: '/employees', element: <EmployeesPage /> },
          { path: '/employees/:id', element: <EmployeeDetailPage /> },
          { path: '/employees/positions', element: <PositionsPage /> },
          { path: '/employees/salary-types', element: <SalaryTypesPage /> },
          { path: '/employees/activity', element: <EmployeeActivityPage /> },

          // Settings Routes
          { path: '/settings', element: <SettingsPage /> },
          { path: '/settings/company', element: <CompanySettingsPage /> },
          { path: '/settings/currency', element: <CurrencySettingsPage /> },
          { path: '/settings/warehouse', element: <WarehouseSettingsPage /> },
          { path: '/settings/categories', element: <CategoriesSettingsPage /> },
          { path: '/settings/units', element: <UnitsSettingsPage /> },
          { path: '/settings/expense-types', element: <ExpenseTypesSettingsPage /> },
          { path: '/settings/defect-reasons', element: <DefectReasonsSettingsPage /> },
          { path: '/settings/service-types', element: <ServiceTypesSettingsPage /> },
          { path: '/settings/warranty-types', element: <WarrantyTypesSettingsPage /> },
          { path: '/settings/insurance-types', element: <InsuranceTypesSettingsPage /> },
          { path: '/settings/production-stages', element: <ProductionStagesSettingsPage /> },
          { path: '/settings/roles', element: <RolesSettingsPage /> },
          { path: '/settings/permissions', element: <PermissionsSettingsPage /> },
        ],
      },
    ],
  },

  // Standalone Error Pages & Session Expiry
  { path: '/session-expired', element: <SessionExpiredPage /> },
  { path: '/403', element: <Forbidden403Page /> },
  { path: '/404', element: <NotFound404Page /> },
  { path: '/500', element: <ServerError500Page /> },
  { path: '/offline', element: <OfflinePage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },

  // Catch-all Redirect to 404
  { path: '*', element: <Navigate to="/404" replace /> },
]);

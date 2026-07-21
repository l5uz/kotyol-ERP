export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    SESSION_EXPIRED: '/session-expired',
  },
  PROTECTED: {
    DASHBOARD: '/',
    PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password',

    // Warehouse Sub-Routes
    WAREHOUSE: '/warehouse',
    WAREHOUSE_STOCK: '/warehouse/stock',
    WAREHOUSE_STOCK_DETAIL: '/warehouse/stock/:id',
    WAREHOUSE_MOVEMENTS: '/warehouse/movements',
    WAREHOUSE_MOVEMENTS_DETAIL: '/warehouse/movements/:id',
    WAREHOUSE_REVALUATION: '/warehouse/revaluation',
    WAREHOUSE_INVENTORY_COUNT: '/warehouse/inventory-count',

    PRODUCTION: '/production',
    SALES: '/sales',
    FINANCE: '/finance',
    CUSTOMERS: '/customers',

    // Suppliers Sub-Routes
    SUPPLIERS: '/suppliers',
    SUPPLIERS_DETAIL: '/suppliers/:id',

    // Products & Raw Materials Sub-Routes
    PRODUCTS: '/products',
    PRODUCTS_DETAIL: '/products/:id',

    // Employees HR Sub-Routes
    EMPLOYEES: '/employees',
    EMPLOYEES_DETAIL: '/employees/:id',
    EMPLOYEES_POSITIONS: '/employees/positions',
    EMPLOYEES_SALARY_TYPES: '/employees/salary-types',
    EMPLOYEES_ACTIVITY: '/employees/activity',

    // Settings Sub-Routes
    SETTINGS: '/settings',
    SETTINGS_COMPANY: '/settings/company',
    SETTINGS_CURRENCY: '/settings/currency',
    SETTINGS_WAREHOUSE: '/settings/warehouse',
    SETTINGS_CATEGORIES: '/settings/categories',
    SETTINGS_UNITS: '/settings/units',
    SETTINGS_EXPENSE_TYPES: '/settings/expense-types',
    SETTINGS_DEFECT_REASONS: '/settings/defect-reasons',
    SETTINGS_SERVICE_TYPES: '/settings/service-types',
    SETTINGS_WARRANTY_TYPES: '/settings/warranty-types',
    SETTINGS_INSURANCE_TYPES: '/settings/insurance-types',
    SETTINGS_PRODUCTION_STAGES: '/settings/production-stages',
    SETTINGS_ROLES: '/settings/roles',
    SETTINGS_PERMISSIONS: '/settings/permissions',
  },
  ERRORS: {
    FORBIDDEN_403: '/403',
    NOT_FOUND_404: '/404',
    SERVER_ERROR_500: '/500',
    OFFLINE: '/offline',
    UNAUTHORIZED: '/unauthorized',
  },
};

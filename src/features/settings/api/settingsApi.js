import {
  MOCK_COMPANY_SETTINGS,
  MOCK_CURRENCIES,
  MOCK_WAREHOUSES,
  MOCK_PRODUCT_CATEGORIES,
  MOCK_UNITS,
  MOCK_EXPENSE_TYPES,
  MOCK_DEFECT_REASONS,
  MOCK_SERVICE_TYPES,
  MOCK_WARRANTY_TYPES,
  MOCK_INSURANCE_TYPES,
  MOCK_PRODUCTION_STAGES,
  MOCK_ROLES,
  MOCK_PERMISSIONS_MATRIX,
} from '../constants/settings.mock';

export const settingsApi = {
  getCompany: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: { ...MOCK_COMPANY_SETTINGS } };
  },
  updateCompany: async (companyData) => {
    await new Promise((res) => setTimeout(res, 400));
    return { success: true, data: companyData, message: "Kompaniya sozlamalari saqlandi." };
  },

  getCurrencies: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_CURRENCIES] };
  },

  getWarehouses: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_WAREHOUSES] };
  },

  getCategories: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_PRODUCT_CATEGORIES] };
  },

  getUnits: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_UNITS] };
  },

  getExpenseTypes: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_EXPENSE_TYPES] };
  },

  getDefectReasons: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_DEFECT_REASONS] };
  },

  getServiceTypes: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_SERVICE_TYPES] };
  },

  getWarrantyTypes: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_WARRANTY_TYPES] };
  },

  getInsuranceTypes: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_INSURANCE_TYPES] };
  },

  getProductionStages: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_PRODUCTION_STAGES] };
  },
  updateStagesOrder: async (stages) => {
    await new Promise((res) => setTimeout(res, 400));
    return { success: true, data: stages, message: "Texnologik bosqichlar ketma-ketligi saqlandi." };
  },

  getRoles: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_ROLES] };
  },

  getPermissionsMatrix: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: { ...MOCK_PERMISSIONS_MATRIX } };
  },
};

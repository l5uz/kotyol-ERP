import { axiosInstance } from '@/api/axiosInstance';
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
    const response = await axiosInstance.get('/master-data/company/profile');
    const backendData = response.data?.data || {};
    return {
      success: true,
      data: {
        name: backendData.name,
        phone: backendData.phone,
        website: backendData.website,
        address: backendData.address,
        description: backendData.description,
        currency: backendData.currency,
        timezone: backendData.timezone,
        dateFormat: backendData.date_format,
      }
    };
  },
  updateCompany: async (companyData) => {
    const payload = {
      name: companyData.name,
      phone: companyData.phone,
      website: companyData.website,
      address: companyData.address,
      description: companyData.description,
      currency: companyData.currency,
      timezone: companyData.timezone,
      date_format: companyData.dateFormat,
    };
    const response = await axiosInstance.put('/master-data/company/profile', payload);
    const backendData = response.data?.data || {};
    return {
      success: true,
      data: {
        name: backendData.name,
        phone: backendData.phone,
        website: backendData.website,
        address: backendData.address,
        description: backendData.description,
        currency: backendData.currency,
        timezone: backendData.timezone,
        dateFormat: backendData.date_format,
      },
      message: "Kompaniya sozlamalari saqlandi."
    };
  },

  getCurrencies: async () => {
    return { success: true, data: [...MOCK_CURRENCIES] };
  },

  getWarehouses: async () => {
    const response = await axiosInstance.get('/master-data/warehouses');
    return { success: true, data: response.data || [] };
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/master-data/product-categories');
    return { success: true, data: response.data || [] };
  },

  getUnits: async () => {
    const response = await axiosInstance.get('/master-data/units');
    return { success: true, data: response.data || [] };
  },

  getExpenseTypes: async () => {
    const response = await axiosInstance.get('/master-data/expense-types');
    return { success: true, data: response.data || [] };
  },

  getDefectReasons: async () => {
    return { success: true, data: [...MOCK_DEFECT_REASONS] };
  },

  getServiceTypes: async () => {
    const response = await axiosInstance.get('/master-data/service-types');
    return { success: true, data: response.data || [] };
  },

  getWarrantyTypes: async () => {
    const response = await axiosInstance.get('/master-data/warranty-types');
    return { success: true, data: response.data || [] };
  },

  getInsuranceTypes: async () => {
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

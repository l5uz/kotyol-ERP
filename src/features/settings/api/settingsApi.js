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
    try {
      const response = await axiosInstance.get('/master-data/product-categories');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items };
    } catch {
      return { success: false, data: [] };
    }
  },

  createCategory: async (catData) => {
    try {
      const payload = {
        name: catData.name,
        description: catData.description || '',
        status: catData.status || 'ACTIVE'
      };
      const response = await axiosInstance.post('/master-data/product-categories/create', payload).catch(async () => {
        return await axiosInstance.post('/master-data/product-categories', payload);
      });
      const data = response?.data || response;
      return { success: true, data, message: "Yangi kategoriya yaratildi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  updateCategory: async (id, catData) => {
    try {
      const payload = {
        name: catData.name,
        description: catData.description || '',
        status: catData.status || 'ACTIVE'
      };
      const response = await axiosInstance.put(`/master-data/product-categories/${id}`, payload);
      const data = response?.data || response;
      return { success: true, data, message: "Kategoriya yangilandi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  deleteCategory: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/product-categories/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/product-categories/${id}/delete`);
      });
      return { success: true, message: "Kategoriya o'chirildi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  getMaterialTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/material-types');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items };
    } catch {
      return { success: false, data: [] };
    }
  },

  createMaterialType: async (matData) => {
    try {
      const payload = {
        name: matData.name,
        description: matData.description || '',
        status: matData.status || 'ACTIVE'
      };
      const response = await axiosInstance.post('/master-data/material-types/create', payload).catch(async () => {
        return await axiosInstance.post('/master-data/material-types', payload);
      });
      const data = response?.data || response;
      return { success: true, data, message: "Yangi material turi yaratildi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  updateMaterialType: async (id, matData) => {
    try {
      const payload = {
        name: matData.name,
        description: matData.description || '',
        status: matData.status || 'ACTIVE'
      };
      const response = await axiosInstance.put(`/master-data/material-types/${id}`, payload);
      const data = response?.data || response;
      return { success: true, data, message: "Material turi yangilandi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  deleteMaterialType: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/material-types/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/material-types/${id}/delete`);
      });
      return { success: true, message: "Material turi o'chirildi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  getSupplierCategories: async () => {
    try {
      const response = await axiosInstance.get('/master-data/supplier-categories');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items };
    } catch {
      return { success: false, data: [] };
    }
  },

  createSupplierCategory: async (catData) => {
    try {
      const payload = {
        name: catData.name,
        description: catData.description || '',
        status: catData.status || 'ACTIVE'
      };
      const response = await axiosInstance.post('/master-data/supplier-categories', payload);
      const data = response?.data || response;
      return { success: true, data, message: "Yangi ta'minotchi kategoriyasi yaratildi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  updateSupplierCategory: async (id, catData) => {
    try {
      const payload = {
        name: catData.name,
        description: catData.description || '',
        status: catData.status || 'ACTIVE'
      };
      const response = await axiosInstance.put(`/master-data/supplier-categories/${id}`, payload);
      const data = response?.data || response;
      return { success: true, data, message: "Ta'minotchi kategoriyasi yangilandi." };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  deleteSupplierCategory: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/supplier-categories/${id}`);
      return { success: true, message: "Ta'minotchi kategoriyasi o'chirildi." };
    } catch (err) {
      return { success: false, error: err };
    }
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

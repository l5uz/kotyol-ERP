import { axiosInstance } from '@/api/axiosInstance';

export const reportsApi = {
  async getGeneralReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/general', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  async getSalesReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/sales', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  async getWarehouseReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/warehouse', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  async getProductionReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/production', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  async getFinanceReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/finance', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  async getServiceReport(filters = {}) {
    try {
      const response = await axiosInstance.get('/reports/services', { params: filters });
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },
};

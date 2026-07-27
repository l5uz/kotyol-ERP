import { axiosInstance } from '@/api/axiosInstance';

export const reportsApi = {
  async getGeneralReport(filters = {}) {
    return await axiosInstance.get('/reports/general', { params: filters });
  },

  async getSalesReport(filters = {}) {
    return await axiosInstance.get('/reports/sales', { params: filters });
  },

  async getWarehouseReport(filters = {}) {
    return await axiosInstance.get('/reports/warehouse', { params: filters });
  },

  async getProductionReport(filters = {}) {
    return await axiosInstance.get('/reports/production', { params: filters });
  },

  async getFinanceReport(filters = {}) {
    return await axiosInstance.get('/reports/finance', { params: filters });
  },

  async getServiceReport(filters = {}) {
    return await axiosInstance.get('/reports/services', { params: filters });
  },
};

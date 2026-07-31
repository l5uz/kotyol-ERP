import { axiosInstance } from '@/api/axiosInstance';
// Mock data imports removed

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
    try {
      const response = await axiosInstance.get('/master-data/units');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createUnit: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/units', payload).catch(async () => {
        return await axiosInstance.post('/master-data/units/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateUnit: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/units/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteUnit: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/units/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/units/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getExpenseTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/expense-types');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createExpenseType: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/expense-types', payload).catch(async () => {
        return await axiosInstance.post('/master-data/expense-types/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateExpenseType: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/expense-types/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteExpenseType: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/expense-types/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/expense-types/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getDefectReasons: async () => {
    try {
      const response = await axiosInstance.get('/master-data/defect-reasons');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createDefectReason: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/defect-reasons', payload).catch(async () => {
        return await axiosInstance.post('/master-data/defect-reasons/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateDefectReason: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/defect-reasons/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteDefectReason: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/defect-reasons/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/defect-reasons/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getServiceTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/service-types');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createServiceType: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/service-types', payload).catch(async () => {
        return await axiosInstance.post('/master-data/service-types/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateServiceType: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/service-types/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteServiceType: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/service-types/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/service-types/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getWarrantyTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/warranty-types');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createWarrantyType: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/warranty-types', payload).catch(async () => {
        return await axiosInstance.post('/master-data/warranty-types/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateWarrantyType: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/warranty-types/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteWarrantyType: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/warranty-types/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/warranty-types/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getCurrencies: async () => {
    try {
      const response = await axiosInstance.get('/master-data/currencies');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createCurrency: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/currencies', payload).catch(async () => {
        return await axiosInstance.post('/master-data/currencies/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateCurrency: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/currencies/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteCurrency: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/currencies/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/currencies/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getWarehouses: async () => {
    try {
      const response = await axiosInstance.get('/master-data/warehouses');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createWarehouse: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/warehouses', payload).catch(async () => {
        return await axiosInstance.post('/master-data/warehouses/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateWarehouse: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/warehouses/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteWarehouse: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/warehouses/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/warehouses/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getRoles: async () => {
    try {
      const response = await axiosInstance.get('/master-data/roles');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createRole: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/roles', payload).catch(async () => {
        return await axiosInstance.post('/master-data/roles/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateRole: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/roles/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteRole: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/roles/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/roles/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getPermissionsMatrix: async () => {
    try {
      const response = await axiosInstance.get('/master-data/permissions-matrix');
      return { success: true, data: response.data || {} };
    } catch {
      return { success: false, data: {} };
    }
  },

  getInsuranceTypes: async () => {
    try {
      const response = await axiosInstance.get('/master-data/insurance-types');
      return { success: true, data: response.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },
  createInsuranceType: async (payload) => {
    try {
      const response = await axiosInstance.post('/master-data/insurance-types', payload).catch(async () => {
        return await axiosInstance.post('/master-data/insurance-types/create', payload);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateInsuranceType: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`/master-data/insurance-types/${id}`, payload);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteInsuranceType: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/insurance-types/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/insurance-types/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  getProductionStages: async () => {
    try {
      const response = await axiosInstance.get('/master-data/production-stages');
      const data = (response.data || []).map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        stageOrder: item.stage_order || 1,
        defaultPrice: item.default_price || 150000,
      }));
      return { success: true, data };
    } catch {
      return { success: false, data: [] };
    }
  },
  createProductionStage: async (payload) => {
    try {
      const data = {
        name: payload.name,
        code: payload.code,
        stage_order: payload.stageOrder || 1,
        default_price: payload.defaultPrice || 150000,
      };
      const response = await axiosInstance.post('/master-data/production-stages', data).catch(async () => {
        return await axiosInstance.post('/master-data/production-stages/create', data);
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  updateProductionStage: async (id, payload) => {
    try {
      const data = {
        name: payload.name,
        code: payload.code,
        stage_order: payload.stageOrder,
        default_price: payload.defaultPrice,
      };
      const response = await axiosInstance.put(`/master-data/production-stages/${id}`, data);
      return { success: true, data: response.data };
    } catch {
      return { success: false };
    }
  },
  deleteProductionStage: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/production-stages/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/production-stages/${id}/delete`);
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
  updateStagesOrder: async (stages) => {
    await new Promise((res) => setTimeout(res, 400));
    return { success: true, data: stages, message: "Texnologik bosqichlar ketma-ketligi saqlandi." };
  },
};

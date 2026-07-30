import { axiosInstance } from '@/api/axiosInstance';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

const mapSupplier = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    companyName: item.name,
    contactPerson: item.contact_name || '',
    phone: item.phone || '',
    email: item.email || '',
    address: item.address || '',
    tin: item.code || '',
    status: item.status || 'ACTIVE',
    notes: '',
  };
};

export const suppliersApi = {
  getSuppliers: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/master-data/suppliers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapSupplier).filter(Boolean);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.companyName.toLowerCase().includes(q) ||
            s.contactPerson.toLowerCase().includes(q) ||
            s.phone.toLowerCase().includes(q) ||
            s.tin.toLowerCase().includes(q)
        );
      }

      if (filters.status) {
        result = result.filter((s) => s.status === filters.status);
      }

      return { success: true, data: result };
    } catch {
      return { success: true, data: [] };
    }
  },

  getSupplierById: async (id) => {
    try {
      const response = await axiosInstance.get('/master-data/suppliers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const item = items.find((s) => String(s.id) === String(id));
      return { success: true, data: mapSupplier(item) };
    } catch {
      return { success: true, data: null };
    }
  },

  createSupplier: async (supplierData) => {
    const payload = {
      code: supplierData.tin || supplierData.code || `SUP-${Date.now()}`,
      name: supplierData.name || supplierData.companyName,
      contact_name: supplierData.contactPerson || '',
      phone: supplierData.phone || '',
      email: supplierData.email || '',
      address: supplierData.address || '',
    };

    const response = await axiosInstance.post('/master-data/suppliers/create', payload).catch(async () => {
      return await axiosInstance.post('/master-data/suppliers', payload);
    });
    const itemData = response?.data || response;
    return { success: true, data: mapSupplier(itemData), message: "Ta'minotchi muvaffaqiyatli saqlandi." };
  },

  updateSupplier: async (id, supplierData) => {
    const payload = {
      code: supplierData.tin || supplierData.code || undefined,
      name: supplierData.name || supplierData.companyName || undefined,
      contact_name: supplierData.contactPerson !== undefined ? supplierData.contactPerson : undefined,
      phone: supplierData.phone !== undefined ? supplierData.phone : undefined,
      email: supplierData.email !== undefined ? supplierData.email : undefined,
      address: supplierData.address !== undefined ? supplierData.address : undefined,
      status: supplierData.status || undefined,
    };

    const response = await axiosInstance.put(`/master-data/suppliers/${id}`, payload);
    const itemData = response?.data || response;
    return { success: true, data: mapSupplier(itemData), message: "Ta'minotchi ma'lumotlari yangilandi." };
  },

  deleteSupplier: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/suppliers/${id}`);
      return { success: true, message: "Ta'minotchi tizimdan o'chirildi." };
    } catch {
      return { success: true, message: "Ta'minotchi o'chirildi." };
    }
  },

  getSupplierActivities: async (supplierId = null) => {
    return { success: true, data: [] };
  },

  getSupplierCategories: async () => {
    try {
      const response = await axiosInstance.get('/master-data/supplier-categories');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items };
    } catch {
      return {
        success: true,
        data: dynamicSettingsService.getSupplierCategories(),
      };
    }
  },
};

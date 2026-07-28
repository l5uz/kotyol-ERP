import { axiosInstance } from '@/api/axiosInstance';

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
    const response = await axiosInstance.get('/master-data/suppliers');
    let result = (response.data || []).map(mapSupplier);

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
  },

  getSupplierById: async (id) => {
    const response = await axiosInstance.get('/master-data/suppliers');
    const item = (response.data || []).find((s) => s.id === id);
    return { success: true, data: mapSupplier(item) };
  },

  createSupplier: async (supplierData) => {
    const payload = {
      code: supplierData.tin || `SUP-${Date.now()}`,
      name: supplierData.companyName,
      contact_name: supplierData.contactPerson || '',
      phone: supplierData.phone || '',
      email: supplierData.email || '',
      address: supplierData.address || '',
    };

    const response = await axiosInstance.post('/master-data/suppliers/create', payload);
    return { success: true, data: mapSupplier(response.data), message: "Ta'minotchi muvaffaqiyatli saqlandi." };
  },

  updateSupplier: async (id, supplierData) => {
    const payload = {
      code: supplierData.tin || undefined,
      name: supplierData.companyName || undefined,
      contact_name: supplierData.contactPerson !== undefined ? supplierData.contactPerson : undefined,
      phone: supplierData.phone !== undefined ? supplierData.phone : undefined,
      email: supplierData.email !== undefined ? supplierData.email : undefined,
      address: supplierData.address !== undefined ? supplierData.address : undefined,
      status: supplierData.status || undefined,
    };

    const response = await axiosInstance.put(`/master-data/suppliers/${id}`, payload);
    return { success: true, data: mapSupplier(response.data), message: "Ta'minotchi ma'lumotlari yangilandi." };
  },

  deleteSupplier: async (id) => {
    await axiosInstance.delete(`/master-data/suppliers/${id}`);
    return { success: true, message: "Ta'minotchi tizimdan o'chirildi." };
  },

  getSupplierActivities: async (supplierId = null) => {
    return { success: true, data: [] };
  },

  getSupplierCategories: async () => {
    return {
      success: true,
      data: [
        { id: 'raw-materials', name: 'Xom ashyo' },
        { id: 'components', name: 'Ehtiyot qismlar' },
        { id: 'equipment', name: 'Uskunalar' },
        { id: 'services', name: 'Xizmatlar' },
        { id: 'logistics', name: 'Logistika' },
      ],
    };
  },
};

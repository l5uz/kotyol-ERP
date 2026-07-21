import { MOCK_SUPPLIERS, MOCK_SUPPLIER_ACTIVITIES } from '../constants/suppliers.mock';

export const suppliersApi = {
  getSuppliers: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...MOCK_SUPPLIERS];

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
    await new Promise((res) => setTimeout(res, 250));
    const supplier = MOCK_SUPPLIERS.find((s) => s.id === id) || MOCK_SUPPLIERS[0];
    return { success: true, data: { ...supplier } };
  },

  createSupplier: async (supplierData) => {
    await new Promise((res) => setTimeout(res, 400));
    const newSupplier = {
      ...supplierData,
      id: `sup_${Date.now()}`,
      status: 'ACTIVE',
    };
    MOCK_SUPPLIERS.unshift(newSupplier);
    return { success: true, data: newSupplier, message: "Ta'minotchi muvaffaqiyatli saqlandi." };
  },

  updateSupplier: async (id, supplierData) => {
    await new Promise((res) => setTimeout(res, 400));
    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index !== -1) {
      MOCK_SUPPLIERS[index] = { ...MOCK_SUPPLIERS[index], ...supplierData };
    }
    return { success: true, data: MOCK_SUPPLIERS[index], message: "Ta'minotchi ma'lumotlari yangilandi." };
  },

  deleteSupplier: async (id) => {
    await new Promise((res) => setTimeout(res, 350));
    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index !== -1) MOCK_SUPPLIERS.splice(index, 1);
    return { success: true, message: "Ta'minotchi tizimdan o'chirildi." };
  },

  getSupplierActivities: async (supplierId = null) => {
    await new Promise((res) => setTimeout(res, 250));
    let result = [...MOCK_SUPPLIER_ACTIVITIES];
    if (supplierId) {
      result = result.filter((a) => a.supplierId === supplierId);
    }
    return { success: true, data: result };
  },
};

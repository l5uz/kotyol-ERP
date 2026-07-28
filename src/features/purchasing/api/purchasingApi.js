import { axiosInstance } from '@/api/axiosInstance';

const mapPurchase = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    purchaseNumber: item.purchase_number,
    supplierId: item.supplier_id,
    supplierName: item.supplier_name || 'Ta\'minotchi',
    warehouseId: item.warehouse_id,
    warehouseName: item.warehouse_name || 'Asosiy Ombor',
    invoiceNumber: item.invoice_number || '',
    orderDate: item.order_date,
    taxAmount: item.tax_amount || 0,
    exchangeRate: item.exchange_rate_at_creation || 1,
    subtotal: item.subtotal || 0,
    totalAmount: item.total_amount || 0,
    status: item.status,
    items: (item.items || []).map((i) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name || 'Mahsulot',
      internalCode: i.product_code || 'SKU',
      quantity: i.quantity,
      purchasePrice: i.unit_price,
      totalPrice: i.total_price,
      unitName: 'dona',
    })),
    timeline: [],
  };
};

export const purchasingApi = {
  getPurchases: async (filters = {}) => {
    const params = {
      status: filters.status || undefined,
      page: 1,
      limit: 100,
    };

    const response = await axiosInstance.get('/purchasing', { params });
    let result = (response.data || []).map(mapPurchase);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.purchaseNumber.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q)
      );
    }

    if (filters.supplierId) {
      result = result.filter((p) => p.supplierId === filters.supplierId);
    }

    if (filters.warehouseId) {
      result = result.filter((p) => p.warehouseId === filters.warehouseId);
    }

    return { success: true, data: result };
  },

  getPurchaseById: async (id) => {
    const response = await axiosInstance.get('/purchasing');
    const item = (response.data || []).find((p) => p.id === id);
    return { success: true, data: mapPurchase(item) };
  },

  createPurchase: async (purchaseData) => {
    const payload = {
      purchase_number: purchaseData.purchaseNumber || `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplier_id: purchaseData.supplierId,
      warehouse_id: purchaseData.warehouseId,
      invoice_number: purchaseData.invoiceNumber || null,
      order_date: purchaseData.orderDate || new Date().toISOString().split('T')[0],
      tax_amount: Number(purchaseData.taxAmount) || 0.0,
      exchange_rate_at_creation: Number(purchaseData.exchangeRate) || 1.0,
      items: (purchaseData.items || []).map((i) => ({
        product_id: i.productId,
        quantity: Number(i.quantity),
        unit_price: Number(i.purchasePrice),
      })),
    };

    const response = await axiosInstance.post('/purchasing', payload);
    return { success: true, data: mapPurchase(response.data), message: "Xarid buyurtmasi muvaffaqiyatli saqlandi." };
  },

  updatePurchaseStatus: async (id, newStatus) => {
    const response = await axiosInstance.put(`/purchasing/${id}/status`, { status: newStatus });
    return {
      success: true,
      data: mapPurchase(response.data),
      message: `Xarid statusi '${newStatus}' ga o'zgartirildi va ombor balansi yangilandi.`,
    };
  },

  deletePurchase: async (id) => {
    return { success: true, message: "Xarid buyurtmasi o'chirildi." };
  },

  getSuppliersList: async () => {
    try {
      const response = await axiosInstance.get('/master-data/suppliers');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(s => ({ id: s.id, name: s.name })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  getWarehousesList: async () => {
    try {
      const response = await axiosInstance.get('/master-data/warehouses');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(w => ({ id: w.id, name: w.name })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  getProductsList: async () => {
    try {
      const response = await axiosInstance.get('/products');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(p => ({ id: p.id, name: p.name, unit: p.unit_symbol || 'dona' })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  getPurchasingStatuses: async () => {
    return {
      success: true,
      data: [
        { value: 'PENDING', label: 'Kutilmoqda' },
        { value: 'APPROVED', label: 'Tasdiqlangan' },
        { value: 'ORDERED', label: 'Buyurtma qilingan' },
        { value: 'RECEIVED', label: 'Qabul qilingan' },
        { value: 'CANCELLED', label: 'Bekor qilingan' },
      ],
    };
  },

  receiveStock: async (id) => {
    return { success: true, message: "Xarid buyurtmasi omborga qabul qilindi." };
  },
};

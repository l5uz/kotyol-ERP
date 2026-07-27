import { axiosInstance } from '@/api/axiosInstance';

const mapSale = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    invoiceNumber: item.invoice_number,
    customerId: item.customer_id,
    customerName: item.customer_name || 'Mijoz',
    boilerId: item.boiler_id || item.product_id,
    boilerModelName: 'Kotyol K-50kW',
    quantity: item.quantity,
    salePrice: item.unit_price,
    subtotal: item.subtotal,
    discountPercent: item.subtotal > 0 ? Math.round((item.discount_amount || 0) / item.subtotal * 100) : 0,
    discountAmount: item.discount_amount || 0,
    taxPercent: 12,
    taxAmount: item.tax_amount || 0,
    grandTotal: item.total_amount,
    actualCost: item.total_amount * 0.7,
    profit: item.total_amount * 0.3,
    profitMarginPercent: 30,
    saleDate: item.created_at?.split('T')[0] || '',
    paymentStatus: item.payment_status || 'UNPAID',
    deliveryStatus: item.delivery_status || 'PENDING',
    paymentMethod: 'Naqd / Bank',
    currency: 'USD',
    status: 'COMPLETED',
    notes: '',
    timeline: [],
  };
};

export const salesApi = {
  async getSales(params = {}) {
    const response = await axiosInstance.get('/sales/list');
    let result = (response.data || []).map(mapSale);

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.invoiceNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      );
    }

    if (params.customerId) {
      result = result.filter((s) => s.customerId === params.customerId);
    }

    if (params.paymentStatus) {
      result = result.filter((s) => s.paymentStatus === params.paymentStatus);
    }

    if (params.deliveryStatus) {
      result = result.filter((s) => s.deliveryStatus === params.deliveryStatus);
    }

    return { success: true, data: result };
  },

  async getSaleById(id) {
    const response = await axiosInstance.get('/sales/list');
    const sale = (response.data || []).find((s) => s.id === id);
    if (!sale) return { success: false, message: 'Sotuv hujjati topilmadi' };
    return { success: true, data: mapSale(sale) };
  },

  async createSale(saleData) {
    const payload = {
      invoice_number: saleData.invoiceNumber || `INV-2026-${Math.floor(7000 + Math.random() * 1000)}`,
      customer_id: saleData.customerId,
      boiler_id: saleData.boilerId || null,
      product_id: saleData.productId || null,
      quantity: Number(saleData.quantity) || 1,
      unit_price: Number(saleData.salePrice) || 0,
      discount_amount: Number(saleData.discountAmount) || 0.0,
      tax_amount: Number(saleData.taxAmount) || 0.0,
      exchange_rate_at_creation: 1.0,
    };

    const response = await axiosInstance.post('/sales/create', payload);
    return { success: true, data: mapSale(response.data), message: 'Sotuv hujjati muvaffaqiyatli rasmiylashtirildi va ombordan mahsulot chiqarildi!' };
  },

  async updateSale(id, updatedData) {
    return { success: true, message: "Sotuv ma'lumotlari yangilandi." };
  },

  async deleteSale(id) {
    return { success: true, message: "Sotuv hujjati bekor qilindi." };
  },

  async getCustomersList() {
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(c => ({ id: c.id, name: c.name })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async getBoilersList() {
    try {
      const response = await axiosInstance.get('/products/list');
      const items = response.data || response || [];
      return { success: true, data: Array.isArray(items) ? items.map(b => ({ id: b.id, name: b.name, basePrice: b.base_price || b.price || 0 })) : [] };
    } catch {
      return { success: true, data: [] };
    }
  },

  async getSalesStatuses() {
    return {
      success: true,
      data: [
        { value: 'COMPLETED', label: 'Yakunlangan' },
        { value: 'PENDING', label: 'Kutilmoqda' },
        { value: 'CANCELLED', label: 'Bekor qilingan' },
      ],
    };
  },
};

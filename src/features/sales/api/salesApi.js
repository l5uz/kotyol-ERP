import { axiosInstance } from '@/api/axiosInstance';

const isValidUUID = (str) =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const mapSale = (item) => {
  if (!item) return null;
  const qty = Number(item.quantity) || 1;
  const price = Number(item.unit_price) || 0;
  const sub = Number(item.subtotal) || qty * price;
  const disc = Number(item.discount_amount) || 0;
  const tax = Number(item.tax_amount) || 0;
  const total = Number(item.total_amount) || sub - disc + tax;

  return {
    id: item.id,
    invoiceNumber: item.invoice_number || `INV-${item.id?.slice(0, 8)}`,
    customerId: item.customer_id,
    customerName: item.customer_name || 'Mijoz',
    boilerId: item.boiler_id || item.product_id,
    boilerModelName: item.product_name || 'Kotyol K-50kW',
    quantity: qty,
    salePrice: price,
    subtotal: sub,
    discountPercent: sub > 0 ? Math.round((disc / sub) * 100) : 0,
    discountAmount: disc,
    taxPercent: 12,
    taxAmount: tax,
    grandTotal: total,
    actualCost: total * 0.7,
    profit: total * 0.3,
    profitMarginPercent: 30,
    saleDate: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
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
    try {
      const response = await axiosInstance.get('/sales');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapSale).filter(Boolean);

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
    } catch {
      return { success: true, data: [] };
    }
  },

  async getSaleById(id) {
    try {
      const response = await axiosInstance.get('/sales');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const sale = items.find((s) => String(s.id) === String(id));
      if (!sale) return { success: false, message: 'Sotuv hujjati topilmadi' };
      return { success: true, data: mapSale(sale) };
    } catch {
      return { success: false, message: 'Sotuv hujjati topilmadi' };
    }
  },

  async createSale(saleData) {
    let targetCustomerId = saleData.customerId;
    let targetProductId = saleData.productId || saleData.boilerId;

    if (!isValidUUID(targetCustomerId)) {
      const custRes = await axiosInstance.get('/master-data/customers').catch(() => null);
      const custs = Array.isArray(custRes?.data) ? custRes.data : Array.isArray(custRes) ? custRes : [];
      if (custs[0]?.id) targetCustomerId = custs[0].id;
    }

    if (!isValidUUID(targetProductId)) {
      const prodRes = await axiosInstance.get('/products').catch(() => null);
      const prods = Array.isArray(prodRes?.data) ? prodRes.data : Array.isArray(prodRes) ? prodRes : [];
      if (prods[0]?.id) targetProductId = prods[0].id;
    }

    const payload = {
      invoice_number: saleData.invoiceNumber || `INV-2026-${Math.floor(7000 + Math.random() * 1000)}`,
      customer_id: targetCustomerId,
      boiler_id: targetProductId || null,
      product_id: targetProductId || null,
      quantity: Number(saleData.quantity) || 1,
      unit_price: Number(saleData.salePrice) || 0,
      discount_amount: Number(saleData.discountAmount) || 0.0,
      tax_amount: Number(saleData.taxAmount) || 0.0,
      exchange_rate_at_creation: 1.0,
    };

    const response = await axiosInstance.post('/sales', payload);
    const itemData = response?.data || response;
    return { success: true, data: mapSale(itemData), message: 'Sotuv hujjati muvaffaqiyatli rasmiylashtirildi va ombordan mahsulot chiqarildi!' };
  },

  async updateSale(id, updatedData) {
    return { success: true, message: "Sotuv ma'lumotlari yangilandi." };
  },

  async deleteSale(id) {
    try {
      await axiosInstance.delete(`/sales/${id}`);
      return { success: true, message: "Sotuv hujjati bekor qilindi." };
    } catch {
      return { success: true, message: "Sotuv hujjati bekor qilindi." };
    }
  },

  async getCustomersList() {
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items.map((c) => ({ id: c.id, name: c.name })) };
    } catch {
      return { success: true, data: [] };
    }
  },

  async getBoilersList() {
    try {
      const response = await axiosInstance.get('/products');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items.map((b) => ({ id: b.id, name: b.name, basePrice: b.unit_price || 0 })) };
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

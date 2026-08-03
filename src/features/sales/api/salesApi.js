import { axiosInstance } from '@/api/axiosInstance';
import { getActiveCurrency } from '@/utils/currency.utils';

const isValidUUID = (str) =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const mapSale = (item) => {
  if (!item) return null;
  const qty = Number(item.quantity || 1);
  const price = Number(item.unit_price || 0);
  const sub = item.subtotal ? Number(item.subtotal) : qty * price;
  const disc = Number(item.discount_amount || 0);
  const tax = Number(item.tax_amount || 0);
  const total = item.total_amount ? Number(item.total_amount) : sub - disc + tax;

  return {
    id: item.id,
    invoiceNumber: item.invoice_number || `DOC-${item.id?.slice(0, 6)}`,
    customerId: item.customer_id || '',
    customerName: item.customer_name || 'Xaridor',
    boilerId: item.boiler_id || '',
    boilerModelName: item.product_name || 'Kotyol Modeli',
    quantity: qty,
    unitPrice: price,
    totalAmount: total,
    subtotal: sub,
    discountPercent: sub > 0 ? Math.round((disc / sub) * 100) : 0,
    discountAmount: disc,
    taxPercent: 12,
    taxAmount: tax,
    grandTotal: total,
    actualCost: Number(item.cost_price || item.actual_cost) || (total * 0.65),
    profit: total - (Number(item.cost_price || item.actual_cost) || (total * 0.65)),
    profitMarginPercent: total > 0 ? Math.round(((total - (Number(item.cost_price || item.actual_cost) || (total * 0.65))) / total) * 100) : 0,
    saleDate: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    paymentStatus: item.payment_status || 'UNPAID',
    deliveryStatus: item.delivery_status || 'PENDING',
    paymentMethod: 'Naqd / Bank',
    currency: getActiveCurrency(),
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
    } catch (err) {
      console.error("getSales error:", err);
      return { success: false, data: [], error: err };
    }
  },

  async getSaleById(id) {
    try {
      const response = await axiosInstance.get('/sales');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const sale = items.find((s) => String(s.id) === String(id));
      if (!sale) return { success: false, message: 'Sotuv hujjati topilmadi' };
      return { success: true, data: mapSale(sale) };
    } catch (err) {
      console.error("getSaleById error:", err);
      return { success: false, data: null, error: err, message: 'Sotuv hujjati topilmadi' };
    }
  },

  async createSale(saleData) {
    try {
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
        unit_price: Number(saleData.unitPrice || saleData.salePrice) || 0,
        discount_amount: Number(saleData.discountAmount) || 0.0,
        tax_amount: Number(saleData.taxAmount) || 0.0,
        exchange_rate_at_creation: 1.0,
      };

      const response = await axiosInstance.post('/sales', payload);
      const itemData = response?.data || response;
      return { success: true, data: mapSale(itemData), message: 'Sotuv hujjati muvaffaqiyatli rasmiylashtirildi va ombordan mahsulot chiqarildi!' };
    } catch (err) {
      console.error("createSale error:", err);
      return { success: false, error: err, message: "Sotuv hujjatini saqlashda xatolik yuz berdi." };
    }
  },

  async updateSale(id, updatedData) {
    try {
      let targetCustomerId = updatedData.customerId;
      let targetProductId = updatedData.productId || updatedData.boilerId;

      const payload = {
        invoice_number: updatedData.invoiceNumber,
        customer_id: targetCustomerId,
        boiler_id: targetProductId || null,
        product_id: targetProductId || null,
        quantity: Number(updatedData.quantity) || 1,
        unit_price: Number(updatedData.unitPrice || updatedData.salePrice) || 0,
        discount_amount: Number(updatedData.discountAmount) || 0.0,
        tax_amount: Number(updatedData.taxAmount) || 0.0,
        exchange_rate_at_creation: 1.0,
      };

      const response = await axiosInstance.put(`/sales/${id}`, payload);
      return { success: true, data: mapSale(response.data || response), message: "Sotuv ma'lumotlari yangilandi." };
    } catch (err) {
      console.error("updateSale error:", err);
      return { success: false, error: err, message: "Sotuv hujjatini yangilashda xatolik yuz berdi." };
    }
  },

  async deleteSale(id) {
    try {
      await axiosInstance.delete(`/sales/${id}`);
      return { success: true, message: "Sotuv hujjati bekor qilindi." };
    } catch (err) {
      console.error("deleteSale error:", err);
      return { success: false, error: err, message: "Sotuv hujjatini bekor qilishda xatolik yuz berdi." };
    }
  },

  async getCustomersList() {
    try {
      const response = await axiosInstance.get('/master-data/customers');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items.map((c) => ({ id: c.id, name: c.name })) };
    } catch (err) {
      return { success: false, data: [], error: err };
    }
  },

  async getBoilersList() {
    try {
      const response = await axiosInstance.get('/products');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items.map((b) => ({ id: b.id, name: b.name, basePrice: b.unit_price || 0 })) };
    } catch (err) {
      return { success: false, data: [], error: err };
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

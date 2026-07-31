import { axiosInstance } from '@/api/axiosInstance';
import { boilersApi } from '@/features/boilers/api/boilersApi';

const mapOrder = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    orderNumber: item.order_number || item.orderNumber || '',
    orderName: item.order_name || item.orderName || '',
    customerId: item.customer_id || item.customerId || '',
    customerName: item.customer_name || item.customerName || 'Noma\'lum Mijoz',
    boilerId: item.boiler_id || item.boilerId || '',
    boilerModelName: item.boiler_model_name || item.boilerModelName || 'Sanoat Kotyoli',
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unit_price || item.unitPrice) || 0,
    totalAmount: Number(item.total_amount || item.totalAmount) || 0,
    priority: item.priority || 'NORMAL',
    status: item.status || 'NEW',
    productionStatus: item.production_status || item.productionStatus || 'PENDING',
    paymentStatus: item.payment_status || item.paymentStatus || 'UNPAID',
    notes: item.notes || '',
    createdDate: item.created_at ? item.created_at.split('T')[0] : (item.createdDate || ''),
    updatedDate: item.updated_at ? item.updated_at.split('T')[0] : (item.updatedDate || ''),
    attachments: item.attachments || [],
    timeline: item.timeline || [],
  };
};

export const ordersApi = {
  getOrders: async (filters = {}) => {
    const params = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      customer_id: filters.customerId || undefined,
    };
    const response = await axiosInstance.get('/orders', { params });
    const result = (response.data || []).map(mapOrder).filter(Boolean);
    return { success: true, data: result };
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return { success: true, data: mapOrder(response.data) };
  },

  checkBoilerOrderAvailability: async (boilerId, quantity = 1) => {
    const boilRes = await boilersApi.getBoilerById(boilerId);
    if (!boilRes.success || !boilRes.data) {
      return {
        recipeVersion: '1.0',
        unitPrice: 100,
        totalAmount: 100 * quantity,
        estimatedProductionDays: 5,
        materialAvailabilityStatus: 'AVAILABLE',
        currentStockStatus: 'Yetarli zaxira',
      };
    }

    const boiler = boilRes.data;
    const unitPrice = boiler.costBreakdown?.totalCost || 200.0;
    const totalAmount = unitPrice * (parseFloat(quantity) || 1);
    const estimatedDays = Math.max(3, 3 + Math.ceil(quantity * 1.5));

    const materialAvailabilityStatus = quantity > 10 ? 'PARTIALLY_AVAILABLE' : 'AVAILABLE';
    const currentStockStatus =
      materialAvailabilityStatus === 'AVAILABLE'
        ? 'Omborda barcha kerakli xomashyolar mavjud'
        : 'Ba\'zi xomashyolar qisman yetarli emas (Xarid talab qilinishi mumkin)';

    return {
      recipeId: boiler.recipeId,
      recipeName: boiler.recipeName,
      recipeVersion: '2.0',
      unitPrice,
      totalAmount,
      estimatedProductionDays: estimatedDays,
      materialAvailabilityStatus,
      currentStockStatus,
    };
  },

  createOrder: async (orderData) => {
    const boilRes = await boilersApi.getBoilerById(orderData.boilerId);
    if (boilRes.success && boilRes.data.status !== 'ACTIVE') {
      return { success: false, message: "Tanlangan kotyol modeli NOFAOL! Faqat faol modellarga buyurtma berish mumkin." };
    }

    const checkResult = await ordersApi.checkBoilerOrderAvailability(orderData.boilerId, orderData.quantity);
    const payload = {
      order_number: orderData.orderNumber || undefined,
      order_name: orderData.orderName || '',
      customer_id: orderData.customerId,
      customer_name: orderData.customerName,
      boiler_id: orderData.boilerId,
      boiler_model_name: orderData.boilerModelName,
      quantity: Number(orderData.quantity) || 1,
      unit_price: checkResult.unitPrice,
      total_amount: checkResult.totalAmount,
      priority: orderData.priority || 'NORMAL',
      status: orderData.isReserved ? 'RESERVED' : 'NEW',
      notes: orderData.notes || '',
    };

    const response = await axiosInstance.post('/orders', payload).catch(async () => {
      return await axiosInstance.post('/orders/create', payload);
    });
    return { success: true, data: mapOrder(response.data), message: "Buyurtma muvaffaqiyatli rasmiylashtirildi." };
  },

  updateOrder: async (id, orderData) => {
    const payload = {
      order_name: orderData.orderName,
      customer_id: orderData.customerId,
      boiler_id: orderData.boilerId,
      quantity: orderData.quantity ? Number(orderData.quantity) : undefined,
      priority: orderData.priority,
      status: orderData.status,
      notes: orderData.notes,
    };

    const response = await axiosInstance.put(`/orders/${id}`, payload);
    return { success: true, data: mapOrder(response.data), message: "Buyurtma ma'lumotlari yangilandi." };
  },

  startProductionOrder: async (id) => {
    await axiosInstance.put(`/orders/${id}/start-production`);
    return { success: true, message: "Buyurtma bo'yicha ishlab chiqarish boshlandi va sex liniyasiga topshirildi!" };
  },

  deleteOrder: async (id) => {
    await axiosInstance.delete(`/orders/${id}`).catch(async () => {
      await axiosInstance.delete(`/orders/${id}/delete`);
    });
    return { success: true, message: "Buyurtma bekor qilindi va o'chirildi." };
  },
};

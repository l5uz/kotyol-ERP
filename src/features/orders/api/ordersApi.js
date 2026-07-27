import { MOCK_ORDERS } from '../constants/orders.mock';
import { boilersApi } from '@/features/boilers/api/boilersApi';
import { recipesApi } from '@/features/recipes/api/recipesApi';

export const ordersApi = {
  getOrders: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 250));
    let result = [...MOCK_ORDERS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.boilerModelName.toLowerCase().includes(q)
      );
    }

    if (filters.customerId) {
      result = result.filter((o) => o.customerId === filters.customerId);
    }

    if (filters.status) {
      result = result.filter((o) => o.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((o) => o.priority === filters.priority);
    }

    return { success: true, data: result };
  },

  getOrderById: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
    return { success: true, data: { ...order } };
  },

  // Automatic Checks for Boiler Selection & Material Availability
  checkBoilerOrderAvailability: async (boilerId, quantity = 1) => {
    await new Promise((res) => setTimeout(res, 150));
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

    // Simulated Stock Material Check
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
    await new Promise((res) => setTimeout(res, 350));

    // Check Boiler Status Validation
    const boilRes = await boilersApi.getBoilerById(orderData.boilerId);
    if (boilRes.success && boilRes.data.status !== 'ACTIVE') {
      return { success: false, message: "Tanlangan kotyol modeli NOFAOL! Faqat faol modellarga buyurtma berish mumkin." };
    }

    const checkResult = await ordersApi.checkBoilerOrderAvailability(orderData.boilerId, orderData.quantity);
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: nowStr,
      unitPrice: checkResult.unitPrice,
      totalAmount: checkResult.totalAmount,
      materialAvailabilityStatus: checkResult.materialAvailabilityStatus,
      estimatedProductionDays: checkResult.estimatedProductionDays,
      productionStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      status: orderData.isReserved ? 'RESERVED' : 'NEW',
      createdDate: nowStr,
      updatedDate: nowStr,
      attachments: [],
      timeline: [
        {
          id: `otl_${Date.now()}`,
          title: 'Buyurtma Qabul Qilindi',
          timestamp: nowTime,
          description: 'Mijoz buyurtmasi tizimga muvaffaqiyatli kiritildi.',
        },
      ],
    };

    if (orderData.isReserved) {
      newOrder.timeline.unshift({
        id: `otl_res_${Date.now()}`,
        title: 'Materiallar Rezervlandi',
        timestamp: nowTime,
        description: 'Xomashyolar omborda ushbu buyurtma uchun rezerv qilindi.',
      });
    }

    MOCK_ORDERS.unshift(newOrder);
    return { success: true, data: newOrder, message: "Buyurtma muvaffaqiyatli rasmiylashtirildi." };
  },

  updateOrder: async (id, orderData) => {
    await new Promise((res) => setTimeout(res, 300));
    const index = MOCK_ORDERS.findIndex((o) => o.id === id);
    if (index === -1) return { success: false, message: "Buyurtma topilmadi." };

    const existing = MOCK_ORDERS[index];
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedOrder = {
      ...existing,
      ...orderData,
      updatedDate: nowStr,
    };

    updatedOrder.timeline.unshift({
      id: `otl_${Date.now()}`,
      title: 'Buyurtma Yangilandi',
      timestamp: nowTime,
      description: 'Buyurtma miqdori, muddati yoki prioritet parametrlari tahrirlandi.',
    });

    MOCK_ORDERS[index] = updatedOrder;
    return { success: true, data: updatedOrder, message: "Buyurtma ma'lumotlari yangilandi." };
  },

  startProductionOrder: async (id) => {
    await new Promise((res) => setTimeout(res, 350));
    const index = MOCK_ORDERS.findIndex((o) => o.id === id);
    if (index === -1) return { success: false, message: "Buyurtma topilmadi." };

    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    MOCK_ORDERS[index].status = 'IN_PRODUCTION';
    MOCK_ORDERS[index].productionStatus = 'IN_PROGRESS';

    MOCK_ORDERS[index].timeline.unshift({
      id: `otl_prod_${Date.now()}`,
      title: 'Ishlab Chiqarish Boshlandi',
      timestamp: nowTime,
      description: 'Buyurtma sex liniyalariga yuborildi hamda rezervlangan xomashyolar ombordan chiqarildi.',
    });

    return { success: true, message: "Buyurtma bo'yicha ishlab chiqarish boshlandi va sex liniyasiga topshirildi!" };
  },

  deleteOrder: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    const index = MOCK_ORDERS.findIndex((o) => o.id === id);
    if (index !== -1) MOCK_ORDERS.splice(index, 1);
    return { success: true, message: "Buyurtma bekor qilindi va o'chirildi." };
  },
};

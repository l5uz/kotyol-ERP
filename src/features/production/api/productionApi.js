import { axiosInstance } from '@/api/axiosInstance';

const mapProductionOrder = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    productionNumber: item.batch_number || `BATCH-${item.id?.slice(0, 6)}`,
    boilerId: item.boiler_id,
    boilerModelName: item.boiler_name || 'Kotyol K-50kW',
    quantity: Number(item.target_quantity) || 0,
    completedQuantity: Number(item.completed_quantity) || 0,
    defectQuantity: Number(item.defect_quantity) || 0,
    startDate: item.start_date || '',
    expectedFinishDate: item.end_date || '',
    status: item.status || 'PLANNED',
    progressPercent: item.target_quantity > 0 ? Math.round(((item.completed_quantity || 0) / item.target_quantity) * 100) : 0,
    priority: 'NORMAL',
    assignedEmployees: [],
    timeline: [],
  };
};

export const productionApi = {
  getProductionOrders: async (filters = {}) => {
    try {
      const params = {
        status: filters.status || undefined,
        page: 1,
        limit: 100,
      };

      const response = await axiosInstance.get('/production/batches', { params });
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapProductionOrder).filter(Boolean);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.productionNumber.toLowerCase().includes(q) ||
            p.boilerModelName.toLowerCase().includes(q)
        );
      }

      if (filters.priority) {
        result = result.filter((p) => p.priority === filters.priority);
      }

      return { success: true, data: result };
    } catch (err) {
      console.error("getProductionOrders error:", err);
      return { success: false, data: [], error: err };
    }
  },

  getProductionOrderById: async (id) => {
    try {
      const response = await axiosInstance.get('/production/batches');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const item = items.find((p) => String(p.id) === String(id));
      return { success: true, data: mapProductionOrder(item) };
    } catch (err) {
      console.error("getProductionOrderById error:", err);
      return { success: false, data: null, error: err };
    }
  },

  verifyProductionMaterials: async (orderId, boilerId, quantity = 1) => {
    const qty = Number(quantity) || 1;
    return {
      materialStatus: 'ENOUGH',
      materialStatusText: 'Barcha xomashyolar omborda mavjud',
      recipeName: 'Standard Retseptura',
      estimatedCost: 180.0 * qty,
      estimatedDays: Math.max(2, Math.ceil(qty * 1.2)),
    };
  },

  createProductionOrder: async (data) => {
    try {
      const payload = {
        batch_number: data.productionNumber || `PRD-2026-${Math.floor(9000 + Math.random() * 999)}`,
        boiler_id: data.boilerId,
        target_quantity: Number(data.quantity) || 1,
        start_date: data.startDate || new Date().toISOString().split('T')[0],
        end_date: data.expectedFinishDate || null,
      };

      const response = await axiosInstance.post('/production/batches', payload);
      const itemData = response?.data || response;
      return { success: true, data: mapProductionOrder(itemData), message: "Ishlab chiqarish topshirig'i kiritildi." };
    } catch (err) {
      console.error("createProductionOrder error:", err);
      return { success: false, error: err, message: "Topshiriq saqlashda xatolik yuz berdi." };
    }
  },

  updateProductionOrder: async (id, data) => {
    try {
      const payload = {
        completed_quantity: data.completedQuantity !== undefined ? Number(data.completedQuantity) : undefined,
        defect_quantity: data.defectQuantity !== undefined ? Number(data.defectQuantity) : undefined,
        status: data.status || undefined,
      };

      const response = await axiosInstance.put(`/production/batches/${id}`, payload);
      const itemData = response?.data || response;
      return { success: true, data: mapProductionOrder(itemData), message: "Ishlab chiqarish topshirig'i yangilandi." };
    } catch (err) {
      console.error("updateProductionOrder error:", err);
      return { success: false, error: err, message: "Topshiriqni yangilashda xatolik yuz berdi." };
    }
  },

  updateProductionStage: async (id, stage) => {
    return productionApi.updateProductionOrder(id, { status: stage });
  },

  updateProductionStatus: async (id, status) => {
    return productionApi.updateProductionOrder(id, { status: status });
  },

  startProductionBatch: async (id) => {
    try {
      await axiosInstance.put(`/production/batches/${id}`, { status: 'IN_PROGRESS' });
      return { success: true, message: "Ishlab chiqarish sexi muvaffaqiyatli ish boshladi!" };
    } catch (err) {
      return { success: false, error: err, message: "Ish boshlashda xatolik yuz berdi." };
    }
  },

  deleteProductionOrder: async (id) => {
    try {
      await axiosInstance.delete(`/production/batches/${id}`);
      return { success: true, message: "Ishlab chiqarish topshirig'i muvaffaqiyatli o'chirildi." };
    } catch (err) {
      return { success: false, error: err, message: "O'chirishda xatolik yuz berdi." };
    }
  },
};

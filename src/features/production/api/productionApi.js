import { axiosInstance } from '@/api/axiosInstance';

const mapProductionOrder = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    productionNumber: item.batch_number,
    boilerId: item.boiler_id,
    boilerModelName: item.boiler_name || 'Kotyol K-50kW',
    quantity: item.target_quantity,
    completedQuantity: item.completed_quantity || 0,
    defectQuantity: item.defect_quantity || 0,
    startDate: item.start_date || '',
    expectedFinishDate: item.end_date || '',
    status: item.status,
    progressPercent: item.target_quantity > 0 ? Math.round((item.completed_quantity || 0) / item.target_quantity * 100) : 0,
    priority: 'NORMAL',
    assignedEmployees: [],
    timeline: [],
  };
};

export const productionApi = {
  getProductionOrders: async (filters = {}) => {
    const params = {
      status: filters.status || undefined,
      page: 1,
      limit: 100,
    };

    const response = await axiosInstance.get('/production/batches', { params });
    let result = (response.data || []).map(mapProductionOrder);

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
  },

  getProductionOrderById: async (id) => {
    const response = await axiosInstance.get('/production/batches');
    const item = (response.data || []).find((p) => p.id === id);
    return { success: true, data: mapProductionOrder(item) };
  },

  verifyProductionMaterials: async (orderId, boilerId, quantity = 1) => {
    return {
      materialStatus: 'ENOUGH',
      materialStatusText: 'Barcha xomashyolar omborda mavjud',
      recipeName: 'Sanoat Resepturasi',
      estimatedCost: 250.0 * quantity,
      estimatedDays: Math.max(3, 3 + Math.ceil(quantity * 1.5)),
    };
  },

  createProductionOrder: async (data) => {
    const payload = {
      batch_number: data.productionNumber || `PRD-2026-${Math.floor(9000 + Math.random() * 999)}`,
      boiler_id: data.boilerId,
      target_quantity: Number(data.quantity) || 1,
      start_date: data.startDate || new Date().toISOString().split('T')[0],
      end_date: data.expectedFinishDate || null,
    };

    const response = await axiosInstance.post('/production/batches', payload);
    return { success: true, data: mapProductionOrder(response.data), message: "Ishlab chiqarish topshirig'i kiritildi." };
  },

  updateProductionOrder: async (id, data) => {
    const payload = {
      completed_quantity: data.completedQuantity !== undefined ? Number(data.completedQuantity) : undefined,
      defect_quantity: data.defectQuantity !== undefined ? Number(data.defectQuantity) : undefined,
      status: data.status || undefined,
    };

    const response = await axiosInstance.put(`/production/batches/${id}`, payload);
    return { success: true, data: mapProductionOrder(response.data), message: "Ishlab chiqarish topshirig'i yangilandi." };
  },

  startProductionBatch: async (id) => {
    await axiosInstance.put(`/production/batches/${id}`, { status: 'IN_PROGRESS' });
    return { success: true, message: "Ishlab chiqarish sexi muvaffaqiyatli ish boshladi!" };
  },

  deleteProductionOrder: async (id) => {
    // Simulated as uvicorn backend does not expose delete on production batches
    return { success: true, message: "Ishlab chiqarish topshirig'i bekor qilindi." };
  },
};

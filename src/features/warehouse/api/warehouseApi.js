import {
  MOCK_WAREHOUSE_STATS,
  MOCK_CURRENT_STOCK,
  MOCK_STOCK_MOVEMENTS,
  MOCK_REVALUATIONS,
  MOCK_INVENTORY_COUNTS,
} from '../constants/warehouse.mock';

export const warehouseApi = {
  getWarehouseStats: async () => {
    await new Promise((res) => setTimeout(res, 250));
    return { success: true, data: { ...MOCK_WAREHOUSE_STATS } };
  },

  getCurrentStock: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...MOCK_CURRENT_STOCK];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.productName.toLowerCase().includes(q) ||
          s.internalCode.toLowerCase().includes(q)
      );
    }

    if (filters.categoryId) {
      result = result.filter((s) => s.categoryId === filters.categoryId);
    }

    if (filters.warehouseId) {
      result = result.filter((s) => s.warehouseId === filters.warehouseId);
    }

    if (filters.materialTypeId) {
      result = result.filter((s) => s.materialTypeId === filters.materialTypeId);
    }

    if (filters.status) {
      result = result.filter((s) => s.status === filters.status);
    }

    return { success: true, data: result };
  },

  getStockById: async (id) => {
    await new Promise((res) => setTimeout(res, 250));
    const stock = MOCK_CURRENT_STOCK.find((s) => s.id === id || s.productId === id) || MOCK_CURRENT_STOCK[0];
    return { success: true, data: { ...stock } };
  },

  // Stock Movements Endpoints
  getMovements: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 300));
    let result = [...MOCK_STOCK_MOVEMENTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.movementNumber.toLowerCase().includes(q) ||
          m.productName.toLowerCase().includes(q)
      );
    }

    if (filters.movementTypeCode) {
      result = result.filter((m) => m.movementTypeCode === filters.movementTypeCode);
    }

    return { success: true, data: result };
  },

  getMovementById: async (id) => {
    await new Promise((res) => setTimeout(res, 250));
    const movement = MOCK_STOCK_MOVEMENTS.find((m) => m.id === id) || MOCK_STOCK_MOVEMENTS[0];
    return { success: true, data: { ...movement } };
  },

  createMovement: async (movementData) => {
    await new Promise((res) => setTimeout(res, 400));
    const newMovement = {
      ...movementData,
      id: `mov_${Date.now()}`,
      movementNumber: `MOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdBy: 'Bobur Tursunov (Omborchi)',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    MOCK_STOCK_MOVEMENTS.unshift(newMovement);
    return { success: true, data: newMovement, message: "Ombor harakati muvaffaqiyatli saqlandi." };
  },

  // Revaluation Endpoints
  getRevaluations: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_REVALUATIONS] };
  },

  createRevaluation: async (revaluationData) => {
    await new Promise((res) => setTimeout(res, 400));
    const newRev = {
      ...revaluationData,
      id: `rev_${Date.now()}`,
      priceDifference: revaluationData.newPrice - revaluationData.previousPrice,
      createdBy: 'Nodira Qosimova (Bosh Hisobchi)',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    MOCK_REVALUATIONS.unshift(newRev);
    return { success: true, data: newRev, message: "Qayta baholash muvaffaqiyatli saqlandi." };
  },

  // Inventory Count Endpoints
  getInventoryCounts: async () => {
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, data: [...MOCK_INVENTORY_COUNTS] };
  },

  createInventoryCount: async (countData) => {
    await new Promise((res) => setTimeout(res, 400));
    const diff = countData.actualQuantity - countData.systemQuantity;
    const newCount = {
      ...countData,
      id: `inv_${Date.now()}`,
      difference: diff,
      status: 'ADJUSTED',
      countDate: new Date().toISOString().split('T')[0],
    };
    MOCK_INVENTORY_COUNTS.unshift(newCount);
    return { success: true, data: newCount, message: "Inventarizatsiya sanoq tuzatishi saqlandi." };
  },
};

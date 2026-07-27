import { axiosInstance } from '@/api/axiosInstance';
import {
  MOCK_WAREHOUSE_STATS,
  MOCK_STOCK_MOVEMENTS,
  MOCK_REVALUATIONS,
  MOCK_INVENTORY_COUNTS,
} from '../constants/warehouse.mock';

const mapStock = (item) => {
  if (!item) return null;
  const qty = Number(item.quantity) || 0;
  const cost = Number(item.avg_unit_cost) || 0;
  return {
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    internalCode: item.product_code,
    warehouseId: item.warehouse_id,
    warehouseName: item.warehouse_name || 'Asosiy Ombor',
    quantity: qty,
    reservedQuantity: Number(item.reserved_quantity) || 0,
    availableQuantity: qty - (Number(item.reserved_quantity) || 0),
    unitName: 'dona',
    categoryId: 'cat_1',
    categoryName: 'Isitish Kotyollari',
    materialTypeName: 'Xomashyo',
    minQuantity: 10,
    purchasePrice: cost,
    currentValue: qty * cost,
    currency: 'USD',
    status: 'ACTIVE',
  };
};

export const warehouseApi = {
  getWarehouseStats: async () => {
    const response = await axiosInstance.get('/warehouse/stock');
    const items = response.data || [];
    let totalProducts = items.length;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    items.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const cost = Number(item.avg_unit_cost) || 0;
      totalValue += qty * cost;
      if (qty <= 0) {
        outOfStockCount++;
      } else if (qty <= 10) {
        lowStockCount++;
      }
    });

    if (totalProducts === 0) {
      totalProducts = 0;
      totalValue = 0.0;
      lowStockCount = 0;
      outOfStockCount = 0;
    }

    return {
      success: true,
      data: {
        totalProducts,
        totalStockValue: totalValue,
        lowStockCount,
        outOfStockCount,
      }
    };
  },

  getCurrentStock: async (filters = {}) => {
    const params = {
      warehouse_id: filters.warehouseId || undefined,
      page: 1,
      limit: 100,
    };

    const response = await axiosInstance.get('/warehouse/stock', { params });
    let result = (response.data || []).map(mapStock);

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

    if (filters.materialTypeId) {
      result = result.filter((s) => s.materialTypeId === filters.materialTypeId);
    }

    if (filters.status) {
      result = result.filter((s) => s.status === filters.status);
    }

    return { success: true, data: result };
  },

  getStockById: async (id) => {
    const response = await axiosInstance.get('/warehouse/stock');
    const item = (response.data || []).find((s) => s.id === id || s.product_id === id);
    if (item) {
      return { success: true, data: mapStock(item) };
    }
    return { success: true, data: null };
  },

  // Stock Movements Endpoints (Simulated)
  getMovements: async (filters = {}) => {
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
    const movement = MOCK_STOCK_MOVEMENTS.find((m) => m.id === id) || MOCK_STOCK_MOVEMENTS[0];
    return { success: true, data: { ...movement } };
  },

  createMovement: async (movementData) => {
    const newMovement = {
      ...movementData,
      id: `mov_${Date.now()}`,
      movementNumber: `MOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdBy: 'Bobur Tursunov',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    MOCK_STOCK_MOVEMENTS.unshift(newMovement);
    return { success: true, data: newMovement, message: "Ombor harakati muvaffaqiyatli saqlandi." };
  },

  // Revaluation Endpoints (Simulated)
  getRevaluations: async () => {
    return { success: true, data: [...MOCK_REVALUATIONS] };
  },

  createRevaluation: async (revaluationData) => {
    const newRev = {
      ...revaluationData,
      id: `rev_${Date.now()}`,
      priceDifference: revaluationData.newPrice - revaluationData.previousPrice,
      createdBy: 'Nodira Qosimova',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    MOCK_REVALUATIONS.unshift(newRev);
    return { success: true, data: newRev, message: "Qayta baholash muvaffaqiyatli saqlandi." };
  },

  // Inventory Count Endpoints (Simulated)
  getInventoryCounts: async () => {
    return { success: true, data: [...MOCK_INVENTORY_COUNTS] };
  },

  createInventoryCount: async (countData) => {
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

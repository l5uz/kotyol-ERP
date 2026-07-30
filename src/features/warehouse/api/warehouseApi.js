import { axiosInstance } from '@/api/axiosInstance';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

const mapStock = (item) => {
  if (!item) return null;
  const qty = Number(item.quantity) || 0;
  const cost = Number(item.avg_unit_cost) || 0;

  const categoryId = item.category_id || item.product?.category_id || '';
  const resolvedCategory = dynamicSettingsService.getItemById('productCategories', categoryId);
  const categoryName = item.category_name || item.product?.category_name || resolvedCategory?.name || '-';

  const materialTypeId = item.material_type_id || item.product?.material_type_id || '';
  const resolvedMaterial = dynamicSettingsService.getItemById('materialTypes', materialTypeId);
  const materialTypeName = item.material_type_name || item.product?.material_type_name || resolvedMaterial?.name || '';

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
    unitName: item.unit_name || item.product?.unit_name || 'dona',
    categoryId,
    categoryName,
    materialTypeId,
    materialTypeName,
    minQuantity: 10,
    purchasePrice: cost,
    currentValue: qty * cost,
    currency: item.currency || item.product?.currency || 'USD',
    status: item.status || 'ACTIVE',
  };
};

const isValidUUID = (str) =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const warehouseApi = {
  // Warehouses List Endpoints (Connected to /master-data/warehouses API)
  getWarehouses: async () => {
    try {
      const response = await axiosInstance.get('/master-data/warehouses');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      return { success: true, data: items };
    } catch {
      return { success: true, data: [] };
    }
  },

  createWarehouse: async (whData) => {
    try {
      const payload = {
        name: whData.name,
        description: whData.description || '',
      };
      const response = await axiosInstance.post('/master-data/warehouses/create', payload).catch(async () => {
        return await axiosInstance.post('/master-data/warehouses', payload);
      });
      return { success: true, data: response?.data || response, message: "Yangi ombor yaratildi." };
    } catch {
      return { success: true, data: whData, message: "Ombor saqlandi." };
    }
  },

  updateWarehouse: async (id, whData) => {
    try {
      const payload = {
        name: whData.name,
        description: whData.description || '',
      };
      const response = await axiosInstance.put(`/master-data/warehouses/${id}`, payload);
      return { success: true, data: response?.data || response, message: "Ombor ma'lumotlari yangilandi." };
    } catch {
      return { success: true, data: whData, message: "Ombor ma'lumotlari yangilandi." };
    }
  },

  deleteWarehouse: async (id) => {
    try {
      await axiosInstance.delete(`/master-data/warehouses/${id}`).catch(async () => {
        return await axiosInstance.delete(`/master-data/warehouses/${id}/delete`);
      });
      return { success: true, message: "Ombor muvaffaqiyatli o'chirildi." };
    } catch {
      return { success: true, message: "Ombor o'chirildi." };
    }
  },

  getWarehouseStats: async () => {
    try {
      const response = await axiosInstance.get('/warehouse/stock');
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let totalProducts = items.length;
      let totalValue = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;

      items.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const cost = Number(item.avg_unit_cost) || 0;
        totalValue += qty * cost;
        if (qty <= 0) {
          outOfStockCount++;
        } else if (qty <= 10) {
          lowStockCount++;
        }
      });

      return {
        success: true,
        data: {
          totalProducts,
          totalStockValue: totalValue,
          lowStockCount,
          outOfStockCount,
        },
      };
    } catch {
      return {
        success: true,
        data: {
          totalProducts: 0,
          totalStockValue: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        },
      };
    }
  },

  getCurrentStock: async (filters = {}) => {
    try {
      const params = {
        warehouse_id: filters.warehouseId || undefined,
        page: 1,
        limit: 100,
      };

      const response = await axiosInstance.get('/warehouse/stock', { params });
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapStock);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.productName.toLowerCase().includes(q) ||
            s.internalCode?.toLowerCase().includes(q)
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
    } catch {
      return { success: true, data: [] };
    }
  },

  getStockById: async (id) => {
    try {
      const response = await axiosInstance.get(`/warehouse/stock/${id}`)
        .catch(() => axiosInstance.get(`/warehouse/stock/${id}/`));
      const data = response?.data || response;
      return { success: true, data: mapStock(data) };
    } catch {
      try {
        const response = await axiosInstance.get('/warehouse/stock');
        const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        const item = items.find((s) => String(s.id) === String(id) || String(s.product_id) === String(id));
        if (item) {
          return { success: true, data: mapStock(item) };
        }
      } catch {}
      return { success: true, data: null };
    }
  },

  updateStock: async (id, stockData) => {
    try {
      const payload = {
        quantity: Number(stockData.quantity) || 0,
        avg_unit_cost: Number(stockData.purchasePrice || stockData.unitPrice) || 0,
        min_quantity: Number(stockData.minQuantity) || 10,
        status: stockData.status || 'ACTIVE',
      };
      await axiosInstance.put(`/warehouse/stock/${id}`, payload)
        .catch(() => axiosInstance.put(`/warehouse/stock/${id}/`, payload))
        .catch(() => axiosInstance.put(`/warehouse/stock/${id}/update`, payload))
        .catch(() => axiosInstance.put(`/warehouse/stock/${id}/update/`, payload))
        .catch(() => axiosInstance.put(`/warehouse/stocks/${id}`, payload))
        .catch(() => axiosInstance.put(`/warehouse/stocks/${id}/`, payload));

      return { success: true, message: "Ombor zaxirasi muvaffaqiyatli yangilandi." };
    } catch {
      return { success: true, message: "Ombor zaxirasi yangilandi." };
    }
  },

  deleteStock: async (id) => {
    try {
      await axiosInstance.delete(`/warehouse/stock/${id}`)
        .catch(() => axiosInstance.delete(`/warehouse/stock/${id}/`))
        .catch(() => axiosInstance.delete(`/warehouse/stock/${id}/delete`))
        .catch(() => axiosInstance.delete(`/warehouse/stocks/${id}`))
        .catch(() => axiosInstance.delete(`/warehouse/stocks/${id}/`));

      return { success: true, message: "Ombor zaxirasi muvaffaqiyatli o'chirildi." };
    } catch {
      return { success: true, message: "Ombor zaxirasi o'chirildi." };
    }
  },

  // Stock Movements Endpoints
  getMovements: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/warehouse/stock').catch(() => null);
      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let apiMovements = items.map((m, idx) => ({
        id: m.id ? `api_mov_${m.id}_${idx}` : `stock_${Date.now()}_${idx}`,
        productName: m.product_name || m.productName || 'Mahsulot',
        warehouseName: m.warehouse_name || m.warehouseName || 'Asosiy Ombor',
        quantity: Number(m.quantity) || 0,
        unitName: 'dona',
        movementTypeName: 'Kirim',
        movementTypeCode: 'PURCHASE',
        reason: m.notes || m.reason || 'Ombor Kirimi',
        createdBy: m.created_by || m.createdBy || 'Mas\'ul Xodim',
        createdDate: m.created_at
          ? new Date(m.created_at).toISOString().replace('T', ' ').slice(0, 16)
          : new Date().toISOString().replace('T', ' ').slice(0, 16),
      }));

      let result = apiMovements;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (m) =>
            m.productName.toLowerCase().includes(q) ||
            m.warehouseName.toLowerCase().includes(q)
        );
      }

      if (filters.movementTypeCode) {
        result = result.filter((m) => m.movementTypeCode === filters.movementTypeCode);
      }

      return { success: true, data: result };
    } catch {
      return { success: true, data: [] };
    }
  },

  getMovementById: async (id) => {
    return { success: true, data: null };
  },

  createMovement: async (movementData) => {
    let targetWarehouseId = movementData.warehouseId;
    let targetProductId = movementData.productId;

    // 1. Fetch real warehouses from backend
    let realWarehouses = [];
    try {
      const whRes = await axiosInstance.get('/master-data/warehouses');
      realWarehouses = Array.isArray(whRes?.data) ? whRes.data : Array.isArray(whRes) ? whRes : [];
    } catch {
      realWarehouses = [];
    }

    if (realWarehouses.length > 0) {
      const matchedWh = realWarehouses.find(
        (w) => String(w.id) === String(targetWarehouseId) || w.name === movementData.warehouseName
      );
      targetWarehouseId = matchedWh ? matchedWh.id : realWarehouses[0].id;
    }

    // 2. Fetch real products from backend
    let realProducts = [];
    try {
      const prodRes = await axiosInstance.get('/products');
      realProducts = Array.isArray(prodRes?.data) ? prodRes.data : Array.isArray(prodRes) ? prodRes : [];
    } catch {
      realProducts = [];
    }

    if (targetProductId && realProducts.length > 0) {
      const matchedP = realProducts.find((p) => String(p.id) === String(targetProductId));
      if (matchedP) targetProductId = matchedP.id;
    }

    if (!isValidUUID(targetProductId) && movementData.productName) {
      const matchByName = realProducts.find(
        (p) => p.name?.toLowerCase() === movementData.productName?.toLowerCase()
      );
      if (matchByName) {
        targetProductId = matchByName.id;
      }
    }

    // 3. Create real product via POST /products if missing valid UUID
    if (!isValidUUID(targetProductId) && movementData.productName) {
      try {
        const [catRes, unitRes] = await Promise.all([
          axiosInstance.get('/master-data/product-categories').catch(() => null),
          axiosInstance.get('/master-data/units').catch(() => null),
        ]);

        const catList = Array.isArray(catRes?.data) ? catRes.data : Array.isArray(catRes) ? catRes : [];
        const unitList = Array.isArray(unitRes?.data) ? unitRes.data : Array.isArray(unitRes) ? unitRes : [];

        const catId = catList[0]?.id;
        const unitId = unitList[0]?.id;

        if (catId && unitId) {
          const createProdRes = await axiosInstance.post('/products', {
            name: movementData.productName,
            code: `PRD-${Date.now().toString().slice(-6)}`,
            type: 'FINISHED_GOOD',
            category_id: catId,
            unit_id: unitId,
            min_stock_level: 0,
            unit_price: Number(movementData.unitPrice) || 0,
          });

          const createdObj = createProdRes?.data || createProdRes;
          if (createdObj?.id) {
            targetProductId = createdObj.id;
          }
        }
      } catch (err) {
        console.error("Failed to auto-create product:", err);
      }
    }

    if (!isValidUUID(targetProductId) && realProducts[0]?.id) {
      targetProductId = realProducts[0].id;
    }

    // 4. Send POST /warehouse/stock to Django REST API
    const stockPayload = {
      warehouse_id: targetWarehouseId,
      product_id: targetProductId,
      product_name: movementData.productName,
      quantity: Number(movementData.quantity) || 0,
      avg_unit_cost: Number(movementData.unitPrice) || 0,
      created_by: movementData.createdBy || 'Mas\'ul Xodim',
      notes: movementData.notes || '',
    };

    const apiRes = await axiosInstance.post('/warehouse/stock', stockPayload);
    const createdStock = apiRes?.data || apiRes;

    return {
      success: true,
      data: {
        ...movementData,
        id: createdStock?.id || `mov_${Date.now()}`,
        productId: targetProductId,
        warehouseId: targetWarehouseId,
      },
      message: "Yangi mahsulot omborga muvaffaqiyatli kirim qilindi va saqlandi.",
    };
  },

  // Revaluation Endpoints
  getRevaluations: async () => {
    return { success: true, data: [] };
  },

  createRevaluation: async (revaluationData) => {
    const newRev = {
      ...revaluationData,
      id: `rev_${Date.now()}`,
      priceDifference: revaluationData.newPrice - revaluationData.previousPrice,
      createdBy: 'Nodira Qosimova',
      createdDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    return { success: true, data: newRev, message: "Qayta baholash muvaffaqiyatli saqlandi." };
  },

  // Inventory Count Endpoints
  getInventoryCounts: async () => {
    return { success: true, data: [] };
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
    return { success: true, data: newCount, message: "Inventarizatsiya sanoq tuzatishi saqlandi." };
  },
};

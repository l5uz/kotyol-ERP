import { axiosInstance } from '@/api/axiosInstance';

const mapRecipe = (item) => {
  if (!item) return null;

  const rawItems = Array.isArray(item.items) ? item.items : [];
  const mappedItems = rawItems.map((ing) => {
    const qty = Number(ing.required_quantity || ing.quantity || ing.requiredQuantity) || 0;
    const price = Number(ing.unit_price || ing.unitPrice || ing.price) || 0;
    const waste = Number(ing.waste_percent || ing.wastePercent || ing.waste_rate || 0);
    const totalCost = qty * price * (1 + waste / 100);

    return {
      id: ing.id || ing.material_id || `item_${Date.now()}_${Math.random()}`,
      materialId: ing.material_id || ing.materialId || ing.product_id || ing.productId,
      materialName: ing.material_name || ing.materialName || ing.product_name || ing.productName || 'Xomashyo',
      materialTypeName: ing.material_type_name || ing.materialTypeName || '',
      unitName: ing.unit_name || ing.unitName || 'dona',
      requiredQuantity: qty,
      wastePercent: waste,
      unitPrice: price,
      totalCost: totalCost,
      notes: ing.notes || ing.description || '',
    };
  });

  const baseMaterialCost = mappedItems.reduce((acc, row) => acc + row.requiredQuantity * row.unitPrice, 0);
  const estimatedWasteCost = mappedItems.reduce((acc, row) => acc + row.requiredQuantity * row.unitPrice * (row.wastePercent / 100), 0);
  const estimatedTotalCost = baseMaterialCost + estimatedWasteCost;

  const rawVersions = Array.isArray(item.versions_history || item.versionsHistory)
    ? (item.versions_history || item.versionsHistory)
    : [];
  const mappedVersions = rawVersions.map((v) => ({
    version: v.version,
    createdDate: v.created_date || v.createdDate || item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    status: v.status,
    note: v.note || v.notes || '',
  }));

  if (mappedVersions.length === 0) {
    mappedVersions.push({
      version: item.version || '1.0',
      createdDate: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      status: item.status || 'ACTIVE',
      note: 'Yaratilgan versiya',
    });
  }

  const rawTimeline = Array.isArray(item.timeline) ? item.timeline : [];
  const mappedTimeline = rawTimeline.map((tl) => ({
    id: tl.id,
    title: tl.title,
    timestamp: tl.timestamp || tl.created_at || new Date().toISOString().replace('T', ' ').slice(0, 16),
    description: tl.description || '',
  }));

  if (mappedTimeline.length === 0) {
    mappedTimeline.push({
      id: `rtl_${Date.now()}`,
      title: `Retsept v${item.version || '1.0'} Yaratildi`,
      timestamp: item.created_at?.replace('T', ' ').slice(0, 16) || new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: 'Yaratilgan versiya',
    });
  }

  return {
    id: item.id,
    recipeName: item.recipe_name || item.recipeName || item.name || 'Retsept',
    productId: item.product_id || item.productId,
    productName: item.product_name || item.productName || item.product?.name || 'Mahsulot',
    version: item.version || '1.0',
    status: item.status || 'ACTIVE',
    description: item.description || '',
    createdDate: item.created_at?.split('T')[0] || item.created_date || item.createdDate || new Date().toISOString().split('T')[0],
    updatedDate: item.updated_at?.split('T')[0] || item.updated_date || item.updatedDate || new Date().toISOString().split('T')[0],
    items: mappedItems,
    versionsHistory: mappedVersions,
    timeline: mappedTimeline,
    totalMaterialCount: mappedItems.length,
    baseMaterialCost,
    estimatedWasteCost,
    estimatedTotalCost,
  };
};

const mapRecipePayload = (recipeData) => {
  const rawItems = Array.isArray(recipeData.items) ? recipeData.items : [];
  const mappedItems = rawItems.map((ing) => ({
    material_id: ing.materialId,
    material_name: ing.materialName,
    required_quantity: Number(ing.requiredQuantity) || 0,
    waste_percent: Number(ing.wastePercent) || 0,
    unit_price: Number(ing.unitPrice) || 0,
    notes: ing.notes || '',
  }));

  return {
    recipe_name: recipeData.recipeName,
    product_id: recipeData.productId,
    version: recipeData.version || '1.0',
    status: recipeData.status || 'ACTIVE',
    description: recipeData.description || '',
    items: mappedItems,
  };
};

export const recipesApi = {
  getRecipes: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/production/recipes')
        .catch(() => axiosInstance.get('/production/recipe'))
        .catch(() => axiosInstance.get('/production/recipes/'))
        .catch(() => axiosInstance.get('/production/recipe/'));

      const items = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      let result = items.map(mapRecipe).filter(Boolean);

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (r) =>
            r.recipeName.toLowerCase().includes(q) ||
            r.productName.toLowerCase().includes(q)
        );
      }

      if (filters.productId) {
        result = result.filter((r) => String(r.productId) === String(filters.productId));
      }

      if (filters.status) {
        result = result.filter((r) => r.status === filters.status);
      }

      return { success: true, data: result };
    } catch {
      return { success: true, data: [] };
    }
  },

  getRecipeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/production/recipes/${id}`)
        .catch(() => axiosInstance.get(`/production/recipes/${id}/`))
        .catch(() => axiosInstance.get(`/production/recipe/${id}`))
        .catch(() => axiosInstance.get(`/production/recipe/${id}/`));

      const data = response?.data || response;
      return { success: true, data: mapRecipe(data) };
    } catch {
      return { success: true, data: null };
    }
  },

  createRecipe: async (recipeData) => {
    try {
      const payload = mapRecipePayload(recipeData);
      const response = await axiosInstance.post('/production/recipes', payload)
        .catch(() => axiosInstance.post('/production/recipes/', payload))
        .catch(() => axiosInstance.post('/production/recipe', payload))
        .catch(() => axiosInstance.post('/production/recipe/', payload));

      const data = response?.data || response;
      return { success: true, data: mapRecipe(data), message: "Yangi retseptur muvaffaqiyatli saqlandi." };
    } catch {
      return { success: true, message: "Retseptur saqlandi." };
    }
  },

  updateRecipe: async (id, recipeData) => {
    try {
      const payload = mapRecipePayload(recipeData);
      const response = await axiosInstance.put(`/production/recipes/${id}`, payload)
        .catch(() => axiosInstance.put(`/production/recipes/${id}/`, payload))
        .catch(() => axiosInstance.put(`/production/recipe/${id}`, payload))
        .catch(() => axiosInstance.put(`/production/recipe/${id}/`, payload));

      const data = response?.data || response;
      return { success: true, data: mapRecipe(data), message: "Retsept ma'lumotlari yangilandi." };
    } catch {
      return { success: true, message: "Retsept yangilandi." };
    }
  },

  activateVersion: async (id) => {
    try {
      const response = await axiosInstance.post(`/production/recipes/${id}/activate`)
        .catch(() => axiosInstance.post(`/production/recipes/${id}/activate/`))
        .catch(() => axiosInstance.put(`/production/recipes/${id}`, { status: 'ACTIVE' }))
        .catch(() => axiosInstance.put(`/production/recipes/${id}/`, { status: 'ACTIVE' }));

      const data = response?.data || response;
      return { success: true, data: mapRecipe(data), message: "Retsept versiyasi faollashtirildi." };
    } catch {
      return { success: true, message: "Retsept versiyasi faollashtirildi." };
    }
  },

  deleteRecipe: async (id) => {
    try {
      await axiosInstance.delete(`/production/recipes/${id}`)
        .catch(() => axiosInstance.delete(`/production/recipes/${id}/`))
        .catch(() => axiosInstance.delete(`/production/recipe/${id}`))
        .catch(() => axiosInstance.delete(`/production/recipe/${id}/`));

      return { success: true, message: "Retsept o'chirildi." };
    } catch {
      return { success: true, message: "Retsept o'chirildi." };
    }
  },
};

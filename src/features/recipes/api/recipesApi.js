import { axiosInstance } from '@/api/axiosInstance';
import { productsApi } from '@/features/products/api/productsApi';

const parseRecipeFromDescription = (description, product) => {
  if (!description || !description.trim().startsWith('{')) return null;
  try {
    const data = JSON.parse(description);
    if (!data.recipeName && !data.items) return null;

    const rawItems = Array.isArray(data.items) ? data.items : [];
    const mappedItems = rawItems.map((ing) => {
      const qty = Number(ing.requiredQuantity || ing.quantity || 0) || 0;
      const price = Number(ing.unitPrice || ing.price || 0) || 0;
      const waste = Number(ing.wastePercent || 0);
      const totalCost = qty * price * (1 + waste / 100);

      return {
        id: ing.id || `ing_${Date.now()}_${Math.random()}`,
        materialId: ing.materialId,
        materialName: ing.materialName || 'Xomashyo',
        materialTypeName: ing.materialTypeName || '',
        unitName: ing.unitName || 'dona',
        requiredQuantity: qty,
        wastePercent: waste,
        unitPrice: price,
        totalCost: totalCost,
        notes: ing.notes || '',
      };
    });

    const baseMaterialCost = mappedItems.reduce((acc, row) => acc + row.requiredQuantity * row.unitPrice, 0);
    const estimatedWasteCost = mappedItems.reduce((acc, row) => acc + row.requiredQuantity * row.unitPrice * (row.wastePercent / 100), 0);
    const estimatedTotalCost = baseMaterialCost + estimatedWasteCost;

    return {
      id: product.id,
      recipeName: data.recipeName || `${product.name} Resepturasi`,
      productId: product.id,
      productName: product.name,
      version: data.version || '1.0',
      status: data.status || 'ACTIVE',
      description: data.description || '',
      createdDate: product.createdDate || new Date().toISOString().split('T')[0],
      updatedDate: product.updatedDate || new Date().toISOString().split('T')[0],
      items: mappedItems,
      versionsHistory: [
        {
          version: data.version || '1.0',
          createdDate: product.createdDate || new Date().toISOString().split('T')[0],
          status: data.status || 'ACTIVE',
          note: 'Saqlangan versiya',
        }
      ],
      timeline: [
        {
          id: `rtl_${product.id}`,
          title: `Retsept v${data.version || '1.0'} Yuklandi`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          description: 'Texnologik karta bazadan yuklandi.',
        }
      ],
      totalMaterialCount: mappedItems.length,
      baseMaterialCost,
      estimatedWasteCost,
      estimatedTotalCost,
    };
  } catch {
    return null;
  }
};

export const recipesApi = {
  getRecipes: async (filters = {}) => {
    try {
      const prodRes = await productsApi.getProducts();
      const products = Array.isArray(prodRes?.data) ? prodRes.data : [];

      let result = products
        .map((p) => parseRecipeFromDescription(p.description, p))
        .filter(Boolean);

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
      const prodRes = await productsApi.getProductById(id);
      if (prodRes.success && prodRes.data) {
        const recipe = parseRecipeFromDescription(prodRes.data.description, prodRes.data);
        if (recipe) {
          return { success: true, data: recipe };
        }
      }
      return { success: true, data: null };
    } catch {
      return { success: true, data: null };
    }
  },

  createRecipe: async (recipeData) => {
    try {
      const recipeJSON = {
        recipeName: recipeData.recipeName,
        version: recipeData.version || '1.0',
        status: recipeData.status || 'ACTIVE',
        description: recipeData.description || '',
        items: recipeData.items || [],
      };

      const res = await productsApi.updateProduct(recipeData.productId, {
        description: JSON.stringify(recipeJSON),
      });

      if (res.success) {
        return { success: true, message: "Yangi retseptur muvaffaqiyatli saqlandi." };
      }
      return { success: false, message: "Retseptni saqlashda xatolik." };
    } catch {
      return { success: false, message: "Retseptni saqlashda xatolik." };
    }
  },

  updateRecipe: async (id, recipeData) => {
    try {
      const recipeJSON = {
        recipeName: recipeData.recipeName,
        version: recipeData.version || '1.0',
        status: recipeData.status || 'ACTIVE',
        description: recipeData.description || '',
        items: recipeData.items || [],
      };

      const res = await productsApi.updateProduct(recipeData.productId || id, {
        description: JSON.stringify(recipeJSON),
      });

      if (res.success) {
        return { success: true, message: "Retsept ma'lumotlari yangilandi." };
      }
      return { success: false, message: "Retseptni yangilashda xatolik." };
    } catch {
      return { success: false, message: "Retseptni yangilashda xatolik." };
    }
  },

  activateVersion: async (id) => {
    try {
      const resById = await recipesApi.getRecipeById(id);
      if (resById.success && resById.data) {
        const recipe = resById.data;
        recipe.status = 'ACTIVE';
        await recipesApi.updateRecipe(id, recipe);
        return { success: true, message: "Retsept versiyasi faollashtirildi." };
      }
      return { success: false, message: "Retsept topilmadi." };
    } catch {
      return { success: false, message: "Retsept faollashtirishda xatolik." };
    }
  },

  deleteRecipe: async (id) => {
    try {
      const res = await productsApi.updateProduct(id, {
        description: '',
      });
      if (res.success) {
        return { success: true, message: "Retsept o'chirildi." };
      }
      return { success: false, message: "Retseptni o'chirishda xatolik." };
    } catch {
      return { success: false, message: "Retseptni o'chirishda xatolik." };
    }
  },
};

import { MOCK_RECIPES } from '../constants/recipes.mock';

export const recipesApi = {
  getRecipes: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 250));
    let result = [...MOCK_RECIPES];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.recipeName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      );
    }

    if (filters.productId) {
      result = result.filter((r) => r.productId === filters.productId);
    }

    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }

    return { success: true, data: result };
  },

  getRecipeById: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    const recipe = MOCK_RECIPES.find((r) => r.id === id) || MOCK_RECIPES[0];
    return { success: true, data: { ...recipe } };
  },

  createRecipe: async (recipeData) => {
    await new Promise((res) => setTimeout(res, 350));
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newRecipe = {
      ...recipeData,
      id: `rec_${Date.now()}`,
      createdDate: nowStr,
      updatedDate: nowStr,
      versionsHistory: [
        {
          version: recipeData.version || '1.0',
          createdDate: nowStr,
          status: recipeData.status || 'ACTIVE',
          note: 'Yangi yaratilgan versiya',
        },
      ],
      timeline: [
        {
          id: `rtl_${Date.now()}`,
          title: `Retsept v${recipeData.version || '1.0'} Yaratildi`,
          timestamp: nowTime,
          description: 'Yangi retseptur kiritildi va saqlandi.',
        },
      ],
    };

    // If new recipe is ACTIVE, deactivate other versions for this product
    if (newRecipe.status === 'ACTIVE') {
      MOCK_RECIPES.forEach((r) => {
        if (r.productId === newRecipe.productId) {
          r.status = 'INACTIVE';
        }
      });
    }

    MOCK_RECIPES.unshift(newRecipe);
    return { success: true, data: newRecipe, message: "Yangi retseptur muvaffaqiyatli saqlandi." };
  },

  updateRecipe: async (id, recipeData) => {
    await new Promise((res) => setTimeout(res, 350));
    const index = MOCK_RECIPES.findIndex((r) => r.id === id);
    if (index === -1) return { success: false, message: "Retsept topilmadi." };

    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const existing = MOCK_RECIPES[index];
    const updatedRecipe = {
      ...existing,
      ...recipeData,
      updatedDate: nowStr,
    };

    if (recipeData.status === 'ACTIVE' && existing.status !== 'ACTIVE') {
      MOCK_RECIPES.forEach((r) => {
        if (r.productId === updatedRecipe.productId && r.id !== id) {
          r.status = 'INACTIVE';
        }
      });
    }

    updatedRecipe.timeline.unshift({
      id: `rtl_${Date.now()}`,
      title: "Retsept Ma'lumotlari Yangilandi",
      timestamp: nowTime,
      description: "Texnologik kartaning masalliqlar yoki rekvizitlari yangilandi.",
    });

    MOCK_RECIPES[index] = updatedRecipe;
    return { success: true, data: updatedRecipe, message: "Retsept ma'lumotlari yangilandi." };
  },

  activateVersion: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    const target = MOCK_RECIPES.find((r) => r.id === id);
    if (!target) return { success: false, message: "Retsept topilmadi." };

    MOCK_RECIPES.forEach((r) => {
      if (r.productId === target.productId) {
        r.status = r.id === id ? 'ACTIVE' : 'INACTIVE';
      }
    });

    target.timeline.unshift({
      id: `rtl_${Date.now()}`,
      title: `Versiya v${target.version} Faollashtirildi`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: "Ushbu versiya ishlab chiqarish uchun FAOL deb belgilandi.",
    });

    return { success: true, data: target, message: `Retsept v${target.version} faollashtirildi.` };
  },

  deleteRecipe: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    const index = MOCK_RECIPES.findIndex((r) => r.id === id);
    if (index !== -1) MOCK_RECIPES.splice(index, 1);
    return { success: true, message: "Retsept o'chirildi." };
  },
};

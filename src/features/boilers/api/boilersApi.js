import { MOCK_BOILERS } from '../constants/boilers.mock';
import { recipesApi } from '@/features/recipes/api/recipesApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

export const boilersApi = {
  getBoilers: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 250));
    let result = [...MOCK_BOILERS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.modelName.toLowerCase().includes(q) ||
          b.internalCode.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }

    return { success: true, data: result };
  },

  getBoilerById: async (id) => {
    await new Promise((res) => setTimeout(res, 200));
    const boiler = MOCK_BOILERS.find((b) => b.id === id) || MOCK_BOILERS[0];
    return { success: true, data: { ...boiler } };
  },

  calculateBoilerCost: async (recipeId, selectedStageIds = []) => {
    let materialCost = 0;
    if (recipeId) {
      const recRes = await recipesApi.getRecipeById(recipeId);
      if (recRes.success && recRes.data.items) {
        materialCost = recRes.data.items.reduce((acc, row) => acc + (row.totalCost || 0), 0);
      }
    }

    const allStages = dynamicSettingsService.getProductionStages();
    const stageCost = (selectedStageIds || []).reduce((acc, stgId) => {
      const stg = allStages.find((s) => s.id === stgId);
      return acc + (stg ? (stg.defaultPrice || 0) : 0);
    }, 0);

    const laborCost = 50.0;
    const totalCost = materialCost + stageCost + laborCost;

    return { materialCost, stageCost, laborCost, totalCost };
  },

  createBoiler: async (boilerData) => {
    await new Promise((res) => setTimeout(res, 350));

    // Validation: Duplicate SKU Internal Code check
    const duplicateSKU = MOCK_BOILERS.some((b) => b.internalCode.toLowerCase() === boilerData.internalCode.toLowerCase());
    if (duplicateSKU) {
      return { success: false, message: `Ushbu '${boilerData.internalCode}' ichki kodi allaqachon mavjud!` };
    }

    // Validation: Active Recipe check
    if (boilerData.recipeId) {
      const recRes = await recipesApi.getRecipeById(boilerData.recipeId);
      if (recRes.success && recRes.data.status !== 'ACTIVE') {
        return { success: false, message: "Tanlangan retseptura NOFAOL (Inactive)! Faqat faol retseptlarni biriktirish mumkin." };
      }
    }

    const costBreakdown = await boilersApi.calculateBoilerCost(boilerData.recipeId, boilerData.selectedStageIds);
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newBoiler = {
      ...boilerData,
      id: `boil_${Date.now()}`,
      createdDate: nowStr,
      updatedDate: nowStr,
      costBreakdown,
      attachments: [],
      timeline: [
        {
          id: `btl_${Date.now()}`,
          title: 'Kotyol Modeli Yaratildi',
          timestamp: nowTime,
          description: 'Yangi kotyol modeli katalogga muvaffaqiyatli kiritildi.',
        },
      ],
    };

    MOCK_BOILERS.unshift(newBoiler);
    return { success: true, data: newBoiler, message: "Kotyol modeli muvaffaqiyatli saqlandi." };
  },

  updateBoiler: async (id, boilerData) => {
    await new Promise((res) => setTimeout(res, 350));
    const index = MOCK_BOILERS.findIndex((b) => b.id === id);
    if (index === -1) return { success: false, message: "Kotyol modeli topilmadi." };

    const existing = MOCK_BOILERS[index];
    const costBreakdown = await boilersApi.calculateBoilerCost(boilerData.recipeId, boilerData.selectedStageIds);
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedBoiler = {
      ...existing,
      ...boilerData,
      costBreakdown,
      updatedDate: nowStr,
    };

    updatedBoiler.timeline.unshift({
      id: `btl_${Date.now()}`,
      title: "Kotyol Modeli Yangilandi",
      timestamp: nowTime,
      description: "Model parametri, retsepturasi yoki bosqichlari yangilandi.",
    });

    MOCK_BOILERS[index] = updatedBoiler;
    return { success: true, data: updatedBoiler, message: "Kotyol modeli ma'lumotlari yangilandi." };
  },

  deleteBoiler: async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    const index = MOCK_BOILERS.findIndex((b) => b.id === id);
    if (index !== -1) MOCK_BOILERS.splice(index, 1);
    return { success: true, message: "Kotyol modeli katalogdan o'chirildi." };
  },
};

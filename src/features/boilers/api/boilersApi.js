import { recipesApi } from '@/features/recipes/api/recipesApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { axiosInstance } from '@/api/axiosInstance';

export const boilersApi = {
  getBoilers: async (filters = {}) => {
    const response = await axiosInstance.get('/master-data/boilers');
    let list = response.data || [];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.modelName.toLowerCase().includes(q) ||
          (b.internalCode && b.internalCode.toLowerCase().includes(q))
      );
    }

    if (filters.status) {
      list = list.filter((b) => b.status === filters.status);
    }

    return { success: true, data: list };
  },

  getBoilerById: async (id) => {
    const response = await axiosInstance.get(`/master-data/boilers/${id}`);
    return { success: true, data: response.data };
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
    // Duplicate internal code validation
    const boilersList = await boilersApi.getBoilers();
    const duplicateSKU = (boilersList.data || []).some(
      (b) => b.internalCode && b.internalCode.toLowerCase() === boilerData.internalCode.toLowerCase()
    );
    if (duplicateSKU) {
      return { success: false, message: `Ushbu '${boilerData.internalCode}' ichki kodi allaqachon mavjud!` };
    }

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

    const response = await axiosInstance.post('/master-data/boilers', newBoiler).catch(async () => {
      return await axiosInstance.post('/master-data/boilers/create', newBoiler);
    });
    return { success: true, data: response.data, message: "Kotyol modeli muvaffaqiyatli saqlandi." };
  },

  updateBoiler: async (id, boilerData) => {
    const boilersList = await boilersApi.getBoilers();
    const existing = (boilersList.data || []).find((b) => b.id === id);
    if (!existing) return { success: false, message: "Kotyol modeli topilmadi." };

    const costBreakdown = await boilersApi.calculateBoilerCost(boilerData.recipeId, boilerData.selectedStageIds);
    const nowStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const updatedBoiler = {
      ...existing,
      ...boilerData,
      costBreakdown,
      updatedDate: nowStr,
    };

    if (!updatedBoiler.timeline) updatedBoiler.timeline = [];
    updatedBoiler.timeline.unshift({
      id: `btl_${Date.now()}`,
      title: "Kotyol Modeli Yangilandi",
      timestamp: nowTime,
      description: "Model parametri, retsepturasi yoki bosqichlari yangilandi.",
    });

    const response = await axiosInstance.put(`/master-data/boilers/${id}`, updatedBoiler);
    return { success: true, data: response.data, message: "Kotyol modeli ma'lumotlari yangilandi." };
  },

  deleteBoiler: async (id) => {
    await axiosInstance.delete(`/master-data/boilers/${id}`).catch(async () => {
      return await axiosInstance.delete(`/master-data/boilers/${id}/delete`);
    });
    return { success: true, message: "Kotyol modeli katalogdan o'chirildi." };
  },
};

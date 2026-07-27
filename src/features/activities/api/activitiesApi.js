import { MOCK_ACTIVITIES } from '../constants/activities.mock';

export const activitiesApi = {
  async getActivities(params = {}) {
    let result = [...MOCK_ACTIVITIES];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.user.toLowerCase().includes(q)
      );
    }

    if (params.moduleName) {
      result = result.filter((a) => a.moduleName === params.moduleName);
    }

    return { success: true, data: result };
  },
};

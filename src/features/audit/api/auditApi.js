import { axiosInstance } from '@/api/axiosInstance';

const mapAuditLog = (item) => {
  if (!item) return null;
  const dt = new Date(item.created_at);
  const actionLabelMap = {
    CREATE: 'Yaratildi',
    UPDATE: 'Yangilandi',
    DELETE: 'O\'chirildi',
    LOGIN: 'Tizimga kirildi',
  };

  return {
    id: item.id,
    date: dt.toISOString().split('T')[0],
    time: dt.toTimeString().split(' ')[0],
    user: 'Alex Vance',
    module: item.entity_name?.toLowerCase() || 'system',
    moduleLabel: item.entity_name || 'Tizim',
    action: item.action,
    actionLabel: actionLabelMap[item.action] || item.action,
    affectedRecord: item.entity_id,
    description: `${item.entity_name} bo'yicha ${item.action} harakati bajarildi.`,
    ipAddress: item.ip_address || '127.0.0.1',
    linkPath: `/${item.entity_name?.toLowerCase()}s`,
    oldValues: item.old_values,
    newValues: item.new_values,
  };
};

export const auditApi = {
  async getAuditLogs(params = {}) {
    const queryParams = {
      page: 1,
      limit: 100,
      action: params.action || undefined,
      entity_name: params.module || undefined,
    };

    const response = await axiosInstance.get('/audit-logs', { params: queryParams });
    const items = response.data || [];
    let result = items.map(mapAuditLog);

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.user.toLowerCase().includes(q) ||
          a.affectedRecord.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    return { success: true, data: result };
  },

  async getAuditLogById(id) {
    const response = await axiosInstance.get('/audit-logs');
    const log = (response.data || []).find((a) => a.id === id);
    if (!log) return { success: false, message: 'Audit yozuvi topilmadi' };
    return { success: true, data: mapAuditLog(log) };
  },
};

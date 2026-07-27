import { MOCK_NOTIFICATIONS } from '../constants/notifications.mock';

let notificationsMemory = [...MOCK_NOTIFICATIONS];

export const notificationsApi = {
  async getNotifications() {
    return { success: true, data: [...notificationsMemory] };
  },

  async markAsRead(id) {
    notificationsMemory = notificationsMemory.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    return { success: true, message: 'Bildirishnoma o\'qilgan deb belgilandi' };
  },

  async markAllAsRead() {
    notificationsMemory = notificationsMemory.map((n) => ({ ...n, isRead: true }));
    return { success: true, message: 'Barcha bildirishnomalar o\'qilgan deb belgilandi' };
  },

  async deleteNotification(id) {
    notificationsMemory = notificationsMemory.filter((n) => n.id !== id);
    return { success: true, message: 'Bildirishnoma o\'chirildi' };
  },
};

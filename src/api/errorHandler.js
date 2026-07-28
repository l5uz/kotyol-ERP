import { notifyError } from '@/services/notification.service';

export const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || 'Kutilmagan xatolik yuz berdi';

    switch (status) {
      case 400:
        notifyError(message, 'Xato so\'rov');
        break;
      case 401:
        // Handled by interceptor token refresh flow
        break;
      case 403:
        notifyError('Ushbu amalni bajarish uchun ruxsatingiz yo\'q.', 'Ruxsat berilmadi');
        break;
      case 404:
        notifyError(message || 'So\'ralgan ma\'lumot topilmadi.', 'Topilmadi');
        break;
      case 422:
        notifyError(message || 'Kiritilgan ma\'lumotlarda xatolik bor.', 'Tekshirish xatoligi');
        break;
      case 500:
        notifyError('Serverda xatolik yuz berdi. Iltimos texnik yordamga murojaat qiling.', 'Server Xatoligi');
        break;
      default:
        notifyError(message, `HTTP Xatosi ${status}`);
    }

    return { status, message, data: error.response.data };
  } else if (error.request) {
    window.dispatchEvent(new Event('app-network-error'));
    const msg = 'Internet aloqasi yo\'q yoki serverga ulanib bo\'lmadi. Internetni tekshiring!';
    notifyError(msg, 'Internet Aloqasi Yo\'q');
    return { status: 0, message: msg };
  } else {
    notifyError(error.message || 'Mijoz tizimi xatoligi', 'Tizim Xatosi');
    return { status: -1, message: error.message };
  }
};

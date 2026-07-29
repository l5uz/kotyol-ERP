import { notifyError } from '@/services/notification.service';

export const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const rawData = error.response.data;
    let message = 'Serverda kutilmagan xatolik yuz berdi';

    if (rawData) {
      if (typeof rawData === 'string') {
        message = rawData;
      } else if (rawData.message) {
        message = rawData.message;
      } else if (rawData.error) {
        message = rawData.error;
      } else if (rawData.detail) {
        message = rawData.detail;
      } else if (rawData.non_field_errors && Array.isArray(rawData.non_field_errors)) {
        message = rawData.non_field_errors.join(', ');
      } else if (typeof rawData === 'object') {
        const firstKey = Object.keys(rawData)[0];
        const val = rawData[firstKey];
        const valText = Array.isArray(val) ? val.join(', ') : String(val);
        message = `${firstKey}: ${valText}`;
      }
    }

    switch (status) {
      case 400:
        notifyError(message, 'Xato so\'rov');
        break;
      case 401:
        // Handled by interceptor token refresh flow
        break;
      case 403:
        notifyError('Ushbu amalni bajarish uchun ruxsatingiz yetarli emas.', 'Ruxsat berilmadi');
        break;
      case 404:
        notifyError(message || 'So\'ralgan ma\'lumot topilmadi.', 'Ma\'lumot topilmadi');
        break;
      case 422:
        notifyError(message || 'Kiritilgan ma\'lumotlarda xatolik bor.', 'Tekshirish xatoligi');
        break;
      case 500:
        notifyError('Server ichki xatoligi. Iltimos keyinroq qayta urinib ko\'ring.', 'Server Xatoligi');
        break;
      default:
        notifyError(message, `HTTP Xatosi ${status}`);
    }

    return { status, message, data: error.response.data };
  } else if (error.request) {
    window.dispatchEvent(new Event('app-network-error'));
    const msg = 'Internet aloqasi uzildi yoki server javob bermadi. Ulanishni tekshiring!';
    notifyError(msg, 'Internet Aloqasi Yo\'q');
    return { status: 0, message: msg };
  } else {
    notifyError('Tizimda kutilmagan xatolik yuz berdi.', 'Tizim Xatosi');
    return { status: -1, message: error.message };
  }
};

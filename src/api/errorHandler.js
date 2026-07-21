import { notifyError } from '@/services/notification.service';

export const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || 'An unexpected API error occurred';

    switch (status) {
      case 400:
        notifyError(message, 'Bad Request');
        break;
      case 401:
        // Handled by interceptor token refresh flow
        break;
      case 403:
        notifyError('You do not have permission to perform this action.', 'Access Forbidden');
        break;
      case 404:
        notifyError(message || 'Requested resource not found.', 'Not Found');
        break;
      case 422:
        notifyError(message || 'Validation error in submission.', 'Validation Error');
        break;
      case 500:
        notifyError('Server internal error. Please contact technical support.', 'Server Error');
        break;
      default:
        notifyError(message, `HTTP Error ${status}`);
    }

    return { status, message, data: error.response.data };
  } else if (error.request) {
    const msg = 'Network timeout or server unreachable. Please check connection.';
    notifyError(msg, 'Network Error');
    return { status: 0, message: msg };
  } else {
    notifyError(error.message || 'Client side error', 'Application Error');
    return { status: -1, message: error.message };
  }
};

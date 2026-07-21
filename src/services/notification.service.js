import { useNotificationStore } from '@/store/useNotificationStore';

export const notifySuccess = (message, title = 'Success') => {
  useNotificationStore.getState().addNotification({ type: 'success', title, message });
};

export const notifyError = (message, title = 'Error') => {
  useNotificationStore.getState().addNotification({ type: 'error', title, message });
};

export const notifyWarning = (message, title = 'Warning') => {
  useNotificationStore.getState().addNotification({ type: 'warning', title, message });
};

export const notifyInfo = (message, title = 'Information') => {
  useNotificationStore.getState().addNotification({ type: 'info', title, message });
};

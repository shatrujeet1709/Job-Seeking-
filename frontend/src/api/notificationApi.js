import api from '../utils/axiosInstance';

export const getNotifications = async (page = 1, unreadOnly = false) => {
  const response = await api.get(`/notifications?page=${page}&limit=20&unreadOnly=${unreadOnly}`);
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

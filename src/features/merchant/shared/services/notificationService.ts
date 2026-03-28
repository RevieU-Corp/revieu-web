import { apiClient } from '../../../../api/apiClient';

export interface MerchantNotification {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const mapNotification = (notification: any): MerchantNotification => ({
  id: String(notification.id),
  type: notification.type || 'system',
  title: notification.title || 'Notification',
  content: notification.content || '',
  isRead: Boolean(notification.is_read),
  createdAt: notification.created_at || new Date().toISOString(),
});

export const notificationService = {
  async listNotifications(): Promise<MerchantNotification[]> {
    const response = await apiClient.get('/notifications');
    const notifications = Array.isArray(response.data?.data) ? response.data.data : [];
    return notifications.map(mapNotification);
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },
};

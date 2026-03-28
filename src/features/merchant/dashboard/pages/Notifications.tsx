import React, { useEffect, useState } from 'react';
import { notificationService, MerchantNotification } from '../../shared/services/notificationService';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<MerchantNotification[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const nextNotifications = await notificationService.listNotifications();
        if (isMounted) {
          setNotifications(nextNotifications);
        }
      } catch (error) {
        console.error('Failed to load merchant notifications:', error);
        if (isMounted) {
          setNotifications([]);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm text-gray-600">
            No notifications yet.
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg p-4 shadow-sm border ${notification.isRead ? 'border-gray-100' : 'border-blue-100'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold mb-2">{notification.title}</h2>
              {!notification.isRead && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </div>
            <p className="text-gray-600">{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

import { create } from "zustand";
import { Notification } from "@/types/interface";

interface NotificationStore {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/user/notification');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      console.log('Fetch Notifications Response:', data);
      if (data && data.data && Array.isArray(data.data.notifications)) {
        set({ notifications: data.data.notifications, loading: false });
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
      console.error("Fetch Notifications Error:", error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notification?notificationId=${notificationId}&action=markAsRead`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark notification as read: ${errorText}`);
      }
      const data = await response.json();
      console.log('Mark as Read Response:', data);
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        ),
      }));
    } catch (error: any) {
      console.error("Mark as Read Error:", error);
      set({ error: error.message });
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await fetch('/api/user/notification?action=markAllAsRead', {
        method: 'POST',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark all notifications as read: ${errorText}`);
      }
      const data = await response.json();
      console.log('Mark All as Read Response:', data);
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      }));
    } catch (error: any) {
      console.error("Mark All as Read Error:", error);
      set({ error: error.message });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      const response = await fetch(`/api/user/notification?notificationId=${notificationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete notification: ${errorText}`);
      }
      const data = await response.json();
      console.log('Delete Notification Response:', data);
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== notificationId
        ),
      }));
    } catch (error: any) {
      console.error("Delete Notification Error:", error);
      set({ error: error.message });
    }
  },
}));


import apiService from "@/lib/api-service";
import { Notification } from "@/types/interface";
import { create } from "zustand";



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
      const response = await apiService.listNotifications();
      set({ notifications: response.data, loading: false });
      console.log(response.data);
      
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
      console.error("Fetch Notifications Error:", error);
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
      }));
    } catch (error: any) {
      console.error("Mark as Read Error:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      }));
    } catch (error: any) {
      console.error("Mark All as Read Error:", error);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await apiService.deleteNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== notificationId
        ),
      }));
    } catch (error: any) {
      console.error("Delete Notification Error:", error);
    }
  },
}));

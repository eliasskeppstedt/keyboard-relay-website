import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
    label: string;
    callback: () => void;
    primary?: boolean;
}

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
    actions?: NotificationAction[];
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (message: string, type?: NotificationType, duration?: number, actions?: NotificationAction[]) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationService = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (message, type = 'info', duration = 5000, actions) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification: Notification = { id, message, type, duration, actions };
        
        set((state) => ({
            notifications: [...state.notifications, newNotification]
        }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }));
            }, duration);
        }
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        }));
    }
}));

export const notify = {
    success: (msg: string, dur?: number) => useNotificationService.getState().addNotification(msg, 'success', dur),
    error: (msg: string, dur?: number) => useNotificationService.getState().addNotification(msg, 'error', dur),
    info: (msg: string, dur?: number) => useNotificationService.getState().addNotification(msg, 'info', dur),
    warning: (msg: string, dur?: number) => useNotificationService.getState().addNotification(msg, 'warning', dur),
    confirm: (msg: string, actions: NotificationAction[]) => useNotificationService.getState().addNotification(msg, 'warning', 0, actions),
};

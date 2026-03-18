import { useNotificationService } from './notification.service';
import NotificationItem from './NotificationItem';

export default function NotificationPortal() {
    const { notifications } = useNotificationService();

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <div key={n.id} className="pointer-events-auto">
                    <NotificationItem notification={n} />
                </div>
            ))}
        </div>
    );
}

import { type Notification, useNotificationService } from './notification.service';

interface NotificationItemProps {
    notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const { removeNotification } = useNotificationService();

    const typeStyles = {
        success: 'border-success/40 text-success',
        error: 'border-red-500/40 text-red-400',
        info: 'border-accent/40 text-accent',
        warning: 'border-yellow-500/40 text-yellow-400'
    };

    const typeIcons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    return (
        <div className={`
            flex flex-col gap-3 px-4 py-3 
            bg-bg/80 backdrop-blur-md border 
            rounded-[var(--round)]
            animate-in slide-in-from-right-full fade-in duration-300
            ${typeStyles[notification.type]}
            min-w-[320px] group
        `}>
            <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{typeIcons[notification.type]}</span>
                <span className="flex-1 text-sm font-mono">{notification.message}</span>
                <button 
                    onClick={() => removeNotification(notification.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-white ml-2 text-xs"
                >
                    🗙
                </button>
            </div>

            {notification.actions && notification.actions.length > 0 && (
                <div className="flex flex-row gap-2 justify-end mt-1">
                    {notification.actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                action.callback();
                                removeNotification(notification.id);
                            }}
                            className={`
                                px-3 py-1 text-[11px] font-mono border rounded transition-all outline-none
                                ${action.primary 
                                    ? 'bg-accent/10 border-accent/40 text-accent hover:bg-accent/20' 
                                    : 'border-border text-muted hover:text-text hover:bg-white/5'}
                            `}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

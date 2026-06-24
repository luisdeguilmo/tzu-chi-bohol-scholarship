import { Bell, Check, Trash2, X } from "lucide-react";
import React, { useState, useRef } from "react";

const NotificationPage = React.forwardRef(
    ({ notifications: initialNotifications, isOpen, onOpen, onDelete, onRefresh, onMarkAsRead }, ref) => {
        const [removingIds, setRemovingIds] = useState(new Set());
        const animatingRef = useRef(new Set());

        const formatRelativeTime = (timestamp) => {
            const now = new Date();
            const diff = now - new Date(timestamp);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            return `${days}d ago`;
        };

        const handleMarkAsRead = async (id) => {
            const success = await onMarkAsRead(id);
            if (success) onRefresh();
        };

        const handleDelete = async (id, type) => {
            if (animatingRef.current.has(id)) return;
            animatingRef.current.add(id);

            setRemovingIds((prev) => new Set(prev).add(id));

            // Wait for animation to complete before removing from DOM
            await new Promise((resolve) => setTimeout(resolve, 320));

            const success = await onDelete(id, type);
            if (success) onRefresh();

            animatingRef.current.delete(id);
            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        };

        const unreadCount = initialNotifications.filter((n) => !n.is_read).length;

        return (
            <>
                <style>{`
                    @keyframes notif-slide-out {
                        0%   { max-height: 200px; opacity: 1; transform: translateX(0); }
                        40%  { opacity: 0; transform: translateX(60px); }
                        100% { max-height: 0; opacity: 0; transform: translateX(60px); padding-top: 0; padding-bottom: 0; }
                    }
                    .notif-removing {
                        animation: notif-slide-out 320ms cubic-bezier(0.4, 0, 1, 1) forwards;
                        overflow: hidden;
                        pointer-events: none;
                    }
                `}</style>

                <div
                    ref={ref}
                    className={`${
                        isOpen ? "block" : "hidden"
                    } w-full sm:w-[450px] h-screen z-50 absolute top-0 right-0 bg-white shadow-xl overflow-y-auto`}
                >
                    {/* Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 border-b border-green-500/20 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Notifications</h2>
                            {initialNotifications.length > 0 && (
                                <p className="text-xs text-green-100 mt-0.5">
                                    {unreadCount} unread
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => onOpen(false)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {initialNotifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {initialNotifications.map((notification, index) => {
                                const isRemoving = removingIds.has(notification.id);

                                return (
                                    <div
                                        key={notification.id ?? index}
                                        className={isRemoving ? "notif-removing" : ""}
                                    >
                                        <div
                                            className={`group relative p-5 transition-colors duration-150 hover:bg-gray-50 ${
                                                notification.is_read
                                                    ? "bg-white"
                                                    : "bg-gradient-to-r from-yellow-50/60 to-amber-50/40 border-l-[3px] border-l-yellow-400"
                                            }`}
                                        >
                                            {!notification.is_read && (
                                                <div className="absolute top-6 left-2 w-2 h-2 bg-yellow-400 rounded-full" />
                                            )}

                                            <div className={!notification.is_read ? "ml-4" : ""}>
                                                <h3
                                                    className={`text-sm leading-tight ${
                                                        notification.is_read ? "text-gray-600 font-normal" : "text-gray-900 font-semibold"
                                                    }`}
                                                >
                                                    {notification.title}
                                                </h3>
                                                <p
                                                    className={`mt-1.5 text-xs leading-relaxed ${
                                                        notification.is_read ? "text-gray-400" : "text-gray-600"
                                                    }`}
                                                >
                                                    {notification.message}
                                                </p>

                                                <div className="mt-2.5 flex justify-between items-center">
                                                    <time className="text-xs font-medium text-gray-400">
                                                        {formatRelativeTime(notification.created_at)}
                                                    </time>

                                                    {/* Actions — only opacity transition, no translate */}
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors duration-150"
                                                            >
                                                                <Check className="w-3 h-3 text-green-600" />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id, notification.type)}
                                                            className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-150"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-red-600" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-sm text-center font-medium text-gray-600 mb-2">
                                No notifications yet
                            </h3>
                            <p className="text-xs text-gray-400 text-center max-w-lg leading-relaxed">
                                You're all caught up! New notifications will appear here when they arrive.
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    },
);

export default NotificationPage;
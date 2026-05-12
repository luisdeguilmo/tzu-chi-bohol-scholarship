import { Bell, Check, Trash2, X } from "lucide-react";
import React from "react";

const NotificationPage = React.forwardRef(
    (
        {
            notifications,
            isOpen,
            onOpen,
            onDelete,
            onRefresh,
            onMarkAsRead,
        },
        ref,
    ) => {
        const formatRelativeTime = (timestamp) => {
            const now = new Date();
            const time = new Date(timestamp);
            const diff = now - time;

            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            return `${days}d ago`;
        };

        const handleMarkAsRead = async (id) => {
            const success = await onMarkAsRead(id);

            if (success) {
                onRefresh();
            }
        };

        const handleDelete = async (id, type) => {
            const success = await onDelete(id, type);

            if (success) {
                onRefresh();
            }
        };

        return (
            <div
                ref={ref}
                className={`${
                    isOpen ? "block" : "hidden"
                } w-full sm:w-[450px] h-screen z-50 absolute top-0 right-0 bg-white shadow-xl overflow-y-auto`}
            >
                {/* Enhanced Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 border-b border-green-500/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Notifications
                        </h2>
                        {notifications.length > 0 && (
                            <p className="text-xs text-green-100 mt-0.5">
                                {notifications.filter((n) => !n.is_read).length}{" "}
                                unread
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => onOpen(false)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 active:ring-1 active:ring-white/30"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`group relative p-5 transition-all duration-200 hover:bg-gray-50/80 ${
                                    notification.is_read
                                        ? "bg-white"
                                        : "bg-gradient-to-r from-yellow-50/60 to-amber-50/40 border-l-3 border-l-yellow-400"
                                }`}
                            >
                                {/* Unread indicator dot */}
                                {!notification.is_read && (
                                    <div className="absolute top-6 left-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                                )}

                                <div
                                    className={`${
                                        !notification.is_read ? "ml-4" : ""
                                    }`}
                                >
                                    <h3
                                        className={`text-sm font-semibold  leading-tight ${
                                            notification.is_read
                                                ? "text-gray-600"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {notification.title}
                                    </h3>
                                    <p
                                        className={`mt-4 text-xs leading-relaxed text-justify ${notification.is_read ? "text-gray-500" : "text-gray-600"}`}
                                    >
                                        {notification.message}
                                    </p>

                                    <div className="mt-2.5 flex justify-between items-center">
                                        <time className="text-xs font-medium text-gray-400">
                                            {formatRelativeTime(
                                                notification.created_at,
                                            )}
                                        </time>

                                        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200 ease-in-out transform translate-x-2 group-hover:translate-x-0">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => {
                                                        handleMarkAsRead(
                                                            notification.id,
                                                        );
                                                    }}
                                                    className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors duration-150"
                                                >
                                                    <Check className="w-3 h-3 text-green-600" />
                                                    Mark as Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        notification.id,
                                                        notification.type,
                                                    )
                                                }
                                                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-150"
                                            >
                                                <Trash2 className="w-3 h-3 text-red-600" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            You're all caught up! New notifications will appear
                            here when they arrive.
                        </p>
                    </div>
                )}
            </div>
        );
    },
);

export default NotificationPage;

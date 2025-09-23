import Logo from "/src/assets/tzu_chi_logo.png";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";
import React, { useEffect, useState, useRef } from "react";
import {
    Bell,
    Check,
    ChevronDown,
    Delete,
    Trash,
    Trash2,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

function TopBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] =
        useState(false);

    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);
    const notificationPanelRef = useRef(null);
    const bellButtonRef = useRef(null);

    const { user } = useAuth();
    const userId = user.user_id;
    const { imageUrl } = getProfilePicture(userId);
    const navigate = useNavigate();
    const {
        notifications,
        markAsRead,
        deleteNotification,
        fetchNotifications,
    } = useNotifications(userId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isNotificationPanelOpen &&
                notificationPanelRef.current &&
                !notificationPanelRef.current.contains(event.target) &&
                bellButtonRef.current &&
                !bellButtonRef.current.contains(event.target)
            ) {
                setIsNotificationPanelOpen(false);
            } else if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                dropdownButtonRef.current && // <- new toggle button ref
                !dropdownButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isNotificationPanelOpen, isDropdownOpen]);

    return (
        <>
            <div
                className={`relative py-1 px-5 flex items-center bg-white border-b-[2px] border-gray-300`}
            >
                <div
                    className={`${
                        user.type === "scholar" ? "py-0" : "py-[2px]"
                    } flex justify-between items-center ml-8 px-2 w-full`}
                >
                    <div className="flex justify-center items-center">
                        <img
                            className="w-[50px] sm:w-[60px] mx-auto"
                            src={Logo}
                            alt="Tzu Chi Logo"
                        />
                        <div className="flex flex-col p-1 ml-[1px]">
                            <h2 className="text-[12px] md:text-[14px] font-bold whitespace-nowrap">
                                Tzu Chi Foundation
                            </h2>
                            <p className="mt-[-4px] text-[8px] md:text-[10px] whitespace-nowrap">
                                Information Management System
                            </p>
                        </div>
                    </div>
                    {user.type === "scholar" && (
                        <button
                            ref={bellButtonRef}
                            onClick={() => setIsNotificationPanelOpen(true)}
                            title="Notifications"
                            className="relative ml-auto -mr-3 p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <span
                                className={`${
                                    notifications.filter(
                                        (notification) => !notification.is_read
                                    ).length > 0
                                        ? "block"
                                        : "hidden"
                                } absolute top-2 right-3 w-2 h-2 rounded-full bg-red-600`}
                            ></span>
                            <Bell className="w-6 h-6 text-gray-500/80" />
                        </button>
                    )}
                    <div
                        ref={dropdownButtonRef}
                        onClick={() => setIsDropdownOpen(true)}
                        className={`${
                            user.type === "scholar" ? "block" : "hidden"
                        } relative px-3 py-0.5 cursor-pointer rounded-full inline-block text-white text-center`}
                    >
                        <div className="py-1 px-2 flex items-center gap-4 sm:gap-2 rounded-md">
                            <img
                                src={imageUrl}
                                className="w-9 h-9 rounded-full"
                            />
                            <p
                                className={`text-gray-500 text-xs hidden sm:block`}
                            >
                                Luis Deguilmo
                            </p>
                            <ChevronDown className="w-4 h-4 -ml-1 sm:m-0 text-gray-400" />
                        </div>
                        {isDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="p-2 w-full sm:w-[80%] mx-auto border rounded-md absolute z-50 bottom-[-80px] left-[50%] translate-x-[-50%] bg-white items-start text-gray-600 text-xs flex flex-col shadow-[0px_0px_4px_rgba(0,0,0,.2)]"
                            >
                                <button
                                    onClick={() => {
                                        navigate("/scholar/my-account");
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    className="w-full px-2 py-2 hover:bg-gray-100 rounded-md"
                                >
                                    My Account
                                </button>
                                <button className="w-full px-2 py-2 hover:bg-gray-100 rounded-md">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <NotificationPage
                ref={notificationPanelRef}
                userId={userId}
                notifications={notifications}
                isOpen={isNotificationPanelOpen}
                onOpen={setIsNotificationPanelOpen}
                onDelete={deleteNotification}
                onRefresh={fetchNotifications}
                onMarkAsRead={markAsRead}
            />
        </>
    );
}

const NotificationPage = React.forwardRef(
    (
        {
            userId,
            notifications,
            isOpen,
            onOpen,
            onDelete,
            onRefresh,
            onMarkAsRead,
        },
        ref
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
                        className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
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
                                    <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                                        {notification.title}
                                    </h3>
                                    <p className="mt-2.5 text-xs leading-relaxed text-gray-600 text-justify">
                                        {notification.message}
                                    </p>

                                    <div className="mt-4 flex justify-between items-center">
                                        <time className="text-xs font-medium text-gray-400">
                                            {formatRelativeTime(
                                                notification.created_at
                                            )}
                                        </time>

                                        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200 ease-in-out transform translate-x-2 group-hover:translate-x-0">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => {
                                                        handleMarkAsRead(
                                                            notification.id
                                                        );
                                                        console.log("Clicked!");
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
                                                        notification.type
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
    }
);

export default TopBar;

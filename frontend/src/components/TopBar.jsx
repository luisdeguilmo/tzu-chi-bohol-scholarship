import Logo from "/src/assets/tzu_chi_logo.png";
import { useAuth } from "../context/AuthContext";
import { getProfilePicture } from "../utils/getProfilePicture";
import { useEffect, useState, useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import NotificationPage from "./NotificationPage";
import { useAdminAccountInformation } from "../hooks/useAdminAccountInformation";
import { toast } from "react-toastify";

function TopBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] =
        useState(false);

    const dropdownRef = useRef(null);
    const dropdownButtonRef = useRef(null);
    const notificationPanelRef = useRef(null);
    const bellButtonRef = useRef(null);

    const { user, logout } = useAuth();
    const userId = user.user_id;
    const { imageUrl } = getProfilePicture(
        userId,
        user.type === "scholar" ? "profile-picture" : "user-profile-picture"
    );
    const navigate = useNavigate();
    const {
        notifications,
        markAsRead,
        deleteNotification,
        fetchNotifications,
    } = useNotifications(userId);
    const { adminInfo } = useAdminAccountInformation(
        user.type === "admin" && userId
    );

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
                dropdownButtonRef.current &&
                !dropdownButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }

            if (
                dropdownRef.current &&
                dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isNotificationPanelOpen, isDropdownOpen]);

    const handleLogout = () => {
        try {
            const userType = user.type || "scholar";
            toast.success("Logged out successfully");
            logout();

            if (userType === "scholar") {
                navigate("/login/scholar");
            } else if (userType === "staff") {
                navigate("/login/staff");
            } else if (userType === "admin") {
                navigate("/login/admin");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out. Please try again.");
        }
    };

    return (
        <>
            <div
                className={`relative py-1 px-5 flex items-center bg-white border-b-[2px] border-gray-300`}
            >
                <div
                    className={`flex justify-between items-center ml-7 sm:ml-8 pl-2 w-full`}
                >
                    <div className="flex justify-center items-center">
                        <img
                            className="w-[45px] sm:w-[60px] mx-auto"
                            src={Logo}
                            alt="Tzu Chi Logo"
                        />
                        <div className="flex flex-col p-1 ml-[1px]">
                            <h2 className="text-[12px] md:text-[14px] font-bold whitespace-nowrap">
                                Tzu Chi Bohol
                            </h2>
                            <p className="mt-[-4px] text-[8px] md:text-[10px] whitespace-nowrap">
                                Information Management System
                            </p>
                        </div>
                    </div>

                    <button
                        ref={bellButtonRef}
                        onClick={() => setIsNotificationPanelOpen(true)}
                        title="Notifications"
                        className={`relative ml-auto -mr-2 p-2 hover:bg-gray-100 rounded-lg ${user.type === "scholar" || user.type === "staff" || user.type === "admin" ? "block" : "hidden"}`}
                    >
                        <span
                            className={`${
                                notifications.filter(
                                    (notification) => !notification.is_read
                                ).length > 0
                                    ? "block"
                                    : "hidden"
                            } absolute top-1 text-[10px] right-2 py-[.5px] px-[5px] rounded-full bg-red-600 text-white font-bold flex items-center justify-center`}
                        >
                            {
                                notifications.filter(
                                    (notification) => !notification.is_read
                                ).length
                            }
                        </span>
                        <Bell className="w-6 h-6 text-gray-500/80" />
                    </button>

                    <div
                        ref={dropdownButtonRef}
                        onClick={() => setIsDropdownOpen(true)}
                        className={`${
                            user.type === "scholar" ||
                            user.type === "staff" ||
                            user.type === "admin"
                                ? "block"
                                : "hidden"
                        } relative pl-2 -mr-1 py-0.5 cursor-pointer rounded-full inline-block text-white text-center`}
                    >
                        <div className="py-1 px-2 flex items-center gap-4 sm:gap-2 rounded-md">
                            {user.type === "scholar" ? (
                                <>
                                    <img
                                        src={imageUrl}
                                        className="w-9 h-9 rounded-full"
                                    />
                                    <p
                                        className={`text-gray-500 text-xs hidden sm:block`}
                                    >
                                        {user.first_name} {user.last_name}
                                    </p>
                                </>
                            ) : (
                                <>
                                    {user.type === "staff" ? (
                                        <>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    className="w-9 h-9 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full text-white text-sm bg-black flex justify-center items-center">
                                                    {user.first_name[0]}{" "}
                                                    {user.last_name[0]}
                                                </div>
                                            )}

                                            <p
                                                className={`text-gray-500 text-xs hidden sm:block`}
                                            >
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    className="w-9 h-9 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full text-white text-sm bg-black flex justify-center items-center">
                                                    {
                                                        adminInfo
                                                            ?.basic_information
                                                            ?.name[0]
                                                    }
                                                </div>
                                            )}

                                            <p
                                                className={`text-gray-500 text-xs hidden sm:block`}
                                            >
                                                {
                                                    adminInfo?.basic_information
                                                        ?.name
                                                }
                                            </p>
                                        </>
                                    )}
                                </>
                            )}
                            <ChevronDown
                                className={`w-4 h-4 -ml-1 hidden sm:block sm:m-0 text-gray-400`}
                            />
                        </div>

                        {isDropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="p-2 w-[max-content] sm:w-[80%] mx-auto border rounded-md absolute z-50 bottom-[-80px] left-[30%] sm:left-[50%] translate-x-[-50%] bg-white items-start text-gray-600 text-xs flex flex-col shadow-[0px_0px_4px_rgba(0,0,0,.2)]"
                            >
                                <button
                                    onClick={() => {
                                        if (user.type === "scholar") {
                                            navigate("/scholar/my-account");
                                        } else if (user.type === "staff") {
                                            navigate("/staff/my-account");
                                        } else {
                                            navigate("/admin/my-account");
                                        }
                                        setIsDropdownOpen(!isDropdownOpen);
                                    }}
                                    className="w-full px-4 sm:px-2 py-2 hover:bg-gray-100 rounded-md"
                                >
                                    My Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-2 py-2 hover:bg-gray-100 rounded-md"
                                >
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

export default TopBar;

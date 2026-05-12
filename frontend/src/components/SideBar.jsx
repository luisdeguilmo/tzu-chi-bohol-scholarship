import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AlignJustify, ChevronDown, ChevronUp, X } from "lucide-react";
import { useApplicationPeriods } from "../hooks/useApplicationPeriods";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { useSidebar } from "../context/SidebarContext";
import ConfirmationModal from "./ConfirmationModal";

function SideBar({ items }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeTab, setActiveTab } = useSidebar();
    const dropdownRefs = useRef({});
    const navigate = useNavigate();
    const location = useLocation();

    // Derive route segments reactively from useLocation so they update on navigation
    const parts = location.pathname.split("/");
    const nestedRoute = parts[2] ?? null; // e.g. "records" in /staff/records/scholars
    const childRoute = parts[3] ?? null; // e.g. "scholars" in /staff/records/scholars

    const { user, logout } = useAuth();
    const scholarId = { id: user.user_id };

    const { dashboardData, fetchScholarDashboardData } =
        useDashboardOverviewData(user.type);

    const { applicationPeriods, fetchApplicationPeriods } =
        useApplicationPeriods("renewal");

    useEffect(() => {
        if (user?.type === "scholar") {
            fetchApplicationPeriods();
        }
        fetchScholarDashboardData();
    }, [activeTab, user?.type]);

    // Auto-expand the dropdown that matches the current route on mount / path change
    useEffect(() => {
        const matchIndex = items.findIndex(
            (item) => item.subItems && item.itemName === nestedRoute,
        );
        if (matchIndex !== -1) {
            setOpenDropdown(matchIndex);
        }
    }, [nestedRoute]);

    const today = new Date().toISOString().split("T")[0];

    // Closes the current dropdown if clicked again; otherwise opens the new one.
    // Only one dropdown can be open at a time.
    const toggleDropdown = (index, tab) => {
        setOpenDropdown((prev) => (prev === index ? null : index));
        setActiveTab(tab);
    };

    const handleRenew = (path, tab, state) => {
        navigate(path, { state });
        setIsOpen(false);
        setActiveTab(tab);
    };

    const handleClickRenew = () => {
        if (
            applicationPeriods.status === "Active" &&
            today >= applicationPeriods.start_date &&
            today <= applicationPeriods.end_date
        ) {
            if (dashboardData?.renewalApplicationStatus?.status === "pending") {
                toast.info(
                    "You have already submitted a renewal application. Please wait for staff approval.",
                );
                return false;
            } else if (
                dashboardData?.renewalApplicationStatus?.status === "approved"
            ) {
                toast.info(
                    "Your renewal has been approved for the current school year!",
                );
                return false;
            }
            return true;
        } else if (
            today > applicationPeriods.end_date ||
            applicationPeriods.status === "Closed"
        ) {
            toast.error("The online application has been closed.");
            return false;
        } else {
            toast.info(
                "The online application is not available at the moment.",
            );
            return false;
        }
    };

    const handleLogout = async () => {
        try {
            const userType = user.type || "scholar";
            toast.success("Logging out...");
            await logout();
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

    const handleClick = (path, tab) => {
        navigate(path);
        setIsOpen(false);
        setActiveTab(tab);
    };

    // Returns the scrollHeight of a dropdown panel for smooth max-height animation
    const getDropdownHeight = (index) => {
        const el = dropdownRefs.current[index];
        return el ? el.scrollHeight : 0;
    };

    return (
        <>
            {/* Backdrop (mobile) */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="absolute bg-[rgba(0,0,0,.4)] lg:bg-transparent top-0 left-0 z-10 w-full h-full"
                />
            )}

            {/* Hamburger toggle */}
            <span
                onClick={() => setIsOpen((v) => !v)}
                className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer absolute top-2 left-[11px] z-20"
                title={isOpen ? "Close sidebar" : "Open sidebar"}
            >
                <AlignJustify className="w-6 h-6 text-slate-500" />
            </span>

            {/* Sidebar nav */}
            <nav
                className={`group lg:h-[92vh] h-[100vh] flex flex-col bg-white shadow-md fixed top-0 left-0 lg:relative z-20 overflow-hidden
                    transition-[width] duration-300 ease-in-out
                    lg:hover:w-[400px] lg:hover:items-stretch
                    ${isOpen ? "lg:w-[400px] w-[300px]" : "w-0 lg:w-[70px]"}
                    ${!isOpen && "items-center"}`}
            >
                {/* Mobile close button */}
                {isOpen && (
                    <X
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer absolute z-20 top-2 right-3.5 lg:hidden"
                        title="Close sidebar"
                    />
                )}

                <ul className="h-full mt-10 lg:mt-0 p-4 flex flex-col gap-1 text-[.9rem] text-gray-900">
                    {items.map((item, index) => (
                        <li key={index} className={`w-full ${item.style}`}>
                            {item.subItems ? (
                                /* ── Dropdown item ── */
                                <div>
                                    <div
                                        onClick={() =>
                                            toggleDropdown(index, item.itemName)
                                        }
                                        className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 whitespace-nowrap w-full px-3 py-3 rounded-lg transition-colors duration-150
                                            ${nestedRoute === item.itemName ? "bg-gray-100" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {isOpen ? (
                                                <p className="lg:block group-hover:block text-sm">
                                                    {item.text}
                                                </p>
                                            ) : (
                                                <p className="hidden lg:group-hover:block text-sm">
                                                    {item.text}
                                                </p>
                                            )}
                                        </div>

                                        {isOpen ? (
                                            <span className="material-symbols-outlined lg:block group-hover:block">
                                                {openDropdown === index ? (
                                                    <ChevronUp className="w-5 h-5 text-slate-600" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-600" />
                                                )}
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined hidden lg:group-hover:block">
                                                {openDropdown === index ? (
                                                    <ChevronUp className="w-5 h-5 text-slate-600" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-600" />
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    {/* Smooth height-animated dropdown panel */}
                                    <div
                                        ref={(el) =>
                                            (dropdownRefs.current[index] = el)
                                        }
                                        style={{
                                            maxHeight:
                                                openDropdown === index
                                                    ? `${getDropdownHeight(index)}px`
                                                    : "0px",
                                            overflow: "hidden",
                                            transition:
                                                "max-height 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                                        }}
                                    >
                                        <ul className="ml-6 mt-1 mb-1 space-y-1 text-gray-700">
                                            {item.subItems.map(
                                                (subItem, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        onClick={() =>
                                                            handleClick(
                                                                subItem.navigate,
                                                                item.itemName,
                                                            )
                                                        }
                                                        className={`cursor-pointer hover:bg-gray-100 whitespace-nowrap text-xs w-full px-3 py-2.5 rounded-lg transition-colors duration-150
                                                            ${nestedRoute === item.itemName && childRoute === subItem.itemName ? "bg-gray-100 font-medium" : ""}
                                                            ${isOpen ? "block" : "hidden"} group-hover:block`}
                                                    >
                                                        {subItem.text}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                /* ── Regular item ── */
                                <div
                                    onClick={() => {
                                        if (item.itemName === "logout") {
                                            setIsModalOpen(true);
                                        } else if (item.itemName === "renew") {
                                            const success = handleClickRenew();
                                            if (success) {
                                                handleRenew(
                                                    item.navigate,
                                                    item.itemName,
                                                    scholarId,
                                                );
                                            }
                                        } else {
                                            handleClick(
                                                item.navigate,
                                                item.itemName,
                                            );
                                        }
                                    }}
                                    className={`flex items-center gap-4 cursor-pointer hover:bg-gray-100 whitespace-nowrap w-full px-3 py-3 rounded-lg transition-colors duration-150
                                        ${location.pathname.includes(item.itemName) ? "bg-gray-100" : ""}`}
                                >
                                    {item.icon}
                                    {isOpen ? (
                                        <p className="lg:block group-hover:block">
                                            {item.text}
                                        </p>
                                    ) : (
                                        <p className="hidden lg:group-hover:block">
                                            {item.text}
                                        </p>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <ConfirmationModal
                label={"Logout"}
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                message={"Are you sure you want to log out?"}
                onClick={handleLogout}
            />
        </>
    );
}

export default SideBar;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AlignJustify, ChevronDown, ChevronUp, X } from "lucide-react";
import { useApplicationPeriods } from "../hooks/useApplicationPeriods";
import { getCurrentSchoolYear } from "../utils/getCurrentSchoolYear";
import { useDashboardOverviewData } from "../hooks/useDashboardOverviewData";
import { useSidebar } from "../context/SidebarContext";
import ConfirmationModal from "./ConfirmationModal";

function SideBar({ items }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeTab, setActiveTab } = useSidebar();
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const scholarId = { id: user.user_id };

    const { dashboardData, fetchScholarDashboardData } =
        useDashboardOverviewData(
            user.user_id,
            user.type,
            getCurrentSchoolYear()
        );

    const { applicationPeriods, fetchApplicationPeriods } =
        useApplicationPeriods("renewal");

    useEffect(() => {
        fetchApplicationPeriods();
        fetchScholarDashboardData();
    }, [activeTab]);

    const today = new Date().toISOString().split("T")[0];

    const toggleDropdown = (index, tab) => {
        setOpenDropdown(openDropdown === index ? null : index);
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
                    "You have already submitted a renewal application. Please wait for staff approval."
                );
                return false;
            } else if (
                dashboardData?.renewalApplicationStatus?.status === "approved"
            ) {
                toast.info(
                    "Your renewal has been approved for the current school year!"
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
                "The online application is not available at the moment."
            );
            return false;
        }
    };

    // const handleLogout = () => {
    //     try {
    //         const userType = user.type || "scholar";
    //         toast.success("Logged out successfully");
    //         logout();

    //         if (userType === "scholar") {
    //             navigate("/login/scholar");
    //         } else if (userType === "staff") {
    //             navigate("/login/staff");
    //         } else if (userType === "admin") {
    //             navigate("/login/admin");
    //         }
    //     } catch (error) {
    //         console.error("Logout error:", error);
    //         toast.error("Failed to log out. Please try again.");
    //     }
    // };

    const handleLogout = async () => {
        try {
            const userType = user.type || "scholar";
            toast.success("Logging out...");

            await logout();

            // Navigate to appropriate login page
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

    const handleNonDropDown = (path, tab) => {
        navigate(path);
        setIsOpen(false);
        setActiveTab(tab);
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="absolute bg-[rgba(0,0,0,.4)] lg:bg-transparent top-0 left-0 z-10 w-full h-full"
                ></div>
            )}
            {isOpen ? (
                <span
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer absolute top-2 left-[11px] z-10"
                    title="Close sidebar"
                >
                    <AlignJustify className="w-6 h-6 text-slate-500" />
                </span>
            ) : (
                <span
                    onClick={() => setIsOpen(true)}
                    className="material-symbols-outlined hover:bg-gray-100 p-2 rounded-lg cursor-pointer absolute top-2 left-[11px] z-20"
                    title="Open sidebar"
                >
                    <AlignJustify className="w-6 h-6 text-slate-500" />
                </span>
            )}

            <nav
                className={`group lg:h-[92vh] h-[100vh] flex flex-col bg-white shadow-md fixed top-0 left-0 lg:relative lg:hover:w-[400px] lg:hover:items-stretch z-20 overflow-hidden transition-all duration-200 ${
                    isOpen ? "lg:w-[400px] w-[300px]" : "w-[0] lg:w-[70px]"
                } ${!isOpen && "items-center"}`}
            >
                {isOpen && (
                    <X
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer absolute z-20 top-2 right-3.5 lg:hidden"
                        title="Close sidebar"
                    >
                        close
                    </X>
                )}

                <ul className="h-[100%] mt-10 lg:mt-0 p-4 flex flex-col gap-1 text-[.9rem] text-gray-900">
                    {items.map((item, index) => (
                        <li key={index} className={`w-full ${item.style}`}>
                            {item.subItems ? (
                                // If item has subItems, create a dropdown
                                <div>
                                    <div
                                        className={`${
                                            activeTab === item.itemName
                                                ? "bg-gray-100"
                                                : ""
                                        } flex items-center justify-between cursor-pointer hover:bg-gray-100 whitespace-nowrap w-full px-3 py-3 rounded-lg`}
                                        onClick={() =>
                                            toggleDropdown(index, item.itemName)
                                        }
                                    >
                                        <div className="flex items-center gap-3 ">
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

                                    {openDropdown === index && (
                                        <ul className="ml-6 mt-1 text-gray-700">
                                            {item.subItems.map(
                                                (subItem, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        onClick={() =>
                                                            handleClick(
                                                                subItem.navigate,
                                                                item.itemName
                                                            )
                                                        }
                                                        className={`cursor-pointer hover:bg-gray-100 whitespace-nowrap text-xs w-full px-3 py-2.5 rounded-lg ${
                                                            isOpen
                                                                ? "block"
                                                                : "hidden"
                                                        } group-hover:block`}
                                                    >
                                                        {subItem.text}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                // Regular menu item (without dropdown)
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
                                                    scholarId
                                                );
                                            }
                                        } else {
                                            handleClick(
                                                item.navigate,
                                                item.itemName
                                            );
                                        }
                                    }}
                                    // onClick={() =>
                                    //     handleClick(subItem.navigate)
                                    // }
                                    className={`${
                                        activeTab === item.itemName
                                            ? "bg-gray-100"
                                            : ""
                                    } flex items-center gap-4 cursor-pointer hover:bg-gray-100 whitespace-nowrap w-full px-3 py-3 rounded-lg`}
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

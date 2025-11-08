import Logo from "/src/assets/tzu_chi_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApplicationPeriods } from "../hooks/useApplicationPeriods";
import { toast } from "react-toastify";

function NavLinks({ isMobile = false, onLinkClick }) {
    const navigate = useNavigate();

    const staff = { type: "staff" };
    const admin = { type: "admin" };
    const scholar = { type: "scholar" };

    const handleNavigation = (path, state) => {
        navigate(path, { state });
        if (onLinkClick) onLinkClick();
    };

    return (
        <div
            className={`${
                isMobile
                    ? "flex flex-col gap-4"
                    : "flex items-center justify-between w-full"
            }`}
        >
            <ul
                className={`${
                    isMobile
                        ? " last:flex flex-col gap-4"
                        : "flex gap-8 items-center"
                } text-sm font-medium`}
            >
                <li>
                    <Link
                        to="/"
                        className="hover:text-green-600 transition-colors duration-200 relative group"
                        onClick={onLinkClick}
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/about"
                        className="hover:text-green-600 transition-colors duration-200 relative group"
                        onClick={onLinkClick}
                    >
                        About
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li>
                    <button
                        onClick={() => handleNavigation("/login/staff")}
                        className="hover:text-green-600 transition-colors duration-200 relative group"
                    >
                        Staff
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => handleNavigation("/login/admin")}
                        className="hover:text-green-600 transition-colors duration-200 relative group"
                    >
                        Admin
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

function NavBar({ isScrolled }) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { applicationPeriods, fetchApplicationPeriods } =
        useApplicationPeriods("new");

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleClick = () => {
        if (
            applicationPeriods.status === "Active" &&
            today >= applicationPeriods.start_date &&
            today <= applicationPeriods.end_date
        ) {
            navigate("/application");
        } else if (
            today > applicationPeriods.end_date ||
            applicationPeriods.status === "Closed"
        ) {
            toast.error("The online application has been closed.");
        } else {
            toast.info(
                "The online application is not available at the moment."
            );
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 z-50 transition-all duration-300 w-full ${
                    isScrolled
                        ? "bg-white backdrop-blur-md shadow-lg border-b border-gray-100"
                        : "bg-white"
                }`}
            >
                {/* Top social bar - only shown when not scrolled */}
                {!isScrolled && (
                    <div className="w-[90%] mx-auto border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-6 py-2">
                            <div className="flex justify-end items-center gap-3">
                                <p className="mr-auto text-slate-500 text-xs md:text-sm">
                                    Bohol, Philippines
                                </p>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                                >
                                    <i className="fa-brands fa-facebook text-sm"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                                >
                                    <i className="fa-brands fa-instagram text-sm"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                                >
                                    <i className="fa-brands fa-youtube text-sm"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main navigation */}
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo section */}
                        <Link to="/" className="flex items-center gap-1 group">
                            <img
                                className="w-14 h-10 md:w-16 md:h-12 transition-transform duration-300 group-hover:scale-105"
                                src={Logo}
                                alt="Tzu chi Logo"
                            />
                            <div className="block">
                                <h1 className="text-lg md:text-xl mb-[-6px] font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                                    Tzu chi Foundation
                                </h1>
                                <p className="text-xs md:text-sm text-gray-600 font-medium">
                                    Scholarship Management System
                                </p>
                            </div>
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            <nav>
                                <NavLinks />
                            </nav>
                            <button
                                onClick={handleClick}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Apply Now
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Toggle mobile menu"
                        >
                            <div className="flex flex-col gap-1.5 text-xl">
                                <span
                                    className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                                        isMobileMenuOpen
                                            ? "rotate-45 translate-y-2"
                                            : ""
                                    }`}
                                ></span>
                                <span
                                    className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                                        isMobileMenuOpen ? "opacity-0" : ""
                                    }`}
                                ></span>
                                <span
                                    className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                                        isMobileMenuOpen
                                            ? "-rotate-45 -translate-y-2"
                                            : ""
                                    }`}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={toggleMobileMenu}
                    ></div>
                    <div
                        className={`fixed ${
                            isScrolled ? "top-[77px]" : "top-[120px]"
                        } left-[50%] translate-x-[-50%] h-[max-content] w-[80%] bg-white shadow-2xl transform transition-transform duration-300`}
                    >
                        <div className="py-6 px-10">
                            <nav className="mb-8 text-center">
                                <NavLinks
                                    isMobile={true}
                                    onLinkClick={toggleMobileMenu}
                                />
                            </nav>
                            <button
                                onClick={() => {
                                    navigate("/application");
                                    toggleMobileMenu();
                                }}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NavBar;

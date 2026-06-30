import Logo from "/src/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useApplicationPeriods } from "../hooks/useApplicationPeriods";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";

function NavLinks({ isMobile = false, onLinkClick }) {
    const navigate = useNavigate();

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
                        ? "text-xs last:flex flex-col gap-5"
                        : "flex gap-12 items-center"
                } sm:text-[15px]`}
            >
                <li>
                    <Link
                        to="/"
                        className="hover:text-green-700 transition-colors duration-200 relative group"
                        onClick={onLinkClick}
                    >
                        Home
                        <span className="absolute -bottom-0.5 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/about"
                        className="hover:text-green-700 transition-colors duration-200 relative group"
                        onClick={onLinkClick}
                    >
                        About Tzu Chi
                        <span className="absolute -bottom-0.5 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/our-mission"
                        className="hover:text-green-700 transition-colors duration-200 relative group"
                        onClick={onLinkClick}
                    >
                        Our Mission
                        <span className="absolute -bottom-0.5 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

function NavBar({ isScrolled }) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showBorder, setShowBorder] = useState(false);
    const mobileMenuRef = useRef(null);
    const mobileMenuButtonRef = useRef(null);

    const { applicationPeriods, fetchApplicationPeriods } =
        useApplicationPeriods("new");

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                mobileMenuButtonRef.current &&
                !mobileMenuButtonRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
                setShowBorder(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const today = new Date().toISOString().split("T")[0];

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
                "The online application is not available at the moment.",
            );
        }
    };

    const toggleMobileMenu = (e) => {
        e.stopPropagation();
        if (isMobileMenuOpen) {
            setTimeout(() => {
                setShowBorder(false);
            }, 400);
        } else {
            setShowBorder(true);
        }

        setIsMobileMenuOpen((prev) => !prev);
    };

    return (
        <>
            <header
                className={`fixed top-0 z-50 transition-all duration-2000 w-full backdrop-blur-md shadow-sm border-b ${
                    isScrolled
                        ? "bg-white backdrop-blur-md shadow-md border-b border-gray-100"
                        : "bg-white"
                }`}
            >
                {/* Main navigation */}
                <div className="w-[95%] md:w-[80%] mx-auto px-6 py-8 lg:py-6">
                    <div className="flex items-center lg:items-start justify-between gap-10 lg:gap-0">
                        {/* Logo section */}
                        <Link to="/" className="flex items-center gap-1">
                            <img
                                className="w-[500px] sm:w-[400px] h-8 md:w-full sm:h-12 md:h-16 transition-transform duration-300"
                                src={Logo}
                                alt="Tzu chi Logo"
                            />
                        </Link>

                        <div className={`space-x-5 hidden lg:block`}>
                            <div className="flex items-center gap-2">
                                <a
                                    href="https://www.facebook.com/tzuchibohol.org.ph"
                                    target="_blank"
                                    className="text-blue-500 hover:text-green-600 transition-colors duration-200"
                                >
                                    <div className="p-1 rounded-sm bg-blue-600 w-[max-content]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 32 32"
                                            fill="currentColor"
                                            className="text-white"
                                        >
                                            <path d="M19 6h5V0h-5c-5.523 0-10 4.477-10 10v4H4v6h5v12h6V20h5l1-6h-6v-4c0-1.103.897-2 2-2z" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    href="https://www.instagram.com/tzuchibohol2013"
                                    target="_blank"
                                    className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                                >
                                    <div className="p-1 rounded-sm bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 w-[max-content]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-white"
                                        >
                                            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    href="https://www.youtube.com/@tzuchiboholchannel2110"
                                    target="_blank"
                                    className="text-red-500 hover:text-green-600 transition-colors duration-200"
                                >
                                    <div className="p-1 rounded-sm bg-red-600 w-[max-content]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-white"
                                        >
                                            <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 00.5 6.2 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.8 3 3 0 002.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 002.1-2.1A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Mobile menu overlay and content */}
                        <div className="fixed inset-0 z-40 lg:hidden">
                            {/* Backdrop */}
                            <div
                                className={`fixed top-32 left-0 right-0 bottom-0 bg-black/20 transition-opacity duration-300 ${
                                    isMobileMenuOpen
                                        ? "opacity-100"
                                        : "opacity-0 pointer-events-none"
                                }`}
                                onClick={toggleMobileMenu}
                            ></div>

                            {/* Menu panel */}
                            <div
                                ref={mobileMenuRef}
                                className={`fixed top-24 md:top-28 left-[50%] translate-x-[-50%] w-[90%] z-50
                                            ${showBorder ? "border-t-4 border-green-600" : "border-t-0"}`}
                            >
                                <div
                                    className={`bg-white shadow-2xl mobile-menu ${
                                        isMobileMenuOpen ? "open" : ""
                                    }`}
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
                                                handleClick();
                                                toggleMobileMenu();
                                            }}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs sm:text[15px] px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Apply for Scholarship
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleMobileMenu();
                                                navigate("/login/scholar");
                                            }}
                                            className="w-full mt-2 p-2 border border-green-600 text-green-800 text-xs sm:text[15px] rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            ref={mobileMenuButtonRef}
                            type="button"
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 relative z-50"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-7 h-7 text-gray-400/80" />
                            ) : (
                                <Menu className="w-7 h-7 text-gray-400/80" />
                            )}
                        </button>
                    </div>
                    <div className="hidden lg:block">
                        <div className="flex justify-between items-end w-full mx-auto -mb-3">
                            <nav>
                                <NavLinks />
                            </nav>
                            <div>
                                <button
                                    onClick={handleClick}
                                    className="ml-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Apply for Scholarship
                                </button>
                                <button
                                    onClick={() => navigate("/login/scholar")}
                                    className="ml-2 px-4 py-2 border-2 border-green-600 text-green-700 text-sm rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default NavBar;

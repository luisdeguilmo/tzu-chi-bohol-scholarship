import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SideBar({ items }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
    const navigate = useNavigate();

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const handleClick = (path) => {
        navigate(path);
        setIsOpen(false);
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
                    className="material-symbols-outlined hover:bg-gray-200 p-2 rounded-lg cursor-pointer absolute top-2 left-[11px] z-0"
                    title="Open sidebar"
                >
                    menu
                </span>
            ) : (
                <span
                    onClick={() => setIsOpen(true)}
                    className="material-symbols-outlined hover:bg-gray-200 p-2 rounded-lg cursor-pointer absolute top-2 left-[11px] z-20"
                    title="Open sidebar"
                >
                    menu
                </span>
            )}

            <nav
                className={`group lg:h-[91.5vh] h-[100vh] flex flex-col bg-white shadow-md fixed top-0 left-0 lg:relative lg:hover:w-[300px] lg:hover:items-stretch z-10 overflow-hidden transition-all duration-200 ${
                    isOpen ? "lg:w-[300px] w-[300px]" : "w-[0] lg:w-[70px]"
                } ${!isOpen && "items-center"}`}
            >
                {isOpen && (
                    <span
                        onClick={() => setIsOpen(false)}
                        className="material-symbols-outlined hover:bg-gray-200 p-2 rounded-lg cursor-pointer absolute z-20 top-2 right-2 lg:hidden"
                        title="Close sidebar"
                    >
                        close
                    </span>
                )}

                <ul className="h-[100%] mt-8 lg:mt-0 p-4 flex flex-col gap-1 text-[.9rem] text-gray-900">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`w-full ${item.style}`}
                        >
                            {item.subItems ? (
                                // If item has subItems, create a dropdown
                                <div>
                                    <div
                                        className="flex items-center justify-between cursor-pointer hover:bg-gray-200 whitespace-nowrap w-full px-3 py-2 rounded-lg"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-xl">
                                                {item.iconName}
                                            </span>
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
                                        {isOpen ? (
                                            <span className="material-symbols-outlined lg:block group-hover:block">
                                                {openDropdown === index
                                                    ? "expand_less"
                                                    : "expand_more"}
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined hidden lg:group-hover:block">
                                                {openDropdown === index
                                                    ? "expand_less"
                                                    : "expand_more"}
                                            </span>
                                        )}
                                    </div>

                                    {openDropdown === index && (
                                        <ul className="ml-6 mt-1 text-gray-700">
                                            {item.subItems.map(
                                                (subItem, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        onClick={() => handleClick(subItem.navigate)}
                                                        className={`cursor-pointer hover:bg-gray-200 whitespace-nowrap w-full px-3 py-2 rounded-lg ${
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
                                <div onClick={() => handleClick(item.navigate)} className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap w-full px-3 py-2 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">
                                        {item.iconName}
                                    </span>
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
        </>
    );
}

export default SideBar;

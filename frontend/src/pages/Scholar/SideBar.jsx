import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SideBar({ items }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className={`absolute bg-[rgba(0,0,0,.4)] lg:bg-transparent top-0 left-0 z-10 w-full h-full`}
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
                className={`group lg:h-auto h-[100vh] flex flex-col bg-white shadow-md fixed top-0 left-0 lg:relative lg:hover:w-[250px] lg:hover:items-stretch z-30 overflow-hidden transition-all duration-200 ${
                    isOpen ? "lg:w-[250px] w-[300px]" : "w-[0] lg:w-[70px]"
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
                            onClick={() => handleClick(item.navigate)}
                            key={index}
                            className={`flex items-center gap-3 cursor-pointer hover:bg-gray-200 whitespace-nowrap w-full px-3 py-1 rounded-lg ${item.style}`}
                        >
                            <span
                                className={`material-symbols-outlined md:${item.iconStyle} text-xl`}
                            >
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
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default SideBar;
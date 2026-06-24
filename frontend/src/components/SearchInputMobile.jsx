import { Search, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SearchInputMobile = React.memo(
    ({ searchTerm, onSearchChange, placeholder }) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className="relative">
                <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon
                        className={`w-4 h-4 ${isFocused ? "text-green-600" : "text-gray-500"}`}
                    />
                </div>
                <input
                    type="text"
                    // ref={inputRef}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="outline-none block w-full pl-10 pr-3 py-3 text-xs md:text-sm border border-gray-200 rounded-lg leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        );
    },
);

export default SearchInputMobile;

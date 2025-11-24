export const FilterDropdown = ({ label, value, onChange, options }) => {
    return (
        <div className="flex flex-col w-[130px]">
            {/* Label */}
            <span className="text-[11px] font-medium text-gray-500">
                {label}
            </span>

            {/* Dropdown */}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="
                        w-[120px] px-2 py-1.5 text-[11px]
                        bg-white border border-gray-200
                        rounded-md 
                        hover:border-gray-400
                        focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500
                        transition-all duration-150
                        cursor-pointer
                    "
                >
                    <option value={"all" || "all_years"}>All</option>

                    {options.map((item, index) => {
                        const clean =
                            item?.name?.replaceAll("*", "").trim() ||
                            item?.course?.replaceAll("*", "").trim() ||
                            item?.value;

                        return (
                            <option key={index} value={clean}>
                                {clean}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};

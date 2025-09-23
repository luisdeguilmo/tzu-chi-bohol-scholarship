const Table = ({
    hasNumberColumn = false,
    applications,
    tableHeaders,
    currentItems,
    selectedItems,
    selectAllVisible,
    hasCheckbox,
    children,
}) => {
    return (
        <table className="lg:w-[100%] min-w-[1000px] relative">
            <thead className="bg-gray-50 text-gray-700 font-bold">
                <tr className="border-y pr-4 border-gray-100 text-center">
                    {hasCheckbox && applications.length > 0 && (
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-wider">
                            <input
                                type="checkbox"
                                className={`h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded`}
                                checked={
                                    currentItems?.length > 0 &&
                                    selectedItems?.length ===
                                        currentItems?.length
                                }
                                onChange={selectAllVisible}
                            />
                        </th>
                    )}
                    {hasNumberColumn && <th></th>}
                    {tableHeaders.map((header, index) => (
                        <th
                            key={index}
                            scope="col"
                            className={`${header.style} ${
                                header.name === "procedure" ||
                                header.name === "course" ||
                                header.name === "qualification" ||
                                header.name === "instruction"
                                    ? "text-left pl-12"
                                    : ""
                            } ${
                                header.name === "description"
                                    ? "text-left pl-24"
                                    : ""
                            } ${
                                header.name === "action" ? "text-right" : ""
                            } pr-4 py-3 text-xs uppercase tracking-wider`}
                        >
                            {header.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white text-xs">{children}</tbody>
        </table>
    );
};

export default Table;

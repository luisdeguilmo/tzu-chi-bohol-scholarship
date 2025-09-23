const ScholarshipCriteriaTableRow = ({
    numberOfItemsPerPage,
    onSelectItem,
    onDelete,
    fields,
    primaryField,
    currentItems,
}) => {
    return (
        <>
            {currentItems.map((item, index) => (
                <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-gray-50  text-xs`}
                >
                    {/* First column - primary field */}

                    <td
                        className={`${
                            item.strand || item.quantity || item.qualification
                                ? "pl-4"
                                : "pl-0"
                        } py-3 whitespace-nowrap text-gray-500`}
                    >
                        {`${numberOfItemsPerPage + index + 1}.`}
                    </td>

                    <td
                        className={`${
                            item.course ||
                            item.procedure ||
                            item.qualification ||
                            item.instruction
                                ? "pl-8 text-left"
                                : ""
                        } ${
                            item.quantity || item.strand ? "text-center" : ""
                        } py-3 whitespace-nowrap text-gray-500`}
                    >
                        {item[primaryField]}
                    </td>

                    {/* Dynamic columns based on fields configuration */}
                    {fields
                        .filter((field) => field.name !== primaryField)
                        .map((field) => (
                            <td
                                key={field.name}
                                className={`
                                    "py-3 px-24 text-gray-500"
                                `}
                            >
                                <span className={`text-gray-500`}>
                                    {field.render
                                        ? field.render(item[field.name])
                                        : item[field.name]}
                                </span>
                            </td>
                        ))}

                    {/* Actions column */}
                    <td
                        className={`ml-auto pr-3 w-[max-content] py-3 flex justify-center whitespace-nowrap`}
                    >
                        <button
                            onClick={() => onSelectItem(item)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                                />
                            </svg>
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ScholarshipCriteriaTableRow;

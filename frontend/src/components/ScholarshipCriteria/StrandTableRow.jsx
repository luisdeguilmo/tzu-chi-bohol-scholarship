const StrandTableRow = ({
    strand,
    index,
    numberOfItemsPerPage,
    isEditing,
    newText,
    newDescription,
    onTextChange,
    onDescriptionChange,
    onEdit,
    onDelete,
    onStartEdit,
}) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors text-center text-xs">
            {isEditing ? (
                <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                    <input
                        className="w-full p-2 border-[1px] outline-green-500"
                        type="text"
                        onChange={(e) => onTextChange(e.target.value)}
                        value={newText}
                    />
                </td>
            ) : (
                <td className="pl-5 py-3 text-left whitespace-nowrap text-gray-500">
                    {`${numberOfItemsPerPage + index + 1}.`} {strand.strand}
                </td>
            )}
            {isEditing ? (
                <td className="p-3 text-gray-500">
                    <textarea
                        rows={3}
                        className="w-full p-2 resize-none text-justify border-[1px] outline-green-500"
                        type="text"
                        onChange={(e) =>
                            onDescriptionChange(e.target.value)
                        }
                        value={newDescription}
                    />
                </td>
            ) : (
                <td className="py-3 max-w-md break-words text-gray-500">
                    {strand.description}
                </td>
            )}
            <td className="pr-5 py-3 text-right whitespace-nowrap">
                <button
                    onClick={() => {
                        isEditing
                            ? onEdit(strand.id)
                            : onStartEdit(
                                  strand.strand,
                                  strand.description,
                                  strand.id
                              );
                    }}
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
                    {isEditing ? "Save Changes" : "Edit"}
                </button>
                <button
                    onClick={() =>
                        onDelete(strand.id)
                    }
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
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default StrandTableRow;

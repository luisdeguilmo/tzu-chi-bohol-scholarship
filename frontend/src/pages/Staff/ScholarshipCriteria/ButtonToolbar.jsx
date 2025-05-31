export default function ButtonToolbar({ label, id, strand, description, text,  }) {
    const handleClick = () => {
        if (label === "Strand") {

        }
    };

    return (
        <>
            <button
                onClick={() => {
                    edit && rowItemId === strand.id
                        ? handleEdit(strand.id)
                        : handleButtonState(
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
                {edit && rowItemId === strand.id ? "Save Changes" : "Edit"}
            </button>
            <button
                onClick={() => handleDelete(strand.id, currentItems.length - 1)}
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
        </>
    );
}

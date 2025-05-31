export default function DeleteBatchButton({ handleDeleteBatch, selectedBatch }) {
    return (
        <button
            onClick={handleDeleteBatch}
            disabled={selectedBatch === "all"}
            className={`px-4 py-2 rounded-lg flex items-center ${
                selectedBatch === "all"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 transition-colors"
            }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m-7-10h6"
                />
            </svg>
            Delete Batch
        </button>
    );
}

export default function CreateBatchButton({ handleCreateBatch }) {
    return (
        <button
            onClick={handleCreateBatch}
            className="bg-white text-green-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
            Create Batch
        </button>
    );
}

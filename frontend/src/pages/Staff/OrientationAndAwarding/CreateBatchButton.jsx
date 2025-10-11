export default function CreateBatchButton({ handleCreateBatch }) {

    return (
        <button
            onClick={handleCreateBatch}
            className="text-green-600 font-bold text-xs p-3 text-center rounded-lg hover:underline transition-colors flex gap-1 items-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
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

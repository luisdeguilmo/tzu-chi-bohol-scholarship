import { Trash2 } from "lucide-react";

export default function DeleteBatchButton({
    handleDeleteBatch,
    selectedBatch,
}) {
    return (
        <button
            onClick={handleDeleteBatch}
            title="Delete Schedule"
            className="p-2 bg-red-600 text-xs rounded-lg hover:bg-red-700 transition-colors flex items-center text-white"
        >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Batch
        </button>
    );
}

import { Trash2 } from "lucide-react";

export default function DeleteBatchButton({
    handleDeleteBatch,
    selectedBatch,
}) {
    return (
        <button
            onClick={handleDeleteBatch}
            title="Delete Schedule"
            className="text-red-600 text-xs p-3 text-center rounded-lg hover:underline transition-colors flex items-center"
        >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Batch
        </button>
    );
}

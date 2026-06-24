import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteBatchButton from "./DeleteBatchButton";
import SetScheduleForm from "./SetScheduleForm";
import { Send, Trash2 } from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function BatchActions({
    applications,
    isModalOpen,
    setIsModalOpen,
    // handleSendSchedule,
    selectedBatchInBatches,
    setIsOpen,
    onSuccess,
    batches,
    deleteBatch,
    setBatches,
    applicantsEachBatch,
    onRefresh,
}) {
    // Add state for creating a new batch when modal is open
    const [batchName, setBatchName] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDeleteBatch = async () => {
        // Ensure a batch is selected before attempting to delete
        if (applicantsEachBatch.length > 0) {
            alert(
                "This batch cannot be deleted. Please ensure it has no applicants.",
            );
            return;
        }

        if (selectedBatchInBatches === "all" || !selectedBatchInBatches) {
            alert("Please select a batch to delete");
            return;
        }

        // Find the batch ID that matches the selected batch name
        const batchToDelete = batches.find(
            (batch) => batch.batch_name === selectedBatchInBatches,
        );

        if (!batchToDelete) {
            alert("Cannot find the selected batch");
            return;
        }

        // Confirm before deleting
        // if (
        //     !confirm(
        //         `Are you sure you want to delete ${selectedBatchInBatches}?`
        //     )
        // ) {
        //     return;
        // }

        const success = await deleteBatch(
            batches,
            batchToDelete,
            setBatches,
            selectedBatchInBatches,
            onSuccess,
        );

        if (success) {
            onRefresh();
            setDeleteModalOpen(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setBatchName(""); // Clear the input
    };

    return (
        <div
            className={`${
                selectedBatchInBatches === "all" ? "hidden" : "block"
            }`}
        >
            <div className="flex items-center gap-2">
                {batches[batches.length - 1]?.batch_name ===
                selectedBatchInBatches ? (
                    <>
                        <SetScheduleForm
                            applications={applications}
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            batches={batches}
                            selectedBatch={selectedBatchInBatches}
                            onSuccess={onSuccess}
                        />

                        {/* <DeleteBatchButton
                            handleDeleteBatch={handleDeleteBatch}
                            selectedBatch={selectedBatchInBatches}
                        /> */}

                        <button
                            onClick={() => {
                                setDeleteModalOpen(true);
                            }}
                            title="Delete Schedule"
                            className="p-2 bg-red-600 text-xs rounded-lg hover:bg-red-700 transition-colors flex items-center text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete Batch
                        </button>
                    </>
                ) : (
                    <>
                        <SetScheduleForm
                            applications={applications}
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            batches={batches}
                            selectedBatch={selectedBatchInBatches}
                            onSuccess={onSuccess}
                        />
                    </>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={setDeleteModalOpen}
                message={`Are you sure you want to delete ${selectedBatchInBatches}?`}
                label={"Delete Confirmation"}
                onClick={handleDeleteBatch}
            />
        </div>
    );
}

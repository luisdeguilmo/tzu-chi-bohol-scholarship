import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CreateBatchButton from "./CreateBatchButton";
import DeleteBatchButton from "./DeleteBatchButton";

export default function BatchActions({
    isOpen,
    setIsOpen,
    onSuccess,
    selectedBatch,
    batches,
    setBatches,
    applicantsEachBatch,
}) {
    // Add state for creating a new batch when modal is open
    const [batchName, setBatchName] = useState("");

    const handleCreateBatch = async () => {
        // Create the data structure that matches your backend expectations
        const data = {};

        // Generate next batch number based on existing batches
        if (batches.length === 0) {
            data.batch_name = "Batch 1"; // Using batch_name as string format
        } else {
            // Extract numeric parts from existing batch names to find the highest number
            const batchNumbers = batches.map((batch) => {
                const match = batch.batch_name.match(/Batch (\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            });

            const highestNumber = Math.max(...batchNumbers, 0);
            data.batch_name = `Batch ${highestNumber + 1}`;
        }

        try {
            // Send the data as JSON in the request body
            const response = await fetch(
                "http://localhost:8000/app/views/batches.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || "Batch created successfully.");
                if (onSuccess) onSuccess(); // Refresh the batches list
            } else {
                alert("Error: " + (result.message || "Failed to create batch"));
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const handleDeleteBatch = async () => {
        // Ensure a batch is selected before attempting to delete
        if (applicantsEachBatch.length > 0) {
            alert(
                "This batch cannot be deleted. Please ensure it has no applicants."
            );
            return;
        }

        if (selectedBatch === "all" || !selectedBatch) {
            alert("Please select a batch to delete");
            return;
        }

        // Find the batch ID that matches the selected batch name
        const batchToDelete = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        if (!batchToDelete) {
            alert("Cannot find the selected batch");
            return;
        }

        // Confirm before deleting
        if (!confirm(`Are you sure you want to delete ${selectedBatch}?`)) {
            return;
        }

        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/batches.php?id=${batchToDelete.batch_name}`
            );

            // Update local state after successful deletion
            const updatedBatches = batches.filter(
                (batch) => batch.id !== batchToDelete.id
            );
            setBatches(updatedBatches);
            toast.success(`${selectedBatch} deleted successfully`);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error deleting batch:", error);
            alert("Failed to delete batch");
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setBatchName(""); // Clear the input
    };

    return (
        <div>
            <div className="flex gap-2">
                {selectedBatch === "all" && (
                    <CreateBatchButton handleCreateBatch={handleCreateBatch} />
                )}

                {batches[batches.length - 1]?.batch_name === selectedBatch && (
                    <DeleteBatchButton handleDeleteBatch={handleDeleteBatch} selectedBatch={selectedBatch} />
                )}
            </div>

            {/* Student Assignment Modal */}
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-4 py-2 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Assign Students to Batch
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Here you would add your student assignment form content */}
                            <p className="text-gray-700 mb-4">
                                Select students to assign to the selected batch.
                            </p>

                            {/* Student selection would go here */}

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                    Assign Students
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

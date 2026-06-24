import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useBatches = (purpose) => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/batches.php?purpose=${purpose}`,
            );
            setBatches(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    const createBatch = async (data) => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}app/api/batches.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || "Batch created successfully.");
                // if (onSuccess) onSuccess(); // Refresh the batches list
                fetchBatches();
                setLoading(false);
            } else {
                alert("Error: " + (result.message || "Failed to create batch"));
                setLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
        }
    };

    const deleteBatch = async (
        batches,
        batchToDelete,
        setBatches,
        selectedBatchInBatches,
        onSuccess,
    ) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `${BASE_URL}app/api/batches.php?id=${batchToDelete.batch_name}&purpose=${purpose}`,
            );

            // Update local state after successful deletion
            const updatedBatches = batches.filter(
                (batch) => batch.id !== batchToDelete.id,
            );
            setBatches(updatedBatches);
            toast.success(`${selectedBatchInBatches} deleted successfully`);
            if (onSuccess) {
                onSuccess();
            }

            return true;
        } catch (error) {
            console.error("Error deleting batch:", error);
            alert("Failed to delete batch");
            return true;
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    return {
        loading,
        batches,
        setBatches,
        createBatch,
        deleteBatch,
        fetchBatches,
    };
};

import { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useStrands = () => {
    const [strands, setStrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStrands = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/strands.php`
            );
            // Decode HTML entities in the data when it's received
            const decodedStrands =
                response.data.data?.map((strand) => ({
                    ...strand,
                    strand: strand.strand,
                })) || [];

            setStrands(decodedStrands);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching strands data:", err);
            setError("Failed to load strands data. Please try again.");
            setLoading(false);
        }
    };

    const updateStrand = async (id, newText, newDescription) => {
        // Check if the user cancelled or submitted an empty string
        if (
            newText === null ||
            newText.trim() === "" ||
            newDescription === null ||
            newDescription.trim() === ""
        ) {
            return; // Exit if cancelled or empty
        }

        try {
            // Create the data structure for the update
            // No need to encode here as that should be handled server-side
            const data = {
                strand: {
                    id: id,
                    strand: newText,
                    description: newDescription,
                },
            };

            // Send the PUT request with the data in the body
            const response = await fetch(
                `http://localhost:8000/app/views/strands.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            // Check for success and update the UI
            if (result.success) {
                // Update the local state to reflect the change
                const updatedStrands = strands.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              strand: newText,
                              description: newDescription,
                          }
                        : item
                );
                setStrands(updatedStrands);

                // Show success message
                toast.success("Strand updated successfully.");
                return true;
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating strand:", error);
            alert("Failed to update strand");
            return false;
        }
    };

    const deleteStrand = async (id) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/strands.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedStrands = strands.filter((strand) => strand.id !== id);
            setStrands(updatedStrands);

            toast.success("Strand deleted successfully.");

            return true;
        } catch (error) {
            console.error("Error deleting strand:", error);
            alert("Failed to delete strand");
            return false;
        }
    };

    useEffect(() => {
        fetchStrands();
    }, []);

    return {
        strands,
        loading,
        error,
        fetchStrands,
        updateStrand,
        deleteStrand,
    };
};

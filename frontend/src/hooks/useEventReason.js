import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useEventReason = (scholarId, eventId) => {
    const [privateComments, setPrivateComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrivateComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/event-reason.php?event_id=${eventId}&user_type=staff`
            );
            // Set application periods data
            setPrivateComments(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    const fetchScholarPrivateComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/event-reason.php?scholar_id=${scholarId}&event_id=${eventId}&user_type=scholar`
            );
            // Set application periods data
            setPrivateComments(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    const addReason = async (
        eventId,
        scholarId,
        reason,
        firstName,
        lastName
    ) => {
        try {
            // Create the data structure for the update
            // No need to encode here as that should be handled server-side
            const data = {
                event: {
                    event_id: eventId,
                    scholar_id: scholarId,
                    reason: reason,
                    first_name: firstName,
                    last_name: lastName,
                },
            };

            // Send the PUT request with the data in the body
            const response = await fetch(
                `${BASE_URL}app/views/event-reason.php`,
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
                // Show success message
                toast.success("Reason added successfully.");
                return true;
            } else {
                alert("Error: " + response.data);
                return false;
            }
        } catch (error) {
            alert("Failed to submit");
            console.log(error);
            return false;
        }
    };

    // const deleteStrand = async (id) => {
    //     try {
    //         // Make the API call to delete
    //         await axios.delete(`${BASE_URL}app/views/strands.php?id=${id}`);

    //         // Update local state after successful deletion
    //         const updatedStrands = strands.filter((strand) => strand.id !== id);
    //         setStrands(updatedStrands);

    //         toast.success("Strand deleted successfully.");

    //         return true;
    //     } catch (error) {
    //         console.error("Error deleting strand:", error);
    //         alert("Failed to delete strand");
    //         return false;
    //     }
    // };

    useEffect(() => {
        if (scholarId && eventId) {
            fetchScholarPrivateComments();
        } else {
            fetchPrivateComments();
        }
    }, [eventId]);

    return {
        loading,
        addReason,
        privateComments,
        fetchPrivateComments,
        fetchScholarPrivateComments,
        error,
    };
};

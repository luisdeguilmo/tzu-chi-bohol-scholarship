import axios from "axios";
import BASE_URL from "../config";
import { useEffect, useState } from "react";
import { useEvents } from "./useEvents";

export const useArchive = (tab, userId) => {
    const [archivedActivities, setArchivedActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchArchivedActivities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/archived-activities.php?tab=${tab}&id=${userId}`
            );
            // Set application periods data
            setArchivedActivities(response.data.data || []);
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

    const archiveActivity = async (userId, id, type) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}app/api/archived-activities.php`,
                { account_id: userId, activity_id: id, activity_type: type },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.data.success) {
                throw new Error("Failed to archive activity");
            }
            await fetchArchivedActivities(tab, userId);
            return true;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            return false;
        }
    };

    const unArchiveActivity = async (userId, id, type) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${BASE_URL}app/api/archived-activities.php`,
                {
                    data: {
                        account_id: userId,
                        activity_id: id,
                        activity_type: type,
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                // Handle success (e.g., update UI, show message)
            } else {
                throw new Error(response.data.message || "Failed to");
            }
            return true;
        } catch (err) {
            setError(err.message);
            console.error("Error cancelling event:", error);
            setError(error.message || "Failed to cancel event");
        } finally {
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        if (tab && userId) {
            fetchArchivedActivities(tab, userId);
        }
    }, [tab, userId]);

    return {
        archiveActivity,
        unArchiveActivity,
        archivedActivities,
        loading,
        error,
        fetchArchivedActivities,
    };
};

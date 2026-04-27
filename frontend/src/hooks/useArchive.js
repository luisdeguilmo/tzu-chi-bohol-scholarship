import axios from "axios";
import BASE_URL from "../config";
import { useEffect, useState } from "react";
import { useEvents } from "./useEvents";

export const useArchive = (tab) => {
    const [archivedActivities, setArchivedActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchArchivedActivities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/archived-activities.php?tab=${tab}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            // Set application periods data
            setArchivedActivities(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again.",
            );
            setLoading(false);
        }
    };

    const archiveActivity = async (id, type) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${BASE_URL}app/api/archived-activities.php`,
                { activity_id: id, activity_type: type },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.data.success) {
                throw new Error("Failed to archive activity");
            }
            await fetchArchivedActivities(tab);
            return true;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            return false;
        }
    };

    const unArchiveActivity = async (id, type) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${BASE_URL}app/api/archived-activities.php`,
                {
                    data: {
                        activity_id: id,
                        activity_type: type,
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
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
        if (tab) {
            fetchArchivedActivities(tab);
        }
    }, [tab]);

    return {
        archiveActivity,
        unArchiveActivity,
        archivedActivities,
        loading,
        error,
        fetchArchivedActivities,
    };
};

import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useActivities = (tab, userId) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActivities = async (tab, userId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/activities.php?tab=${tab}&id=${userId}`
            );
            // Set application periods data
            setActivities(response.data.data || []);
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

    useEffect(() => {
        fetchActivities(tab, userId);
    }, []);

    return { activities, fetchActivities };
};

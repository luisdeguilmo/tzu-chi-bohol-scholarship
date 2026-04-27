import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useActivities = (tab) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchActivities = async (tab) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/activities.php?tab=${tab}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            // Set application periods data
            setActivities(response.data.data || []);
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

    useEffect(() => {
        fetchActivities(tab);
    }, [tab]);

    return { loading, activities, fetchActivities };
};

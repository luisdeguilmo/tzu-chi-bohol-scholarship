import axios from "axios";
import { useEffect, useState } from "react";

export const useActivities = () => {
    const [currentTab, setCurrentTab] = useState("all");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActivities = async (tab) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/activities.php?tab=${tab}`
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
        fetchActivities();
    }, []);

    return { activities, fetchActivities };
};

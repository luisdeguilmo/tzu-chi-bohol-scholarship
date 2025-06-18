import axios from "axios";
import { useEffect, useState } from "react";

export const useScholarsAndActivities = ( tab ) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/scholars-activities.php?tab=${tab}`
            );
            // Set application periods data
            setScholars(response.data.data || []);
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
        fetchScholars();
    }, [tab]);

    return { scholars, fetchScholars };
};
import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useScholarsAndActivities = (year, month, status, sort) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async (year, month, status, sort) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/scholars-activities.php?year=${year}&month=${month}&status=${status}&sort=${sort}`
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
        fetchScholars(year, month, status, sort);
    }, [year, month, status, sort]);

    return { scholars, fetchScholars };
};

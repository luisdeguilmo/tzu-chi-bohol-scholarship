import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useScholarsAndActivities = (tab, year, month) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async (tab, year, month) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/scholars-activities.php?tab=${tab}&year=${year}&month=${month}`
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
        fetchScholars(tab, year, month);
    }, [tab, year, month]);

    return { scholars, fetchScholars };
};
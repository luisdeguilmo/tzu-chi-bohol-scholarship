import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useSubmissions = (tab, userId, yearLevel) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSubmissionsOnSatf = async (tab, userId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/coe-grades.php?tab=${tab}&id=${userId}&year_level=${yearLevel}`
            );
            // Set application periods data
            setSubmissions(response.data.data || []);
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
        fetchSubmissions(tab, userId);
    }, [tab, userId]);

    return { loading, submissions, fetchSubmissions };
};

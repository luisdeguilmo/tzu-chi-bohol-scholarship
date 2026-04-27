import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useSubmissions = (tab, yearLevel) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchSubmissions = async (tab) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/coe-grades.php?tab=${tab}&year_level=${yearLevel}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            // Set application periods data
            setSubmissions(response.data.data || []);
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
        fetchSubmissions(tab);
    }, [tab]);

    return { loading, submissions, fetchSubmissions };
};

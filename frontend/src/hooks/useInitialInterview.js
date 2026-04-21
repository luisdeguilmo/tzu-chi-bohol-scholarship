import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

export const useInitialInterview = (tab) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/applicants.php?application_status=initial_interview&tab=${tab.toLowerCase()}`
            );
            setApplications(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab) {
            fetchApplications();
        }
    }, [tab]);

    return { applications, loading, error, fetchApplications };
};

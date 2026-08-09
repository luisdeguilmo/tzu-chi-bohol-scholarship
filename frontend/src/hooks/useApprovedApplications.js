import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useApprovedApplications = (status) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/applicants.php?application_status=approved&status=${status}`,
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
        fetchApplications();
    }, []);

    return { loading, applications, fetchApplications };
};

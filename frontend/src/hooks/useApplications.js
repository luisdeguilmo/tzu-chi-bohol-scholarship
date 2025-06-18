import { useEffect, useState } from "react";
import axios from "axios";

export const useApplications = (status) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/applicants.php?status=${status}`
            );
            setApplications(response.data.personalInfo || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [status]);

    return { applications, loading, error, fetchApplications };
};

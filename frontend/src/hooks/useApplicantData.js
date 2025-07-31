import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useApplicantData = () => {
    const [applicantData, setApplicantData] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicantData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${BASE_URL}app/views/applications.php?applicationId=${id}`
            );
            setApplicantData(response.data || []);
            console.log(response.data);
            setApplicationId(id);
            const data = response.data;
            return data;
        } catch (err) {
            console.error("Error fetching applicant data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicantData();
    }, []);

    return { applicantData, fetchApplicantData, loading, error };
};

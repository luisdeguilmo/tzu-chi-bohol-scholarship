import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useApplicantInformation = (userId, schoolYear) => {
    const [applicantInformation, setApplicantInformation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicantInformation = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/applicant-information.php?id=${userId}&school_year=${schoolYear}`
            );
            // Set application periods data
            setApplicantInformation(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholar allowances data: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicantInformation();
    }, [userId, schoolYear]);

    return { applicantInformation, fetchApplicantInformation };
};

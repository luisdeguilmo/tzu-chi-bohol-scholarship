import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useApplicationRecords = (tab, status, schoolYear, sort) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/api/application-records.php?tab=${tab}&status=${status}&school_year=${schoolYear}&sort=${sort}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                },
            );
            const json = await response.json();
            setApplications(json.data || []);
            setLoading(false);
        } catch (error) {
            alert("Failed: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab && status && schoolYear && sort) {
            fetchApplications();
        }
    }, [tab, status, schoolYear, sort]);

    return { loading, applications, fetchApplications };
};

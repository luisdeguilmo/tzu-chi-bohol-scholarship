import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useApplicationRecords = (tab, status, schoolYear, sort) => {
    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/views/application-records.php?tab=${tab}&status=${status}&school_year=${schoolYear}&sort=${sort}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const json = await response.json();
            setApplications(json.data || []);
        } catch (error) {
            alert("Failed: ", error);
        }
    };

    useEffect(() => {
        if (tab && status && schoolYear && sort) {
            fetchApplications();
        }
    }, [tab, status, schoolYear, sort]);

    return { applications, fetchApplications };
};

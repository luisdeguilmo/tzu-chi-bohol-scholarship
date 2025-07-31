import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useExamination = (selectedBatchInBatches, tab) => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // const { selectedBatchInBatches } = useBatch();

    const fetchApplications = async () => {
        try {
            setIsLoading(true);

            let url = "";

            if (tab === "Applicants")
                url = `${BASE_URL}app/views/applicants.php?entrance_examination=1&batch=Unassigned`;
            else if (tab === "Batches")
                url = `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches}`;
            else if (tab === "Result")
                url = `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches}&score=true`;

            const response = await axios.get(url);
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedBatchInBatches && tab) {
            fetchApplications(selectedBatchInBatches, tab);
        }
    }, [selectedBatchInBatches, tab]);

    return { isLoading, applications, fetchApplications };
};

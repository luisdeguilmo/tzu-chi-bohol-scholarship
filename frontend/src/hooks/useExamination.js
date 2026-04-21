import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useExamination = (selectedBatchInBatches, tab, status, sort) => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicationsOnApplicantsTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/api/applicants.php?application_status=examination&batch=Unassigned`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchApplicationsOnBatchesTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/api/batch-examination.php?batch=${selectedBatchInBatches.replace(" ", "%20")}&status=${status}&sort=${sort}`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchApplicationsOnResultTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/api/batch-examination.php?batch=${selectedBatchInBatches.replace(" ", "%20")}&score=true&status=${status}&sort=${sort}`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tab === "Applicants") {
            fetchApplicationsOnApplicantsTab();
        } else if (tab === "Batches" && selectedBatchInBatches && sort) {
            fetchApplicationsOnBatchesTab();
        } else if (
            tab === "Result" &&
            selectedBatchInBatches &&
            status &&
            sort
        ) {
            fetchApplicationsOnResultTab();
        } else {
            console.log("Conditions not met for API call");
        }
    }, [selectedBatchInBatches, tab, status, sort]);

    return {
        isLoading,
        applications,
        fetchApplicationsOnApplicantsTab,
        fetchApplicationsOnBatchesTab,
        fetchApplicationsOnResultTab,
    };
};

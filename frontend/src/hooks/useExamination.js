import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useExamination = (selectedBatchInBatches, tab, status, sort) => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // const { selectedBatchInBatches } = useBatch();

    // const fetchApplications = async () => {
    //     try {
    //         setIsLoading(true);

    //         let url = "";

    //         if (tab === "Applicants")
    //             url = `${BASE_URL}app/views/applicants.php?application_status=examination&batch=Unassigned`;
    //         else if (tab === "Batches")
    //             url = `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches}`;
    //         else if (tab === "Result")
    //             url = `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches}&score=true`;

    //         const response = await axios.get(url);
    //         setApplications(response.data.data || []);
    //         setIsLoading(false);
    //     } catch (err) {
    //         console.error("Error fetching student data:", err);
    //         setError("Failed to load student data. Please try again.");
    //         setIsLoading(false);
    //     }
    // };

    const fetchApplicationsOnApplicantsTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/views/applicants.php?application_status=examination&batch=Unassigned`
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
                `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches.replace(" ", "%20")}&status=${status}&sort=${sort}`
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
                `${BASE_URL}app/views/batch-examination.php?batch=${selectedBatchInBatches.replace(" ", "%20")}&score=true&status=${status}&sort=${sort}`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     // if (selectedBatchInBatches && tab) {
    //     //     fetchApplications(selectedBatchInBatches, tab);
    //     // }

    //     if (tab === "Applicants") {
    //         fetchApplicationsOnApplicantsTab();
    //     } else if (tab === "Batches" && selectedBatchInBatches && sort) {
    //         fetchApplicationsOnBatchesTab();
    //     } else if (
    //         tab === "Result" &&
    //         selectedBatchInBatches &&
    //         status &&
    //         sort
    //     ) {
    //         fetchApplicationsOnResultTab();
    //     }
    // }, [selectedBatchInBatches, tab, status, sort]);

    useEffect(() => {
        console.log("useEffect triggered with:", {
            tab: tab,
            selectedBatchInBatches: selectedBatchInBatches,
            status: status,
            sort: sort,
        });

        if (tab === "Applicants") {
            fetchApplicationsOnApplicantsTab();
        } else if (tab === "Batches" && selectedBatchInBatches && sort) {
            console.log("Calling fetchApplicationsOnBatchesTab");
            fetchApplicationsOnBatchesTab();
        } else if (
            tab === "Result" &&
            selectedBatchInBatches &&
            status &&
            sort
        ) {
            console.log("Calling fetchApplicationsOnResultTab with:", {
                batch: selectedBatchInBatches,
                status: status,
                sort: sort,
            });
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

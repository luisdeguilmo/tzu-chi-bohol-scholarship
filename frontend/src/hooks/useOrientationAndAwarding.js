import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useOrientationAndAwarding = (
    selectedBatchInBatches,
    tab,
    status,
    sort
) => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicationsOnApplicantsTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/views/applicants.php?application_status=orientation&batch=Unassigned`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchApplicationsOnOrientationTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/views/orientation.php?batch=${selectedBatchInBatches.replace(" ", "%20")}&status=${status}&sort=${sort}`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    const fetchApplicationsOnAwardingTab = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/views/awarding.php?status=${status}&sort=${sort}`
            );
            setApplications(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setIsLoading(false);
        }
    };

    const updateStatusForOrientation = async (status, accountId) => {
        try {
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/orientation.php`,
                {
                    account_id: accountId,
                    status: status,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            console.log(data);

            if (data.success) {
                toast.success("Status Updated Successfully");
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusForAwarding = async (status, accountId) => {
        try {
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/awarding.php`,
                {
                    account_id: accountId,
                    status: status,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            console.log(data);

            if (data.success) {
                toast.success("Status Updated Successfully");
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setIsLoading(false);
            return false;
        }
    };

    useEffect(() => {
        console.log("useEffect triggered with:", {
            tab: tab,
            selectedBatchInBatches: selectedBatchInBatches,
            status: status,
            sort: sort,
        });

        if (tab === "Applicants") {
            fetchApplicationsOnApplicantsTab();
        } else if (tab === "Orientation" && selectedBatchInBatches && sort) {
            fetchApplicationsOnOrientationTab();
        } else if (
            tab === "Awarding" &&
            selectedBatchInBatches &&
            status &&
            sort
        ) {
            console.log("Calling fetchApplicationsOnResultTab with:", {
                batch: selectedBatchInBatches,
                status: status,
                sort: sort,
            });
            fetchApplicationsOnAwardingTab();
        } else {
            console.log("Conditions not met for API call");
        }
    }, [selectedBatchInBatches, tab, status, sort]);

    return {
        isLoading,
        applications,
        fetchApplicationsOnApplicantsTab,
        fetchApplicationsOnOrientationTab,
        fetchApplicationsOnAwardingTab,
        updateStatusForOrientation,
        updateStatusForAwarding,
    };
};

import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useScholarAccounts = (tab) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async (tab) => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `${BASE_URL}app/views/scholar-accounts.php?application_status=${tab}`
            );

            if (response.data.success) {
                setScholars(response.data.data || []);
                setLoading(false);
            } else {
                setScholars([]);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching accounts data:", err);
            setError("Failed to load accounts data. Please try again.");
            setLoading(false);
        }
    };

    const createScholarAccount = async (
        selectedScholars,
        setSelectedScholars = null
    ) => {
        if (selectedScholars.length === 0) {
            toast.error("Please select at least one scholar");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}app/views/scholar-accounts.php`,
                {
                    applicationIds: selectedScholars,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Refresh the data after account creation
                await fetchScholars(tab);

                // Clear selections
                if (setSelectedScholars) {
                    setSelectedScholars([]);
                }

                // Show success notification
                toast.success(
                    `Successfully created ${selectedScholars.length} account(s)`
                );
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
        } catch (err) {
            console.error("Error creating accounts:", err);
            toast.error(
                "Failed to create accounts: " +
                    (err.response?.data?.message || err.message)
            );
            setLoading(false);
        }
    };

    const updateScholarAccountStatus = async (scholarId, action) => {
        try {
            setLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/views/scholar-accounts.php?action=${action}`,
                {
                    scholarId: scholarId,
                }
            );

            if (response.data.success) {
                // Refresh the data after account creation
                await fetchScholars(tab);
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Error updating scholar status:", err);
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchScholars(tab);
    }, [tab]);

    return {
        loading,
        scholars,
        createScholarAccount,
        updateScholarAccountStatus,
        fetchScholars,
    };
};

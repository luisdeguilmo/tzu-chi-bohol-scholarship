import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const usePendingScholars = () => {
    const [pendingScholars, setPendingScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPendingScholars = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `${BASE_URL}app/views/scholar-accounts.php?application_status=Pending`
            );
            setPendingScholars(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholars data:", err);
            setError("Failed to load scholars data. Please try again.");
            setLoading(false);
        }
    };

    const createScholarAccount = async (
        selectedScholars,
        setSelectedScholars
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
                await fetchPendingScholars();

                // Clear selections
                setSelectedScholars([]);

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

    useEffect(() => {
        fetchPendingScholars();
    }, []);

    return { loading, pendingScholars, createScholarAccount, fetchPendingScholars };
};

import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useApplicationPeriods = () => {
    const [applicationPeriods, setApplicationPeriods] = useState([]);
    const [hasActiveApplicationPeriod, setHasActiveApplicationPeriod] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApplicationPeriods = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/application-periods.php`
            );
            // Set application periods data
            setApplicationPeriods(response.data.data || []);
            // Set active application period flag
            console.log(response.data.hasActiveApplicationPeriod);
            setHasActiveApplicationPeriod(
                response.data.hasActiveApplicationPeriod || false
            );
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    const createApplicationPeriod = async (
        startDate,
        endDate,
        announcementMessage
    ) => {
        const data = {
            application: {
                startDate: startDate,
                endDate: endDate,
                status: "Active",
                announcementMessage: announcementMessage,
            },
        };

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/views/application-periods.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                await fetchApplicationPeriods();
                setLoading(false);
            } else {
                alert("Error: " + result.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
        }
    };

    const deleteApplicationPeriod = async (id) => {
        try {
            const response = await fetch(
                `${BASE_URL}app/views/application-periods.php?id=${id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                await fetchApplicationPeriods();
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const editApplicationPeriod = async (
        id,
        startDate,
        endDate,
        announcementMessage,
        status
    ) => {
        const data = {
            application: {
                id: id,
                startDate: startDate,
                endDate: endDate,
                status: status,
                announcementMessage: announcementMessage,
            },
        };

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/views/application-periods.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                await fetchApplicationPeriods();
                setLoading(false);
            } else {
                alert("Error: " + result.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    return {
        loading,
        applicationPeriods,
        hasActiveApplicationPeriod,
        setHasActiveApplicationPeriod,
        createApplicationPeriod,
        editApplicationPeriod,
        deleteApplicationPeriod,
        fetchApplicationPeriods,
    };
};

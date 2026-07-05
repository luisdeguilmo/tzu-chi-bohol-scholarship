import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export const useApplicationPeriods = (type) => {
    const [applicationPeriods, setApplicationPeriods] = useState([]);
    const [hasActiveNewApplicationPeriod, setHasActiveNewApplicationPeriod] =
        useState(false);
    const [
        hasActiveRenewalApplicationPeriod,
        setHasActiveRenewalApplicationPeriod,
    ] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const getSchoolYear = async (type) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/application-periods.php?type=${type}`,
            );
            return response.data.data || [];
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again.",
            );
            setLoading(false);
        }
    };

    const fetchApplicationPeriods = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/application-periods.php?type=${type}`,
            );
            // Set application periods data
            setApplicationPeriods(response.data.data || []);
            // Set active application period flag
            setHasActiveNewApplicationPeriod(
                response.data.hasActiveNewApplicationPeriod || false,
            );
            setHasActiveRenewalApplicationPeriod(
                response.data.hasActiveRenewalApplicationPeriod || false,
            );
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again.",
            );
            setLoading(false);
        }
    };

    const createApplicationPeriod = async (
        startDate,
        endDate,
        schoolYear,
        announcementMessage,
        status,
        type,
    ) => {
        const data = {
            application: {
                startDate: startDate,
                endDate: endDate,
                schoolYear: schoolYear,
                type: type,
                status: status,
                announcementMessage: announcementMessage,
            },
        };

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/api/application-periods.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                await fetchApplicationPeriods();
                setLoading(false);
                return true;
            } else {
                toast.error("Error: " + result.message);
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
            return false;
        }
    };

    const deleteApplicationPeriod = async (id) => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/application-periods.php?id=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                await fetchApplicationPeriods();
            } else {
                alert("Error: " + result.message);
            }

            return true;
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            return true;
        }
    };

    const editApplicationPeriod = async (
        id,
        startDate,
        endDate,
        schoolYear,
        announcementMessage,
        status,
        type,
    ) => {
        const data = {
            application: {
                id: id,
                startDate: startDate,
                endDate: endDate,
                schoolYear: schoolYear,
                type: type,
                status: status,
                announcementMessage: announcementMessage,
            },
        };

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/api/application-periods.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
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

    const { pathname } = useLocation();

    useEffect(() => {
        if (
            pathname.includes("about") ||
            pathname.includes("our-mission") 
            // pathname.includes("staff/scholarship/application-period")
        ) {
            fetchApplicationPeriods();
        }
    }, [pathname]);

    return {
        loading,
        applicationPeriods,
        hasActiveNewApplicationPeriod,
        hasActiveRenewalApplicationPeriod,
        setHasActiveNewApplicationPeriod,
        setHasActiveRenewalApplicationPeriod,
        createApplicationPeriod,
        editApplicationPeriod,
        deleteApplicationPeriod,
        fetchApplicationPeriods,
        getSchoolYear,
    };
};

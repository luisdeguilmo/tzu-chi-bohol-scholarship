import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useDashboardOverviewData = (userType) => {
    const [dashboardData, setDashboardData] = useState([]);
    const token = localStorage.getItem("token");

    const fetchStaffDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/staff-dashboard-data.php`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const json = await response.json();

            if (response.ok) {
                setDashboardData(json.data || []);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const fetchAdminDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/admin-dashboard-data.php`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const json = await response.json();
            setDashboardData(json.data || []);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const fetchScholarDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/scholar-dashboard-data.php`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const json = await response.json();
            setDashboardData(json.data || []);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (userType === "staff") {
            fetchStaffDashboardData();
        } else if (userType === "admin") {
            fetchAdminDashboardData();
        } else if (userType === "scholar") {
            fetchScholarDashboardData();
        }
    }, [userType]);

    return {
        dashboardData,
        fetchStaffDashboardData,
        fetchScholarDashboardData,
    };
};

import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useDashboardOverviewData = (id, userType) => {
    const [dashboardData, setDashboardData] = useState([]);

    const fetchStaffDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/views/staff-dashboard-data.php?id=${id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const json = await response.json();
            setDashboardData(json.data || []);
            console.log(json.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const fetchAdminDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/views/admin-dashboard-data.php?id=${id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const json = await response.json();
            setDashboardData(json.data || []);
            console.log(json.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const fetchScholarDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/views/scholar-dashboard-data.php?id=${id}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const json = await response.json();
            setDashboardData(json.data || []);
            console.log(json.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (userType === "staff") {
            fetchStaffDashboardData(id);
        } else if (userType === "admin") {
            fetchAdminDashboardData(id);
        } else if (userType === "scholar") {
            fetchScholarDashboardData(id);
        }
    }, [userType]);

    return { dashboardData, fetchStaffDashboardData };
};

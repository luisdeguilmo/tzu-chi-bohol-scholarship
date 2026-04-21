import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useDashboardOverviewData = (id, userType, schoolYear) => {
    const [dashboardData, setDashboardData] = useState([]);

    const fetchStaffDashboardData = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/staff-dashboard-data.php?id=${id}&school_year=${schoolYear}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
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
                `${BASE_URL}app/api/admin-dashboard-data.php?id=${id}&school_year=${schoolYear}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
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
                `${BASE_URL}app/api/scholar-dashboard-data.php?id=${id}&school_year=${schoolYear}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const json = await response.json();
            setDashboardData(json.data || []);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (userType === "staff") {
            fetchStaffDashboardData(id);
        } else if (userType === "admin") {
            fetchAdminDashboardData(id);
        } else if (userType === "scholar" && schoolYear) {
            fetchScholarDashboardData(id);
        }
    }, [userType, schoolYear]);

    return {
        dashboardData,
        fetchStaffDashboardData,
        fetchScholarDashboardData,
    };
};

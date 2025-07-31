import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useStaffDashboardOverviewData = (id, userType) => {
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

    useEffect(() => {
        if (userType === "staff") {
            fetchStaffDashboardData(id);
        }
    }, [userType]);

    return { dashboardData, fetchStaffDashboardData };
};

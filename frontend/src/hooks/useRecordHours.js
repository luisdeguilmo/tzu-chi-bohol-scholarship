import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useRecordHours = () => {
    const recordCommunityServiceHours = async (
        id,
        accountId,
        renderedHours,
        onRefresh,
        activeTab,
        year,
        month
    ) => {
        try {
            const response = await axios.put(
                `${BASE_URL}app/views/rendered-hours.php?duty_type=community_service`,
                {
                    id: id,
                    account_id: accountId,
                    rendered_hours: renderedHours,
                    activity_status: "Recorded",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("Recorded Successfully");
                onRefresh(activeTab, year, month);
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
        }
    };

    const recordEventHours = async (eventId, renderedHours, selectedScholars) => {
        try {
            const response = await axios.put(
                `${BASE_URL}app/views/rendered-hours.php?duty_type=event`,
                {
                    event_id: eventId,
                    rendered_hours: renderedHours,
                    selected_scholars: selectedScholars,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("Recorded Successfully");
                console.log("Recorded Successfully");
                // onRefresh(activeTab, year, month);
                return true;
            }
            return true;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            return false;
        }
    };

    return { recordCommunityServiceHours, recordEventHours };
};

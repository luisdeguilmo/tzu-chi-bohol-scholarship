import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useState } from "react";

export const useRecordHours = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const recordCommunityServiceHours = async (
        activity,
        renderedHours,
        onRefresh,
        year,
        month,
        currentStatus,
        sort,
    ) => {
        try {
            setIsLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/api/rendered-hours.php?duty_type=community_service&action=approve`,
                {
                    id: activity?.id,
                    account_id: activity?.application_id,
                    activity_type: "community_service",
                    activity_name: activity?.activity_name,
                    activity_date: activity?.activity_date,
                    start_time: activity?.start_time,
                    end_time: activity?.end_time,
                    activity_location: activity?.activity_location,
                    rendered_hours: renderedHours,
                    activity_status: "Recorded",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response.data;

            if (data.success) {
                toast.success("Recorded Successfully");
                onRefresh(year, month, currentStatus, sort);
            }

            setIsLoading(false);
            return true;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setIsLoading(false);
            return false;
        }
    };

    const markAsNotRecorded = async (
        id,
        accountId,
        activity,
        feedback,
        year,
        month,
        currentStatus,
        sort,
        onRefresh,
    ) => {
        try {
            setIsLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/api/rendered-hours.php?duty_type=community_service&action=reject`,
                {
                    id: id,
                    account_id: accountId,
                    feedback: feedback,
                    activity_name: activity?.activity_name,
                    activity_date: activity?.activity_date,
                    rendered_hours: 0,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response.data;

            console.log(data);

            if (data.success) {
                toast.success("Marked as not recorded successfully");
                onRefresh(year, month, currentStatus, sort);
                console.log("SAKSIS");
                // setIsLoading(false);
                // return true;
            }

            setIsLoading(false);
            return true;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setIsLoading(false);
            return false;
        }
    };

    const recordEventHours = async (event, renderedHours, selectedScholars) => {
        try {
            const response = await axios.put(
                `${BASE_URL}app/api/rendered-hours.php?duty_type=event`,
                {
                    event_id: event.id,
                    event_type: "event",
                    event_name: event.event_name,
                    event_start_time: event.start_time,
                    event_end_time: event.end_time,
                    event_date: event.date,
                    event_location: event.event_location,
                    rendered_hours: renderedHours,
                    selected_scholars: selectedScholars,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response.data;

            if (data.success) {
                toast.success("Recorded Successfully");
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

    const setRenderedHours = async (id, renderedHours) => {
        try {
            setIsLoading(true);

            const response = await axios.patch(
                `${BASE_URL}app/api/rendered-hours.php`,
                {
                    account_id: id,
                    initial_rendered_hours: renderedHours,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response.data;

            if (data.success) {
                toast.success("Initial rendered hours added successfully");
                // onRefresh(activeTab, year, month);
                setIsLoading(false);
                return true;
            }
            setIsLoading(false);
            return true;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setIsLoading(false);
            return false;
        }
    };

    return {
        isLoading,
        recordCommunityServiceHours,
        markAsNotRecorded,
        recordEventHours,
        setRenderedHours,
    };
};

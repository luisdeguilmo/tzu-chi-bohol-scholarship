import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useSchoolTransportInfo = (id) => {
    const [transportInfo, setTransportInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSchoolTransportInfo = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/school-transport-info.php?id=${id}`
            );

            if (response.data) {
                setTransportInfo(response.data.data);
                setIsLoading(false);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Error: ", error);
        }
    };

    const addTransportInfo = async (
        scholarId,
        type,
        university,
        course,
        stayType,
        address,
        dailyTransportCost,
        routeExplanation
    ) => {
        const data = {
            scholar_id: scholarId,
            type: type,
            university: university,
            course: course,
            stay_type: stayType,
            address: address,
            daily_transport_cost: dailyTransportCost,
            route_explanation: routeExplanation,
        };

        try {
            setIsLoading(true);

            const response = await fetch(
                `${BASE_URL}app/views/school-transport-info.php`,
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
                setIsLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setIsLoading(false);
            return false;
        }
    };

    const deleteCourse = async (id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(
                `${BASE_URL}app/views/courses-accepted.php?id=${id}`
            );

            if (response.data) {
                toast.success("Course deleted successfully");
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
            return false;
        }
    };

    useEffect(() => {
        if (id) {
            fetchSchoolTransportInfo();
        }
    }, [id]);

    return {
        isLoading,
        transportInfo,
        addTransportInfo,
        fetchSchoolTransportInfo,
    };
};

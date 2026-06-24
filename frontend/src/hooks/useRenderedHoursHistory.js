import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useLocation } from "react-router-dom";

export const useRenderedHoursHistory = () => {
    const [renderedHoursHistory, setRenderedHoursHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchRenderedHoursHistory = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/rendered-hours-history.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setRenderedHoursHistory(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.log("Error: ", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRenderedHoursHistory();
    }, []);

    return { isLoading, renderedHoursHistory, fetchRenderedHoursHistory };
};

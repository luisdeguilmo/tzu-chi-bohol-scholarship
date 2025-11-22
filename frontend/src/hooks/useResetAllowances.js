import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useResetAllowances = (tab, status, scholarYear, sortBy) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetAllowances = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/reset-scholar-allowances.php`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                // toast.success("Allowance Reset Successfully");
                setLoading(false);
                return true;
            } else {
                // toast.error("Failed to reset allowances. Please try again.");
                console.log(data);
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setLoading(false);
            return false;
        }
    };

    return {
        resetAllowances,
    };
};

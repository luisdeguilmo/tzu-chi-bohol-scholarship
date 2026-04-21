import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useUserAccount = () => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateScholarAccountStatus = async (userId, action) => {
        try {
            setLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/api/user-account.php?action=${action}`,
                {
                    userId: userId,
                }
            );

            if (response.data.success) {
                // Refresh the data after account creation
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Error updating scholar status:", err);
            setLoading(false);
            return false;
        }
    };

    return {
        loading,
        updateScholarAccountStatus,
    };
};

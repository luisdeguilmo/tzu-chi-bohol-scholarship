import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useOrientation = (tab, status, scholarYear, sortBy) => {
    const [loading, setLoading] = useState(false);

    const updateAllowanceStatus = async (status, accountId) => {
        try {
            console.log(accountId, status);
            const response = await axios.put(
                `${BASE_URL}app/views/scholar.php`,
                {
                    account_id: accountId,
                    allowance_status: status,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("Status Updated Successfully");
                return true;
            }

            return false;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            return false;
        }
    };

    return {
        loading,
    };
};

import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useState } from "react";

export const useSpecialSponsor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const setSpecialSponsor = async (id, sponsor) => {
        try {
            setIsLoading(true);

            const response = await axios.patch(
                `${BASE_URL}app/api/scholars.php`,
                {
                    account_id: id,
                    special_sponsor: sponsor,
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
                toast.success("Special sponsor added successfully");
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
        setSpecialSponsor,
    };
};

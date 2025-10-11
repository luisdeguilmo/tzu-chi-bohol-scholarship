// import { useEffect, useState } from "react";
// import BASE_URL from "../config";

// export const useScholars = (tab, status, scholarYear) => {
//     const [scholars, setScholars] = useState([]);

//     const fetchScholars = async (tab) => {
//         try {
//             const response = await fetch(
//                 `${BASE_URL}app/views/scholars.php?tab=${tab}&status=${status}&school_year=${scholarYear}`
//             );
//             const json = await response.json();
//             setScholars(json.data || []);
//         } catch (error) {
//             console.log("Error: ", error);
//             alert("Failed: ", error);
//         }
//     };

//     useEffect(() => {
//         fetchScholars(tab, status, scholarYear);
//     }, [tab, status, scholarYear]);

//     return { scholars, fetchScholars };
// };

import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useScholars = (tab, status, scholarYear, sortBy) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}app/views/scholars.php?tab=${tab}&status=${status}&school_year=${scholarYear}&sort=${sortBy}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setScholars(json.data || []);
        } catch (error) {
            console.error("Error fetching scholars:", error);
            setError(error.message);
            setScholars([]);
        } finally {
            setLoading(false);
        }
    };

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
                toast.success("Allowance Status Updated Successfully");
                return true;
            }

            return false;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            return false;
        }
    };

    useEffect(() => {
        if (tab && status && scholarYear && sortBy) {
            fetchScholars();
        }
    }, [tab, status, scholarYear, sortBy]);

    return {
        scholars,
        loading,
        error,
        fetchScholars,
        updateAllowanceStatus,
        refetch: fetchScholars,
    };
};

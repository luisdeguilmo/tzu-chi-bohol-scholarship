import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

const useMonthlyAllowanceSummary = (month, year) => {
    const [allowanceCycles, setAllowanceCycles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllowanceCycles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/monthly-allowance-summary.php?month=${month}&year=${year}`
            );

            if (response.data) {
                setAllowanceCycles(response.data.data || []);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.log("Error: ", err);
        }
    };

    useEffect(() => {
        if (month && year) {
            fetchAllowanceCycles();
        }
    }, [month, year]);

    return { loading, allowanceCycles, fetchAllowanceCycles };
};

export default useMonthlyAllowanceSummary;

import axios from "axios";
import BASE_URL from "../config";
import { useEffect, useState } from "react";

export const useScholar = (id, schoolYear) => {
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);

    const getScholarType = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}app/views/scholar.php?id=${id}&school_year=${schoolYear}`
            );

            if (response.data.success) {
                setType(response.data.data || "");
                setLoading(false);
            } else {
                setAdminInfo({});
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (id && schoolYear) {
            getScholarType();
        }
    }, [id, schoolYear]);

    return { type, getScholarType };
};

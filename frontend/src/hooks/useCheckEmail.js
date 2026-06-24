// import axios from "axios";
// import { useEffect, useState } from "react";
// import BASE_URL from "../config";
// import { useAuth } from "../context/AuthContext";

// export const useCheckEmail = (email) => {
//     const [isEmailExist, setIsEmailExist] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const token = localStorage.getItem("token");
//     const { user } = useAuth();

//     const checkEmail = async () => {
//         try {
//             setLoading(true);

//             const response = await axios.get(
//                 `${BASE_URL}app/api/check-email.php`,
//                 {
//                     params: { email: email },
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 },
//             );

//             setIsEmailExist(response.data.data);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error checking email existence:", err);
//             setError("Failed to check email. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (email) {
//             checkEmail();
//         }
//     }, [email]);

//     return { isEmailExist, loading, error, refetch: checkEmail };
// };

import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { useAuth } from "../context/AuthContext";

export const useCheckEmail = (email) => {
    const [isEmailExist, setIsEmailExist] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    const checkEmail = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const headers = {};

            // only attach Authorization if user is logged in
            if (user && token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.get(
                `${BASE_URL}app/api/check-email.php`,
                {
                    params: { email },
                    headers,
                },
            );

            setIsEmailExist(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error checking email existence:", err);

            setError("Failed to check email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) {
            checkEmail();
        }
    }, [email]);

    return { isEmailExist, loading, error, refetch: checkEmail };
};

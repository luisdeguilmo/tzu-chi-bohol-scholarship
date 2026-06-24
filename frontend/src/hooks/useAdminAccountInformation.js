import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useAdminAccountInformation = () => {
    const [adminInfo, setAdminInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchAdminInfo = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `${BASE_URL}app/api/admin-info.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                setAdminInfo(response.data.data || {});
                setLoading(false);
            } else {
                setAdminInfo({});
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching accounts data:", err);
            setError("Failed to load accounts data. Please try again.");
            setLoading(false);
        }
    };

    const updateAdminInfo = async (name, email) => {
        try {
            const response = await axios.put(
                `${BASE_URL}app/api/admin-info.php`,
                {
                    name: name,
                    email: email,
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
                toast.success("Admin Profile Updated Successfully");
                setLoading(false);
                return true;
            } else {
                setLoading(false);
                return false;
            }
        } catch (err) {
            toast.error(err);
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchAdminInfo();
    }, []);

    return {
        loading,
        adminInfo,
        updateAdminInfo,
        fetchAdminInfo,
    };
};

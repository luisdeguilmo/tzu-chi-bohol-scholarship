import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/notifications.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                setNotifications(response.data.data || []);
                setIsLoading(false);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("Error: ", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.put(
                `${BASE_URL}app/api/notifications.php?id=${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                return true;
            }

            return false;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    const deleteNotification = async (id, type) => {
        try {
            const response = await axios.delete(
                `${BASE_URL}app/api/notifications.php?id=${id}&type=${type}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data) {
                return true;
            }

            return false;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return {
        notifications,
        markAsRead,
        deleteNotification,
        fetchNotifications,
    };
};

import axios from "axios";
import BASE_URL from "../config";
import { useEffect, useState } from "react";

export const getProfilePicture = (userId, endpoint) => {
    const [imageUrl, setImageUrl] = useState(null);
    // const userId = user?.user_id;

    if (!userId) {
        return { imageUrl: null };
    }

    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}backend/api/applications/${userId}/${endpoint}`
            );

            if (response.data.success) {
                setImageUrl(response.data.profile_picture_url);
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
            return null;
        }
    };

    useEffect(() => {
        fetchProfilePicture();
    }, [userId]);

    return { imageUrl, fetchProfilePicture };
};

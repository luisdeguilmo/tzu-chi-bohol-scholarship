import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useProfilePicture = (applications) => {
    const [profilePics, setProfilePics] = useState([]);

    const getProfilePicture = async (applicationId) => {
        try {
            const response = await axios.get(
                `${BASE_URL}backend/api/applications/${applicationId}/profile-picture`
            );
            console.log(response.data.profile_picture_url);
            return response.data.profile_picture_url;
        } catch (error) {
            console.error("Error fetching profile picture:", error);
            return null;
        }
    };

    const fetchAllPics = async () => {
        const pics = {};
        for (const app of applications) {
            const url = await getProfilePicture(app.application_id || app.account_id);
            pics[app.application_id || app.account_id] = url;
        }
        setProfilePics(pics);
    };

    useEffect(() => {
        fetchAllPics();
    }, [applications]);

    return { profilePics, fetchAllPics };
}; 

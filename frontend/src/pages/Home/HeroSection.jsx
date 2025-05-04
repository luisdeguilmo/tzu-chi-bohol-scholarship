import { useNavigate } from "react-router-dom";
import "/src/background.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HeroSection() {
    const navigate = useNavigate();
    const userType = { type: "Scholar" };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [applicationPeriods, setApplicationPeriods] = useState([]);
    const [hasActiveApplicationPeriod, setHasActiveApplicationPeriod] =
        useState(false);
    const [editingPeriod, setEditingPeriod] = useState(null);

    const fetchApplicationPeriods = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/application-periods.php`
            );
            // Set application periods data
            setApplicationPeriods(response.data.data || []);
            // Set active application period flag
            setHasActiveApplicationPeriod(
                response.data.hasActiveApplicationPeriod || false
            );
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const announcementMessage = applicationPeriods.length > 0 ? applicationPeriods[0].announcement_message : '';

    console.log(applicationPeriods);

    const today = new Date().toISOString().split("T")[0];

    const handleClick = () => {
        if (
            applicationPeriods[0].status === "Active" &&
            today >= applicationPeriods[0].start_date &&
            today <= applicationPeriods[0].end_date
        ) {
            navigate("/application");
        } else if (
            today > applicationPeriods[0].end_date ||
            applicationPeriods[0].status === "Closed"
        ) {
            toast.error("The online application has been closed.");
        } else {
            toast.info(
                "The online application is not available at the moment."
            );
        }
    };

    return (
        <section className="relative h-screen text-white">
            <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div>
                    <h1 className="text-6xl italic font-semibold text-center whitespace-pre-wrap">
                        Seize the Opportunity, Apply Now!
                    </h1>
                    <div className="mt-5 flex justify-center gap-5">
                        <button
                            onClick={handleClick}
                            className="w-28 p-2 text-white bg-green-600 rounded-sm"
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={() => navigate("/scholar/dashboard")}
                            // onClick={() => navigate("/login", { state: userType })}
                            className="w-28 p-2 border border-green-500 rounded-sm"
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-center text-lg">
                        {announcementMessage}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

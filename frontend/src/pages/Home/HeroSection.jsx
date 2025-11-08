import { useNavigate } from "react-router-dom";
import "/src/background.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../config";
import { useApplicationPeriods } from "../../hooks/useApplicationPeriods";

function HeroSection() {
    const navigate = useNavigate();

    const { applicationPeriods } = useApplicationPeriods('new');

    const today = new Date().toISOString().split("T")[0];

    const handleClick = () => {
        if (
            applicationPeriods.status === "Active" &&
            today >= applicationPeriods.start_date &&
            today <= applicationPeriods.end_date
        ) {
            navigate("/application");
        } else if (
            today > applicationPeriods.end_date ||
            applicationPeriods.status === "Closed"
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
                            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={() => navigate("/login/scholar")}
                            // onClick={() => navigate("/login", { state: userType })}
                            className="w-28 p-2 border border-green-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-center text-sm md:text-lg">
                        {applicationPeriods.announcement_message}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

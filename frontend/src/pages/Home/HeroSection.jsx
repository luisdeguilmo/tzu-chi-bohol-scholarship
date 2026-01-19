import { useNavigate } from "react-router-dom";
import "/src/background.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApplicationPeriods } from "../../hooks/useApplicationPeriods";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HeroSection() {
    const navigate = useNavigate();
    const { applicationPeriods } = useApplicationPeriods("new");

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

    const images = [
        "/src/assets/img.jpg",
        "/src/assets/img1.jpg",
        "/src/assets/img3.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev + 1) % images.length);
            setTimeout(() => setIsTransitioning(false), 300);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handlePrevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const handleNextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    return (
        <section className="hero group relative h-screen text-white">
            {/* Background Carousel */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`hero-bg ${index === currentIndex ? "visible" : "hidden"}`}
                    style={{ backgroundImage: `url(${img})` }}
                />
            ))}

            {/* Navigation Arrows */}
            <div className="invisible">
                <div
                    className="hero-arrow left group-hover:visible"
                    onClick={handlePrevSlide}
                >
                    <ChevronLeft className="w-10 h-10" />
                </div>
                <div
                    className="hero-arrow right group-hover:visible"
                    onClick={handleNextSlide}
                >
                    <ChevronRight className="w-10 h-10" />
                </div>
            </div>

            <div className="w-[95%] absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                <div>
                    <h1 className="text-4xl md:text-6xl italic font-semibold text-center whitespace-pre-wrap">
                        Seize the Opportunity, Apply Now!
                    </h1>
                    <div className="mt-5 flex justify-center gap-2 md:gap-5">
                        <button
                            onClick={handleClick}
                            className="bg-green-700 hover:bg-green-800 text-xs md:text-sm text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={() => navigate("/login/scholar")}
                            className="w-28 p-2 border-2 border-green-500 text-xs md:text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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

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
                "The online application is not available at the moment.",
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

            {/* <div className="w-[95%] absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                <div>
                    <h1 className="text-4xl md:text-6xl mb-[16px] italic font-semibold text-center whitespace-pre-wrap">
                        Empowering <span className="text-green-600">Compassion</span> <br /> Through <span className="text-green-600">Education</span>
                    </h1>
                    <p className="mb-[28px] text-center whitespace-pre-wrap">
                        A unified platform to manage scholarships, support
                        scholars, and uphold the mission of service and
                        gratitude.
                    </p>
                    <div className="mt-[36px] mb-[48px] flex justify-center gap-2 md:gap-5">
                        <button
                            onClick={handleClick}
                            className="bg-green-700 hover:bg-green-800 text-xs md:text-sm text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Apply for Scholarship
                        </button>
                        <button
                            onClick={() => navigate("/login/scholar")}
                            className="px-4 py-2.5 border-2 border-green-500 text-xs md:text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Scholar Login
                        </button>
                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-center text-sm md:text-lg">
                        {applicationPeriods.announcement_message}
                    </p>
                </div>
            </div> */}

            <div className="w-[95%] absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* HERO TITLE */}
                    <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
                        Empowering{" "}
                        <span className="text-green-600">Compassion</span>
                        <br />
                        Through{" "}
                        <span className="text-green-600">Education</span>
                    </h1>

                    {/* SUBTITLE */}
                    <p className="text-sm md:text-base text-white/90 leading-relaxed mb-8">
                        A unified platform to manage scholarships, support
                        scholars, and uphold the mission of service and
                        gratitude.
                    </p>

                    {/* CTA BUTTONS */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 mb-10">
                        <button
                            onClick={handleClick}
                            className="bg-green-700 hover:bg-green-800 text-white text-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Apply for Scholarship
                        </button>

                        <button
                            onClick={() => navigate("/login/scholar")}
                            className="border-2 border-green-500 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-green-500/10"
                        >
                            Scholar Login
                        </button>
                    </div>

                    {/* ANNOUNCEMENT */}
                    <p className="text-sm md:text-base text-white/80 leading-relaxed">
                        {applicationPeriods.announcement_message}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

import { useNavigate } from "react-router-dom";
import "/src/background.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApplicationPeriods } from "../../hooks/useApplicationPeriods";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img from "../../assets/img.jpg";
import img1 from "../../assets/img1.jpg";
import img3 from "../../assets/img3.jpg";

const IMAGES = [img, img1, img3];
const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50; // px of horizontal drag needed to register as a swipe

function HeroSection() {
    const navigate = useNavigate();
    const { loading, applicationPeriods, fetchApplicationPeriods } =
        useApplicationPeriods("new");

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const handleClick = () => {
        if (!applicationPeriods) return;

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

    // --- Carousel state ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    const goToSlide = useCallback(
        (index) => {
            if (isTransitioning) return;
            setIsTransitioning(true);
            setCurrentIndex((index + IMAGES.length) % IMAGES.length);
            setTimeout(() => setIsTransitioning(false), 300);
        },
        [isTransitioning],
    );

    const handlePrevSlide = () => goToSlide(currentIndex - 1);
    const handleNextSlide = () => goToSlide(currentIndex + 1);

    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, SLIDE_DURATION);
        return () => clearInterval(timerRef.current);
    }, [isPaused, currentIndex]);

    // --- Swipe gesture support (mobile) ---
    const touchStartX = useRef(null);
    const touchDeltaX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
        setIsPaused(true);
    };

    const handleTouchMove = (e) => {
        if (touchStartX.current === null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (touchDeltaX.current > SWIPE_THRESHOLD) {
            handlePrevSlide(); // swiped right -> previous slide
        } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
            handleNextSlide(); // swiped left -> next slide
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
        setIsPaused(false);
    };

    return (
        <section
            className="hero group relative flex items-center justify-center h-[615px] md:h-[610px] text-white overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Carousel — pulled out of flex flow so it never affects layout */}
            {IMAGES.map((image, index) => (
                <div
                    key={index}
                    className={`hero-bg absolute inset-0 ${index === currentIndex ? "visible" : "hidden"}`}
                    style={{ backgroundImage: `url(${image})` }}
                    aria-hidden={index !== currentIndex}
                />
            ))}

            {/* Subtle scrim so text stays legible over any photo */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Navigation Arrows — explicitly absolute + positioned, independent of flex */}
            <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className="hero-arrow left absolute left-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
            >
                <ChevronLeft className="w-10 h-10" />
            </button>
            <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next slide"
                className="hero-arrow right absolute right-4 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
            >
                <ChevronRight className="w-10 h-10" />
            </button>

            {/* Dot pagination */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2.5">
                {IMAGES.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentIndex}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? "w-6 bg-green-500"
                                : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                    />
                ))}
            </div>

            {/* Static hero content — the only true flex item; centered by the section itself */}
            <div className="relative z-30 w-[95%] max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight mt-14 md:mt-4 mb-6">
                    Empowering{" "}
                    <span className="text-green-600">Compassion</span>
                    <br />
                    Through <span className="text-green-600">Education</span>
                </h1>

                <p className="text-xs px-2 md:text-sm lg:text-lg mb-8 text-white/80 leading-relaxed">
                    {applicationPeriods?.announcement_message}
                </p>

                {!loading && (
                    <div className="flex flex-row justify-center items-center gap-3 sm:gap-5 mb-10">
                        <button
                            onClick={handleClick}
                            className={`text-white text-sm px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                                applicationPeriods?.status === "Active"
                                    ? "bg-green-700 hover:bg-green-800 hover:shadow-lg transform hover:-translate-y-0.5"
                                    : "bg-gray-400 cursor-not-allowed opacity-75"
                            }`}
                            disabled={applicationPeriods?.status !== "Active"}
                        >
                            {applicationPeriods?.status === "Active"
                                ? "Apply Now"
                                : "Applications Closed"}
                        </button>

                        <button
                            onClick={() => navigate("/login/scholar")}
                            className="border-2 border-green-500 text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-green-500/10"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default HeroSection;

import { useLocation } from "react-router-dom";
import HeroSection from "./HeroSection";
import ScholarshipInfo from "./ScholarshipInfo";
import { useEffect } from "react";

export default function Home() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <main>
            <HeroSection />
            <ScholarshipInfo />
        </main>
    );
}

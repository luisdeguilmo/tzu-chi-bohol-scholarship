import { useLocation } from "react-router-dom";
import HeroSection from "./HeroSection";
import ScholarshipInfo from "./ScholarshipInfo";
import { useEffect } from "react";

export default function Home() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <main>
            <HeroSection />
            <ScholarshipInfo />
        </main>
    );
}

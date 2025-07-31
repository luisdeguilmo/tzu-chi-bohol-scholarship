import Footer from "../Footer";
import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";
import "/src/background.css";
import { useEffect, useState } from "react";

export default function HomePageLayout() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            onScroll={() => setIsScrolled(true)}
            className={`hero scroll-smooth`}
        >
            <NavBar isScrolled={isScrolled} />
            <main
                className={`transition-all duration-300 ${
                    isScrolled ? "" : "pt-28"
                }`}
            >
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

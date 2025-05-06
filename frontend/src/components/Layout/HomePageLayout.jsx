// import ApplicationSection from "../../pages/Home/ApplicationSection";
import HeroSection from "../../pages/Home/HeroSection";
import Home from "../../pages/Home/Home";
import ScholarshipInfo from "../../pages/Home/ScholarshipInfo";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "/src/background.css";

export default function HomePageLayout() {
    return (
        <div className="hero">
            <NavBar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

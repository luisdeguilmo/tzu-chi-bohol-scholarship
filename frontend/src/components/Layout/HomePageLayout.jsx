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

// export default function HomePageLayout() {
//     return (
//         <div>
//             <NavBar />
//             <main>
//                 <HeroSection />
//                 <ScholarshipInfo />
//             </main>
//             <Footer />
//         </div>
//     );
// }

// export default function HomePageLayout() {
//     return (
//         <Router>
//             <NavBar />
//             <div className="min-h-screen flex flex-col justify-center">
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route
//                         path="/application"
//                         element={<ApplicationSection />}
//                     />
//                 </Routes>
//             </div>
//             <Footer />
//         </Router>
//     );
// }

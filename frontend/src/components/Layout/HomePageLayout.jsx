import Footer from "../Footer";
import NavBar from "../NavBar";
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

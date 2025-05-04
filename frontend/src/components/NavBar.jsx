import Logo from "/src/assets/tzu_chi_logo.png";
import { Link, useNavigate } from "react-router-dom";

function NavLinks() {
    const navigate = useNavigate();

    const staff = { type: "Staff" };
    const admin = { type: "Admin" };

    return (
        <ul className="flex gap-4 items-center text-sm font-semibold">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <a href="">About</a>
            </li>
            <li 
                // onClick={() => navigate("/login", { state: staff })}
            >
                {/* Staff */}
                <Link to="/staff/dashboard">Staff</Link>
            </li>
            <li onClick={() => navigate("/login", { state: admin })}>
                Admin
                {/* <Link to="/admin/dashboard">Admin</Link> */}
            </li>
            <button
                onClick={() => navigate("/application")}
                className="w-28 p-2 text-white bg-green-600 rounded-sm"
            >
                Apply Now
            </button>
        </ul>
    );
}

function NavBar() {
    return (
        <header className="flex items-center bg-white justify-between border-b-[2px] p-4 pr-4">
            <div className="flex items-center">
                <img className="w-12" src={Logo} alt="Tzu Chi Logo" />
                <div>
                    <p className="mb-[-8px] font-bold whitespace-nowrap">
                        Tzu Chi Foundation
                    </p>
                    <p className="text-sm whitespace-nowrap">
                        Information Management System
                    </p>
                </div>
            </div>
            <nav className="hidden md:block">
                <NavLinks />
            </nav>
            <div className="flex flex-col gap-1 md:hidden">
                <span className="block w-5 h-[2.5px] bg-slate-600"></span>
                <span className="block w-5 h-[2px] bg-slate-600"></span>
                <span className="block w-5 h-[2.5px] bg-slate-600"></span>
            </div>
        </header>
    );
}

export default NavBar;

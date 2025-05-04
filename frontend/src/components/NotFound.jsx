import { Link } from "react-router-dom";
import { Icon } from "@iconify/react"; // optional if you're using iconify

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 rounded-full p-4">
                        <Icon icon="fluent:error-circle-24-filled" className="text-red-500 text-5xl" />
                    </div>
                </div>
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg transition"
                >
                    Go Back
                </Link>
            </div>
        </div>
    );
}
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import img from "../../assets/img.jpg";
import { Search } from "lucide-react";

export default function TrackApplication() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="w-[95%] md:w-[80%] mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Track Application
                    </h1>
                    <p className="text-xs md:text-sm text-gray-700">
                        Check the status of your scholarship application for
                        School Year 2026–2027
                    </p>
                </div>

                <div className="mx-auto w-[95%] sm:w-[80%] md:w-[70%] lg:w-[50%] border p-8 rounded-md">
                    <label
                        htmlFor="application_id"
                        className="text-xs sm:text-sm text-gray-700"
                    >
                        Application ID
                    </label>
                    <input
                        type="text"
                        placeholder="Enter application ID"
                        className="mt-1 w-full border text-xs text-slate-800 border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />

                    <button className="mt-3 w-full px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center justify-center gap-2">
                        <Search className="mb-[1px] w-4 h-4 text-white" />
                        Track Application
                    </button>
                </div>
            </div>
        </div>
    );
}

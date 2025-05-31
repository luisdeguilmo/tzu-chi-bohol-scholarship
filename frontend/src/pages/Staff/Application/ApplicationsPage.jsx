import { useState } from "react";
import NewApplications from "./NewApplications";
import RenewalApplications from "./RenewalApplications";

const ApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState("newApplications");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Applications</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("newApplications")}
                        className={`${
                            activeTab === "newApplications"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        New Applications
                    </button>
                    <button
                        onClick={() => setActiveTab("renewalApplications")}
                        className={`${
                            activeTab === "renewalApplications"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Renewal Applications
                    </button>
                </nav>
            </div>

            <div className="py-6">
                {activeTab === "newApplications" && <NewApplications />}
                {activeTab === "renewalApplications" && <RenewalApplications />}
            </div>
        </div>
    );
};

export default ApplicationsPage;
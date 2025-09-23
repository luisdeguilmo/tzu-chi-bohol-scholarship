import { useState } from "react";
import RenewalApplications from "./RenewalApplications";
import PendingActivities from "./PendingActivities";

const ActivitiesPage = () => {
    const [activeTab, setActiveTab] = useState("pendingActivities");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Volunteer Activities</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("pendingActivities")}
                        className={`${
                            activeTab === "pendingActivities"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Activities
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
                {activeTab === "pendingActivities" && <PendingActivities />}
                {activeTab === "renewalApplications" && <RenewalApplications />}
            </div>
        </div>
    );
};

export default ActivitiesPage;
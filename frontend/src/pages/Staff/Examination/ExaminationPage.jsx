import { useState } from "react";
import UnassignedApplicants from "./UnassignedApplicants";
import ExaminationBatches from "./ExaminationBatches";
import ExaminationResult from "./ExaminationResult";

const ExaminationPage = () => {
    const [activeTab, setActiveTab] = useState("applicationList");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Examination List</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("applicationList")}
                        className={`${
                            activeTab === "applicationList"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Unassigned
                    </button>
                    <button
                        onClick={() => setActiveTab("applicationBatches")}
                        className={`${
                            activeTab === "applicationBatches"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Batches
                    </button>
                    <button
                        onClick={() => setActiveTab("examinationResult")}
                        className={`${
                            activeTab === "examinationResult"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Result
                    </button>
                </nav>
            </div>

            <div className="py-6">
                {activeTab === "applicationList" && <UnassignedApplicants />}
                {activeTab === "applicationBatches" && <ExaminationBatches />}
                {activeTab === "examinationResult" && <ExaminationResult />}
            </div>
        </div>
    );
};

export default ExaminationPage;
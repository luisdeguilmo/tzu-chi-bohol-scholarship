import { useState } from "react";
import PostCOA from "./PostCOA";
import PostCOEGrades from "./PostCOEGrades";

const Documents = () => {
    const [activeTab, setActiveTab] = useState("coa");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Scholarship Information</h1>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("coa")}
                        className={`${
                            activeTab === "coa"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Certificate of Appearance
                    </button>
                    <button
                        onClick={() => setActiveTab("coe")}
                        className={`${
                            activeTab === "coe"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Certificate of Enrollment and Grades
                    </button>
                </nav>
            </div>

            <div className="py-6">
                {activeTab === "coa" && <PostCOA />}
                {activeTab === "coe" && <PostCOEGrades />}
            </div>
        </div>
    );
};

export default Documents;
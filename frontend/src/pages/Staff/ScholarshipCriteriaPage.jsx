import { useState } from "react";
import AcceptedCourses from "./AcceptedCourses";
import Procedures from "./Procedures";
import Qualifications from "./Qualifications";
import Requirements from "./Requirements";
import Strands from "./Strands";
import Instruction from "./Instruction";

const ManageScholarshipInfo = () => {
    const [activeTab, setActiveTab] = useState("strands");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Scholarship Criteria
            </h2>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("strands")}
                        className={`${
                            activeTab === "strands"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Strands
                    </button>
                    <button
                        onClick={() => setActiveTab("courses")}
                        className={`${
                            activeTab === "courses"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Courses
                    </button>
                    <button
                        onClick={() => setActiveTab("qualifications")}
                        className={`${
                            activeTab === "qualifications"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Qualifications
                    </button>
                    <button
                        onClick={() => setActiveTab("requirements")}
                        className={`${
                            activeTab === "requirements"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Requirements
                    </button>
                    <button
                        onClick={() => setActiveTab("procedures")}
                        className={`${
                            activeTab === "procedures"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Procedures
                    </button>
                    <button
                        onClick={() => setActiveTab("instructions")}
                        className={`${
                            activeTab === "instructions"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Instructions
                    </button>
                </nav>
            </div>

            <div className="py-6">
                {activeTab === "strands" && <Strands />}
                {activeTab === "courses" && <AcceptedCourses />}
                {activeTab === "qualifications" && <Qualifications />}
                {activeTab === "requirements" && <Requirements />}
                {activeTab === "procedures" && <Procedures />}
                {activeTab === "instructions" && <Instruction />}
            </div>
        </div>
    );
};

export default ManageScholarshipInfo;

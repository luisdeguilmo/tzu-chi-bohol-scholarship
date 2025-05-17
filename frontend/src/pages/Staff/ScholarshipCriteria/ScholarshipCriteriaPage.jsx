import { useState } from "react";
import Strands from "./Strands";
import Courses from "./Courses";
import Qualifications from "./Qualifications";
import Requirements from "./Requirements";
import Procedures from "./Procedures";
import Instruction from "./Instructions";

const ScholarshipCriteriaPage = () => {
    const [activeTab, setActiveTab] = useState("strands");
    const [label, setLabel] = useState("Strand");

    function handleTabChange(label, tab) {
        setLabel(label);
        setActiveTab(tab);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Scholarship Criteria
            </h2>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => handleTabChange("Strand", "strands")}
                        className={`${
                            activeTab === "strands"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Strands
                    </button>
                    <button
                        onClick={() => handleTabChange("Course", "courses")}
                        className={`${
                            activeTab === "courses"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Courses
                    </button>
                    <button
                        onClick={() => handleTabChange("Qualification", "qualifications")}
                        className={`${
                            activeTab === "qualifications"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Qualifications
                    </button>
                    <button
                        onClick={() => handleTabChange("Requirement", "requirements")}
                        className={`${
                            activeTab === "requirements"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Requirements
                    </button>
                    <button
                        onClick={() => handleTabChange("Procedure", "procedures")}
                        className={`${
                            activeTab === "procedures"
                                ? "border-green-500 text-green-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Procedures
                    </button>
                    <button
                        onClick={() => handleTabChange("Instruction", "instructions")}
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
                {activeTab === "strands" && <Strands label={label} />}
                {activeTab === "courses" && <Courses label={label} />}
                {activeTab === "qualifications" && <Qualifications label={label} />}
                {activeTab === "requirements" && <Requirements label={label} />}
                {activeTab === "procedures" && <Procedures label={label} />}
                {activeTab === "instructions" && <Instruction label={label} />}
            </div>
        </div>
    );
};

export default ScholarshipCriteriaPage;

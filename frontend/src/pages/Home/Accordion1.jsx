import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

function Accordions() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [procedure, setProcedure] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [courses, setCourses] = useState([]);
    const [strands, setStrands] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const BASE_URL = "http://localhost:8000";

    // Function to decode HTML entities to plain text
    const decodeHTMLEntities = (text) => {
        if (!text) return "";
        const textArea = document.createElement("textarea");
        textArea.innerHTML = text;
        return textArea.value;
    };

    const fetchStrands = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/app/views/strands.php`);
            const decodedStrands =
                response.data.data?.map((strand) => ({
                    ...strand,
                    strand: decodeHTMLEntities(strand.strand),
                })) || [];
            setStrands(decodedStrands);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching strands data:", err);
            setError("Failed to load strands data. Please try again.");
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/app/views/courses.php`);
            setCourses(response.data.data || []);
        } catch (err) {
            console.error("Error fetching courses data:", err);
        }
    };

    const fetchInstructions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/app/views/instructions.php`);
            setInstructions(response.data.data || []);
        } catch (err) {
            console.error("Error fetching instructions data:", err);
        }
    };

    const fetchQualifications = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/app/views/qualifications.php`);
            setQualifications(response.data.data || []);
        } catch (err) {
            console.error("Error fetching qualifications data:", err);
        }
    };

    const fetchRequirements = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/app/views/requirements.php`);
            setRequirements(response.data.data || []);
        } catch (err) {
            console.error("Error fetching requirements data:", err);
        }
    };

    const fetchProcedure = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/app/views/procedures.php`);
            setProcedure(response.data.data || []);
        } catch (err) {
            console.error("Error fetching procedure data:", err);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchStrands(),
                fetchCourses(),
                fetchInstructions(),
                fetchQualifications(),
                fetchRequirements(),
                fetchProcedure(),
            ]);
        };
        fetchAllData();
    }, []);

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const goToStep = (index) => {
        if (index !== currentStep) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(index);
                setIsAnimating(false);
            }, 150);
        }
    };

    const tableStyle = "border-[1px] border-gray-300 p-2";
    let courseLength = courses.length;

    const steps = [
        {
            id: 1,
            title: "Track & Courses",
            description: "Review the available tracks and courses",
            content: (
                <>
                    <h3 className="font-bold text-xl text-center text-gray-800 mb-6">
                        Senior High School Track Legend
                    </h3>
                    <ul className="my-6 list-none list-inside columns-2 text-sm space-y-3">
                        {strands.map((strand, index) => (
                            <li key={index} className="text-xs">
                                <span className="font-bold text-green-700">
                                    {strand.strand}
                                </span>{" "}
                                -{" "}
                                <span className="text-gray-700">
                                    {strand.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <h3 className="font-bold text-xl text-center text-gray-800 mt-8 mb-6">
                        List of Courses Accepted for College
                    </h3>
                    <ul
                        className={`mt-6 mb-4 list-none list-inside text-xs space-y-2 text-gray-700 ${
                            courseLength <= 10
                                ? "columns-1"
                                : courseLength <= 20
                                  ? "columns-2"
                                  : "columns-3"
                        }`}
                    >
                        {courses.map((course, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                <span>{course.course}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ),
        },
        {
            id: 2,
            title: "Qualifications",
            description: "Check if you meet the requirements",
            content: (
                <ul className="list-none space-y-4 text-gray-800">
                    {qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                                {index + 1}
                            </div>
                            <span className="text-sm leading-relaxed">{qualification.qualification}</span>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            id: 3,
            title: "Requirements",
            description: "Prepare the necessary documents",
            content: (
                <div className="overflow-x-auto">
                    <table className={`w-full ${tableStyle} text-gray-800`}>
                        <thead className="bg-green-50">
                            <tr className={tableStyle}>
                                <th colSpan={3} className={`${tableStyle} text-base`}>
                                    Requirements
                                </th>
                            </tr>
                            <tr className={tableStyle}>
                                <th className={`${tableStyle} text-sm`}>Quantity</th>
                                <th className={`${tableStyle} text-sm`}>Description</th>
                                <th className={`${tableStyle} text-sm`}>Submit During</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {requirements.map((requirement, index) => (
                                <tr key={index} className={`${tableStyle} hover:bg-gray-50`}>
                                    <td className={`${tableStyle} text-center font-semibold`}>
                                        {requirement.quantity}
                                    </td>
                                    <td className={tableStyle}>
                                        {requirement.description}
                                    </td>
                                    <td className={tableStyle}>
                                        {requirement.submit}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ),
        },
        {
            id: 4,
            title: "Procedure",
            description: "Follow the enrollment process",
            content: (
                <ul className="list-none space-y-4 text-gray-800">
                    {procedure.map((pro, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                                {index + 1}
                            </div>
                            <span className="text-sm leading-relaxed">{pro.procedure}</span>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            id: 5,
            title: "Instructions",
            description: "Important notes and guidelines",
            content: (
                <ul className="list-none space-y-4 text-gray-800">
                    {instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold mt-0.5">
                                {index + 1}
                            </div>
                            <span className="text-sm leading-relaxed">{instruction.instruction}</span>
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading enrollment guide...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <p className="text-red-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Enrollment Guide
                    </h1>
                    <p className="text-gray-600">Follow these steps to complete your enrollment</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center relative z-10">
                                    <button
                                        onClick={() => goToStep(index)}
                                        className={`w-10 h-10 rounded-full flex items-center text-xs justify-center font-bold transition-all duration-300 ${
                                            index < currentStep
                                                ? "bg-green-600 text-white"
                                                : index === currentStep
                                                  ? "bg-green-600 text-white ring-4 ring-green-200 scale-110"
                                                  : "bg-gray-200 text-gray-500"
                                        } hover:scale-105`}
                                    >
                                        {index < currentStep ? (
                                            <Check size={20} />
                                        ) : (
                                            index + 1
                                        )}
                                    </button>
                                    <p
                                        className={`text-xs mt-2 text-center transition-colors duration-300 ${
                                            index === currentStep
                                                ? "text-green-700 font-semibold"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 transition-all duration-500 ${
                                            index < currentStep
                                                ? "bg-green-600"
                                                : "bg-gray-200"
                                        }`}
                                        style={{
                                            marginTop: "-1.5rem",
                                            marginLeft: "-0.1rem",
                                            marginRight: "-0.1rem",
                                        }}
                                    ></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                        <h2 className="text-2xl font-bold text-white">
                            Step {currentStep + 1}: {steps[currentStep].title}
                        </h2>
                        <p className="text-green-100 mt-1">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    <div
                        className={`p-8 transition-all duration-300 ${
                            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                        }`}
                    >
                        {steps[currentStep].content}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
                        <button
                            onClick={goToPreviousStep}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-sm px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                currentStep === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-green-600 hover:text-green-600"
                            }`}
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>

                        <div className="text-sm text-gray-600">
                            Step {currentStep + 1} of {steps.length}
                        </div>

                        <button
                            onClick={goToNextStep}
                            disabled={currentStep === steps.length - 1}
                            className={`flex items-center gap-2 text-sm px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                currentStep === steps.length - 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                            }`}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accordions;
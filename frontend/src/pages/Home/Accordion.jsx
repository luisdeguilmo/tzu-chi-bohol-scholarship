import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

function Accordion() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [procedure, setProcedure] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [courses, setCourses] = useState([]);
    const [strands, setStrands] = useState([]);
    const [instructions, setInstructions] = useState([]);

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
            const response = await axios.get(
                `http://localhost:8000/app/views/strands.php`
            );

            const decodedStrands =
                response.data.data?.map((strand) => ({
                    ...strand,
                    strand: decodeHTMLEntities(strand.strand),
                })) || [];

            // Fix 2: Access the correct property in the response
            setStrands(decodedStrands);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching strands data:", err);
            setError("Failed to load strands data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStrands();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/courses.php`
            );
            // Fix 2: Access the correct property in the response
            setCourses(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching courses data:", err);
            setError("Failed to load courses data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    let courseLength = courses.length;

    const fetchInstructions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/instructions.php`
            );
            // Fix 2: Access the correct property in the response
            setInstructions(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching instructions data:", err);
            setError("Failed to load instructions data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructions();
    }, []);

    const fetchQualifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/qualifications.php`
            );
            // Fix 2: Access the correct property in the response
            setQualifications(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching qualifications data:", err);
            setError("Failed to load qualifications data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQualifications();
    }, []);

    const fetchRequirements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/requirements.php`
            );
            // Fix 2: Access the correct property in the response
            setRequirements(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching qualifications data:", err);
            setError("Failed to load qualifications data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchProcedure = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/procedures.php`
            );
            // Fix 2: Access the correct property in the response
            setProcedure(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching qualifications data:", err);
            setError("Failed to load qualifications data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcedure();
    }, []);

    // State to track the currently open accordion
    const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

    const toggleAccordion = (index) => {
        // If the clicked accordion is already open, close it
        if (openAccordionIndex === index) {
            setOpenAccordionIndex(null);
        } else {
            // Otherwise, open the clicked accordion
            setOpenAccordionIndex(index);
        }
    };

    const tableStyle = "border-[1px] border-gray-300 p-2";

    const accordionData = [
        {
            id: 1,
            title: "SHS Track Legend & College Courses",
            content: (
                <>
                    <h3 className="font-bold text-center">
                        Senior High School Track Legend
                    </h3>
                    <ul className="my-6 list-none list-inside columns-2 text-sm space-y-2">
                        {strands.map((strand, index) => (
                            <li key={index}>{strand.strand}</li>
                        ))}
                    </ul>
                    <h3 className="font-bold text-center">
                        List of Courses Accepted for College
                    </h3>
                    <ul
                        className={`mt-6 mb-4 list-none list-inside text-sm space-y-2 ${
                            courseLength <= 10
                                ? "columns-1"
                                : courseLength <= 20
                                ? "columns-2"
                                : "columns-3"
                        }`}
                    >
                        {courses.map((course, index) => (
                            <li key={index}>
                                {course.course_name}
                            </li>
                        ))}
                    </ul>
                </>
            ),
        },
        {
            id: 2,
            title: "Qualifications",
            content: (
                <ul className="list-decimal list-inside text-sm space-y-2">
                    {qualifications.map((qualification, index) => (
                        <li key={index}>{qualification.qualification}</li>
                    ))}
                </ul>
            ),
        },
        {
            id: 3,
            title: "Requirements",
            content: (
                <table className={`w-full ${tableStyle} text-gray-700`}>
                    <thead>
                        <tr className={tableStyle}>
                            <th colSpan={3} className={tableStyle}>
                                Requirements
                            </th>
                        </tr>
                        <tr className={tableStyle}>
                            <th className={tableStyle}>Quantity</th>
                            <th className={tableStyle}>Description</th>
                            <th className={tableStyle}>Submit During</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {requirements.map((requirement, index) => (
                            <tr key={index} className={tableStyle}>
                                <td className={tableStyle}>
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
            ),
        },
        {
            id: 4,
            title: "Procedure",
            content: (
                <ul className="list-decimal list-inside text-sm space-y-2">
                    {procedure.map((pro, index) => (
                        <li key={index}>{pro.procedure}</li>
                    ))}
                </ul>
            ),
        },
        {
            id: 5,
            title: "Instruction",
            content: (
                <ul className="list-decimal list-inside text-sm space-y-2">
                    {instructions.map((instruction, index) => (
                        <li key={index}>{instruction.instruction}</li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <div className="bg-white">
            {accordionData.map((accordion, index) => (
                <div
                    key={accordion.id}
                    className="border-b border-gray-300 last:border-0"
                >
                    <button
                        className={`w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 ${
                            openAccordionIndex === index
                                ? "bg-green-50 border-l-4 border-green-500"
                                : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={openAccordionIndex === index}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex bg-green-500 text-white items-center justify-center w-8 h-8 rounded-full`}
                            >
                                {index + 1}
                            </div>
                            <span className="font-semibold">
                                {accordion.title}
                            </span>
                        </div>
                        {openAccordionIndex === index ? (
                            <ChevronUp className="text-green-500" size={20} />
                        ) : (
                            <ChevronDown className="text-gray-500" size={20} />
                        )}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openAccordionIndex === index
                                ? "max-h-full"
                                : "max-h-0"
                        }`}
                        aria-hidden={openAccordionIndex !== index}
                    >
                        <div className="p-6 bg-white">{accordion.content}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Accordion;

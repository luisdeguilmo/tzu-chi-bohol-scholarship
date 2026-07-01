import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import BASE_URL from "../../config";

const Loader = () => (
    <div className="mb-4 flex flex-col items-center gap-4">
        <div className="flex items-end gap-1 h-10">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-1.5 bg-emerald-500 rounded-full animate-bounce"
                    style={{
                        height: "7px",
                        animationDelay: `${i * 100}ms`,
                    }}
                />
            ))}
        </div>

        <p className="text-sm text-slate-500">Loading data...</p>
    </div>
);

function Accordion() {
    const [error, setError] = useState(null);

    const [strands, setStrands] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [procedure, setProcedure] = useState([]);

    const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

    const [loadingState, setLoadingState] = useState({
        strands: true,
        courses: true,
        instructions: true,
        qualifications: true,
        requirements: true,
        procedure: true,
    });

    const setLoading = (key, value) => {
        setLoadingState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const decodeHTMLEntities = (text) => {
        if (!text) return "";
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                /* STRANDS */
                setLoading("strands", true);
                const strandsRes = await axios.get(
                    `${BASE_URL}/app/api/strands.php`,
                );
                setStrands(
                    strandsRes.data.data?.map((s) => ({
                        ...s,
                        strand: decodeHTMLEntities(s.strand),
                    })) || [],
                );
                setLoading("strands", false);

                /* COURSES */
                setLoading("courses", true);
                const coursesRes = await axios.get(
                    `${BASE_URL}/app/api/course-visibility.php`,
                );
                setCourses(coursesRes.data.data || []);
                setLoading("courses", false);

                /* INSTRUCTIONS */
                setLoading("instructions", true);
                const instRes = await axios.get(
                    `${BASE_URL}/app/api/instructions.php`,
                );
                setInstructions(instRes.data.data || []);
                setLoading("instructions", false);

                /* QUALIFICATIONS */
                setLoading("qualifications", true);
                const qualRes = await axios.get(
                    `${BASE_URL}/app/api/qualifications.php`,
                );
                setQualifications(qualRes.data.data || []);
                setLoading("qualifications", false);

                /* REQUIREMENTS */
                setLoading("requirements", true);
                const reqRes = await axios.get(
                    `${BASE_URL}/app/api/requirements.php`,
                );
                setRequirements(reqRes.data.data || []);
                setLoading("requirements", false);

                /* PROCEDURE */
                setLoading("procedure", true);
                const procRes = await axios.get(
                    `${BASE_URL}/app/api/procedures.php`,
                );
                setProcedure(procRes.data.data || []);
                setLoading("procedure", false);
            } catch (err) {
                console.error(err);
                setError("Failed to load data.");
            }
        };

        fetchAll();
    }, []);

    /* ---------------- TOGGLE ---------------- */

    const toggleAccordion = (index) => {
        setOpenAccordionIndex((prev) => (prev === index ? null : index));
    };

    const tableStyle = "border border-gray-300 p-3";
    const courseLength = courses.length;

    /* ---------------- ACCORDION DATA ---------------- */

    const accordionData = [
        {
            id: 1,
            title: "SHS Track Legend & College Courses",
            content:
                loadingState.strands || loadingState.courses ? (
                    <Loader />
                ) : (
                    <>
                        <h3 className="font-bold text-center text-gray-800">
                            Senior High School Tracks
                        </h3>

                        <ul className="my-6 columns-1 md:columns-2 space-y-2 text-xs md:text-sm">
                            {strands.map((s, i) => (
                                <li key={i}>
                                    <span className="font-bold text-gray-800">
                                        {s.strand}
                                    </span>{" "}
                                    -{" "}
                                    <span className="text-gray-700">
                                        {s.description}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-center text-gray-800">
                            College Courses
                        </h3>

                        <ul className="mt-6 space-y-2 text-xs md:text-sm text-gray-700">
                            {courses.map((c, i) => (
                                <li key={i}>{c.course}</li>
                            ))}
                        </ul>
                    </>
                ),
        },

        {
            id: 2,
            title: "Qualifications",
            content: loadingState.qualifications ? (
                <Loader />
            ) : (
                <ul className="list-decimal list-inside space-y-2 text-gray-700 text-xs md:text-sm">
                    {qualifications.map((q, i) => (
                        <li key={i}>{q.qualification}</li>
                    ))}
                </ul>
            ),
        },

        {
            id: 3,
            title: "Requirements",
            content: loadingState.requirements ? (
                <Loader />
            ) : (
                <table className={`w-full ${tableStyle}`}>
                    <thead>
                        <tr className="text-gray-800 text-sm md:text-lg">
                            <th className={tableStyle}>Qty</th>
                            <th className={tableStyle}>Description</th>
                            <th className={tableStyle}>Submit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map((r, i) => (
                            <tr
                                key={i}
                                className="text-gray-700 text-xs md:text-sm"
                            >
                                <td className={tableStyle}>{r.quantity}</td>
                                <td className={tableStyle}>{r.description}</td>
                                <td className={tableStyle}>{r.submit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ),
        },

        {
            id: 4,
            title: "Application Procedure",
            content: loadingState.procedure ? (
                <Loader />
            ) : (
                <ul className="list-decimal list-inside space-y-2 text-gray-700 text-xs md:text-sm">
                    {procedure.map((p, i) => (
                        <li key={i}>{p.procedure}</li>
                    ))}
                </ul>
            ),
        },

        {
            id: 5,
            title: "Instructions",
            content: loadingState.instructions ? (
                <Loader />
            ) : (
                <ul className="list-decimal list-inside space-y-2 text-gray-700 text-xs md:text-sm">
                    {instructions.map((ins, i) => (
                        <li key={i}>{ins.instruction}</li>
                    ))}
                </ul>
            ),
        },
    ];

    /* ---------------- ERROR ---------------- */

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="bg-white">
            {accordionData.map((acc, index) => (
                <div key={acc.id} className="border-b border-gray-300">
                    <button
                        onClick={() => toggleAccordion(index)}
                        className={`flex w-full items-center justify-between px-4 py-6 text-left ${
                            openAccordionIndex === index
                                ? "bg-green-50 border-l-4 border-green-500"
                                : "hover:bg-gray-50"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                {index + 1}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-800 font-semibold">
                                {acc.title}
                            </span>
                        </div>

                        {openAccordionIndex === index ? (
                            <ChevronUp className="text-green-600" />
                        ) : (
                            <ChevronDown className="text-gray-400/60" />
                        )}
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openAccordionIndex === index
                                ? "max-h-[2000px]"
                                : "max-h-0"
                        }`}
                    >
                        <div className="p-6">{acc.content}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Accordion;

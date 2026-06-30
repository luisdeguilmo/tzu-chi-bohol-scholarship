// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import BASE_URL from "../../config";

// function Accordion() {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [procedure, setProcedure] = useState([]);
//     const [requirements, setRequirements] = useState([]);
//     const [qualifications, setQualifications] = useState([]);
//     const [courses, setCourses] = useState([]);
//     const [strands, setStrands] = useState([]);
//     const [instructions, setInstructions] = useState([]);

//     // Function to decode HTML entities to plain text
//     const decodeHTMLEntities = (text) => {
//         if (!text) return "";
//         const textArea = document.createElement("textarea");
//         textArea.innerHTML = text;
//         return textArea.value;
//     };

//     const fetchStrands = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}/app/api/strands.php`
//             );

//             const decodedStrands =
//                 response.data.data?.map((strand) => ({
//                     ...strand,
//                     strand: decodeHTMLEntities(strand.strand),
//                 })) || [];

//             // Fix 2: Access the correct property in the response
//             setStrands(decodedStrands);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching strands data:", err);
//             setError("Failed to load strands data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchStrands();
//     }, []);

//     const fetchCourses = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}app/api/courses.php`
//             );
//             // Fix 2: Access the correct property in the response
//             setCourses(response.data.data || []);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching courses data:", err);
//             setError("Failed to load courses data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, []);

//     let courseLength = courses.length;

//     const fetchInstructions = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}app/api/instructions.php`
//             );
//             // Fix 2: Access the correct property in the response
//             setInstructions(response.data.data || []);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching instructions data:", err);
//             setError("Failed to load instructions data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchInstructions();
//     }, []);

//     const fetchQualifications = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}app/api/qualifications.php`
//             );
//             // Fix 2: Access the correct property in the response
//             setQualifications(response.data.data || []);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching qualifications data:", err);
//             setError("Failed to load qualifications data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchQualifications();
//     }, []);

//     const fetchRequirements = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}app/api/requirements.php`
//             );
//             // Fix 2: Access the correct property in the response
//             setRequirements(response.data.data || []);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching qualifications data:", err);
//             setError("Failed to load qualifications data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchRequirements();
//     }, []);

//     const fetchProcedure = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(
//                 `${BASE_URL}app/api/procedures.php`
//             );
//             // Fix 2: Access the correct property in the response
//             setProcedure(response.data.data || []);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching qualifications data:", err);
//             setError("Failed to load qualifications data. Please try again.");
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProcedure();
//     }, []);

//     // State to track the currently open accordion
//     const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

//     const toggleAccordion = (index) => {
//         // If the clicked accordion is already open, close it
//         if (openAccordionIndex === index) {
//             setOpenAccordionIndex(null);
//         } else {
//             // Otherwise, open the clicked accordion
//             setOpenAccordionIndex(index);
//         }
//     };

//     const tableStyle = "border-[1px] border-gray-300 p-3";

//     const accordionData = [
//         {
//             id: 1,
//             title: "SHS Track Legend & College Courses",
//             content: (
//                 <>
//                     <h3 className="font-bold text-center text-gray-800">
//                         Senior High School Track Legend
//                     </h3>
//                     <ul className="my-6 list-none list-inside columns-2 text-sm space-y-2">
//                         {strands.map((strand, index) => (
//                             <li key={index} className="text-xs md:text-sm">
//                                 <span className="font-bold text-gray-800">
//                                     {strand.strand}
//                                 </span>{" "}
//                                 -{" "}
//                                 <span className="text-gray-600">
//                                     {strand.description}
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>
//                     <h3 className="font-bold text-center text-gray-800">
//                         List of Courses Accepted for College
//                     </h3>
//                     <ul
//                         className={`mt-6 mb-4 list-none list-inside text-xs md:text-sm space-y-2 text-gray-600 ${
//                             courseLength <= 10
//                                 ? "md:columns-1 columns-1"
//                                 : courseLength <= 20
//                                   ? "md:columns-2 columns-1"
//                                   : "md:columns-3 columns-1"
//                         }`}
//                     >
//                         {courses.map((course, index) => (
//                             <li key={index} className="flex items-center gap-2">
//                                 <div className="w-[5px] h-[5px] rounded-full bg-green-600"></div>
//                                 {course.course}
//                             </li>
//                         ))}
//                     </ul>
//                 </>
//             ),
//         },
//         {
//             id: 2,
//             title: "Qualifications",
//             content: (
//                 <ul className="list-decimal list-inside text-xs md:text-sm space-y-2 text-gray-600">
//                     {qualifications.map((qualification, index) => (
//                         <li key={index}>{qualification.qualification}</li>
//                     ))}
//                 </ul>
//             ),
//         },
//         {
//             id: 3,
//             title: "Requirements",
//             content: (
//                 <table className={`w-full ${tableStyle} text-gray-800`}>
//                     <thead className="text-sm">
//                         <tr className={tableStyle}>
//                             <th colSpan={3} className={tableStyle}>
//                                 Requirements
//                             </th>
//                         </tr>
//                         <tr className={tableStyle}>
//                             <th className={tableStyle}>Quantity</th>
//                             <th className={tableStyle}>Description</th>
//                             <th className={tableStyle}>Submit During</th>
//                         </tr>
//                     </thead>
//                     <tbody className="text-sm text-gray-600">
//                         {requirements.map((requirement, index) => (
//                             <tr key={index} className={`text-xs md:text-sm ${tableStyle}`}>
//                                 <td className={`${tableStyle} text-center`}>
//                                     {requirement.quantity}
//                                 </td>
//                                 <td className={tableStyle}>
//                                     {requirement.description}
//                                 </td>
//                                 <td className={tableStyle}>
//                                     {requirement.submit}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ),
//         },
//         {
//             id: 4,
//             title: "Procedure",
//             content: (
//                 <ul className="list-decimal list-inside text-xs md:text-sm space-y-2 text-gray-600">
//                     {procedure.map((pro, index) => (
//                         <li key={index}>{pro.procedure}</li>
//                     ))}
//                 </ul>
//             ),
//         },
//         {
//             id: 5,
//             title: "Instruction",
//             content: (
//                 <ul className="list-decimal list-inside text-xs md:text-sm space-y-2 text-gray-600">
//                     {instructions.map((instruction, index) => (
//                         <li key={index}>{instruction.instruction}</li>
//                     ))}
//                 </ul>
//             ),
//         },
//     ];

//     return (
//         <div className="bg-white">
//             {accordionData.map((accordion, index) => (
//                 <div
//                     key={accordion.id}
//                     className="border-b border-gray-300 last:border-0"
//                 >
//                     <button
//                         className={`w-full flex items-center justify-between px-4 py-6 text-left font-medium text-gray-800 ${
//                             openAccordionIndex === index
//                                 ? "bg-green-50 border-l-4 border-green-500"
//                                 : "hover:bg-gray-50"
//                         }`}
//                         onClick={() => toggleAccordion(index)}
//                         aria-expanded={openAccordionIndex === index}
//                     >
//                         <div className="flex items-center gap-3">
//                             <div
//                                 className={`flex bg-green-600 text-white items-center justify-center w-8 h-8 rounded-full`}
//                             >
//                                 {index + 1}
//                             </div>
//                             <span className="text-sm font-semibold">
//                                 {accordion.title}
//                             </span>
//                         </div>
//                         {openAccordionIndex === index ? (
//                             <ChevronUp className="text-green-600" size={20} />
//                         ) : (
//                             <ChevronDown className="text-gray-500" size={20} />
//                         )}
//                     </button>
//                     <div
//                         className={`overflow-hidden transition-all duration-300 ${
//                             openAccordionIndex === index
//                                 ? "max-h-full"
//                                 : "max-h-0"
//                         }`}
//                         aria-hidden={openAccordionIndex !== index}
//                     >
//                         <div className="p-6 bg-white">{accordion.content}</div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default Accordion;
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

/* ---------------- MAIN COMPONENT ---------------- */

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

    /* ---------------- FETCH ALL DATA ---------------- */

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

                        <ul className="my-6 columns-2 space-y-2 text-gray-700 text-xs md:text-sm">
                            {strands.map((s, i) => (
                                <li key={i}>
                                    <span className="font-bold">
                                        {s.strand}
                                    </span>{" "}
                                    - {s.description}
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-center text-gray-800">
                            College Courses
                        </h3>

                        <ul className="mt-6 space-y-2 text-xs md:text-sm text-gray-700">
                            {courses.map((c, i) => (
                                <li key={i}>• {c.course}</li>
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
            title: "Procedure",
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
            title: "Instruction",
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
                            <span className="text-sm text-gray-800 font-semibold">
                                {acc.title}
                            </span>
                        </div>

                        {openAccordionIndex === index ? (
                            <ChevronUp className="text-green-600" />
                        ) : (
                            <ChevronDown className="text-gray-500" />
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

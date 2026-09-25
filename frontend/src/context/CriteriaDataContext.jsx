import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import BASE_URL from "../config";

const CriteriaDataContext = createContext();

export const useCriteriaDataContext = () => useContext(CriteriaDataContext);

export const CriteriaDataProvider = ({ children }) => {
    const [strands, setStrands] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [procedure, setProcedure] = useState([]);

    const [loadingState, setLoadingState] = useState({
        strands: true,
        courses: true,
        instructions: true,
        qualifications: true,
        requirements: true,
        procedure: true,
    });

    const value = {
        loadingState,
        strands,
        courses,
        instructions,
        qualifications,
        requirements,
        procedure,
    };

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
                // setError("Failed to load data.");
            }
        };

        fetchAll();
    }, []);

    return (
        <CriteriaDataContext.Provider value={value}>
            {children}
        </CriteriaDataContext.Provider>
    );
};

import { createContext, useContext } from "react";
import { useSchoolYears } from "../hooks/useSchoolYears";

const SchoolYearContext = createContext();

export const useSchoolYearContext = () => useContext(SchoolYearContext);

export const SchoolYearProvider = ({ children }) => {
    const schoolYearData = useSchoolYears();

    return (
        <SchoolYearContext.Provider value={schoolYearData}>
            {children}
        </SchoolYearContext.Provider>
    );
};

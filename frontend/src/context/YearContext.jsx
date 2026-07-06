import { createContext, useContext } from "react";
import { useYears } from "../hooks/useYear";

const YearContext = createContext();

export const useYearContext = () => useContext(YearContext);

export const YearProvider = ({ children }) => {
    const yearData = useYears();

    return (
        <YearContext.Provider value={yearData}>
            {children}
        </YearContext.Provider>
    );
};

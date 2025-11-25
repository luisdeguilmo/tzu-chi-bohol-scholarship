import { createContext, useContext, useState } from "react";

const ApplicationFormContext = createContext();

export const useApplicationForm = () => {
    const context = useContext(ApplicationFormContext);
    if (!context) {
        throw new Error(
            "useApplicationForm must be used within ApplicationFormProvider"
        );
    }
    return context;
};

export const ApplicationFormProvider = ({ children }) => {
    const [isTzuChiSiblingsApplicable, setIsTzuChiSiblingsApplicable] =
        useState(null);
    const [isOtherAssistanceApplicable, setIsOtherAssistanceApplicable] =
        useState(null);
    const [isSiblingsApplicable, setIsSiblingsApplicable] = useState(null);

    const value = {
        isSiblingsApplicable,
        setIsSiblingsApplicable,
        isTzuChiSiblingsApplicable,
        isOtherAssistanceApplicable,
        setIsTzuChiSiblingsApplicable,
        setIsOtherAssistanceApplicable,
    };

    return (
        <ApplicationFormContext.Provider value={value}>
            {children}
        </ApplicationFormContext.Provider>
    );
};

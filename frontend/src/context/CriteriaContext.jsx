import { createContext, useContext, useState } from "react";

const CriteriaContext = createContext();

export const useCriteria = () => {
    const context = useContext(CriteriaContext);
    if (!context) {
        throw new Error("useCriteria must be used within CriteriaProvider");
    }
    return context;
};

export const CriteriaProvider = ({ children }) => {
    const [id, setId] = useState("");
    const [text, setText] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [submit, setSubmit] = useState("");

    const value = {
        id,
        text,
        quantity,
        description,
        submit,
        setId,
        setText,
        setQuantity,
        setDescription,
        setSubmit,
    };

    return (
        <CriteriaContext.Provider value={value}>
            {children}
        </CriteriaContext.Provider>
    );
};

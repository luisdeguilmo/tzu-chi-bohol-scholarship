import { createContext, useContext, useState } from "react";

const BatchContext = createContext();

export const useBatch = () => {
    const context = useContext(BatchContext);
    if (!context) {
        throw new Error("useBatch must be within Batch Provider");
    }
    return context;
};

export const BatchProvider = ({ children }) => {
    const [pageNum, setPageNum] = useState(1);
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("Batch 1");
    const [selectedBatchInBatches, setSelectedBatchInBatches] = useState("all");

    const value = {
        selectedApplicants,
        setSelectedApplicants,
        pageNum,
        setPageNum,
        selectedBatchInBatches,
        setSelectedBatchInBatches,
        selectedBatch,
        setSelectedBatch,
    };

    return (
        <BatchContext.Provider value={value}>{children}</BatchContext.Provider>
    );
};

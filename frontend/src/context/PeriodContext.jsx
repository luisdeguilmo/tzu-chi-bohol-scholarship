import { useState } from "react";
import { createContext, useContext } from "react";

const PeriodContext = createContext();

export const usePeriod = () => {
    const context = useContext(PeriodContext);
    if (!context) {
        throw new Error("usePeriod must be used within PeriodProvider");
    }
    return context;
};

export const PeriodProvider = ({ children }) => {
    const [id, setId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [status, setStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const value = {
        id,
        startDate,
        endDate,
        announcementMessage,
        status,
        isModalOpen,
        isEditing,
        setId,
        setStartDate,
        setEndDate,
        setAnnouncementMessage,
        setStatus,
        setIsModalOpen,
        setIsEditing,
    };

    return (
        <PeriodContext.Provider value={value}>
            {children}
        </PeriodContext.Provider>
    );
};

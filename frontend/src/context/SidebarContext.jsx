import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useCriteria must be used within SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState("");

    const value = {
        activeTab,
        setActiveTab,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

import { AuthProvider } from "./AuthContext";
import { BatchProvider } from "./BatchContext";
import { CriteriaProvider } from "./CriteriaContext";
import { PeriodProvider } from "./PeriodContext";
import { SidebarProvider } from "./SidebarContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <SidebarProvider>
                <BatchProvider>
                    <CriteriaProvider>
                        <PeriodProvider>{children}</PeriodProvider>
                    </CriteriaProvider>
                </BatchProvider>
            </SidebarProvider>
        </AuthProvider>
    );
};

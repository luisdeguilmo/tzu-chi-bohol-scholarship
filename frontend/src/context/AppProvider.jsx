import { ApplicationFormProvider } from "./ApplicationFormContext";
import { AuthProvider } from "./AuthContext";
import { BatchProvider } from "./BatchContext";
import { CriteriaProvider } from "./CriteriaContext";
import { PeriodProvider } from "./PeriodContext";
import { SidebarProvider } from "./SidebarContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ApplicationFormProvider>
                <SidebarProvider>
                    <BatchProvider>
                        <CriteriaProvider>
                            <PeriodProvider>{children}</PeriodProvider>
                        </CriteriaProvider>
                    </BatchProvider>
                </SidebarProvider>
            </ApplicationFormProvider>
        </AuthProvider>
    );
};

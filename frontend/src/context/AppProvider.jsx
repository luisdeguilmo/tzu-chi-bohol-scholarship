import { ApplicationFormProvider } from "./ApplicationFormContext";
import { AuthProvider } from "./AuthContext";
import { BatchProvider } from "./BatchContext";
import { CriteriaProvider } from "./CriteriaContext";
import { PeriodProvider } from "./PeriodContext";
import { SidebarProvider } from "./SidebarContext";
import { SchoolYearProvider } from "./SchoolYearContext";
import { YearProvider } from "./YearContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ApplicationFormProvider>
                <SidebarProvider>
                    <BatchProvider>
                        <CriteriaProvider>
                            <PeriodProvider>
                                <SchoolYearProvider>
                                    <YearProvider>{children}</YearProvider>
                                </SchoolYearProvider>
                            </PeriodProvider>
                        </CriteriaProvider>
                    </BatchProvider>
                </SidebarProvider>
            </ApplicationFormProvider>
        </AuthProvider>
    );
};

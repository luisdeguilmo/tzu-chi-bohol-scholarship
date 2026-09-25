import { ApplicationFormProvider } from "./ApplicationFormContext";
import { AuthProvider } from "./AuthContext";
import { BatchProvider } from "./BatchContext";
import { CriteriaProvider } from "./CriteriaContext";
import { PeriodProvider } from "./PeriodContext";
import { SidebarProvider } from "./SidebarContext";
import { SchoolYearProvider } from "./SchoolYearContext";
import { YearProvider } from "./YearContext";
import { CriteriaDataProvider } from "./CriteriaDataContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ApplicationFormProvider>
                <SidebarProvider>
                    <BatchProvider>
                        <CriteriaDataProvider>
                            <CriteriaProvider>
                                <PeriodProvider>
                                    <SchoolYearProvider>
                                        <YearProvider>{children}</YearProvider>
                                    </SchoolYearProvider>
                                </PeriodProvider>
                            </CriteriaProvider>
                        </CriteriaDataProvider>
                    </BatchProvider>
                </SidebarProvider>
            </ApplicationFormProvider>
        </AuthProvider>
    );
};

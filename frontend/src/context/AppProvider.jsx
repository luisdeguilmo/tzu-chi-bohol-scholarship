import { AuthProvider } from "./AuthContext";
import { BatchProvider } from "./BatchContext";
import { CriteriaProvider } from "./CriteriaContext";
import { PeriodProvider } from "./PeriodContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <BatchProvider>
                <CriteriaProvider>
                    <PeriodProvider>{children}</PeriodProvider>
                </CriteriaProvider>
            </BatchProvider>
        </AuthProvider>
    );
};

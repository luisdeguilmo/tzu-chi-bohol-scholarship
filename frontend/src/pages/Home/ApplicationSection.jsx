// import { NewApplicationForm, RenewalApplicationForm } from "./ApplicationForm";

import { useLocation } from "react-router-dom";
import {
    NewApplicationForm,
    RenewalApplicationForm,
} from "./ApplicationForm/ApplicationFormPage";

function ApplicationSection() {
    return (
        <div className="py-16 bg-white">
            <NewApplicationForm />
        </div>
    );
}

function RenewalApplicationSection() {
    const location = useLocation();

    return (
        <div className="py-5 bg-white">
            <RenewalApplicationForm />
        </div>
    );
}

export { ApplicationSection, RenewalApplicationSection };

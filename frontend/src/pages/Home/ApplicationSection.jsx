// import { NewApplicationForm, RenewalApplicationForm } from "./ApplicationForm";

import { useLocation } from "react-router-dom";
import {
    NewApplicationForm,
    RenewalApplicationForm,
} from "./ApplicationForm/ApplicationFormPage";

function ApplicationSection() {
    return (
        <div className="py-24 bg-white">
            <NewApplicationForm />
        </div>
    );
}

function RenewalApplicationSection() {
    const location = useLocation();
    let userId = location.state?.id;

    console.log(userId);

    return (
        <div className="py-5 bg-white">
            <RenewalApplicationForm userId={userId} />
        </div>
    );
}

export { ApplicationSection, RenewalApplicationSection };

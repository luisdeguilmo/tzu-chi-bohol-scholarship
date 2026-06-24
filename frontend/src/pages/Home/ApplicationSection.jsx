// import { NewApplicationForm, RenewalApplicationForm } from "./ApplicationForm";

import { useLocation } from "react-router-dom";
import {
    NewApplicationForm,
    RenewalApplicationForm,
} from "./ApplicationForm/ApplicationFormPage";

function ApplicationSection() {
    return (
        <div className="py-16 bg-white">
            <NewApplicationForm isForExistingScholar={false} />
        </div>
    );
}

function AddExistingScholarSection({ onClose }) {
    return (
        <div className="pb-8 bg-white">
            <NewApplicationForm isForExistingScholar={true} onClose={onClose} />
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

export { ApplicationSection, AddExistingScholarSection, RenewalApplicationSection };

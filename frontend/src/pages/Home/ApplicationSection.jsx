import { NewApplicationForm, RenewalApplicationForm } from "./ApplicationForm";

function ApplicationSection() {
    return (
        <div className="py-5 bg-white">
            <NewApplicationForm />
        </div>
    );
}

function RenewalApplicationSection() {
    return (
        <div className="py-5 bg-white">
            <RenewalApplicationForm />
        </div>
    );
}

export { ApplicationSection, RenewalApplicationSection };
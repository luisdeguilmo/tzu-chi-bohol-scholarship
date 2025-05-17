import { useState } from "react";
import FormFields from "./FormFields";
import NavigationButtons from "./NavigationButtons";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";

const ApplicationSection = ({ formData, handleInputChange, nextStep }) => {
    const [errors, setErrors] = useState({});

    return (
        <form className="w-[75%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Application Details</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.APPLICATION]}
                section={FORM_SECTIONS.APPLICATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />
            <NavigationButtons
                isFirst={true}
                isLast={false}
                prevStep={() => {}}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.APPLICATION]}
            />
        </form>
    );
};

export default ApplicationSection;
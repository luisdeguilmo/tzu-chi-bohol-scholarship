import { useState } from "react";
import NavigationButtons from "./NavigationButtons";
import FormFields from "./FormFields";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";

const EducationSection = ({
    formData,
    handleInputChange,
    prevStep,
    nextStep,
}) => {
    const [errors, setErrors] = useState({});

    return (
        <form className="w-[75%] sm:w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Educational Background</h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.EDUCATION]}
                section={FORM_SECTIONS.EDUCATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />
            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.EDUCATION]}
            />
        </form>
    );
};

export default EducationSection;
import { useEffect, useState } from "react";
import NavigationButtons from "./NavigationButtons";
import FormFields from "./FormFields";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";
import { useLocation } from "react-router-dom";

const EducationSection = ({
    formData,
    handleInputChange,
    prevStep,
    nextStep,
    isRenewal,
}) => {
    const [errors, setErrors] = useState({});
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <form className="w-[85%] sm:w-[80%] xl:w-[70%] mx-auto">
            {/* <h2 className="pb-6 font-bold text-gray-700 md:text-lg text-sm">
                Educational Background
            </h2> */}
            <h2 className="mb-12 px-4 py-3 font-bold bg-green-600 rounded-lg text-white md:text-lg text-sm">
                Educational Background
            </h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.EDUCATION]}
                section={FORM_SECTIONS.EDUCATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                isRenewal={isRenewal}
            />
            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.EDUCATION]}
                section={"Education"}
            />
        </form>
    );
};

export default EducationSection;

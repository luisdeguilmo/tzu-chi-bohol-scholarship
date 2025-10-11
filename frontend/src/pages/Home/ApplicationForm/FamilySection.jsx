import { useState, useCallback } from "react";
import FormFields from "./FormFields";
import FamilyListForm from "./FamilyListForm";
import NavigationButtons from "./NavigationButtons";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";

const FamilySection = ({
    formData,
    setFormData,
    handleInputChange,
    prevStep,
    nextStep,
    // handleRenewSubmit,
    isLast,
}) => {
    const [errors, setErrors] = useState({});
    const [isFirstFormApplicable, setIsFirstFormApplicable] = useState(false);
    const [isSecondFormApplicable, setIsSecondFormApplicable] = useState(false);
    // Function to update the family-related data in the main form state
    // Use useCallback to prevent this from being recreated on every render
    const updateFamilyData = useCallback(
        (familyData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...familyData, // This will add/update familyMembers, tzuChiScholars, and assistanceList
            }));
        },
        [setFormData]
    );

    return (
        <form className="w-[85%] sm:w-[80%] xl:w-[70%] mx-auto">
            <h2 className="pb-6 font-bold text-gray-700 md:text-lg text-sm">
                Family Information
            </h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.FAMILY]}
                section={FORM_SECTIONS.FAMILY}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            <h2 className="py-10 font-bold text-gray-700 md:text-lg text-sm">
                Contact Person In Case of Emergency
            </h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.CONTACT_PERSON]}
                section={FORM_SECTIONS.FAMILY}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            {/* Pass formData and update function to FamilyList */}
            <div>
                <FamilyListForm
                    formData={formData}
                    updateFormData={updateFamilyData}
                    setIsFirstFormApplicable={setIsFirstFormApplicable}
                    setIsSecondFormApplicable={setIsSecondFormApplicable}
                />
            </div>

            <NavigationButtons
                isFirst={false}
                isLast={isLast || false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                section={"Family"}
                isFirstFormApplicable={isFirstFormApplicable}
                isSecondFormApplicable={isSecondFormApplicable}
                // handleRenewSubmit={handleRenewSubmit}
                sections={[FORM_SECTIONS.FAMILY, FORM_SECTIONS.CONTACT_PERSON]}
            />
        </form>
    );
};

export default FamilySection;

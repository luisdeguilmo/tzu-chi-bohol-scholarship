import { useState, useCallback, useEffect } from "react";
import FormFields from "./FormFields";
import NavigationButtons from "./NavigationButtons";
import FORM_SECTIONS from "../../../constant/application/formSections";
import formConfig from "../../../constant/application/formConfig";
import CharacterReferenceForm from "./CharacterReferenceForm";
import { useLocation } from "react-router-dom";

const OtherInformationSection = ({
    formData,
    setFormData,
    handleInputChange,
    prevStep,
    nextStep,
    handleRenewSubmit,
    isLast,
}) => {
    const [errors, setErrors] = useState({});

    // Function to update the family-related data in the main form state
    // Use useCallback to prevent this from being recreated on every render
    const updateCharacterReferenceData = useCallback(
        (characterData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...characterData, // This will add/update familyMembers, tzuChiScholars, and assistanceList
            }));
        },
        [setFormData]
    );

    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <form className="w-[85%] sm:w-[80%] xl:w-[70%] mx-auto">
            {/* <h2 className="pb-6 font-bold text-gray-700 md:text-lg text-sm">
                Other Information
            </h2> */}
            <h2 className="mb-12 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 md:text-lg text-sm">
                Other Information
            </h2>
            <FormFields
                fields={formConfig[FORM_SECTIONS.OTHER_INFORMATION]}
                section={FORM_SECTIONS.OTHER_INFORMATION}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
            />

            {/* Pass formData and update function to FamilyList */}
            <div>
                <CharacterReferenceForm
                    formData={formData}
                    updateFormData={updateCharacterReferenceData}
                />
            </div>

            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                formConfig={formConfig}
                sections={[FORM_SECTIONS.OTHER_INFORMATION]}
                section={"Other Information"}
            />
        </form>
    );
};

export default OtherInformationSection;

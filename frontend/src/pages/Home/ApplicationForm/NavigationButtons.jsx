import { toast } from "react-toastify";
import { useCheckEmail } from "../../../hooks/useCheckEmail";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import { useApplicationForm } from "../../../context/ApplicationFormContext";
import { isValidContactNumber } from "../../../utils/inputValidations";
import { useValidateEmail } from "../../../hooks/useValidateEmail";

const validateSection = (section, formData, formConfig) => {
    const errors = {};
    let hasErrors = false;

    formConfig[section].forEach((field) => {
        if (
            field.required &&
            !formData[section][field.name]?.toString().trim()
        ) {
            errors[field.name] = `${field.label} is required`;
            hasErrors = true;
        }
    });

    return { errors, hasErrors };
};

const NavigationButtons = ({
    isFirst,
    isLast,
    prevStep,
    nextStep,
    disabled,
    handleSubmit,
    handleRenewSubmit,
    formData,
    formConfig,
    sections,
    section,
    isFirstFormApplicable = false,
    isSecondFormApplicable = false,
    isThirdFormApplicable = false,
    isLoading = false,
}) => {
    const { user } = useAuth();
    const {
        isSiblingsApplicable,
        isTzuChiSiblingsApplicable,
        isOtherAssistanceApplicable,
        isForExistingScholar,
    } = useApplicationForm();

    const { isEmailExist, refetch } = useCheckEmail(
        formData?.personal_information.email,
        user?.user_id ?? null,
        section
    );

    const { loading, result, validateEmail } = useValidateEmail();

    useEffect(() => {
        if (section === "Personal") {
            refetch();
        }
    }, [formData?.personal_information.email]);

    const checkAndProceed = async (e) => {
        e.preventDefault();

        if (sections) {
            let [section1, section2] = sections;

            const { errors, hasErrors } = validateSection(
                section1.toString(),
                formData,
                formConfig,
            );

            if (section2) {
                const { errors, hasErrors } = validateSection(
                    section2,
                    formData,
                    formConfig,
                );

                if (hasErrors) {
                    toast.error("Please fill in all required fields");
                    return;
                }
            }

            if (hasErrors) {
                toast.error("Please fill in all required fields");
                return;
            }
        }

        if (
            (section === "Personal" &&
                !isValidContactNumber(
                    formData.personal_information.contact_number,
                )) ||
            (section === "Personal" &&
                formData.personal_information.secondary_contact !== "" &&
                !isValidContactNumber(
                    formData.personal_information.secondary_contact,
                ))
        ) {
            toast.error("Invalid contact number.");
            return;
        }

        // if (
        //     section === "Family" &&
        //     (!isValidContactNumber(formData.parents_guardian.father_contact) ||
        //         !isValidContactNumber(
        //             formData.parents_guardian.mother_contact
        //         ) ||
        //         !isValidContactNumber(
        //             formData.contact_person.emergency_contact_number
        //         ))
        // ) {
        //     toast.error("Invalid contact number.");
        //     return;
        // }

        if (section === "Personal") {
            if (isEmailExist) {
                toast.error(
                    user?.user_id
                        ? "Email is already used."
                        : "An application with this email already exists.",
                );
                return;
            }
        }

        // FIXED: Properly await the validation result
        if (section === "Personal" && !user?.user_id) {
            const isValid = await validateEmail(
                formData.personal_information.email,
            );
            if (!isValid) {
                return;
            }
        }

        if (
            section === "Family" &&
            !isValidContactNumber(formData.parents_guardian.father_contact)
        ) {
            toast.error(
                "Father's contact number is invalid. Please enter a valid phone number.",
            );
            return;
        }

        if (
            section === "Family" &&
            !isValidContactNumber(formData.parents_guardian.mother_contact)
        ) {
            toast.error(
                "Mother's contact number is invalid. Please enter a valid phone number.",
            );
            return;
        }

        if (
            section === "Family" &&
            formData.parents_guardian.guardian_contact !== "" &&
            !isValidContactNumber(formData.parents_guardian.guardian_contact)
        ) {
            toast.error(
                "Guardian's contact number is invalid. Please enter a valid phone number.",
            );
            return;
        }

        if (
            section === "Family" &&
            !isValidContactNumber(
                formData.contact_person.emergency_contact_number,
            )
        ) {
            toast.error(
                "Emergency contact number is invalid. Please provide a valid phone number.",
            );
            return;
        }

        if (
            section === "Family" &&
            (parseInt(formData.parents_guardian.father_age) < 18 ||
                parseInt(formData.parents_guardian.father_age) > 100)
        ) {
            toast.error("Father's age must be between 18 and 100.");
            return;
        }

        if (
            section === "Family" &&
            (parseInt(formData.parents_guardian.mother_age) < 18 ||
                parseInt(formData.parents_guardian.mother_age) > 100)
        ) {
            toast.error("Mother's age must be between 18 and 100.");
            return;
        }

        if (
            section === "Family" &&
            formData.parents_guardian.guardian_age !== "" &&
            (parseInt(formData.parents_guardian.guardian_age) < 18 ||
                parseInt(formData.parents_guardian.guardian_age) > 100)
        ) {
            toast.error("Guardian's age must be between 18 and 100.");
            return;
        }

        if (section === "Personal") {
            const isGmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);

            if (!isGmail(formData.personal_information.email)) {
                toast.error("Invalid email address.");
                return;
            }
        }

        if (section === "Family") {
            if (isSiblingsApplicable === null) {
                toast.error("Please select whether you have siblings.");
                return;
            }
        }

        if (section === "Family") {
            if (isTzuChiSiblingsApplicable === null) {
                toast.error(
                    "Please select whether you have siblings who received Tzu Chi Educational Assistance.",
                );
                return;
            }
        }

        if (section === "Family") {
            if (isOtherAssistanceApplicable === null) {
                toast.error(
                    "Please select whether you received assistance from other organizations.",
                );
                return;
            }
        }

        if (section === "Family") {
            if (isThirdFormApplicable && formData.family_members.length === 0) {
                toast.error(
                    "Please provide information for all your siblings.",
                );
                return;
            }
        }

        if (section === "Family") {
            if (
                isFirstFormApplicable &&
                formData.tzu_chi_siblings.length === 0
            ) {
                toast.error(
                    "Please add at least one sibling who received Tzu Chi Educational Assistance.",
                );
                return;
            }
        }

        if (section === "Family") {
            if (
                isSecondFormApplicable &&
                formData.other_assistance.length === 0
            ) {
                toast.error(
                    "Please provide the details of the assistance you received.",
                );
                return;
            }
        }

        // if (!sections && section === "Requirements" && isForExistingScholar) {
        //     if (formData.picture_file === null) {
        //         toast.error("1x1 ID Photo cannot be empty");
        //         return;
        //     }
        // } else if (!sections && section === "Requirements") {
        //     if (
        //         formData.picture_file === null ||
        //         formData.uploaded_files.length === 0
        //     ) {
        //         toast.error("Please fill in all required fields");
        //         return;
        //     }
        // }

        if (!sections && section === "Requirements") {
            if (formData.picture_file === null) {
                toast.error("Please upload a 1x1 ID photo.");
                return;
            }

            if (!isForExistingScholar && formData.uploaded_files.length === 0) {
                toast.error("Please fill in all required fields");
                return;
            }
        }

        if (section === "Other Information") {
            const refs = formData.character_reference;

            if (refs.length === 0) {
                toast.error("Please add at least 1 character reference.");
                return;
            }

            if (refs.length > 3) {
                toast.error(
                    "You can only add a maximum of 3 character references.",
                );
                return;
            }
        }

        // If validation passes, proceed to next step
        if (!isLast) {
            nextStep(e);
        } else {
            if (handleRenewSubmit) {
                handleRenewSubmit(e);
            } else {
                handleSubmit(e);
            }
        }
    };

    return (
        <div className="mt-6">
            {!isFirst && (
                <button
                    className="mr-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg"
                    onClick={prevStep}
                >
                    Previous
                </button>
            )}

            {!isLast ? (
                <button
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg shadow-lg"
                    onClick={checkAndProceed}
                    disabled={loading}
                >
                    {loading ? "Validating..." : "Next"}
                </button>
            ) : (
                <button
                    className={`px-5 py-2 ${
                        disabled || isLoading
                            ? "bg-green-400"
                            : "bg-green-600 hover:bg-green-700"
                    } text-white text-sm rounded-lg shadow-lg`}
                    onClick={checkAndProceed}
                    disabled={disabled || isLoading}
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            )}
        </div>
    );
};

export default NavigationButtons;

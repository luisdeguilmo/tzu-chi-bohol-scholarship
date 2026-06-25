import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalSection from "./PersonalSection";
import EducationSection from "./EducationSection";
import FamilySection from "./FamilySection";
import RequirementsSection from "./RequirementsSection";
import ProgressIndicator from "./ProgressIndicator";
import formConfig from "../../../constant/application/formConfig";
import FORM_SECTIONS from "../../../constant/application/formSections";
import ReviewSection from "./ReviewSection";
import BASE_URL from "../../../config";
import OtherInformationSection from "./OtherInformationSection";
import { useAuth } from "../../../context/AuthContext";
import { useApplicantInformation } from "../../../hooks/useApplicantInformation";
import { useSidebar } from "../../../context/SidebarContext";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { useApplicationForm } from "../../../context/ApplicationFormContext";

const generateInitialState = (fieldsConfig) => {
    const initialState = {};
    fieldsConfig.forEach((field) => {
        initialState[field.name] =
            field.type === "select" ? field.defaultValue || "s" : "s";
    });
    return initialState;
};

function ApplicationForm({
    isForExistingScholar,
    includeRequirements = true,
    onClose,
}) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [schoolYear, setSchoolYear] = useState(null);

    const { user } = useAuth();
    const { setActiveTab } = useSidebar();

    useEffect(() => {
        const fetchSchoolYear = async () => {
            try {
                const data = await getSchoolYear("renewal");
                setSchoolYear(data?.school_year);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch school year");
            }
        };

        fetchSchoolYear();
    }, []);

    const { applicantInformation } = useApplicantInformation(
        user?.user_id,
        schoolYear,
    );

    const { getSchoolYear } = useApplicationPeriods();

    // Define steps based on whether requirements are included
    const steps = [
        { label: "Personal", section: FORM_SECTIONS.PERSONAL },
        { label: "Education", section: FORM_SECTIONS.EDUCATION },
        { label: "Family", section: FORM_SECTIONS.FAMILY },
    ];

    if (includeRequirements) {
        steps.push({
            label: "Requirements",
            section: FORM_SECTIONS.REQUIREMENTS,
        });
    }

    steps.push({
        label: "Other Info",
        section: FORM_SECTIONS.OTHER_INFORMATION,
    });

    steps.push({
        label: "Review",
    });

    const totalSteps = steps.length;

    // Consolidated form state
    const [formData, setFormData] = useState({
        application_info: generateInitialState(
            formConfig[FORM_SECTIONS.APPLICATION],
        ),
        personal_information: generateInitialState(
            formConfig[FORM_SECTIONS.PERSONAL],
        ),
        educational_background: generateInitialState(
            formConfig[FORM_SECTIONS.EDUCATION],
        ),
        parents_guardian: generateInitialState(
            formConfig[FORM_SECTIONS.FAMILY],
        ),
        contact_person: generateInitialState(
            formConfig[FORM_SECTIONS.CONTACT_PERSON],
        ),
        other_information: generateInitialState(
            formConfig[FORM_SECTIONS.OTHER_INFORMATION],
        ),
        family_members: [],
        tzu_chi_siblings: [],
        other_assistance: [],
        character_reference: [],
        uploaded_files: [],
    });

    // Initialize personal information from API
    useEffect(() => {
        if (applicantInformation?.personalInfo && !includeRequirements) {
            const {
                applicationInfo,
                personalInfo,
                educationalInfo,
                familyInfo,
                contactPersonInfo,
                familyMembers,
                tzuChiSiblings,
                assistanceInfo,
                characterReference,
            } = applicantInformation;

            setFormData((prevData) => ({
                ...prevData,

                application_info: {
                    school_year: applicationInfo?.school_year || "",
                },
                personal_information: {
                    last_name: personalInfo.last_name || "",
                    first_name: personalInfo.first_name || "",
                    middle_name: personalInfo.middle_name || "",
                    suffix: personalInfo.suffix || "",
                    gender: personalInfo.gender || "",
                    age: personalInfo.age || 0,
                    birthdate: personalInfo.birthdate || "",
                    birthplace: personalInfo.birthplace || "",
                    home_address: personalInfo.home_address || "",
                    subdivision: personalInfo.subdivision || "",
                    barangay: personalInfo.barangay || "",
                    city: personalInfo.city || "",
                    zip_code: personalInfo.zip_code || "",
                    contact_number: personalInfo.contact_number || "",
                    secondary_contact: personalInfo.secondary_contact || "",
                    religion: personalInfo.religion || "",
                    civil_status: personalInfo.civil_status || "",
                    facebook: personalInfo.facebook || "",
                    email: personalInfo.email || "",
                },

                educational_background: {
                    previous_school: educationalInfo?.previous_school || "",
                    previous_location: educationalInfo?.previous_location || "",
                    previous_honor: educationalInfo?.previous_honor || "",
                    previous_gwa: educationalInfo?.previous_gwa || "",
                    previous_course: educationalInfo?.previous_course || "",
                    incoming_grade:
                        educationalInfo?.incoming_grade || "College",
                    present_school: educationalInfo?.present_school || "",
                    present_location: educationalInfo?.present_location || "",
                    present_course1: educationalInfo?.present_course1 || "",
                    present_course2: educationalInfo?.present_course2 || "",
                    year_level: educationalInfo?.year_level || "",
                    selected_school_id:
                        educationalInfo?.selected_school_id || "",
                },

                parents_guardian: {
                    father_name: familyInfo?.father_name || "",
                    father_age: familyInfo?.father_age || 0,
                    father_education: familyInfo?.father_education || "",
                    father_occupation: familyInfo?.father_occupation || "",
                    father_income: parseFloat(familyInfo?.father_income) || 0,
                    father_contact: familyInfo?.father_contact || "",
                    mother_name: familyInfo?.mother_name || "",
                    mother_age: familyInfo?.mother_age || 0,
                    mother_education: familyInfo?.mother_education || "",
                    mother_occupation: familyInfo?.mother_occupation || "",
                    mother_income: parseFloat(familyInfo?.mother_income) || 0,
                    mother_contact: familyInfo?.mother_contact || "",
                    guardian_name: familyInfo?.guardian_name || "",
                    guardian_age: familyInfo?.guardian_age || "",
                    guardian_education: familyInfo?.guardian_education || "",
                    guardian_occupation: familyInfo?.guardian_occupation || "",
                    guardian_income: familyInfo?.guardian_income || "",
                    guardian_contact: familyInfo?.guardian_contact || "",
                },

                contact_person: {
                    emergency_contact_name:
                        contactPersonInfo?.emergency_contact_name || "",
                    emergency_contact_relationship:
                        contactPersonInfo?.emergency_contact_relationship || "",
                    emergency_contact_address:
                        contactPersonInfo?.emergency_contact_address || "",
                    emergency_contact_number:
                        contactPersonInfo?.emergency_contact_number || "",
                },

                other_information: {
                    expectation: applicationInfo?.expectation || "",
                },

                family_members: familyMembers.map((member) => ({
                    id: member.id,
                    name: member.name || "",
                    relationship: member.relationship || "",
                    age: member.age || 0,
                    gender: member.gender || "",
                    civil_status: member.civil_status || "",
                    living_with_family: member.living_with_family || "",
                    education_occupation: member.education_occupation || "",
                    monthly_income: member.monthly_income || "0.00",
                })),

                tzu_chi_siblings: tzuChiSiblings,
                other_assistance: assistanceInfo,
                character_reference: characterReference.map((ref) => ({
                    id: ref.id,
                    name: ref.name || "",
                    address: ref.address || "",
                    company: ref.company || "",
                    position: ref.position || "",
                    contact_number: ref.contact_number || "",
                })),
            }));
        }
    }, [applicantInformation]);

    const handleInputChange = (section, fieldName, value) => {
        // const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [fieldName]: value,
            },
        }));
    };

    // Navigation functions
    const nextStep = (e) => {
        e.preventDefault();

        if (!includeRequirements && currentStep === 4) {
            setCurrentStep((prev) => Math.min(prev + 2, totalSteps + 1));
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = (e) => {
        e.preventDefault();

        if (!includeRequirements && currentStep === 6) {
            setCurrentStep((prev) => Math.max(prev - 1, 1) - 1);
        } else {
            setCurrentStep((prev) => Math.max(prev - 1, 1));
        }
    };

    const handleRenewSubmit = async (e) => {
        e.preventDefault();

        const data = await getSchoolYear("renewal");
        formData.application_info.school_year = data?.school_year;
        formData.application_info.application_type = "renew";
        formData.application_info.status = "Old";
        formData.application_info.scholar_id = user.user_id;
        formData.personal_information.scholar_id = user.user_id;
        formData.educational_background.scholar_id = user.user_id;
        formData.parents_guardian.scholar_id = user.user_id;

        try {
            const formDataToSend = new FormData();

            const applicationData = { ...formData };

            formDataToSend.append(
                "applicationData",
                JSON.stringify(applicationData),
            );

            const response = await axios.post(
                `${BASE_URL}app/api/renewal.php`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            toast.success("Application submitted successfully!");
            setLoading(false);
            setTimeout(() => {
                navigate("/scholar/dashboard");
            }, 1000);
            setActiveTab("dashboard");
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
        }
    };

    const handleReSubmitRenew = async (e) => {
        e.preventDefault();

        const data = await getSchoolYear("renewal");
        formData.application_info.school_year = data?.school_year;
        formData.application_info.application_type = "resubmit";
        formData.application_info.scholar_id = user.user_id;

        try {
            const formDataToSend = new FormData();

            const applicationData = { ...formData };

            formDataToSend.append(
                "applicationData",
                JSON.stringify(applicationData),
            );

            const response = await axios.post(
                `${BASE_URL}app/api/renewal.php`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            toast.success("Application submitted successfully!");
            setLoading(false);
            setTimeout(() => {
                navigate("/scholar/dashboard");
            }, 1000);
            setActiveTab("dashboard");
        } catch (error) {
            alert("Failed: ", error);
        }
        // console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);
    };

    // Handle final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await getSchoolYear("new");
        formData.application_info.school_year = data?.school_year;
        formData.application_info.is_existing_scholar = isForExistingScholar;
        formData.application_info.status = "New";
        formData.educational_background.year_level = isForExistingScholar
            ? formData.educational_background.year_level
            : 1;
        // console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);

        const submitStudentData = async () => {
            try {
                setLoading(true);

                const formDataToSend = new FormData();

                const applicationData = { ...formData };
                delete applicationData.uploaded_files;

                formDataToSend.append(
                    "applicationData",
                    JSON.stringify(applicationData),
                );

                if (formData.picture_file && formData.picture_file.fileObj) {
                    formDataToSend.append(
                        "picture",
                        formData.picture_file.fileObj,
                    );
                    formDataToSend.append(
                        "pictureInfo",
                        JSON.stringify({
                            filename: formData.picture_file.filename,
                        }),
                    );
                }

                if (
                    formData.uploaded_files &&
                    formData.uploaded_files.length > 0
                ) {
                    formData.uploaded_files.forEach((fileItem) => {
                        if (fileItem.fileObj) {
                            formDataToSend.append("files[]", fileItem.fileObj);
                        }
                        formDataToSend.append(
                            "fileInfo[]",
                            JSON.stringify({
                                filename: fileItem.filename,
                            }),
                        );
                    });
                }

                const response = await axios.post(
                    `${BASE_URL}app/api/submit-application.php`,
                    formDataToSend,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                toast.success("Application submitted successfully!");
                setLoading(false);

                if (isForExistingScholar) {
                    setTimeout(() => {
                        navigate(
                            "/admin/users-accounts/scholar-account-management",
                        );
                    }, 1000);
                    onClose(false);
                } else {
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                }
            } catch (err) {
                console.error("Error submitting data:", err);
                setError("Failed to submit. Please try again.");
                toast.error("Failed to submit application. Please try again.");
                setLoading(false);
            }
        };

        submitStudentData();
    };

    // Render form step components
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <EducationSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        isRenewal={!includeRequirements}
                    />
                );
            case 3:
                return (
                    <FamilySection
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        isSiblingsExisted={
                            applicantInformation?.familyMembers?.length > 0
                        }
                        isTzuChiSiblingsExisted={
                            applicantInformation?.tzuChiSiblings?.length > 0
                        }
                        isOtherAssistanceExisted={
                            applicantInformation?.assistanceInfo?.length > 0
                        }
                    />
                );
            case 4:
                if (includeRequirements) {
                    return (
                        <RequirementsSection
                            formData={formData}
                            setFormData={setFormData}
                            prevStep={prevStep}
                            nextStep={nextStep}
                        />
                    );
                }
            case 5:
                return (
                    <OtherInformationSection
                        formData={formData}
                        setFormData={setFormData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 6:
                return (
                    <ReviewSection
                        formData={formData}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        handleSubmit={
                            !includeRequirements &&
                            !applicantInformation?.applicationInfo?.scholar_id
                                ? handleRenewSubmit
                                : !includeRequirements &&
                                    applicantInformation?.applicationInfo
                                        ?.scholar_id === user.user_id
                                  ? handleReSubmitRenew
                                  : handleSubmit
                        }
                        isLast={true}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center">
            <ProgressIndicator
                includeRequirements={includeRequirements}
                steps={steps}
                currentStep={currentStep}
            />
            {renderStep()}
        </div>
    );
}

function NewApplicationForm({ isForExistingScholar = false, onClose }) {
    const { setIsForExistingScholar } = useApplicationForm();

    useEffect(() => {
        setIsForExistingScholar(isForExistingScholar);
    }, []);

    return (
        <ApplicationForm
            isForExistingScholar={isForExistingScholar}
            onClose={onClose}
            includeRequirements={true}
        />
    );
}

function RenewalApplicationForm() {
    return <ApplicationForm includeRequirements={false} />;
}

export { ApplicationForm, NewApplicationForm, RenewalApplicationForm };

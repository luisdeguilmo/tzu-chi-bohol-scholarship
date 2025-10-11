import { useCallback } from "react";
import FileUploadForm from "./FileUploadForm";
import NavigationButtons from "./NavigationButtons";

const RequirementsSection = ({ formData, setFormData, prevStep, nextStep }) => {
    // Function to update the files-related data in the main form state

    const updateFilesData = useCallback(
        (filesData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...filesData, // This will add/update uploaded_files
            }));
        },
        [setFormData]
    );

    return (
        <div className="w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-12 font-bold text-gray-700 md:text-lg text-sm">
                Requirements
            </h2>
            <FileUploadForm
                formData={formData}
                updateFilesData={updateFilesData}
            />
            <p className="my-8 text-xs font-bold text-gray-700">
                Tip:
                <span className="ml-1 font-normal text-xs text-gray-600 italic">
                    If you're using your phone to take pictures of documents,
                    place them on a flat surface in good lighting, and make sure
                    the entire document fits in the frame.
                </span>
            </p>
            <NavigationButtons
                isFirst={false}
                isLast={false}
                prevStep={prevStep}
                nextStep={nextStep}
                formData={formData}
                sections={null}
                section={"Requirements"}
            />
        </div>
    );
};

export default RequirementsSection;

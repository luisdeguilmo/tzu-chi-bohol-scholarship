import { useState } from "react";
import NavigationButtons from "./NavigationButtons";
import ReviewPage from "./ReviewPage";

const ReviewSection = ({ formData, prevStep, handleSubmit }) => {
    const [isConsent, setIsConsent] = useState(false);

    console.log("Review Section");

    const handleConsent = () => {
        setIsConsent(!isConsent);
    };

    return (
        <div className="w-[85%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold text-gray-700 md:text-lg text-sm">Review Information</h2>
            <ReviewPage
                formData={formData}
                isConsent={isConsent}
                onSetConsent={handleConsent}
            />
            <NavigationButtons
                isFirst={false}
                isLast={true}
                prevStep={prevStep}
                disabled={!isConsent}
                handleSubmit={handleSubmit}
                section={'Review'}
                sections={null}
            />
        </div>
    );
};

export default ReviewSection;

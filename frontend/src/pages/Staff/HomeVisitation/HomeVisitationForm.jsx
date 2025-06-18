import { useState } from "react";

function HomeVisitationForm({ isOpen, setIsOpen, applicant }) {
    const [text, setText] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [submit, setSubmit] = useState("");

    const questions = [
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatem, ab soluta quo dolor sapiente eius ullam amet assumenda voluptatum similique eum delectus quae perspiciatis vel dignissimos nostrum eos nulla.",
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatem, ab soluta quo dolor sapiente eius ullam amet assumenda voluptatum similique eum delectus quae perspiciatis vel dignissimos nostrum eos nulla.",
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatem, ab soluta quo dolor sapiente eius ullam amet assumenda voluptatum similique eum delectus quae perspiciatis vel dignissimos nostrum eos nulla.",
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatem, ab soluta quo dolor sapiente eius ullam amet assumenda voluptatum similique eum delectus quae perspiciatis vel dignissimos nostrum eos nulla.",
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatem, ab soluta quo dolor sapiente eius ullam amet assumenda voluptatum similique eum delectus quae perspiciatis vel dignissimos nostrum eos nulla.",
    ];

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    console.log(applicant);
    console.log(applicant.previous_course);

    return (
        <div>
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.3)] bg-opacity-50">
                    <div className="h-[600px] p-8 pt-6 space-y-4 w-[80%] lg:w-[60%] overflow-y-scroll bg-white rounded-sm shadow-md">
                        <div className="pt-4 relative flex justify-between items-center">
                            <h2 className="absolute left-[50%] translate-x-[-50%] text-xl text-center text-gray-600">
                                Intake Interview Questionnaire
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute right-0 text-gray-500 text-3xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="py-4 w-[80%] text-left flex justify-between">
                            <div className="flex flex-col justify-center font-bold">
                                <p className="text-xs text-gray-600">
                                    Name of Applicant:{" "}
                                    <span className="font-normal">
                                        {applicant.first_name}{" "}
                                        {applicant.last_name}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-600">
                                    School:{" "}
                                    <span className="font-normal">
                                        {applicant.previous_school}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col font-bold">
                                <p className="text-xs text-gray-600">
                                    Year Level:{" "}
                                </p>
                                <p className="text-xs text-gray-600">
                                    Course:{" "}
                                    <span className="font-normal">
                                        {applicant.previous_course}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <form className="">
                            {/* Form Inputs */}
                            <div className="space-y-4">
                                <h3 className="text-left text-lg font-bold text-gray-600">
                                    I. GUIDE QUESTIONS
                                </h3>
                                {questions.map((question, index) => (
                                    <label className="py-1 flex flex-col gap-[5px] text-xs whitespace-normal text-justify text-gray-600">
                                        {index + 1}
                                        {". "}
                                        {question}
                                        <textarea
                                            name=""
                                            id=""
                                            rows={4}
                                            // value={description}
                                            required
                                            // onChange={(e) =>
                                            //     setDescription(e.target.value)
                                            // }
                                            // placeholder={field.placeholder}
                                            className="w-full resize-none text-gray-600 border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        ></textarea>
                                    </label>
                                ))}
                                <h3 className="text-left text-lg font-bold text-gray-600 whitespace-normal">
                                    II. RATE HIS/HER AUTOBIOGRAPHY{" "}
                                    <span className="font-normal text-sm">
                                        (2 points)
                                    </span>
                                </h3>
                                <textarea
                                    name=""
                                    id=""
                                    rows={4}
                                    // value={description}
                                    required
                                    // onChange={(e) =>
                                    //     setDescription(e.target.value)
                                    // }
                                    // placeholder={field.placeholder}
                                    className="w-full resize-none text-gray-600 border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                                <h3 className="text-left text-lg font-bold text-gray-600 whitespace-normal">
                                    III. INTERVIEWER OVERALL IMPRESSIONS
                                    (Describe applicant behavior during the
                                    interview){" "}
                                    <span className="font-normal text-sm">
                                        (3 points)
                                    </span>
                                </h3>
                                <textarea
                                    name=""
                                    id=""
                                    rows={4}
                                    // value={description}
                                    required
                                    // onChange={(e) =>
                                    //     setDescription(e.target.value)
                                    // }
                                    // placeholder={field.placeholder}
                                    className="w-full resize-none text-gray-600 border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`w-full py-3 px-4 rounded-sm shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-full py-3 px-4 rounded-sm shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600`}
                                >
                                    {/* Add {label} */}{" "}
                                    {/* {isLoading ? "Submitting" : `Add ${label}`} */}
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeVisitationForm;

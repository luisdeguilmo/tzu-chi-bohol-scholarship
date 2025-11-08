import { useEffect, useMemo, useState } from "react";
import formConfig from "../../../constant/application/formConfig";
import FORM_SECTIONS from "../../../constant/application/formSections";
import { useCollegesUniversities } from "../../../hooks/useCollegesUniversities";
import { useCoursesAccepted } from "../../../hooks/useCoursesAccepted";

const FormFields = ({
    fields,
    section,
    formData,
    handleInputChange,
    errors,
}) => {
    const [selectedCollegeOrUniversity, setSelectedCollegeOrUniversity] =
        useState(formData?.educational_background?.selected_school_id || 0);

    console.log(selectedCollegeOrUniversity);

    const { collegesAndUniversities } = useCollegesUniversities();
    const { coursesAccepted, fetchCoursesAccepted, resetCoursesAccepted } =
        useCoursesAccepted(selectedCollegeOrUniversity);

    useEffect(() => {
        if (selectedCollegeOrUniversity > 0) {
            // Reset courses before fetching new ones
            resetCoursesAccepted?.();
            fetchCoursesAccepted();
        }

        if (
            selectedCollegeOrUniversity !==
            formData.educational_background.selected_school_id
        ) {
            formData.educational_background.present_course1 = "";
            formData.educational_background.present_course2 = "";
        }

        formData.educational_background.selected_school_id =
            +selectedCollegeOrUniversity;
        // Remove fetchCoursesAccepted and resetCoursesAccepted from dependencies
    }, [selectedCollegeOrUniversity]);

    const inputSection =
        fields === formConfig[FORM_SECTIONS.CONTACT_PERSON]
            ? FORM_SECTIONS.CONTACT_PERSON
            : section;

    // Only split fields if we're in the education section
    const previous =
        section === FORM_SECTIONS.EDUCATION ? fields.slice(0, 5) : [];
    const present = section === FORM_SECTIONS.EDUCATION ? fields.slice(6) : [];

    console.log(formData);

    // Memoize mapped arrays
    const collegesAndUniversitiesArray = useMemo(
        () =>
            collegesAndUniversities.map((item) => ({
                key: item.id,
                name: item.name,
            })),
        [collegesAndUniversities]
    );

    const coursesAcceptedArr = useMemo(
        () =>
            coursesAccepted.map((item) => ({
                key: item.school_id,
                name: item.course,
            })),
        [coursesAccepted]
    );

    // Update form config options - wrap in useMemo to prevent mutations on every render
    useMemo(() => {
        const emptyOption = { key: 0, name: "" };
        formConfig[FORM_SECTIONS.EDUCATION][6].options = [
            emptyOption,
            ...collegesAndUniversitiesArray,
        ];
        formConfig[FORM_SECTIONS.EDUCATION][8].options = [
            emptyOption,
            ...coursesAcceptedArr,
        ];
        formConfig[FORM_SECTIONS.EDUCATION][9].options = [
            emptyOption,
            ...coursesAcceptedArr,
        ];
    }, [collegesAndUniversitiesArray, coursesAcceptedArr]);
    return (
        <>
            {section === FORM_SECTIONS.EDUCATION ? (
                <>
                    <h2 className="mb-4 font-bold text-sm text-gray-700">
                        Previous
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4">
                        {previous.map((field) => (
                            <div className="relative">
                                <label className="block mb-1 text-gray-500 text-xs">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[inputSection][field.name]}
                                    onChange={(e) =>
                                        handleInputChange(inputSection, e)
                                    }
                                    placeholder={`${field.label}${
                                        field.required ? "*" : ""
                                    }`}
                                    // className={`w-full outline-none border-b-[2px] ${
                                    //     errors && errors[field.name]
                                    //         ? "border-red-500"
                                    //         : "border-gray-400"
                                    // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                    className="w-full border text-xs text-slate-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    required
                                />
                                {errors && errors[field.name] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="mt-10 mb-4 font-bold text-sm text-gray-700">
                        Present
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4">
                        {present.map((field) => (
                            <div
                                key={field.name}
                                className={`${
                                    field.type === "textarea"
                                        ? "col-span-3"
                                        : ""
                                }`}
                            >
                                {field.type === "select" ? (
                                    <div className="block w-full relative">
                                        <label className="block mb-1 text-gray-500 text-xs">
                                            {field.label}
                                        </label>
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={
                                                formData[section][field.name]
                                            }
                                            onChange={(e) => {
                                                handleInputChange(section, e);

                                                if (
                                                    field.name ===
                                                    "present_school"
                                                ) {
                                                    const selectedOption =
                                                        e.target.options[
                                                            e.target
                                                                .selectedIndex
                                                        ];

                                                    const id =
                                                        selectedOption.getAttribute(
                                                            "data-id"
                                                        );

                                                    setSelectedCollegeOrUniversity(
                                                        id
                                                    );
                                                }
                                            }}
                                            // className={`w-full outline-none border-b-[2px] ${
                                            //     errors && errors[field.name]
                                            //         ? "border-red-500"
                                            //         : "border-gray-400"
                                            // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                            className="w-full border text-gray-800 text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required={field.required}
                                        >
                                            {field.options.map(
                                                (option, index) => (
                                                    <option
                                                        key={index}
                                                        data-id={option.key}
                                                        value={option.name}
                                                        disabled={
                                                            option.name === ""
                                                        }
                                                        className="text-gray-800 disabled:text-gray-400"
                                                    >
                                                        {option.name === ""
                                                            ? "-- Select --"
                                                            : option.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors && errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <label className="block mb-1 text-gray-500 text-xs">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={
                                                formData[inputSection][
                                                    field.name
                                                ]
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    inputSection,
                                                    e
                                                )
                                            }
                                            placeholder={`${field.label}${
                                                field.required ? "*" : ""
                                            }`}
                                            // className={`w-full outline-none border-b-[2px] ${
                                            //     errors && errors[field.name]
                                            //         ? "border-red-500"
                                            //         : "border-gray-400"
                                            // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                            className="w-full border text-xs text-slate-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                            required
                                        />
                                        {errors && errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4">
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={`${
                                field.type === "textarea" ? "col-span-3" : ""
                            }`}
                        >
                            {field.type === "select" ? (
                                <div className="block w-full relative">
                                    <label className="block mb-1 text-gray-500 text-xs">
                                        {field.label}
                                    </label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={formData[section][field.name]}
                                        onChange={(e) =>
                                            handleInputChange(section, e)
                                        }
                                        // className={`w-full outline-none border-b-[2px] ${
                                        //     errors && errors[field.name]
                                        //         ? "border-red-500"
                                        //         : "border-gray-400"
                                        // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                        className="w-full border text-gray-800 text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required={field.required}
                                    >
                                        {field.options.map((option) => (
                                            <option
                                                key={option}
                                                value={option}
                                                disabled={option === ""}
                                                className="text-gray-800 disabled:text-gray-400"
                                            >
                                                {option === ""
                                                    ? "-- Select --"
                                                    : option}
                                            </option>
                                        ))}
                                    </select>
                                    {errors && errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            ) : field.type === "textarea" ? (
                                <div className="relative">
                                    <label className="block mb-1 text-gray-600 text-xs">
                                        {field.label}
                                    </label>
                                    <textarea
                                        rows={5}
                                        name={field.name}
                                        value={
                                            formData[inputSection][field.name]
                                        }
                                        onChange={(e) =>
                                            handleInputChange(inputSection, e)
                                        }
                                        placeholder={`${field.label}${
                                            field.required ? "*" : ""
                                        }`}
                                        className="w-full resize-none border text-xs text-slate-700 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required={field.required}
                                    ></textarea>

                                    {errors && errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="relative">
                                    <label className="block mb-1 text-gray-500 text-xs">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={
                                            formData[inputSection][field.name]
                                        }
                                        onChange={(e) =>
                                            handleInputChange(inputSection, e)
                                        }
                                        placeholder={`${field.label}${
                                            field.required ? "*" : ""
                                        }`}
                                        // className={`w-full outline-none border-b-[2px] ${
                                        //     errors && errors[field.name]
                                        //         ? "border-red-500"
                                        //         : "border-gray-400"
                                        // } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                        className="w-full border text-xs text-slate-800 border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        required
                                    />
                                    {errors && errors[field.name] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FormFields;

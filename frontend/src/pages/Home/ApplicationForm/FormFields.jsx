import formConfig from "../../../constant/application/formConfig";
import FORM_SECTIONS from "../../../constant/application/formSections";

const FormFields = ({
    fields,
    section,
    formData,
    handleInputChange,
    errors,
}) => {
    let inputSection =
        fields === formConfig[FORM_SECTIONS.CONTACT_PERSON]
            ? FORM_SECTIONS.CONTACT_PERSON
            : section;

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
            {fields.map((field) => (
                <div key={field.name}>
                    {field.type === "select" ? (
                        <div className="block w-full mb-2 relative">
                            <label
                                htmlFor={field.name}
                                className="absolute top-[-10px] text-gray-600 text-sm"
                            >
                                {field.label}
                                {field.required && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>
                            <select
                                id={field.name}
                                name={field.name}
                                value={formData[section][field.name]}
                                onChange={(e) => handleInputChange(section, e)}
                                className={`w-full outline-none border-b-[2px] ${
                                    errors && errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-400"
                                } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                required={field.required}
                            >
                                {field.options.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                        disabled={option === ""}
                                    >
                                        {option === "" ? "Select" : option}
                                    </option>
                                ))}
                            </select>
                            {errors && errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
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
                                className={`w-full outline-none border-b-[2px] ${
                                    errors && errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-400"
                                } py-2 mt-1 box-border hover:border-black focus:border-green-500`}
                                required={field.required}
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
    );
};

export default FormFields;
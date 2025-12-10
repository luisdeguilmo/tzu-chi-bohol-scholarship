import { useState, useEffect, useCallback } from "react";
import characterReferenceInputFields from "../../../constant/application/characterReferenceInputFields";
import { Plus, TrashIcon } from "lucide-react";
import {
    isValidContactNumber,
    lettersNumbers,
    lettersOnly,
    numbersOnly,
} from "../../../utils/inputValidations";
import { toast } from "react-toastify";

const CharacterReferenceForm = ({ formData, updateFormData }) => {
    // Initialize state from formData or use empty arrays if not present
    const [character_reference, setCharacterReference] = useState(
        formData.character_reference || []
    );

    const [newCharacter, setNewCharacter] = useState({
        name: "",
        address: "",
        company: "",
        position: "",
        contact_number: "",
    });

    // Use useCallback to memoize the function that updates parent data
    const updateData = useCallback(() => {
        updateFormData({
            character_reference,
        });
    }, [character_reference, updateFormData]);

    // Update parent formData when our local state changes
    useEffect(() => {
        updateData();
    }, [updateData]);

    const handleChange = (name, value) => {
        setNewCharacter({
            ...newCharacter,
            [name]: value,
        });
    };

    // Add new Tzu Chi scholar
    const addCharacter = () => {
        if (newCharacter.contact_number !== "" && !isValidContactNumber(newCharacter.contact_number)) {
            toast.error("Invalid contact number.");
            return;
        }

        if (newCharacter.name && newCharacter.address) {
            setCharacterReference([...character_reference, newCharacter]);
            setNewCharacter({
                name: "",
                address: "",
                company: "",
                position: "",
                contact_number: "",
            });
        }
    };

    // Remove a scholar
    const removeCharacter = (index) => {
        const updatedCharacterReference = [...character_reference];
        updatedCharacterReference.splice(index, 1);
        setCharacterReference(updatedCharacterReference);
    };

    const validators = {
        lettersOnly,
        numbersOnly,
        lettersNumbers,
    };

    return (
        <div>
            <h2 className="mt-12 mb-12 px-4 py-3 font-bold bg-green-100 rounded-lg text-green-900 text-sm">
                Character Reference{" "}
                <span className="text-xs italic font-normal">
                    (Name 3 Person not related to your family who can vouch
                    yourself)
                </span>
            </h2>
            <div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
                    {characterReferenceInputFields.map((input) => (
                        <div>
                            <label className="block mb-1 text-gray-600 text-xs">
                                {input.label}
                            </label>
                            <input
                                type={input.type}
                                name={input.name}
                                value={newCharacter[input.name]}
                                onChange={(e) => {
                                    let value = e.target.value;

                                    if (input.validate) {
                                        value =
                                            validators[input.validate](value);
                                    }

                                    handleChange(input.name, value);
                                }}
                                placeholder={input.placeholder}
                                className="w-full border text-xs text-gray-700 border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addCharacter}
                    className={`col-span-3 my-7 flex items-center gap-1 shadow-lg text-xs rounded-lg text-white py-2.5 px-4 ${
                        character_reference.length > 2
                            ? "bg-green-400"
                            : "bg-green-600 hover:bg-green-700"
                    } `}
                    disabled={character_reference.length > 2}
                >
                    <Plus className="mb-[.5px] w-4 h-4" />
                    Add Character
                </button>
            </div>

            <div className="space-y-4">
                {character_reference.length > 0 ? (
                    character_reference.map((character, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-md p-4 bg-white shadow-sm relative"
                        >
                            {/* Remove button */}
                            <button
                                onClick={() => removeCharacter(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                                <p>
                                    <span className="text-gray-600">Name:</span>{" "}
                                    <span className="text-gray-800">
                                        {character.name}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Address:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.address}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Company:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.company}
                                    </span>
                                </p>

                                <p>
                                    <span className="text-gray-600">
                                        Position:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.position}
                                    </span>
                                </p>

                                <p className="md:col-span-2">
                                    <span className="text-gray-600">
                                        Contact #:
                                    </span>{" "}
                                    <span className="text-gray-800">
                                        {character.contact_number}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="p-4 rounded-md border-2 border-dashed text-xs text-center text-gray-500">
                        No character references added yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CharacterReferenceForm;

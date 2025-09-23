import { useState, useEffect, useCallback } from "react";
import characterReferenceInputFields from "../../../constant/application/characterReferenceInputFields";

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

    // Rest of the component remains the same...
    // Handle input changes
    const handleChange = (e) => {
        setNewCharacter({
            ...newCharacter,
            [e.target.name]: e.target.value,
        });
    };

    // Add new Tzu Chi scholar
    const addCharacter = () => {
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

    return (
        <div>
            <h2 className="pt-12 pb-6 font-bold mb-4">
                Character Reference{" "}
                <span className="text-sm font-normal">
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
                                onChange={handleChange}
                                placeholder={input.placeholder}
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addCharacter}
                    className={`col-span-3 my-7 shadow-lg text-sm rounded-md text-white p-2 ${
                        character_reference.length > 2
                            ? "bg-green-400"
                            : "bg-green-600"
                    } `}
                    disabled={character_reference.length > 2}
                >
                    Add Character
                </button>
            </div>

            {/* Display Scholars in a Table */}
            <div className="overflow-y-auto">
                {character_reference.length > 0 && (
                    <table className="w-full mb-6 lg:w-[100%] min-w-[1000px]">
                        <thead>
                            <tr className="p-2 bg-gray-50 text-xs font-normal text-slate-800">
                                {[
                                    "Name",
                                    "Address",
                                    "Company",
                                    "Position",
                                    "Contact #",
                                    "Action",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="py-4 font-semibold text-xs"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {character_reference.map((character, index) => (
                                <tr
                                    key={index}
                                    className="text-center text-xs border-y border-gray-200 text-gray-500"
                                >
                                    <td className="py-5">{character.name}</td>
                                    <td className="p-2">{character.address}</td>
                                    <td className="p-2">{character.company}</td>
                                    <td className="p-2">
                                        {character.position}
                                    </td>
                                    <td className="p-2">
                                        {character.contact_number}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() =>
                                                removeCharacter(index)
                                            }
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CharacterReferenceForm;

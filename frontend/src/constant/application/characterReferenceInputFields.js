const characterReferenceInputFields = [
    {
        label: "Name",
        name: "name",
        type: "text",
        placeholder: "Name",
        validate: "lettersOnly",
    },
    {
        label: "Address",
        name: "address",
        type: "text",
        placeholder: "Address",
        validate: "lettersNumbers",
    },
    {
        label: "Company",
        name: "company",
        type: "text",
        placeholder: "Company",
        validate: "lettersOnly",
    },
    {
        label: "Position",
        name: "position",
        type: "text",
        placeholder: "Position",
        validate: "lettersOnly",
    },
    {
        label: "Contact Number",
        name: "contact_number",
        type: "text",
        placeholder: "Contact Number",
        validate: "numbersOnly",
    },
];

export default characterReferenceInputFields;

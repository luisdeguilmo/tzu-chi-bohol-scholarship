const assistanceInputFields = [
    {
        label: "Organization Name",
        name: "organization_name",
        type: "text",
        placeholder: "Enter organization",
        validate: "lettersOnly",
    },
    {
        label: "Type of Support",
        name: "support_type",
        type: "text",
        placeholder: "Enter support type",
        validate: "lettersOnly",
    },
    {
        label: "Amount",
        name: "amount",
        type: "number",
        placeholder: "Enter amount",
    },
];

export default assistanceInputFields;
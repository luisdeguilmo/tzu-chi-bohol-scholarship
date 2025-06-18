import { convertImageToBase64 } from "./convertImageToBase64";
import { getProfilePictureBase64 } from "./getProfilePictureBase64";
import FormLogo from "/src/assets/form_logo.png";

export const generatePDF = async (
    action,
    applicationId,
    applicantData
) => {

    if (!applicantData) {
        alert("No student data available");
        return;
    }

    try {
        console.log("Starting PDF generation...");

        // Convert logo to base64
        const logoBase64 = await convertImageToBase64(FormLogo);
        // const profilePictureBase64 = await getProfilePictureBase64(studentId);

        // Get profile picture as base64 using existing endpoint
        let profilePictureBase64 = null;
        if (applicationId) {
            console.log(
                "Getting profile picture for student ID:",
                applicationId
            );
            profilePictureBase64 = await getProfilePictureBase64(applicationId);

            if (!profilePictureBase64) {
                console.warn(
                    "Failed to get profile picture, PDF will be generated without it"
                );
            }
        }

        console.log("Profile picture base64:", profilePictureBase64);
        console.log("Logo base64:", logoBase64);

        // Extract data for easier access
        const {
            applicationInfo,
            personalInfo,
            educationalBackground,
            familyInfo,
            otherAssistance,
            requirements,
        } = applicantData;

        const content = [
            {
                image: logoBase64, // dynamic Base64 from import
                width: 300,
                alignment: "center",
                absolutePosition: { y: 10 },
            },
            {
                text: "Tzu Chi Educational Assistance Program",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 40, 0, 0],
            },
            {
                image: profilePictureBase64,
                width: 100,
                height: 100,
                alignment: "right",
                absolutePosition: { x: 5, y: 24 },
            },
            {
                text: "APPLICATION FORM",
                fontSize: 14,
                bold: true,
                decoration: "underline",
                alignment: "center",
                margin: [0, 0, 0, 20],
            },

            {
                columns: [
                    {
                        text: "PERSONAL INFORMATION",
                        fontSize: 14,
                        bold: true,
                        decoration: "underline",
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                    },
                    {
                        text: "Status: " + applicationInfo.status,
                        fontSize: 10,
                        bold: true,
                        decoration: "underline",
                        alignment: "right",
                    },
                    {
                        text: "SY: " + applicationInfo.school_year,
                        fontSize: 10,
                        bold: true,
                        decoration: "underline",
                        alignment: "right",
                    },
                ],
                margin: [0, 10, 0, 5],
            },

            // First Table with Labels and Data
            {
                table: {
                    widths: ["auto", "*", "*", "*", "*"],
                    body: [
                        // Row with Labels in Each Cell and Data
                        [
                            {
                                stack: [
                                    {
                                        text: "Name (Last Name, First Name, Middle Name, Suffix)",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text:
                                            personalInfo?.last_name +
                                                ", " +
                                                personalInfo?.middle_name +
                                                ", " +
                                                personalInfo.first_name || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Gender",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.gender || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Age",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.age || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Birthdate",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.birthdate || "",
                                        fontSize: 10,
                                    },
                                ],
                                colSpan: 2,
                            },
                            {}, // Placeholder for colSpan
                        ],
                        [
                            {
                                stack: [
                                    {
                                        text: "Home Address",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.home_address || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Subd./Village",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.subdivision || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Barangay",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.barangay || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "City/Municipality",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.city || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Zip Code",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.zip_code || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                        ],
                        [
                            {
                                stack: [
                                    {
                                        text: "Personal Contact",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text:
                                            personalInfo?.contact_number || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Secondary Contact",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text:
                                            personalInfo?.secondary_contact ||
                                            "",
                                        fontSize: 10,
                                    },
                                ],
                                colSpan: 2,
                            },
                            {},
                            {
                                stack: [
                                    {
                                        text: "Religion",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.religion || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Civil Status",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.civil_status || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                        ],
                        [
                            {
                                stack: [
                                    {
                                        text: "Facebook Account",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.facebook || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                stack: [
                                    {
                                        text: "Email Address",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.email || "",
                                        fontSize: 10,
                                    },
                                ],
                                colSpan: 3,
                            },
                            {},
                            {},
                            {
                                stack: [
                                    {
                                        text: "Birthplace",
                                        bold: true,
                                        fontSize: 7,
                                        italics: true,
                                    },
                                    {
                                        text: personalInfo?.birthplace || "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },

            {
                text: "EDUCATIONAL BACKGROUND",
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5],
                decoration: "underline",
            },

            // Educational Background Table
            {
                table: {
                    headerRows: 1,
                    widths: ["auto", "*", "auto", "*"],
                    body: [
                        [
                            {
                                text: "PREVIOUS",
                                bold: true,
                                colSpan: 2,
                                alignment: "center",
                                fontSize: 10,
                            },
                            {},
                            {
                                text: "PRESENT",
                                bold: true,
                                colSpan: 2,
                                alignment: "center",
                                fontSize: 10,
                            },
                            {},
                        ],
                        [
                            { text: "School", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.previous_school ||
                                    "",
                                fontSize: 10,
                            },
                            {
                                text: "Incoming Grade/Year Level",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text:
                                    educationalBackground?.incoming_grade || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            { text: "Location", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.previous_location ||
                                    "",
                                fontSize: 10,
                            },
                            { text: "School", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.present_school || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            {
                                text: "Honor/Award",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text:
                                    educationalBackground?.previous_honor || "",
                                fontSize: 10,
                            },
                            { text: "Location", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.present_location ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                        [
                            { text: "GWA", bold: true, fontSize: 7 },
                            {
                                text: educationalBackground?.previous_gwa || "",
                                fontSize: 10,
                            },
                            { text: "Course 1", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.present_course1 ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                        [
                            {
                                text: "Course Taken",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text:
                                    educationalBackground?.previous_course ||
                                    "",
                                fontSize: 10,
                            },
                            { text: "Course 2", bold: true, fontSize: 7 },
                            {
                                text:
                                    educationalBackground?.present_course2 ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                    ],
                },
            },

            {
                text: "FAMILY INFORMATION",
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5],
                decoration: "underline",
            },
            {
                text: "A. Parent/Guardian",
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5],
            },

            // Parents/Guardian Table
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                        [
                            {
                                text: "NAME / AGE",
                                bold: true,
                                alignment: "center",
                                rowSpan: 2,
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "FATHER",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "MOTHER",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "GUARDIAN",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "Contact Person In Case of Emergency",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                        ],
                        [
                            { text: "", bold: true, fontSize: 7 },
                            {
                                text: [
                                    {
                                        text:
                                            familyInfo?.parents?.father_name ||
                                            "",
                                        fontSize: 10,
                                    },
                                    { text: " / ", fontSize: 10 },
                                    {
                                        text:
                                            familyInfo?.parents?.father_age ||
                                            "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                text: [
                                    {
                                        text:
                                            familyInfo?.parents?.mother_name ||
                                            "",
                                        fontSize: 10,
                                    },
                                    { text: " / ", fontSize: 10 },
                                    {
                                        text:
                                            familyInfo?.parents?.mother_age ||
                                            "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                text: [
                                    {
                                        text:
                                            familyInfo?.parents
                                                ?.guardian_name || "",
                                        fontSize: 10,
                                    },
                                    { text: " / ", fontSize: 10 },
                                    {
                                        text:
                                            familyInfo?.parents?.guardian_age ||
                                            "",
                                        fontSize: 10,
                                    },
                                ],
                            },
                            {
                                text:
                                    familyInfo?.contact
                                        ?.emergency_contact_name || "",
                                fontSize: 10,
                            },
                        ],

                        [
                            {
                                text: "Educational Attainment",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text:
                                    familyInfo?.parents?.father_education || "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.mother_education || "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.guardian_education ||
                                    "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.contact
                                        ?.emergency_contact_relationship || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            { text: "Occupation", bold: true, fontSize: 7 },
                            {
                                text:
                                    familyInfo?.parents?.father_occupation ||
                                    "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.mother_occupation ||
                                    "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.guardian_occupation ||
                                    "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.contact
                                        ?.emergency_contact_address || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            {
                                text: "Monthly Income",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text: familyInfo?.parents?.father_income || "",
                                fontSize: 10,
                            },
                            {
                                text: familyInfo?.parents?.mother_income || "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.guardian_income || "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.contact
                                        ?.emergency_contact_number || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            {
                                text: "Contact Number",
                                bold: true,
                                fontSize: 7,
                            },
                            {
                                text: familyInfo?.parents?.father_contact || "",
                                fontSize: 10,
                            },
                            {
                                text: familyInfo?.parents?.mother_contact || "",
                                fontSize: 10,
                            },
                            {
                                text:
                                    familyInfo?.parents?.guardian_contact || "",
                                fontSize: 10,
                            },
                            { text: "" },
                        ],
                    ],
                },
            },

            {
                text: "B. Siblings (Eldest to Youngest) including Family Member",
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5],
            },

            // Siblings Table
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
                    body: [
                        [
                            {
                                text: "NAME",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "RELATIONSHIP",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "AGE",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "GENDER",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "CIVIL STATUS",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "Living w/ Family or Not?",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "Educational Attainment / Occupation & Company Name",
                                bold: true,
                                alignment: "center",
                                fontSize: 5,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "Monthly Income",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                        ],
                        // Dynamically generate rows for siblings
                        ...(familyInfo?.siblings?.map((sibling) => [
                            { text: sibling.name || "", fontSize: 10 },
                            {
                                text: sibling.relationship || "",
                                fontSize: 10,
                            },
                            { text: sibling.age || "", fontSize: 10 },
                            { text: sibling.gender || "", fontSize: 10 },
                            {
                                text: sibling.civil_status || "",
                                fontSize: 10,
                            },
                            {
                                text: sibling.living_with_family || "",
                                fontSize: 10,
                            },
                            {
                                text: sibling.education_occupation || "",
                                fontSize: 10,
                            },
                            {
                                text: sibling.monthly_income || "",
                                fontSize: 10,
                            },
                        ]) || [
                            ["", "", "", "", "", "", "", ""],
                            ["", "", "", "", "", "", "", ""],
                            ["", "", "", "", "", "", "", ""],
                        ]),
                    ],
                },
            },

            {
                text: "C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance",
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5],
            },

            // Tzu Chi Siblings Table
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*", "*", "*"],
                    body: [
                        [
                            {
                                text: "NAME",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "YEAR LEVEL",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "SCHOOL",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "COURSE",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "SCHOOL YEAR",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                        ],
                        // Dynamically generate rows for tzu chi siblings
                        ...(familyInfo?.tzuChiSiblings?.map((sibling) => [
                            { text: sibling.name || "", fontSize: 10 },
                            {
                                text: sibling.year_level || "",
                                fontSize: 10,
                            },
                            { text: sibling.school || "", fontSize: 10 },
                            { text: sibling.course || "", fontSize: 10 },
                            {
                                text: sibling.school_year || "",
                                fontSize: 10,
                            },
                        ]) || [
                            ["", "", "", "", ""],
                            ["", "", "", "", ""],
                            ["", "", "", "", ""],
                        ]),
                    ],
                },
            },

            {
                text: "Assistance from Other Association, Organization, School Discount, etc.",
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5],
                decoration: "underline",
            },

            // Other Assistance Table
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*"],
                    body: [
                        [
                            {
                                text: "NAME OF COMPANY ORGANIZATION/ASSOCIATION",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "TYPE OF SUPPORT",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                            {
                                text: "HOW MUCH?",
                                bold: true,
                                alignment: "center",
                                fontSize: 7,
                                fillColor: "#f0f0f0",
                            },
                        ],
                        // Dynamically generate rows for other assistance
                        ...(otherAssistance?.map((assistance) => [
                            {
                                text: assistance.organization_name || "",
                                fontSize: 10,
                            },
                            {
                                text: assistance.support_type || "",
                                fontSize: 10,
                            },
                            { text: assistance.amount || "", fontSize: 10 },
                        ]) || [
                            ["", "", ""],
                            ["", "", ""],
                            ["", "", ""],
                        ]),
                    ],
                },
            },
        ];

        const docDefinition = {
            content: content,
            pageSize: {
                width: 612, // 8.5 inches
                height: 936, // 13 inches (long)
            },
            pageMargins: [20, 40, 20, 40],
            images: {}, // Optional for pre-defined images
        };

        // const docDefinition = {
        //     content: content,
        //     pageSize: "A4",
        //     pageMargins: [40, 40, 40, 40],
        //     defaultStyle: {
        //         fontSize: 10,
        //     },
        //     styles: {
        //         header: {
        //             fontSize: 18,
        //             bold: true,
        //             alignment: "center",
        //         },
        //         subheader: {
        //             fontSize: 14,
        //             bold: true,
        //             margin: [0, 10, 0, 5],
        //         },
        //     },
        // };

        const pdfDoc = pdfMake.createPdf(docDefinition);

        if (action === "download") {
            pdfDoc.download(`Student_Application_${applicationId}.pdf`);
        } else if (action === "view") {
            pdfDoc.open();
        }
    } catch (err) {
        console.error("Error creating PDF:", err);
        alert(`Error creating PDF: ${err.message}`);
    }
};

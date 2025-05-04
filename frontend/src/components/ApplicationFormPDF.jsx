import React, { useState, useEffect, useCallback } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import FormLogo from "/src/assets/form_logo.png";

// Set vfs fonts for pdfMake
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts.vfs;

const ApplicationFormPDF = ({ studentId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState(null);

    const getImageMimeType = useCallback((filePath) => {
        if (!filePath) return "image/jpeg"; // Default

        const extension = filePath.split(".").pop().toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "image/jpeg";
        }
    }, []);

    const arrayBufferToBase64 = useCallback((buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }, []);

    const fetchStudentData = useCallback(
        async (id) => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:8000/app/views/applications.php?applicationId=${id}`
                );
                const data = response.data;

                // Process requirements with images
                if (data.requirements) {
                    for (let i = 0; i < data.requirements.length; i++) {
                        const requirement = data.requirements[i];
                        if (requirement && requirement.file_path) {
                            try {
                                // Update the image path to include the full URL if it's not absolute
                                let imagePath = requirement.file_path;

                                // Check if path already starts with /public
                                if (!imagePath.startsWith("/public")) {
                                    imagePath = `/public${imagePath}`;
                                }

                                // Use the image-proxy.php script to fetch the image
                                const proxyUrl = `http://localhost:8000/app/views/image-proxy.php?path=${encodeURIComponent(
                                    imagePath
                                )}`;

                                console.log(`Fetching image from: ${proxyUrl}`);
                                const imageResponse = await axios.get(
                                    proxyUrl,
                                    {
                                        responseType: "arraybuffer",
                                    }
                                );

                                // Get MIME type from the response headers
                                const contentType =
                                    imageResponse.headers["content-type"] ||
                                    getImageMimeType(requirement.file_path);

                                // Convert array buffer to base64 string using browser-compatible method
                                const base64 = arrayBufferToBase64(
                                    imageResponse.data
                                );
                                const base64String = `data:${contentType};base64,${base64}`;

                                // Verify the image data is valid
                                if (!base64String.startsWith("data:image/")) {
                                    throw new Error(
                                        "Invalid image data format"
                                    );
                                }

                                // Store the base64 data in the requirements object
                                requirement.base64Data = base64String;

                                console.log(
                                    `Successfully processed image for requirement ${i}`
                                );
                            } catch (err) {
                                console.error(
                                    `Error fetching image for requirement ${i}:`,
                                    err
                                );
                                requirement.error = err.message;
                            }
                        }
                    }
                }

                setStudentData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError("Failed to load student data. Please try again.");
                setLoading(false);
            }
        },
        [arrayBufferToBase64, getImageMimeType]
    );

    useEffect(() => {
        // Fetch data when component mounts or studentId changes
        if (studentId) {
            fetchStudentData(studentId);
        }
    }, [studentId, fetchStudentData]);

    const [logoBase64, setLogoBase64] = useState("");

    useEffect(() => {
        const loadImage = async () => {
            const base64 = await toBase64(FormLogo);
            setLogoBase64(base64);
        };
        loadImage();
    }, []);

    const toBase64 = (filePath) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            fetch(filePath)
                .then((res) => res.blob())
                .then((blob) => {
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = (err) => reject(err);
                });
        });
    };

    const generatePDF = (action) => {
        if (!studentData) {
            alert("No student data available");
            return;
        }

        // Extract data for easier access
        const {
            applicationInfo,
            personalInfo,
            educationalBackground,
            familyInfo,
            otherAssistance,
            requirements,
        } = studentData;

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
                margin: [0, 20, 0, 0],
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
                            { text: "Honor/Award", bold: true, fontSize: 7 },
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
                            { text: "Course Taken", bold: true, fontSize: 7 },
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
                            { text: "Monthly Income", bold: true, fontSize: 7 },
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
                            { text: "Contact Number", bold: true, fontSize: 7 },
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
                            { text: sibling.relationship || "", fontSize: 10 },
                            { text: sibling.age || "", fontSize: 10 },
                            { text: sibling.gender || "", fontSize: 10 },
                            { text: sibling.civil_status || "", fontSize: 10 },
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
                            { text: sibling.year_level || "", fontSize: 10 },
                            { text: sibling.school || "", fontSize: 10 },
                            { text: sibling.course || "", fontSize: 10 },
                            { text: sibling.school_year || "", fontSize: 10 },
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

        console.log("Generating PDF with requirements:", requirements);

        // Inside your generatePDF function, when adding requirement images:
        const debugBase64Image = (base64String) => {
            if (!base64String) return "No data";
            const firstPart = base64String.substring(0, 30);
            const parts = base64String.split(",");
            const mimeInfo = parts[0];
            return `${firstPart}... (MIME: ${mimeInfo})`;
        };

        // Add a debugging function
        if (requirements && requirements.length > 0) {
            // Add a header for requirements section
            content.push({
                text: "REQUIREMENTS",
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5],
                decoration: "underline",
            });

            // Process each requirement
            requirements.forEach((requirement, index) => {
                if (requirement) {
                    // Add the requirement name or index if no name available
                    const requirementName =
                        requirement.requirement_type ||
                        `Requirement ${index + 1}`;
                    content.push({
                        text: formatRequirementName(requirementName),
                        fontSize: 12,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    });

                    // Check if we have base64 data for this requirement
                    if (
                        requirement.base64Data &&
                        requirement.base64Data.indexOf("data:") === 0
                    ) {
                        try {
                            console.log(`Adding image for ${requirementName}`);

                            // Add the image using the base64 data
                            content.push({
                                image: requirement.base64Data,
                                width: 400,
                                alignment: "center",
                                margin: [0, 5, 0, 15],
                            });
                        } catch (err) {
                            console.error(
                                `Error adding image for ${requirementName}:`,
                                err
                            );
                            content.push({
                                text: `Image could not be loaded: ${err.message}`,
                                fontSize: 10,
                                italics: true,
                                color: "red",
                                margin: [0, 5, 0, 15],
                            });
                        }
                    } else if (requirement.error) {
                        // If there was an error loading the image
                        content.push({
                            text: `Image could not be loaded: ${requirement.error}`,
                            fontSize: 10,
                            italics: true,
                            color: "red",
                            margin: [0, 5, 0, 15],
                        });
                    } else if (requirement.file_path) {
                        // If we have a file path but no base64 data
                        content.push({
                            text: `File path: ${requirement.file_path} (Unable to load image)`,
                            fontSize: 10,
                            italics: true,
                            margin: [0, 5, 0, 15],
                        });
                    } else {
                        // If we have neither
                        content.push({
                            text: "No file uploaded",
                            fontSize: 10,
                            italics: true,
                            margin: [0, 5, 0, 15],
                        });
                    }
                }
            });
        }

        // const docDefinition = {
        //     content: content,
        //     pageSize: "LETTER",
        //     pageMargins: [40, 40, 40, 40],
        //     images: {}, // This can be used if you want to pre-define images
        // };

        const docDefinition = {
            content: content,
            pageSize: {
                width: 612, // 8.5 inches
                height: 936, // 13 inches (long)
            },
            pageMargins: [20, 40, 20, 40],
            images: {}, // Optional for pre-defined images
        };

        try {
            const pdfDoc = pdfMake.createPdf(docDefinition);

            if (action === "download") {
                pdfDoc.download(`Student_Information_${studentId}.pdf`);
            } else if (action === "view") {
                pdfDoc.open();
            }
        } catch (err) {
            console.error("Error creating PDF:", err);
            alert(`Error creating PDF: ${err.message}`);
        }
    };

    const formatRequirementName = (key) => {
        return key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (loading) {
        return <div>Loading student data...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="inline">
            <button
                onClick={() => generatePDF("view")}
                className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                View PDF
            </button>
        </div>
    );
};

export default ApplicationFormPDF;

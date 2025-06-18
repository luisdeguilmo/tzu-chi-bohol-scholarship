import React, { useState, useEffect, useCallback } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import FormLogo from "/src/assets/form_logo.png";

// Set vfs fonts for pdfMake
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfFonts.vfs;

const ApplicationFormPDF = ({ studentId, imageURL }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    // Function to get profile picture as base64 using existing endpoint
    const getProfilePictureBase64 = async (applicationId) => {
        try {
            console.log(
                "Getting profile picture for application ID:",
                applicationId
            );

            // Use your existing profile picture endpoint
            const response = await axios.get(
                `http://localhost:8000/backend/api/applications/${applicationId}/2x2-picture`
            );

            console.log("Profile picture endpoint response:", response.data);

            // Assuming your endpoint returns the base64 data
            // Adjust this based on your actual response structure
            if (response.data && response.data.profile_picture_base64) {
                return response.data.profile_picture_base64;
            } else if (response.data && response.data.base64) {
                return response.data.base64;
            } else {
                console.warn("Unexpected response format:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error getting profile picture:", error);

            // Log more details for debugging
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }

            return null;
        }
    };

    // Convert FormLogo to base64 (keep existing method for local assets)
    const convertLogoToBase64 = async () => {
        try {
            const response = await fetch(FormLogo);
            if (!response.ok) {
                throw new Error(`Failed to fetch logo: ${response.status}`);
            }
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error converting logo to base64:", error);
            return null;
        }
    };

    const fetchStudentData = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `http://localhost:8000/app/views/applications.php?applicationId=${id}`
            );
            const data = response.data;
            console.log("Fetched student data:", data);
            setStudentData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fetch data when component mounts or studentId changes
        if (studentId) {
            fetchStudentData(studentId);
        }
    }, [studentId, fetchStudentData]);

    const generatePDF = async (action) => {
        if (!studentData) {
            alert("No student data available");
            return;
        }

        try {
            console.log("Starting PDF generation...");

            // Convert logo to base64
            const logoBase64 = await convertLogoToBase64();
            // const profilePictureBase64 = await getProfilePictureBase64(studentId);

            // Get profile picture as base64 using existing endpoint
            let profilePictureBase64 = null;
            if (studentId) {
                console.log(
                    "Getting profile picture for student ID:",
                    studentId
                );
                profilePictureBase64 = await getProfilePictureBase64(studentId);

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
                            margin: [0, 0, 0, 0]
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
                                                    personalInfo.first_name ||
                                                "",
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
                                            text:
                                                personalInfo?.home_address ||
                                                "",
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
                                            text:
                                                personalInfo?.subdivision || "",
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
                                                personalInfo?.contact_number ||
                                                "",
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
                                            text:
                                                personalInfo?.civil_status ||
                                                "",
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
                                            text:
                                                personalInfo?.birthplace || "",
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
                                        educationalBackground?.incoming_grade ||
                                        "",
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
                                        educationalBackground?.present_school ||
                                        "",
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
                                        educationalBackground?.previous_honor ||
                                        "",
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
                                    text:
                                        educationalBackground?.previous_gwa ||
                                        "",
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
                                                familyInfo?.parents
                                                    ?.father_name || "",
                                            fontSize: 10,
                                        },
                                        { text: " / ", fontSize: 10 },
                                        {
                                            text:
                                                familyInfo?.parents
                                                    ?.father_age || "",
                                            fontSize: 10,
                                        },
                                    ],
                                },
                                {
                                    text: [
                                        {
                                            text:
                                                familyInfo?.parents
                                                    ?.mother_name || "",
                                            fontSize: 10,
                                        },
                                        { text: " / ", fontSize: 10 },
                                        {
                                            text:
                                                familyInfo?.parents
                                                    ?.mother_age || "",
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
                                                familyInfo?.parents
                                                    ?.guardian_age || "",
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
                                        familyInfo?.parents?.father_education ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents?.mother_education ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents
                                            ?.guardian_education || "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.contact
                                            ?.emergency_contact_relationship ||
                                        "",
                                    fontSize: 10,
                                },
                            ],
                            [
                                { text: "Occupation", bold: true, fontSize: 7 },
                                {
                                    text:
                                        familyInfo?.parents
                                            ?.father_occupation || "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents
                                            ?.mother_occupation || "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents
                                            ?.guardian_occupation || "",
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
                                    text:
                                        familyInfo?.parents?.father_income ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents?.mother_income ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents?.guardian_income ||
                                        "",
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
                                    text:
                                        familyInfo?.parents?.father_contact ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents?.mother_contact ||
                                        "",
                                    fontSize: 10,
                                },
                                {
                                    text:
                                        familyInfo?.parents?.guardian_contact ||
                                        "",
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
                pdfDoc.download(`Student_Application_${studentId}.pdf`);
            } else if (action === "view") {
                pdfDoc.open();
            }
        } catch (err) {
            console.error("Error creating PDF:", err);
            alert(`Error creating PDF: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="inline">
                <span className="text-gray-500">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inline">
                <span className="text-red-500">{error}</span>
            </div>
        );
    }

    return (
        <div className="inline">
            <button
                onClick={() => generatePDF("view")}
                className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                disabled={!studentData}
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

            <button
                onClick={() => generatePDF("download")}
                className="inline-flex items-center text-green-600 hover:text-green-900 disabled:opacity-50"
                disabled={!studentData}
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                Download PDF
            </button>
        </div>
    );
};

export default ApplicationFormPDF;

// ...(profilePictureBase64
//                     ? [
//                           {
//                               text: "STUDENT PROFILE PICTURE",
//                               fontSize: 14,
//                               bold: true,
//                               decoration: "underline",
//                               alignment: "center",
//                               margin: [0, 20, 0, 10],
//                           },
//                           {
//                               image: profilePictureBase64,
//                               width: 150,
//                               height: 150,
//                               alignment: "center",
//                               margin: [0, 0, 0, 20],
//                           },
//                       ]
//                     : [
//                           {
//                               text: "No profile picture available",
//                               fontSize: 10,
//                               alignment: "center",
//                               italics: true,
//                               margin: [0, 20, 0, 0],
//                           },
//                       ]),

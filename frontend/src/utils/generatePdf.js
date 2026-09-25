// import { convertImageToBase64 } from "./convertImageToBase64";
// import FormLogo from "/src/assets/form_logo.png";

// // ---------------------------------------------------------------------------
// // Shared styling helpers (match the printed template)
// // ---------------------------------------------------------------------------
// const GREY = "#d9d9d9";

// const tableLayout = {
//     hLineWidth: () => 0.75,
//     vLineWidth: () => 0.75,
//     hLineColor: () => "#000000",
//     vLineColor: () => "#000000",
//     paddingLeft: () => 4,
//     paddingRight: () => 4,
//     paddingTop: () => 3,
//     paddingBottom: () => 3,
// };

// // Small italic bold label + value (used in the personal information table)
// const field = (label, value, extra = {}) => ({
//     stack: [
//         { text: label, bold: true, fontSize: 7, italics: true },
//         { text: value, fontSize: 10 },
//     ],
//     ...extra,
// });

// // Grey table header cell
// const th = (text, fontSize = 7, extra = {}) => ({
//     text,
//     bold: true,
//     alignment: "center",
//     fontSize,
//     fillColor: GREY,
//     ...extra,
// });

// // Row label (left column of the parent/guardian table)
// const rowLabel = (text) => ({
//     text,
//     bold: true,
//     fontSize: 8,
//     alignment: "right",
// });

// // Section heading (14pt bold underlined)
// const sectionHeading = (text) => ({
//     text,
//     fontSize: 14,
//     bold: true,
//     decoration: "underline",
//     margin: [0, 4, 0, 3],
// });

// // Sub heading (A. / B. / C.)
// const subHeading = (text) => ({
//     text,
//     fontSize: 10,
//     bold: true,
//     margin: [0, 4, 0, 3],
// });

// // Pad a list of rows with blank rows so the table looks like the template
// const padRows = (rows, min, cols) => {
//     const out = [...rows];
//     while (out.length < min) {
//         out.push(Array.from({ length: cols }, () => ({ text: "", fontSize: 10 })));
//     }
//     return out;
// };

// // Thick separator line used on page 2
// const thickLine = (width = 572, lineWidth = 3) => ({
//     canvas: [
//         {
//             type: "line",
//             x1: 0,
//             y1: 0,
//             x2: width,
//             y2: 0,
//             lineWidth,
//             lineColor: "#333333",
//         },
//     ],
//     margin: [0, 4, 0, 4],
// });

// const PRIVACY_POLICY =
//     "DATA PRIVACY POLICY: This form is strictly for Tzu Chi Bohol Office internal use only. Reproduction in all forms and mediums is strictly prohibited and requires permission from the management. Moreover, all personal information contained in this form remains confidential and will not be disclosed to a third party unless authorized by the signatory and/or management and /or required by governing institutional compliances.";

// const FORM_NUMBER = "Form No. SS-ME-001";

// // Course list (3 columns) - page 2
// const COURSES_COL_1 = [
//     "Bachelor of Science in Agriculture *",
//     "Bachelor of Science in Psychology",
//     "Bachelor of Science in Social Works *",
//     "Bachelor of Arts in English *",
//     "Bachelor of Science in Tourism Management",
//     "Bachelor of Science in Accountancy *",
//     "Bachelor of Science in Business Administration",
//     "Bachelor of Science in Office Administration",
//     "Bachelor of Science in Computer Science",
//     "Bachelor of Science in Information Technology *",
//     "Bachelor of Science in Computer Engineering *",
// ];
// const COURSES_COL_2 = [
//     "Bachelor of Science in Electronic Communication Engineering *",
//     "Bachelor of Science in Hospitality Management (BSHM)",
//     "Bachelor of Science in Tourism Management (BSTM)",
//     "Bachelor of Science in Economics",
//     "Bachelor of Science in Environmental Management",
//     "Bachelor of Arts in Communication *",
//     "Bachelor Science in Journalism *",
//     "Bachelor of Science in Development Communication *",
//     "Bachelor of Science in Mechanical Engineering *",
//     "Bachelor of Science in Electrical Engineering *",
//     "Bachelor of Science in Civil Engineering *",
// ];
// const COURSES_COL_3 = [
//     "Bachelor of Science in Industrial Engineering *",
//     "Bachelor of Science in Industrial Education/ Technology *",
//     "Bachelor of Science in Architecture (EVSU) *",
//     "Bachelor of Secondary Education",
//     "Bachelor of Science in Elementary Education",
//     "Bachelor of Science in Industrial Education *",
//     "Bachelor of Science in Chemistry *",
//     "Bachelor of Science in Biology *",
//     "Bachelor of Science in Nursing (VISCA) *",
//     "Bachelor of Science in Nutrition & Dietetics (EVSU) *",
//     "———————",
// ];

// const courseColumn = (list) => ({
//     width: "*",
//     stack: list.map((c) => ({ text: c, fontSize: 6.5, margin: [0, 0, 0, 4] })),
// });

// // Qualifications / requirements table cells
// const q = (text) => ({ text, fontSize: 7 });
// const REQUIREMENT_ROWS = [
//     [
//         q("1. Must be graduate or graduating senior high school."),
//         q("1 CTC form your School"),
//         q("Previous Report Card"),
//         q("Application"),
//     ],
//     [
//         q("2. GWA of 82% and up, no below grades 80."),
//         q("1 Original Copy"),
//         q("Barangay Certificate of Indigency"),
//         q("Examination"),
//     ],
//     [
//         q("3. Must be indigent & residing within the community adopted by Tzu Chi."),
//         q("1 CTC from your School"),
//         q("Good Moral Certificate"),
//         q("Interview"),
//     ],
//     [
//         q(
//             "4. Parents Annual Gross combine income must not be more than Php300,000 or for a family with a single earner / guardian of not more than Php150,000.",
//         ),
//         q("1 Photocopy"),
//         q(
//             "Both Parent or Guardian Latest BIR Income Tax Return Form 1700 or BIR Certificate of Exemption Form 2304 (if working) and Affidavit of Non-Filling of Income Tax Return of both parents ( if not working)",
//         ),
//         q("Case Visitation"),
//     ],
//     [
//         q("5. No vices and has a good moral character."),
//         q("1 Whole Bond Paper"),
//         q("Type Written Personal Autobiography (minimum of 500 words)"),
//         q("Examination"),
//     ],
//     [
//         q(""),
//         q("2 Photocopy"),
//         q("Utility Bills (Electric, Water, etc.) with Family address."),
//         q("Case Visitation"),
//     ],
//     [q(""), q("1 Original Copy"), q("PSA Birth Certificate"), q("Application")],
//     [
//         q(""),
//         q("2 Pieces"),
//         q("Latest 1x1 Picture with White Background (not pixilated, not cut)"),
//         q("Application"),
//     ],
// ];

// // Office-use table label cell
// const officeLabel = (text) => ({
//     text,
//     fontSize: 8,
//     alignment: "right",
//     margin: [0, 2, 0, 2],
// });
// const officeBlank = () => ({ text: "", fontSize: 8 });

// export const generatePDF = async (
//     type,
//     action,
//     applicationId,
//     scholarId,
//     applicantData,
//     pdfWindow,
// ) => {
//     const { getProfilePicture } = await import("./getPdfProfilePicture.js");
//     const { getRequirements } = await import("./getRequirements.js");

//     const pdfMakeModule = await import("pdfmake/build/pdfmake");
//     const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
//     const pdfMake = pdfMakeModule.default || pdfMakeModule;
//     const fontsExport = pdfFontsModule.default || pdfFontsModule;
//     const vfs = fontsExport.vfs || fontsExport.pdfMake?.vfs || fontsExport;
//     pdfMake.vfs = vfs;

//     if (!applicantData) {
//         alert("No student data available");
//         return;
//     }

//     try {
//         // Convert logo to base64
//         const logoBase64 = await convertImageToBase64(FormLogo);

//         // Get profile picture as base64 using existing endpoint
//         let profilePictureBase64 = null;
//         if (type === "new") {
//             if (applicationId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     applicationId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         } else {
//             if (scholarId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     scholarId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         }

//         let requirementsBase64 = null;
//         if (applicationId) {
//             requirementsBase64 = await getRequirements(applicationId);

//             if (!requirementsBase64) {
//                 console.warn(
//                     "Failed to get requirements, PDF will be generated without them",
//                 );
//             }
//         }

//         const requirementImages = [];
//         if (requirementsBase64 && Array.isArray(requirementsBase64)) {
//             requirementsBase64.forEach((requirement) => {
//                 if (requirement.success && requirement.base64) {
//                     requirementImages.push({
//                         image: requirement.base64,
//                         width: 500,
//                         alignment: "center",
//                         margin: [0, 10, 0, 10],
//                     });
//                 }
//             });
//         }

//         // Extract data for easier access
//         const {
//             applicationInfo,
//             personalInfo,
//             educationalBackground,
//             familyInfo,
//             otherAssistance,
//             characterReference,
//         } = applicantData;

//         const content = [
//             // ------------------------------------------------------------
//             // HEADER (unchanged)
//             // ------------------------------------------------------------
//             {
//                 image: logoBase64,
//                 width: 300,
//                 alignment: "center",
//                 absolutePosition: { y: 10 },
//             },
//             {
//                 text: "Tzu Chi Educational Assistance Program",
//                 fontSize: 12,
//                 bold: true,
//                 alignment: "center",
//                 margin: [0, 40, 0, 0],
//             },
//             // Only render the picture when one exists (pdfmake throws on null images)
//             ...(profilePictureBase64
//                 ? [
//                       {
//                           image: profilePictureBase64,
//                           width: 120,
//                           height: 110,
//                           alignment: "right",
//                           absolutePosition: { x: 5, y: 24 },
//                       },
//                   ]
//                 : []),
//             {
//                 text: "APPLICATION FORM",
//                 fontSize: 14,
//                 bold: true,
//                 decoration: "underline",
//                 alignment: "center",
//                 margin: [0, 0, 0, 20],
//             },

//             // ------------------------------------------------------------
//             // REMINDERS
//             // ------------------------------------------------------------
//             {
//                 text: [
//                     { text: "REMINDERS:", bold: true },
//                     " Please fill-up the form neatly & completely. Any misleading information may lead to disqualification.",
//                 ],
//                 fontSize: 10,
//                 margin: [0, 12, 0, 8],
//             },

//             // ------------------------------------------------------------
//             // PERSONAL INFORMATION
//             // ------------------------------------------------------------
//             {
//                 columns: [
//                     {
//                         width: "*",
//                         text: "PERSONAL INFORMATION",
//                         fontSize: 14,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "left",
//                     },
//                     {
//                         width: "auto",
//                         text: "Status: " + applicationInfo?.type,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 30, 0],
//                     },
//                     {
//                         width: "auto",
//                         text: "SY: " + applicationInfo.school_year,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 0, 0],
//                     },
//                 ],
//                 margin: [0, 0, 0, 2],
//             },

//             {
//                 table: {
//                     widths: [160, "*", "*", "*", "*"],
//                     body: [
//                         [
//                             field(
//                                 "Name (Last Name, First Name, Middle Name, Suffix)",
//                                 personalInfo?.last_name +
//                                     ", " +
//                                     personalInfo?.first_name +
//                                     ", " +
//                                     personalInfo?.middle_name +
//                                     ", " +
//                                     personalInfo?.suffix || "",
//                             ),
//                             field("Gender", personalInfo?.gender || ""),
//                             field("Age", personalInfo?.age || ""),
//                             field("Birthdate", personalInfo?.birthdate || "", {
//                                 colSpan: 2,
//                             }),
//                             {},
//                         ],
//                         [
//                             field("Home Address", personalInfo?.home_address || ""),
//                             field("Subd./Village", personalInfo?.subdivision || ""),
//                             field("Barangay", personalInfo?.barangay || ""),
//                             field("City/Municipality", personalInfo?.city || ""),
//                             field("Zip Code", personalInfo?.zip_code || ""),
//                         ],
//                         [
//                             field(
//                                 "Personal Contact",
//                                 personalInfo?.contact_number || "",
//                             ),
//                             field(
//                                 "Secondary Contact",
//                                 personalInfo?.secondary_contact || "",
//                                 { colSpan: 2 },
//                             ),
//                             {},
//                             field("Religion", personalInfo?.religion || ""),
//                             field("Civil Status", personalInfo?.civil_status || ""),
//                         ],
//                         [
//                             field("Facebook Account", personalInfo?.facebook || ""),
//                             field("Email Address", personalInfo?.email || "", {
//                                 colSpan: 3,
//                             }),
//                             {},
//                             {},
//                             field("Birthplace", personalInfo?.birthplace || ""),
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // EDUCATIONAL BACKGROUND
//             // ------------------------------------------------------------
//             sectionHeading("EDUCATIONAL BACKGROUND"),
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [55, "*", 85, "*"],
//                     body: [
//                         [
//                             {
//                                 text: "PREVIOUS",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                             {
//                                 text: "PRESENT",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                         ],
//                         [
//                             rowLabel("School"),
//                             {
//                                 text: educationalBackground?.previous_school || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel(
//                                 applicationInfo?.type === "New"
//                                     ? "Incoming Grade/Year Level"
//                                     : "Year Level",
//                             ),
//                             {
//                                 text:
//                                     applicationInfo?.type === "New"
//                                         ? educationalBackground?.incoming_grade || ""
//                                         : educationalBackground?.year_level || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Location"),
//                             {
//                                 text: educationalBackground?.previous_location || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("School"),
//                             {
//                                 text: educationalBackground?.present_school || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Honor/Award"),
//                             {
//                                 text: educationalBackground?.previous_honor || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Location"),
//                             {
//                                 text: educationalBackground?.present_location || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("GWA"),
//                             {
//                                 text: educationalBackground?.previous_gwa || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 1"),
//                             {
//                                 text: educationalBackground?.present_course1 || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Course Taken"),
//                             {
//                                 text: educationalBackground?.previous_course || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 2"),
//                             {
//                                 text: educationalBackground?.present_course2 || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // FAMILY INFORMATION
//             // ------------------------------------------------------------
//             sectionHeading("FAMILY INFORMATION"),
//             subHeading("A. Parent/Guardian"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [80, "*", "*", "*", 120],
//                     body: [
//                         [
//                             th("NAME / AGE", 8, { rowSpan: 2 }),
//                             th("FATHER", 8),
//                             th("MOTHER", 8),
//                             th("GUARDIAN", 8),
//                             th("Contact Person In Case of Emergency", 7),
//                         ],
//                         [
//                             {},
//                             {
//                                 text: [
//                                     {
//                                         text: familyInfo?.parents?.father_name || "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text: familyInfo?.parents?.father_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text: familyInfo?.parents?.mother_name || "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text: familyInfo?.parents?.mother_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text:
//                                             familyInfo?.parents?.guardian_name || "",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             (familyInfo?.parents?.guardian_name ===
//                                                 "" ||
//                                                 familyInfo?.parents?.guardian_name ===
//                                                     null) &&
//                                             familyInfo?.parents?.guardian_age < 1
//                                                 ? ""
//                                                 : " / ",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             familyInfo?.parents?.guardian_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_name || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Educational Attainment"),
//                             {
//                                 text: familyInfo?.parents?.father_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_relationship || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Occupation"),
//                             {
//                                 text: familyInfo?.parents?.father_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_address ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Monthly Income"),
//                             {
//                                 text: familyInfo?.parents?.father_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_income < 1
//                                         ? "0"
//                                         : familyInfo?.parents?.guardian_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: "",
//                             },
//                         ],
//                         [
//                             rowLabel("Contact Number"),
//                             {
//                                 text: familyInfo?.parents?.father_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_number ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading("B. Siblings (Eldest to Youngest) including Family Member"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [100, 62, 24, 42, 40, 40, "*", 58],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("RELATIONSHIP"),
//                             th("AGE"),
//                             th("GENDER"),
//                             th("CIVIL STATUS"),
//                             th("Living w/ Family or Not?"),
//                             th("Educational Attainment / Occupation & Company Name"),
//                             th("Monthly Income"),
//                         ],
//                         ...padRows(
//                             familyInfo?.siblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 { text: sibling?.relationship || "", fontSize: 10 },
//                                 { text: sibling?.age || "", fontSize: 10 },
//                                 { text: sibling?.gender || "", fontSize: 10 },
//                                 { text: sibling?.civil_status || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.living_with_family || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: sibling?.education_occupation || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: sibling?.monthly_income || "", fontSize: 10 },
//                             ]) || [],
//                             6,
//                             8,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading("C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [120, 55, "*", "*", 80],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("YEAR LEVEL"),
//                             th("SCHOOL"),
//                             th("COURSE"),
//                             th("SCHOOL YEAR"),
//                         ],
//                         ...padRows(
//                             familyInfo?.tzuChiSiblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 { text: sibling?.year_level || "", fontSize: 10 },
//                                 { text: sibling?.school || "", fontSize: 10 },
//                                 { text: sibling?.course || "", fontSize: 10 },
//                                 { text: sibling?.school_year || "", fontSize: 10 },
//                             ]) || [],
//                             2,
//                             5,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // OTHER ASSISTANCE
//             // ------------------------------------------------------------
//             {
//                 text: "Assistance from Other Association, Organization, School Discount, etc.",
//                 fontSize: 11,
//                 bold: true,
//                 decoration: "underline",
//                 margin: [0, 10, 0, 8],
//             },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ["*", "*", "*"],
//                     body: [
//                         [
//                             th("NAME OF COMPANY ORGANIZATION/ASSOCIATION"),
//                             th("TYPE OF SUPPORT"),
//                             th("HOW MUCH?"),
//                         ],
//                         ...padRows(
//                             otherAssistance?.map((assistance) => [
//                                 {
//                                     text: assistance?.organization_name || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: assistance?.support_type || "", fontSize: 10 },
//                                 { text: assistance?.amount || "", fontSize: 10 },
//                             ]) || [],
//                             2,
//                             3,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // PAGE 2
//             // ------------------------------------------------------------
//             {
//                 pageBreak: "before",
//                 stack: [
//                     {
//                         image: logoBase64,
//                         width: 300,
//                         alignment: "center",
//                         absolutePosition: { y: 10 },
//                     },
//                     {
//                         text: "What is your expectation from Tzu Chi Foundation?",
//                         fontSize: 12,
//                         bold: true,
//                         alignment: "left",
//                         margin: [0, 40, 0, 0],
//                     },
//                     thickLine(572, 1.5),
//                     {
//                         text: applicationInfo.expectation,
//                         fontSize: 10,
//                         alignment: "left",
//                         margin: [10, 4, 10, 4],
//                     },
//                     thickLine(572, 1.5),

//                     {
//                         text: [
//                             { text: "CHARACTER REFERENCE ", fontSize: 12, bold: true },
//                             {
//                                 text: "(Name 3 Person not related to your family who can vouch yourself)",
//                                 fontSize: 8,
//                                 italics: true,
//                             },
//                         ],
//                         margin: [0, 10, 0, 5],
//                     },

//                     {
//                         table: {
//                             headerRows: 1,
//                             widths: ["*", "*", "*", "*", "*"],
//                             body: [
//                                 [
//                                     th("NAME"),
//                                     th("ADDRESS"),
//                                     th("COMPANY"),
//                                     th("POSITION"),
//                                     th("CONTACT #"),
//                                 ],
//                                 ...padRows(
//                                     characterReference?.map((character) => [
//                                         { text: character?.name || "", fontSize: 10 },
//                                         { text: character?.address || "", fontSize: 10 },
//                                         { text: character?.company || "", fontSize: 10 },
//                                         { text: character?.position || "", fontSize: 10 },
//                                         {
//                                             text: character?.contact_number || "",
//                                             fontSize: 10,
//                                         },
//                                     ]) || [],
//                                     3,
//                                     5,
//                                 ),
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Attestation
//                     {
//                         text: "I hereby attest that the information I have provided is true and correct. I also consents Tzu Chi Foundation to obtain and retain my personal information for the purpose of this application.",
//                         fontSize: 10,
//                         italics: true,
//                         alignment: "center",
//                         margin: [10, 8, 10, 0],
//                     },

//                     // Signature line
//                     {
//                         canvas: [
//                             {
//                                 type: "line",
//                                 x1: 186,
//                                 y1: 0,
//                                 x2: 386,
//                                 y2: 0,
//                                 lineWidth: 1,
//                             },
//                         ],
//                         margin: [0, 30, 0, 3],
//                     },
//                     {
//                         text: "Applicant Name w/ Signature / Date",
//                         fontSize: 9,
//                         alignment: "center",
//                         margin: [0, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Senior high school track legend
//                     {
//                         columns: [
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "SENIOR HIGH SCHOOL TRACK LEGEND:",
//                                         fontSize: 9,
//                                         bold: true,
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "HUMM * ", bold: true },
//                                             "- Humanities & Social Sciences",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "STEM * ", bold: true },
//                                             "- Science, Technology, Engineering & Mathematics",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "GAS ", bold: true },
//                                             "- General Academic Strand",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                 ],
//                             },
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "The symbol appeared means priority & has higher chance to be accepted *",
//                                         fontSize: 7,
//                                         italics: true,
//                                         alignment: "right",
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "ABM * ", bold: true },
//                                             "- Accountancy, Business & Management",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "TVL ", bold: true },
//                                             "- Technical - Vocational - Livelihood",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             {
//                                                 text: "Specialization: choose ",
//                                                 italics: true,
//                                             },
//                                             {
//                                                 text: "your own specialization related to the course you want to take in college.",
//                                                 italics: true,
//                                             },
//                                         ],
//                                         fontSize: 7,
//                                         margin: [28, 0, 0, 0],
//                                     },
//                                 ],
//                             },
//                         ],
//                         margin: [15, 0, 0, 6],
//                     },

//                     {
//                         text: "List of Courses Accepted for College",
//                         fontSize: 11,
//                         bold: true,
//                         alignment: "center",
//                         margin: [0, 2, 0, 6],
//                     },
//                     {
//                         columns: [
//                             courseColumn(COURSES_COL_1),
//                             courseColumn(COURSES_COL_2),
//                             courseColumn(COURSES_COL_3),
//                         ],
//                         columnGap: 6,
//                     },
//                     {
//                         text: [
//                             { text: "NOTE: ", bold: true },
//                             "This symbol means “priority” and has a higher chance of being accepted into the program *",
//                         ],
//                         fontSize: 6.5,
//                         italics: true,
//                         margin: [0, 0, 0, 2],
//                     },

//                     thickLine(),

//                     // Qualifications / requirements
//                     {
//                         table: {
//                             headerRows: 2,
//                             widths: [190, 70, "*", 58],
//                             body: [
//                                 [
//                                     th("QUALIFICATIONS", 7, {
//                                         rowSpan: 2,
//                                         margin: [0, 8, 0, 0],
//                                     }),
//                                     th("REQUIREMENTS", 7, { colSpan: 3 }),
//                                     {},
//                                     {},
//                                 ],
//                                 [
//                                     {},
//                                     th("QUANTITY"),
//                                     th("DESCRIPTION"),
//                                     th("SUBMIT DURING:", 6),
//                                 ],
//                                 ...REQUIREMENT_ROWS,
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Instructions
//                     {
//                         text: "Read & understand instruction carefully:",
//                         fontSize: 9,
//                         bold: true,
//                         margin: [0, 8, 0, 2],
//                     },
//                     {
//                         ol: [
//                             "Priority applicant must study at any public/government colleges or state university.",
//                             "Only applicant with complete requirements will be accepted and undergo the process.",
//                             "Enclosed all the requirements in one (1) White Long Folder and fasten on the left.",
//                             "Applicant with failing grade or not meet the desired grade requirements will not be accepted.",
//                             "All applicant are subject to undergo process of application, home visitation, interview and approval.",
//                             "The applicant will received a notification reply either thru text messages or a letter on the acceptance or rejection of application.",
//                         ],
//                         fontSize: 8,
//                         margin: [8, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Office use table
//                     {
//                         table: {
//                             widths: [55, "*", 75, "*", 75, "*"],
//                             body: [
//                                 [
//                                     officeLabel("Office Received by:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Group / District:"),
//                                     officeBlank(),
//                                     officeLabel("Case Referred by:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     officeLabel("Date Received:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Volunteer:"),
//                                     officeBlank(),
//                                     officeLabel("Referral Contact #:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     {
//                                         text: "",
//                                         colSpan: 4,
//                                         border: [false, false, false, false],
//                                     },
//                                     {},
//                                     {},
//                                     {},
//                                     officeLabel("Relationship to Beneficiary:"),
//                                     officeBlank(),
//                                 ],
//                             ],
//                         },
//                         layout: tableLayout,
//                     },
//                 ],
//             },

//             // ------------------------------------------------------------
//             // REQUIREMENT IMAGES
//             // ------------------------------------------------------------
//             ...(requirementImages.length > 0
//                 ? [
//                       {
//                           pageBreak: "before",
//                           stack: [
//                               {
//                                   text: "Requirements",
//                                   fontSize: 16,
//                                   alignment: "center",
//                                   margin: [0, 0, 0, 10],
//                               },
//                               ...requirementImages,
//                           ],
//                       },
//                   ]
//                 : []),
//         ];

//         const docDefinition = {
//             content: content,
//             pageSize: {
//                 width: 612, // 8.5 inches
//                 height: 936, // 13 inches (long)
//             },
//             pageMargins: [20, 40, 20, 65],
//             defaultStyle: {
//                 fontSize: 10,
//             },
//             // Footer on every page: data privacy policy, page number, form number
//             footer: (currentPage) => ({
//                 margin: [20, 0, 20, 0],
//                 stack: [
//                     {
//                         text: PRIVACY_POLICY,
//                         fontSize: 6,
//                         italics: true,
//                         margin: [0, 0, 0, 4],
//                     },
//                     {
//                         columns: [
//                             { text: "", width: "*" },
//                             {
//                                 text: String(currentPage),
//                                 width: "auto",
//                                 fontSize: 8,
//                                 alignment: "center",
//                             },
//                             {
//                                 text: FORM_NUMBER,
//                                 width: "*",
//                                 fontSize: 8,
//                                 alignment: "right",
//                             },
//                         ],
//                     },
//                 ],
//             }),
//             images: {},
//         };

//         const pdfDoc = pdfMake.createPdf(docDefinition);

//         if (action === "download") {
//             pdfDoc.download(`Student_Application_${applicationId}.pdf`);
//         } else if (action === "view") {
//             pdfDoc.open(false, pdfWindow);
//         }
//     } catch (err) {
//         console.error("Error creating PDF:", err);
//         alert(`Error creating PDF: ${err.message}`);
//     }
// };

// import { convertImageToBase64 } from "./convertImageToBase64";
// import FormLogo from "/src/assets/form_logo.png";

// // ---------------------------------------------------------------------------
// // Fonts
// // Put the font files in /src/assets/fonts/.
// // Liberation Sans is metric-compatible with Arial. If you have the real Arial
// // (arial.ttf, arialbd.ttf, ariali.ttf, arialbi.ttf) or Tahoma Bold
// // (tahomabd.ttf), drop them in and just change the imports below.
// // ---------------------------------------------------------------------------

// import ArialRegular from "../assets/fonts/LiberationSans-Regular.ttf";
// import ArialBold from "../assets/fonts/LiberationSans-Bold.ttf";
// import ArialItalic from "../assets/fonts/LiberationSans-Italic.ttf";
// import ArialBoldItalic from "../assets/fonts/LiberationSans-BoldItalic.ttf";
// // import TahomaBold from "../assets/fonts/DejaVuSans-Bold.ttf"; // stand-in for tahomabd.ttf

// const FONT_FILES = {
//     "Arial-Regular.ttf": ArialRegular,
//     "Arial-Bold.ttf": ArialBold,
//     "Arial-Italic.ttf": ArialItalic,
//     "Arial-BoldItalic.ttf": ArialBoldItalic,
//     "Tahoma-Bold.ttf": ArialBold,
// };

// const PDF_FONTS = {
//     Roboto: {
//         normal: "Roboto-Regular.ttf",
//         bold: "Roboto-Medium.ttf",
//         italics: "Roboto-Italic.ttf",
//         bolditalics: "Roboto-MediumItalic.ttf",
//     },
//     Arial: {
//         normal: "Arial-Regular.ttf",
//         bold: "Arial-Bold.ttf",
//         italics: "Arial-Italic.ttf",
//         bolditalics: "Arial-BoldItalic.ttf",
//     },
//     Tahoma: {
//         normal: "Tahoma-Bold.ttf",
//         bold: "Tahoma-Bold.ttf",
//         italics: "Tahoma-Bold.ttf",
//         bolditalics: "Tahoma-Bold.ttf",
//     },
// };

// const arrayBufferToBase64 = (buffer) => {
//     const bytes = new Uint8Array(buffer);
//     const chunk = 0x8000;
//     let binary = "";
//     for (let i = 0; i < bytes.length; i += chunk) {
//         binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
//     }
//     return btoa(binary);
// };

// // Cache so the fonts are only downloaded once per page load
// let fontCache = null;
// const loadFonts = async () => {
//     if (fontCache) return fontCache;
//     const entries = await Promise.all(
//         Object.entries(FONT_FILES).map(async ([name, url]) => {
//             const res = await fetch(url);
//             if (!res.ok) throw new Error(`Failed to load font ${name}`);
//             return [name, arrayBufferToBase64(await res.arrayBuffer())];
//         }),
//     );
//     fontCache = Object.fromEntries(entries);
//     return fontCache;
// };

// // ---------------------------------------------------------------------------
// // Shared styling helpers (match the printed template)
// // ---------------------------------------------------------------------------
// const GREY = "#d9d9d9";

// const tableLayout = {
//     hLineWidth: () => 0.75,
//     vLineWidth: () => 0.75,
//     hLineColor: () => "#000000",
//     vLineColor: () => "#000000",
//     paddingLeft: () => 4,
//     paddingRight: () => 4,
//     paddingTop: () => 3,
//     paddingBottom: () => 3,
// };

// // Small italic bold label + value (used in the personal information table)
// const field = (label, value, extra = {}) => ({
//     stack: [
//         { text: label, bold: true, fontSize: 7, italics: true },
//         { text: value, fontSize: 10 },
//     ],
//     ...extra,
// });

// // Grey table header cell
// const th = (text, fontSize = 7, extra = {}) => ({
//     text,
//     bold: true,
//     alignment: "center",
//     fontSize,
//     fillColor: GREY,
//     ...extra,
// });

// // Row label (left column of the parent/guardian table)
// const rowLabel = (text) => ({
//     text,
//     bold: true,
//     fontSize: 8,
//     alignment: "right",
// });

// // Section heading (14pt bold underlined)
// const sectionHeading = (text) => ({
//     text,
//     fontSize: 14,
//     bold: true,
//     decoration: "underline",
//     margin: [0, 10, 0, 3],
// });

// // Sub heading (A. / B. / C.)
// const subHeading = (text) => ({
//     text,
//     fontSize: 10,
//     bold: true,
//     margin: [0, 8, 0, 3],
// });

// // Pad a list of rows with blank rows so the table looks like the template
// const padRows = (rows, min, cols) => {
//     const out = [...rows];
//     while (out.length < min) {
//         out.push(Array.from({ length: cols }, () => ({ text: "", fontSize: 10 })));
//     }
//     return out;
// };

// // Thick separator line used on page 2
// const thickLine = (width = 572, lineWidth = 3) => ({
//     canvas: [
//         {
//             type: "line",
//             x1: 0,
//             y1: 0,
//             x2: width,
//             y2: 0,
//             lineWidth,
//             lineColor: "#333333",
//         },
//     ],
//     margin: [0, 4, 0, 4],
// });

// const PRIVACY_POLICY =
//     "DATA PRIVACY POLICY: This form is strictly for Tzu Chi Bohol Office internal use only. Reproduction in all forms and mediums is strictly prohibited and requires permission from the management. Moreover, all personal information contained in this form remains confidential and will not be disclosed to a third party unless authorized by the signatory and/or management and /or required by governing institutional compliances.";

// const FORM_NUMBER = "Form No. SS-ME-001";

// // Course list (3 columns) - page 2
// const COURSES_COL_1 = [
//     "Bachelor of Science in Agriculture *",
//     "Bachelor of Science in Psychology",
//     "Bachelor of Science in Social Works *",
//     "Bachelor of Arts in English *",
//     "Bachelor of Science in Tourism Management",
//     "Bachelor of Science in Accountancy *",
//     "Bachelor of Science in Business Administration",
//     "Bachelor of Science in Office Administration",
//     "Bachelor of Science in Computer Science",
//     "Bachelor of Science in Information Technology *",
//     "Bachelor of Science in Computer Engineering *",
// ];
// const COURSES_COL_2 = [
//     "Bachelor of Science in Electronic Communication Engineering *",
//     "Bachelor of Science in Hospitality Management (BSHM)",
//     "Bachelor of Science in Tourism Management (BSTM)",
//     "Bachelor of Science in Economics",
//     "Bachelor of Science in Environmental Management",
//     "Bachelor of Arts in Communication *",
//     "Bachelor Science in Journalism *",
//     "Bachelor of Science in Development Communication *",
//     "Bachelor of Science in Mechanical Engineering *",
//     "Bachelor of Science in Electrical Engineering *",
//     "Bachelor of Science in Civil Engineering *",
// ];
// const COURSES_COL_3 = [
//     "Bachelor of Science in Industrial Engineering *",
//     "Bachelor of Science in Industrial Education/ Technology *",
//     "Bachelor of Science in Architecture (EVSU) *",
//     "Bachelor of Secondary Education",
//     "Bachelor of Science in Elementary Education",
//     "Bachelor of Science in Industrial Education *",
//     "Bachelor of Science in Chemistry *",
//     "Bachelor of Science in Biology *",
//     "Bachelor of Science in Nursing (VISCA) *",
//     "Bachelor of Science in Nutrition & Dietetics (EVSU) *",
//     "———————",
// ];

// const courseColumn = (list) => ({
//     width: "*",
//     stack: list.map((c) => ({ text: c, fontSize: 6.5, margin: [0, 0, 0, 4] })),
// });

// // Qualifications / requirements table cells
// const q = (text) => ({ text, fontSize: 7 });
// const REQUIREMENT_ROWS = [
//     [
//         q("1. Must be graduate or graduating senior high school."),
//         q("1 CTC form your School"),
//         q("Previous Report Card"),
//         q("Application"),
//     ],
//     [
//         q("2. GWA of 82% and up, no below grades 80."),
//         q("1 Original Copy"),
//         q("Barangay Certificate of Indigency"),
//         q("Examination"),
//     ],
//     [
//         q("3. Must be indigent & residing within the community adopted by Tzu Chi."),
//         q("1 CTC from your School"),
//         q("Good Moral Certificate"),
//         q("Interview"),
//     ],
//     [
//         q(
//             "4. Parents Annual Gross combine income must not be more than Php300,000 or for a family with a single earner / guardian of not more than Php150,000.",
//         ),
//         q("1 Photocopy"),
//         q(
//             "Both Parent or Guardian Latest BIR Income Tax Return Form 1700 or BIR Certificate of Exemption Form 2304 (if working) and Affidavit of Non-Filling of Income Tax Return of both parents ( if not working)",
//         ),
//         q("Case Visitation"),
//     ],
//     [
//         q("5. No vices and has a good moral character."),
//         q("1 Whole Bond Paper"),
//         q("Type Written Personal Autobiography (minimum of 500 words)"),
//         q("Examination"),
//     ],
//     [
//         q(""),
//         q("2 Photocopy"),
//         q("Utility Bills (Electric, Water, etc.) with Family address."),
//         q("Case Visitation"),
//     ],
//     [q(""), q("1 Original Copy"), q("PSA Birth Certificate"), q("Application")],
//     [
//         q(""),
//         q("2 Pieces"),
//         q("Latest 1x1 Picture with White Background (not pixilated, not cut)"),
//         q("Application"),
//     ],
// ];

// // Office-use table label cell
// const officeLabel = (text) => ({
//     text,
//     fontSize: 8,
//     alignment: "right",
//     margin: [0, 2, 0, 2],
// });
// const officeBlank = () => ({ text: "", fontSize: 8 });

// export const generatePDF = async (
//     type,
//     action,
//     applicationId,
//     scholarId,
//     applicantData,
//     pdfWindow,
// ) => {
//     const { getProfilePicture } = await import("./getPdfProfilePicture.js");
//     const { getRequirements } = await import("./getRequirements.js");

//     const pdfMakeModule = await import("pdfmake/build/pdfmake");
//     const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
//     const pdfMake = pdfMakeModule.default || pdfMakeModule;
//     const fontsExport = pdfFontsModule.default || pdfFontsModule;
//     const vfs = fontsExport.vfs || fontsExport.pdfMake?.vfs || fontsExport;
//     const customFonts = await loadFonts();
//     pdfMake.vfs = { ...vfs, ...customFonts };
//     pdfMake.fonts = PDF_FONTS;

//     if (!applicantData) {
//         alert("No student data available");
//         return;
//     }

//     try {
//         // Convert logo to base64
//         const logoBase64 = await convertImageToBase64(FormLogo);

//         // Get profile picture as base64 using existing endpoint
//         let profilePictureBase64 = null;
//         if (type === "new") {
//             if (applicationId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     applicationId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         } else {
//             if (scholarId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     scholarId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         }

//         let requirementsBase64 = null;
//         if (applicationId) {
//             requirementsBase64 = await getRequirements(applicationId);

//             if (!requirementsBase64) {
//                 console.warn(
//                     "Failed to get requirements, PDF will be generated without them",
//                 );
//             }
//         }

//         const requirementImages = [];
//         if (requirementsBase64 && Array.isArray(requirementsBase64)) {
//             requirementsBase64.forEach((requirement) => {
//                 if (requirement.success && requirement.base64) {
//                     requirementImages.push({
//                         image: requirement.base64,
//                         width: 500,
//                         alignment: "center",
//                         margin: [0, 10, 0, 10],
//                     });
//                 }
//             });
//         }

//         // Extract data for easier access
//         const {
//             applicationInfo,
//             personalInfo,
//             educationalBackground,
//             familyInfo,
//             otherAssistance,
//             characterReference,
//         } = applicantData;

//         const content = [
//             // ------------------------------------------------------------
//             // HEADER (unchanged)
//             // ------------------------------------------------------------
//             {
//                 image: logoBase64,
//                 width: 300,
//                 alignment: "center",
//                 absolutePosition: { y: 10 },
//             },
//             {
//                 text: "Tzu Chi Educational Assistance Program",
//                 font: "Tahoma",
//                 fontSize: 12,
//                 bold: true,
//                 alignment: "center",
//                 margin: [0, 40, 0, 0],
//             },
//             // Only render the picture when one exists (pdfmake throws on null images)
//             ...(profilePictureBase64
//                 ? [
//                       {
//                           image: profilePictureBase64,
//                           width: 100,
//                           height: 100,
//                           alignment: "right",
//                           absolutePosition: { x: 5, y: 24 },
//                       },
//                   ]
//                 : []),
//             {
//                 text: "APPLICATION FORM",
//                 font: "Tahoma",
//                 fontSize: 14,
//                 bold: true,
//                 decoration: "underline",
//                 alignment: "center",
//                 margin: [0, 0, 0, 20],
//             },

//             // ------------------------------------------------------------
//             // REMINDERS
//             // ------------------------------------------------------------
//             {
//                 text: [
//                     { text: "REMINDERS:", bold: true },
//                     " Please fill-up the form neatly & completely. Any misleading information may lead to disqualification.",
//                 ],
//                 fontSize: 10,
//                 margin: [0, 0, 0, 8],
//             },

//             // ------------------------------------------------------------
//             // PERSONAL INFORMATION
//             // ------------------------------------------------------------
//             {
//                 columns: [
//                     {
//                         width: "*",
//                         text: "PERSONAL INFORMATION",
//                         fontSize: 14,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "left",
//                     },
//                     {
//                         width: "auto",
//                         text: "Status: " + applicationInfo?.type,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 30, 0],
//                     },
//                     {
//                         width: "auto",
//                         text: "SY: " + applicationInfo.school_year,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 0, 0],
//                     },
//                 ],
//                 margin: [0, 0, 0, 2],
//             },

//             {
//                 table: {
//                     widths: [160, "*", "*", "*", "*"],
//                     body: [
//                         [
//                             field(
//                                 "Name (Last Name, First Name, Middle Name, Suffix)",
//                                 personalInfo?.last_name +
//                                     ", " +
//                                     personalInfo?.first_name +
//                                     ", " +
//                                     personalInfo?.middle_name +
//                                     ", " +
//                                     personalInfo?.suffix || "",
//                             ),
//                             field("Gender", personalInfo?.gender || ""),
//                             field("Age", personalInfo?.age || ""),
//                             field("Birthdate", personalInfo?.birthdate || "", {
//                                 colSpan: 2,
//                             }),
//                             {},
//                         ],
//                         [
//                             field("Home Address", personalInfo?.home_address || ""),
//                             field("Subd./Village", personalInfo?.subdivision || ""),
//                             field("Barangay", personalInfo?.barangay || ""),
//                             field("City/Municipality", personalInfo?.city || ""),
//                             field("Zip Code", personalInfo?.zip_code || ""),
//                         ],
//                         [
//                             field(
//                                 "Personal Contact",
//                                 personalInfo?.contact_number || "",
//                             ),
//                             field(
//                                 "Secondary Contact",
//                                 personalInfo?.secondary_contact || "",
//                                 { colSpan: 2 },
//                             ),
//                             {},
//                             field("Religion", personalInfo?.religion || ""),
//                             field("Civil Status", personalInfo?.civil_status || ""),
//                         ],
//                         [
//                             field("Facebook Account", personalInfo?.facebook || ""),
//                             field("Email Address", personalInfo?.email || "", {
//                                 colSpan: 3,
//                             }),
//                             {},
//                             {},
//                             field("Birthplace", personalInfo?.birthplace || ""),
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // EDUCATIONAL BACKGROUND
//             // ------------------------------------------------------------
//             sectionHeading("EDUCATIONAL BACKGROUND"),
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [55, "*", 85, "*"],
//                     body: [
//                         [
//                             {
//                                 text: "PREVIOUS",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                             {
//                                 text: "PRESENT",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                         ],
//                         [
//                             rowLabel("School"),
//                             {
//                                 text: educationalBackground?.previous_school || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel(
//                                 applicationInfo?.type === "New"
//                                     ? "Incoming Grade/Year Level"
//                                     : "Year Level",
//                             ),
//                             {
//                                 text:
//                                     applicationInfo?.type === "New"
//                                         ? educationalBackground?.incoming_grade || ""
//                                         : educationalBackground?.year_level || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Location"),
//                             {
//                                 text: educationalBackground?.previous_location || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("School"),
//                             {
//                                 text: educationalBackground?.present_school || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Honor/Award"),
//                             {
//                                 text: educationalBackground?.previous_honor || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Location"),
//                             {
//                                 text: educationalBackground?.present_location || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("GWA"),
//                             {
//                                 text: educationalBackground?.previous_gwa || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 1"),
//                             {
//                                 text: educationalBackground?.present_course1 || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Course Taken"),
//                             {
//                                 text: educationalBackground?.previous_course || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 2"),
//                             {
//                                 text: educationalBackground?.present_course2 || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // FAMILY INFORMATION
//             // ------------------------------------------------------------
//             sectionHeading("FAMILY INFORMATION"),
//             subHeading("A. Parent/Guardian"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [80, "*", "*", "*", 120],
//                     body: [
//                         [
//                             th("NAME / AGE", 8, { rowSpan: 2 }),
//                             th("FATHER", 8),
//                             th("MOTHER", 8),
//                             th("GUARDIAN", 8),
//                             th("Contact Person In Case of Emergency", 7),
//                         ],
//                         [
//                             {},
//                             {
//                                 text: [
//                                     {
//                                         text: familyInfo?.parents?.father_name || "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text: familyInfo?.parents?.father_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text: familyInfo?.parents?.mother_name || "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text: familyInfo?.parents?.mother_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text:
//                                             familyInfo?.parents?.guardian_name || "",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             (familyInfo?.parents?.guardian_name ===
//                                                 "" ||
//                                                 familyInfo?.parents?.guardian_name ===
//                                                     null) &&
//                                             familyInfo?.parents?.guardian_age < 1
//                                                 ? ""
//                                                 : " / ",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             familyInfo?.parents?.guardian_age || "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_name || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Educational Attainment"),
//                             {
//                                 text: familyInfo?.parents?.father_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_relationship || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Occupation"),
//                             {
//                                 text: familyInfo?.parents?.father_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_occupation || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_address ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Monthly Income"),
//                             {
//                                 text: familyInfo?.parents?.father_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_income < 1
//                                         ? "0"
//                                         : familyInfo?.parents?.guardian_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: "",
//                             },
//                         ],
//                         [
//                             rowLabel("Contact Number"),
//                             {
//                                 text: familyInfo?.parents?.father_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.guardian_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact?.emergency_contact_number ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading("B. Siblings (Eldest to Youngest) including Family Member"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [100, 62, 24, 42, 40, 40, "*", 58],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("RELATIONSHIP"),
//                             th("AGE"),
//                             th("GENDER"),
//                             th("CIVIL STATUS"),
//                             th("Living w/ Family or Not?"),
//                             th("Educational Attainment / Occupation & Company Name"),
//                             th("Monthly Income"),
//                         ],
//                         ...padRows(
//                             familyInfo?.siblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 { text: sibling?.relationship || "", fontSize: 10 },
//                                 { text: sibling?.age || "", fontSize: 10 },
//                                 { text: sibling?.gender || "", fontSize: 10 },
//                                 { text: sibling?.civil_status || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.living_with_family || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: sibling?.education_occupation || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: sibling?.monthly_income || "", fontSize: 10 },
//                             ]) || [],
//                             6,
//                             8,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading("C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [120, 55, "*", "*", 80],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("YEAR LEVEL"),
//                             th("SCHOOL"),
//                             th("COURSE"),
//                             th("SCHOOL YEAR"),
//                         ],
//                         ...padRows(
//                             familyInfo?.tzuChiSiblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 { text: sibling?.year_level || "", fontSize: 10 },
//                                 { text: sibling?.school || "", fontSize: 10 },
//                                 { text: sibling?.course || "", fontSize: 10 },
//                                 { text: sibling?.school_year || "", fontSize: 10 },
//                             ]) || [],
//                             2,
//                             5,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // OTHER ASSISTANCE
//             // ------------------------------------------------------------
//             {
//                 text: "Assistance from Other Association, Organization, School Discount, etc.",
//                 fontSize: 11,
//                 bold: true,
//                 decoration: "underline",
//                 margin: [0, 10, 0, 8],
//             },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ["*", "*", "*"],
//                     body: [
//                         [
//                             th("NAME OF COMPANY ORGANIZATION/ASSOCIATION"),
//                             th("TYPE OF SUPPORT"),
//                             th("HOW MUCH?"),
//                         ],
//                         ...padRows(
//                             otherAssistance?.map((assistance) => [
//                                 {
//                                     text: assistance?.organization_name || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: assistance?.support_type || "", fontSize: 10 },
//                                 { text: assistance?.amount || "", fontSize: 10 },
//                             ]) || [],
//                             2,
//                             3,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // PAGE 2
//             // ------------------------------------------------------------
//             {
//                 pageBreak: "before",
//                 stack: [
//                     {
//                         image: logoBase64,
//                         width: 300,
//                         alignment: "center",
//                         absolutePosition: { y: 10 },
//                     },
//                     {
//                         text: "What is your expectation from Tzu Chi Foundation?",
//                         fontSize: 12,
//                         bold: true,
//                         alignment: "left",
//                         margin: [0, 40, 0, 0],
//                     },
//                     thickLine(572, 1.5),
//                     {
//                         text: applicationInfo.expectation,
//                         fontSize: 10,
//                         alignment: "left",
//                         margin: [10, 4, 10, 4],
//                     },
//                     thickLine(572, 1.5),

//                     {
//                         text: [
//                             { text: "CHARACTER REFERENCE ", fontSize: 12, bold: true },
//                             {
//                                 text: "(Name 3 Person not related to your family who can vouch yourself)",
//                                 fontSize: 8,
//                                 italics: true,
//                             },
//                         ],
//                         margin: [0, 10, 0, 5],
//                     },

//                     {
//                         table: {
//                             headerRows: 1,
//                             widths: ["*", "*", "*", "*", "*"],
//                             body: [
//                                 [
//                                     th("NAME"),
//                                     th("ADDRESS"),
//                                     th("COMPANY"),
//                                     th("POSITION"),
//                                     th("CONTACT #"),
//                                 ],
//                                 ...padRows(
//                                     characterReference?.map((character) => [
//                                         { text: character?.name || "", fontSize: 10 },
//                                         { text: character?.address || "", fontSize: 10 },
//                                         { text: character?.company || "", fontSize: 10 },
//                                         { text: character?.position || "", fontSize: 10 },
//                                         {
//                                             text: character?.contact_number || "",
//                                             fontSize: 10,
//                                         },
//                                     ]) || [],
//                                     3,
//                                     5,
//                                 ),
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Attestation
//                     {
//                         text: "I hereby attest that the information I have provided is true and correct. I also consents Tzu Chi Foundation to obtain and retain my personal information for the purpose of this application.",
//                         fontSize: 10,
//                         italics: true,
//                         alignment: "center",
//                         margin: [10, 8, 10, 0],
//                     },

//                     // Signature line
//                     {
//                         canvas: [
//                             {
//                                 type: "line",
//                                 x1: 186,
//                                 y1: 0,
//                                 x2: 386,
//                                 y2: 0,
//                                 lineWidth: 1,
//                             },
//                         ],
//                         margin: [0, 30, 0, 3],
//                     },
//                     {
//                         text: "Applicant Name w/ Signature / Date",
//                         fontSize: 9,
//                         alignment: "center",
//                         margin: [0, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Senior high school track legend
//                     {
//                         columns: [
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "SENIOR HIGH SCHOOL TRACK LEGEND:",
//                                         fontSize: 9,
//                                         bold: true,
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "HUMM * ", bold: true },
//                                             "- Humanities & Social Sciences",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "STEM * ", bold: true },
//                                             "- Science, Technology, Engineering & Mathematics",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "GAS ", bold: true },
//                                             "- General Academic Strand",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                 ],
//                             },
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "The symbol appeared means priority & has higher chance to be accepted *",
//                                         fontSize: 7,
//                                         italics: true,
//                                         alignment: "right",
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "ABM * ", bold: true },
//                                             "- Accountancy, Business & Management",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "TVL ", bold: true },
//                                             "- Technical - Vocational - Livelihood",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             {
//                                                 text: "Specialization: choose ",
//                                                 italics: true,
//                                             },
//                                             {
//                                                 text: "your own specialization related to the course you want to take in college.",
//                                                 italics: true,
//                                             },
//                                         ],
//                                         fontSize: 7,
//                                         margin: [28, 0, 0, 0],
//                                     },
//                                 ],
//                             },
//                         ],
//                         margin: [15, 0, 0, 6],
//                     },

//                     {
//                         text: "List of Courses Accepted for College",
//                         fontSize: 11,
//                         bold: true,
//                         alignment: "center",
//                         margin: [0, 2, 0, 6],
//                     },
//                     {
//                         columns: [
//                             courseColumn(COURSES_COL_1),
//                             courseColumn(COURSES_COL_2),
//                             courseColumn(COURSES_COL_3),
//                         ],
//                         columnGap: 6,
//                     },
//                     {
//                         text: [
//                             { text: "NOTE: ", bold: true },
//                             "This symbol means “priority” and has a higher chance of being accepted into the program *",
//                         ],
//                         fontSize: 6.5,
//                         italics: true,
//                         margin: [0, 0, 0, 2],
//                     },

//                     thickLine(),

//                     // Qualifications / requirements
//                     {
//                         table: {
//                             headerRows: 2,
//                             widths: [190, 70, "*", 58],
//                             body: [
//                                 [
//                                     th("QUALIFICATIONS", 7, {
//                                         rowSpan: 2,
//                                         margin: [0, 8, 0, 0],
//                                     }),
//                                     th("REQUIREMENTS", 7, { colSpan: 3 }),
//                                     {},
//                                     {},
//                                 ],
//                                 [
//                                     {},
//                                     th("QUANTITY"),
//                                     th("DESCRIPTION"),
//                                     th("SUBMIT DURING:", 6),
//                                 ],
//                                 ...REQUIREMENT_ROWS,
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Instructions
//                     {
//                         text: "Read & understand instruction carefully:",
//                         fontSize: 9,
//                         bold: true,
//                         margin: [0, 8, 0, 2],
//                     },
//                     {
//                         ol: [
//                             "Priority applicant must study at any public/government colleges or state university.",
//                             "Only applicant with complete requirements will be accepted and undergo the process.",
//                             "Enclosed all the requirements in one (1) White Long Folder and fasten on the left.",
//                             "Applicant with failing grade or not meet the desired grade requirements will not be accepted.",
//                             "All applicant are subject to undergo process of application, home visitation, interview and approval.",
//                             "The applicant will received a notification reply either thru text messages or a letter on the acceptance or rejection of application.",
//                         ],
//                         fontSize: 8,
//                         margin: [8, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Office use table
//                     {
//                         table: {
//                             widths: [55, "*", 75, "*", 75, "*"],
//                             body: [
//                                 [
//                                     officeLabel("Office Received by:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Group / District:"),
//                                     officeBlank(),
//                                     officeLabel("Case Referred by:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     officeLabel("Date Received:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Volunteer:"),
//                                     officeBlank(),
//                                     officeLabel("Referral Contact #:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     {
//                                         text: "",
//                                         colSpan: 4,
//                                         border: [false, false, false, false],
//                                     },
//                                     {},
//                                     {},
//                                     {},
//                                     officeLabel("Relationship to Beneficiary:"),
//                                     officeBlank(),
//                                 ],
//                             ],
//                         },
//                         layout: tableLayout,
//                     },
//                 ],
//             },

//             // ------------------------------------------------------------
//             // REQUIREMENT IMAGES
//             // ------------------------------------------------------------
//             ...(requirementImages.length > 0
//                 ? [
//                       {
//                           pageBreak: "before",
//                           stack: [
//                               {
//                                   text: "Requirements",
//                                   fontSize: 16,
//                                   alignment: "center",
//                                   margin: [0, 0, 0, 10],
//                               },
//                               ...requirementImages,
//                           ],
//                       },
//                   ]
//                 : []),
//         ];

//         const docDefinition = {
//             content: content,
//             pageSize: {
//                 width: 612, // 8.5 inches
//                 height: 936, // 13 inches (long)
//             },
//             pageMargins: [20, 40, 20, 65],
//             defaultStyle: {
//                 font: "Arial",
//                 fontSize: 10,
//             },
//             // Footer on every page: data privacy policy, page number, form number
//             footer: (currentPage) => ({
//                 margin: [20, 0, 20, 0],
//                 stack: [
//                     {
//                         text: PRIVACY_POLICY,
//                         fontSize: 6,
//                         italics: true,
//                         margin: [0, 0, 0, 4],
//                     },
//                     {
//                         columns: [
//                             { text: "", width: "*" },
//                             {
//                                 text: String(currentPage),
//                                 width: "auto",
//                                 fontSize: 8,
//                                 alignment: "center",
//                             },
//                             {
//                                 text: FORM_NUMBER,
//                                 width: "*",
//                                 fontSize: 8,
//                                 alignment: "right",
//                             },
//                         ],
//                     },
//                 ],
//             }),
//             images: {},
//         };

//         const pdfDoc = pdfMake.createPdf(docDefinition);

//         if (action === "download") {
//             pdfDoc.download(`Student_Application_${applicationId}.pdf`);
//         } else if (action === "view") {
//             pdfDoc.open(false, pdfWindow);
//         }
//     } catch (err) {
//         console.error("Error creating PDF:", err);
//         alert(`Error creating PDF: ${err.message}`);
//     }
// };












// import { convertImageToBase64 } from "./convertImageToBase64";
// import FormLogo from "/src/assets/form_logo.png";

// // ---------------------------------------------------------------------------
// // Fonts
// // Put the font files in /src/assets/fonts/.
// // Liberation Sans is metric-compatible with Arial. If you have the real Arial
// // (arial.ttf, arialbd.ttf, ariali.ttf, arialbi.ttf) or Tahoma Bold
// // (tahomabd.ttf), drop them in and just change the imports below.
// // ---------------------------------------------------------------------------

// import ArialRegular from "/src/assets/fonts/LiberationSans-Regular.ttf";
// import ArialBold from "/src/assets/fonts/LiberationSans-Bold.ttf";
// import ArialItalic from "/src/assets/fonts/LiberationSans-Italic.ttf";
// import ArialBoldItalic from "/src/assets/fonts/LiberationSans-BoldItalic.ttf";
// import TahomaBold from "/src/assets/fonts/DejaVuSans-Bold.ttf"; // stand-in for tahomabd.ttf
// import MSGothic from "/src/assets/fonts/MS-PGothic.ttf";

// const FONT_FILES = {
//     "Arial-Regular.ttf": ArialRegular,
//     "Arial-Bold.ttf": ArialBold,
//     "Arial-Italic.ttf": ArialItalic,
//     "Arial-BoldItalic.ttf": ArialBoldItalic,
//     "Tahoma-Bold.ttf": TahomaBold,
//     "MS-PGothic.ttf": MSGothic,
// };

// // const {
// //     strands, // strand, description
// //     courses, // course
// //     qualifications, // qualification
// //     requirements, // quantity, description, submit
// //     instructions, // instruction
// // } = useCriteriaDataContext();

// const PDF_FONTS = {
//     Roboto: {
//         normal: "Roboto-Regular.ttf",
//         bold: "Roboto-Medium.ttf",
//         italics: "Roboto-Italic.ttf",
//         bolditalics: "Roboto-MediumItalic.ttf",
//     },
//     Arial: {
//         normal: "Arial-Regular.ttf",
//         bold: "Arial-Bold.ttf",
//         italics: "Arial-Italic.ttf",
//         bolditalics: "Arial-BoldItalic.ttf",
//     },
//     Tahoma: {
//         normal: "Tahoma-Bold.ttf",
//         bold: "Tahoma-Bold.ttf",
//         italics: "Tahoma-Bold.ttf",
//         bolditalics: "Tahoma-Bold.ttf",
//     },
//     Gothic: {
//         normal: "MS-PGothic.ttf",
//     },
// };

// const arrayBufferToBase64 = (buffer) => {
//     const bytes = new Uint8Array(buffer);
//     const chunk = 0x8000;
//     let binary = "";
//     for (let i = 0; i < bytes.length; i += chunk) {
//         binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
//     }
//     return btoa(binary);
// };

// // Works with both pdfmake 0.2.x (pdfMake.vfs / pdfMake.fonts) and
// // pdfmake 0.3.x (addVirtualFileSystem / addFonts)
// const registerFonts = (pdfMake, baseVfs, customFonts) => {
//     if (typeof pdfMake.addVirtualFileSystem === "function") {
//         // 0.3.x: only pass string (base64) entries
//         const baseFiles = Object.fromEntries(
//             Object.entries(baseVfs || {}).filter(
//                 ([, value]) => typeof value === "string",
//             ),
//         );
//         pdfMake.addVirtualFileSystem(baseFiles);
//         pdfMake.addVirtualFileSystem(customFonts);
//         pdfMake.addFonts(PDF_FONTS);
//     } else {
//         // 0.2.x
//         pdfMake.vfs = { ...baseVfs, ...customFonts };
//         pdfMake.fonts = PDF_FONTS;
//     }
// };

// // Cache so the fonts are only downloaded once per page load
// let fontCache = null;
// const loadFonts = async () => {
//     if (fontCache) return fontCache;
//     const entries = await Promise.all(
//         Object.entries(FONT_FILES).map(async ([name, url]) => {
//             const res = await fetch(url);
//             if (!res.ok) throw new Error(`Failed to load font ${name}`);
//             return [name, arrayBufferToBase64(await res.arrayBuffer())];
//         }),
//     );
//     fontCache = Object.fromEntries(entries);
//     return fontCache;
// };

// // ---------------------------------------------------------------------------
// // Shared styling helpers (match the printed template)
// // ---------------------------------------------------------------------------
// const GREY = "#d9d9d9";

// const tableLayout = {
//     hLineWidth: () => 0.75,
//     vLineWidth: () => 0.75,
//     hLineColor: () => "#000000",
//     vLineColor: () => "#000000",
//     paddingLeft: () => 4,
//     paddingRight: () => 4,
//     paddingTop: () => 3,
//     paddingBottom: () => 3,
// };

// // Small italic bold label + value (used in the personal information table)
// const field = (label, value, extra = {}) => ({
//     stack: [
//         { text: label, bold: true, fontSize: 6, italics: true },
//         { text: value, fontSize: 10 },
//     ],
//     ...extra,
// });

// const fieldWithExtra = (label, value, extra = {}) => ({
//     stack: [
//         {
//             text: label,
//             fontSize: 6,
//             italics: true,
//         },
//         { text: value, fontSize: 10 },
//     ],
//     ...extra,
// });

// // Grey table header cell
// const th = (text, fontSize = 7, extra = {}) => ({
//     text,
//     bold: true,
//     alignment: "center",
//     fontSize,
//     fillColor: GREY,
//     ...extra,
// });

// // Row label (left column of the parent/guardian table)
// const rowLabel = (text) => ({
//     text,
//     bold: true,
//     fontSize: 8,
//     alignment: "right",
// });

// // Section heading (14pt bold underlined)
// const sectionHeading = (text) => ({
//     text,
//     fontSize: 12,
//     bold: true,
//     decoration: "underline",
//     margin: [0, 3, 0, 1],
// });

// // Sub heading (A. / B. / C.)
// const subHeading = (text) => ({
//     text,
//     fontSize: 10,
//     bold: true,
//     margin: [0, 3, 0, 3],
// });

// // Pad a list of rows with blank rows so the table looks like the template
// const padRows = (rows, min, cols) => {
//     const out = [...rows];
//     while (out.length < min) {
//         out.push(
//             Array.from({ length: cols }, () => ({ text: "", fontSize: 8 })),
//         );
//     }
//     return out;
// };

// // Thick separator line used on page 2
// const thickLine = (width = 572, lineWidth = 3) => ({
//     canvas: [
//         {
//             type: "line",
//             x1: 0,
//             y1: 0,
//             x2: width,
//             y2: 0,
//             lineWidth,
//             lineColor: "#333333",
//         },
//     ],
//     margin: [0, 4, 0, 4],
// });

// const PRIVACY_POLICY =
//     "DATA PRIVACY POLICY: This form is strictly for Tzu Chi Bohol Office internal use only. Reproduction in all forms and mediums is strictly prohibited and requires permission from the management. Moreover, all personal information contained in this form remains confidential and will not be disclosed to a third party unless authorized by the signatory and/or management and /or required by governing institutional compliances.";

// const FORM_NUMBER = "Form No. SS-ME-001";

// // Course list (3 columns) - page 2
// const COURSES_COL_1 = [
//     "Bachelor of Science in Agriculture *",
//     "Bachelor of Science in Psychology",
//     "Bachelor of Science in Social Works *",
//     "Bachelor of Arts in English *",
//     "Bachelor of Science in Tourism Management",
//     "Bachelor of Science in Accountancy *",
//     "Bachelor of Science in Business Administration",
//     "Bachelor of Science in Office Administration",
//     "Bachelor of Science in Computer Science",
//     "Bachelor of Science in Information Technology *",
//     "Bachelor of Science in Computer Engineering *",
// ];
// const COURSES_COL_2 = [
//     "Bachelor of Science in Electronic Communication Engineering *",
//     "Bachelor of Science in Hospitality Management (BSHM)",
//     "Bachelor of Science in Tourism Management (BSTM)",
//     "Bachelor of Science in Economics",
//     "Bachelor of Science in Environmental Management",
//     "Bachelor of Arts in Communication *",
//     "Bachelor Science in Journalism *",
//     "Bachelor of Science in Development Communication *",
//     "Bachelor of Science in Mechanical Engineering *",
//     "Bachelor of Science in Electrical Engineering *",
//     "Bachelor of Science in Civil Engineering *",
// ];
// const COURSES_COL_3 = [
//     "Bachelor of Science in Industrial Engineering *",
//     "Bachelor of Science in Industrial Education/ Technology *",
//     "Bachelor of Science in Architecture (EVSU) *",
//     "Bachelor of Secondary Education",
//     "Bachelor of Science in Elementary Education",
//     "Bachelor of Science in Industrial Education *",
//     "Bachelor of Science in Chemistry *",
//     "Bachelor of Science in Biology *",
//     "Bachelor of Science in Nursing (VISCA) *",
//     "Bachelor of Science in Nutrition & Dietetics (EVSU) *",
//     "———————",
// ];

// const courseColumn = (list) => ({
//     width: "*",
//     stack: list.map((c) => ({ text: c, fontSize: 6.5, margin: [0, 0, 0, 4] })),
// });

// // Qualifications / requirements table cells
// const q = (text) => ({ text, fontSize: 7 });
// const REQUIREMENT_ROWS = [
//     [
//         q("1. Must be graduate or graduating senior high school."),
//         q("1 CTC form your School"),
//         q("Previous Report Card"),
//         q("Application"),
//     ],
//     [
//         q("2. GWA of 82% and up, no below grades 80."),
//         q("1 Original Copy"),
//         q("Barangay Certificate of Indigency"),
//         q("Examination"),
//     ],
//     [
//         q(
//             "3. Must be indigent & residing within the community adopted by Tzu Chi.",
//         ),
//         q("1 CTC from your School"),
//         q("Good Moral Certificate"),
//         q("Interview"),
//     ],
//     [
//         q(
//             "4. Parents Annual Gross combine income must not be more than Php300,000 or for a family with a single earner / guardian of not more than Php150,000.",
//         ),
//         q("1 Photocopy"),
//         q(
//             "Both Parent or Guardian Latest BIR Income Tax Return Form 1700 or BIR Certificate of Exemption Form 2304 (if working) and Affidavit of Non-Filling of Income Tax Return of both parents ( if not working)",
//         ),
//         q("Case Visitation"),
//     ],
//     [
//         q("5. No vices and has a good moral character."),
//         q("1 Whole Bond Paper"),
//         q("Type Written Personal Autobiography (minimum of 500 words)"),
//         q("Examination"),
//     ],
//     [
//         q(""),
//         q("2 Photocopy"),
//         q("Utility Bills (Electric, Water, etc.) with Family address."),
//         q("Case Visitation"),
//     ],
//     [q(""), q("1 Original Copy"), q("PSA Birth Certificate"), q("Application")],
//     [
//         q(""),
//         q("2 Pieces"),
//         q("Latest 1x1 Picture with White Background (not pixilated, not cut)"),
//         q("Application"),
//     ],
// ];

// // Office-use table label cell
// const officeLabel = (text) => ({
//     text,
//     fontSize: 8,
//     alignment: "right",
//     margin: [0, 2, 0, 2],
// });
// const officeBlank = () => ({ text: "", fontSize: 8 });

// export const generatePDF = async (
//     type,
//     action,
//     applicationId,
//     scholarId,
//     applicantData,
//     pdfWindow,
// ) => {
//     const { getProfilePicture } = await import("./getPdfProfilePicture.js");
//     const { getRequirements } = await import("./getRequirements.js");

//     const pdfMakeModule = await import("pdfmake/build/pdfmake");
//     const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
//     const pdfMake = pdfMakeModule.default || pdfMakeModule;
//     const fontsExport = pdfFontsModule.default || pdfFontsModule;
//     const vfs = fontsExport.vfs || fontsExport.pdfMake?.vfs || fontsExport;
//     const customFonts = await loadFonts();
//     registerFonts(pdfMake, vfs, customFonts);

//     if (!applicantData) {
//         alert("No student data available");
//         return;
//     }

//     try {
//         // Convert logo to base64
//         const logoBase64 = await convertImageToBase64(FormLogo);

//         // Get profile picture as base64 using existing endpoint
//         let profilePictureBase64 = null;
//         if (type === "new") {
//             if (applicationId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     applicationId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         } else {
//             if (scholarId) {
//                 profilePictureBase64 = await getProfilePicture(
//                     scholarId,
//                     "profile-picture",
//                 );

//                 if (!profilePictureBase64) {
//                     console.warn(
//                         "Failed to get profile picture, PDF will be generated without it",
//                     );
//                 }
//             }
//         }

//         let requirementsBase64 = null;
//         if (applicationId) {
//             requirementsBase64 = await getRequirements(applicationId);

//             if (!requirementsBase64) {
//                 console.warn(
//                     "Failed to get requirements, PDF will be generated without them",
//                 );
//             }
//         }

//         const requirementImages = [];
//         if (requirementsBase64 && Array.isArray(requirementsBase64)) {
//             requirementsBase64.forEach((requirement) => {
//                 if (requirement.success && requirement.base64) {
//                     requirementImages.push({
//                         image: requirement.base64,
//                         width: 500,
//                         alignment: "center",
//                         margin: [0, 10, 0, 10],
//                     });
//                 }
//             });
//         }

//         // Extract data for easier access
//         const {
//             applicationInfo,
//             personalInfo,
//             educationalBackground,
//             familyInfo,
//             otherAssistance,
//             characterReference,
//         } = applicantData;

//         const content = [
//             // ------------------------------------------------------------
//             // HEADER (unchanged)
//             // ------------------------------------------------------------
//             {
//                 image: logoBase64,
//                 width: 300,
//                 alignment: "center",
//                 absolutePosition: { y: 10 },
//             },
//             {
//                 text: "慈濟安心就學學費補助申請表",
//                 font: "Gothic",
//                 fontSize: 12,
//                 alignment: "center",
//                 margin: [0, 25, 0, 0],
//             },
//             {
//                 text: "Tzu Chi Educational Assistance Program",
//                 font: "Tahoma",
//                 fontSize: 12,
//                 bold: true,
//                 alignment: "center",
//                 margin: [0, 8, 0, 0],
//             },
//             // Only render the picture when one exists (pdfmake throws on null images)
//             ...(profilePictureBase64
//                 ? [
//                       {
//                           image: profilePictureBase64,
//                           width: 115,
//                           height: 105,
//                           alignment: "right",
//                           absolutePosition: { x: 5, y: 24 },
//                       },
//                   ]
//                 : []),
//             {
//                 text: "APPLICATION FORM",
//                 font: "Tahoma",
//                 fontSize: 14,
//                 bold: true,
//                 decoration: "underline",
//                 alignment: "center",
//                 margin: [0, 0, 0, 17],
//             },

//             // ------------------------------------------------------------
//             // REMINDERS
//             // ------------------------------------------------------------
//             {
//                 text: [
//                     { text: "REMINDERS:", bold: true },
//                     " Please fill-up the form neatly & completely. Any misleading information may lead to disqualification.",
//                 ],
//                 fontSize: 10,
//                 margin: [0, 0, 0, 8],
//             },

//             // ------------------------------------------------------------
//             // PERSONAL INFORMATION
//             // ------------------------------------------------------------
//             {
//                 columns: [
//                     {
//                         width: "*",
//                         text: "PERSONAL INFORMATION",
//                         fontSize: 12,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "left",
//                     },
//                     {
//                         width: "auto",
//                         text: "Status: " + applicationInfo?.type,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 30, 0],
//                     },
//                     {
//                         width: "auto",
//                         text: "SY: " + applicationInfo?.school_year,
//                         fontSize: 10,
//                         bold: true,
//                         decoration: "underline",
//                         alignment: "right",
//                         margin: [0, 4, 0, 0],
//                     },
//                 ],
//                 margin: [0, 0, 0, 2],
//             },
//             {
//                 table: {
//                     widths: [190, "*", "*", "*", "*"],
//                     body: [
//                         [
//                             fieldWithExtra(
//                                 [
//                                     { text: "Name", bold: true },
//                                     {
//                                         text: " (Last Name, First Name, Middle Name, Suffix)",
//                                     },
//                                 ],
//                                 [
//                                     personalInfo?.last_name
//                                         ? `${personalInfo.last_name},`
//                                         : "",
//                                     personalInfo?.first_name,
//                                     personalInfo?.middle_name,
//                                     personalInfo?.suffix
//                                         ? `, ${personalInfo.suffix}`
//                                         : "",
//                                 ]
//                                     .filter(Boolean)
//                                     .join(" ")
//                                     .trim() || "",
//                             ),
//                             field("Gender", personalInfo?.gender || ""),
//                             field("Age", personalInfo?.age || ""),
//                             field("Birthdate", personalInfo?.birthdate || "", {
//                                 colSpan: 2,
//                             }),
//                             {},
//                         ],
//                         [
//                             field(
//                                 "Home Address",
//                                 personalInfo?.home_address || "",
//                             ),
//                             field(
//                                 "Subd./Village",
//                                 personalInfo?.subdivision || "",
//                             ),
//                             field("Barangay", personalInfo?.barangay || ""),
//                             field(
//                                 "City/Municipality",
//                                 personalInfo?.city || "",
//                             ),
//                             field("Zip Code", personalInfo?.zip_code || ""),
//                         ],
//                         [
//                             field(
//                                 "Personal Contact",
//                                 personalInfo?.contact_number || "",
//                             ),
//                             field(
//                                 "Secondary Contact",
//                                 personalInfo?.secondary_contact || "",
//                                 { colSpan: 2 },
//                             ),
//                             {},
//                             field("Religion", personalInfo?.religion || ""),
//                             field(
//                                 "Civil Status",
//                                 personalInfo?.civil_status || "",
//                             ),
//                         ],
//                         [
//                             field(
//                                 "Facebook Account",
//                                 personalInfo?.facebook || "",
//                             ),
//                             field("Email Address", personalInfo?.email || "", {
//                                 colSpan: 3,
//                             }),
//                             {},
//                             {},
//                             field("Birthplace", personalInfo?.birthplace || ""),
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // EDUCATIONAL BACKGROUND
//             // ------------------------------------------------------------
//             sectionHeading("EDUCATIONAL BACKGROUND"),
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [40, "*", 45, "*"],
//                     body: [
//                         [
//                             {
//                                 text: "PREVIOUS",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                             {
//                                 text: "PRESENT",
//                                 bold: true,
//                                 colSpan: 2,
//                                 alignment: "center",
//                                 fontSize: 10,
//                             },
//                             {},
//                         ],
//                         [
//                             rowLabel("School"),
//                             {
//                                 text:
//                                     educationalBackground?.previous_school ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             rowLabel(
//                                 applicationInfo?.type === "New"
//                                     ? "Incoming Grade/Year Level"
//                                     : "Year Level",
//                             ),
//                             {
//                                 text:
//                                     applicationInfo?.type === "New"
//                                         ? educationalBackground?.incoming_grade ||
//                                           ""
//                                         : educationalBackground?.year_level ||
//                                           "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Location"),
//                             {
//                                 text:
//                                     educationalBackground?.previous_location ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("School"),
//                             {
//                                 text:
//                                     educationalBackground?.present_school || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Honor/Award"),
//                             {
//                                 text:
//                                     educationalBackground?.previous_honor || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Location"),
//                             {
//                                 text:
//                                     educationalBackground?.present_location ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("GWA"),
//                             {
//                                 text: educationalBackground?.previous_gwa || "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 1"),
//                             {
//                                 text:
//                                     educationalBackground?.present_course1 ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Course Taken"),
//                             {
//                                 text:
//                                     educationalBackground?.previous_course ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             rowLabel("Course 2"),
//                             {
//                                 text:
//                                     educationalBackground?.present_course2 ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // FAMILY INFORMATION
//             // ------------------------------------------------------------
//             sectionHeading("FAMILY INFORMATION"),
//             subHeading("A. Parent/Guardian"),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [80, "*", "*", "*", 120],
//                     body: [
//                         [
//                             th("NAME / AGE", 8, {
//                                 rowSpan: 2,
//                                 margin: [0, 12, 0, 0],
//                             }),
//                             th("FATHER", 8),
//                             th("MOTHER", 8),
//                             th("GUARDIAN", 8),
//                             th("Contact Person In Case of Emergency", 7),
//                         ],
//                         [
//                             {},
//                             {
//                                 text: [
//                                     {
//                                         text:
//                                             familyInfo?.parents?.father_name ||
//                                             "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text:
//                                             familyInfo?.parents?.father_age ||
//                                             "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text:
//                                             familyInfo?.parents?.mother_name ||
//                                             "",
//                                         fontSize: 10,
//                                     },
//                                     { text: " / ", fontSize: 10 },
//                                     {
//                                         text:
//                                             familyInfo?.parents?.mother_age ||
//                                             "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text: [
//                                     {
//                                         text:
//                                             familyInfo?.parents
//                                                 ?.guardian_name || "",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             (familyInfo?.parents
//                                                 ?.guardian_name === "" ||
//                                                 familyInfo?.parents
//                                                     ?.guardian_name === null) &&
//                                             familyInfo?.parents?.guardian_age <
//                                                 1
//                                                 ? ""
//                                                 : " / ",
//                                         fontSize: 10,
//                                     },
//                                     {
//                                         text:
//                                             familyInfo?.parents?.guardian_age ||
//                                             "",
//                                         fontSize: 10,
//                                     },
//                                 ],
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_name || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Educational Attainment"),
//                             {
//                                 text:
//                                     familyInfo?.parents?.father_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.mother_education || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_education ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_relationship || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Occupation"),
//                             {
//                                 text:
//                                     familyInfo?.parents?.father_occupation ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.mother_occupation ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_occupation ||
//                                     "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_address || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                         [
//                             rowLabel("Monthly Income"),
//                             {
//                                 text: familyInfo?.parents?.father_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_income < 1
//                                         ? "0"
//                                         : familyInfo?.parents
//                                               ?.guardian_income || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: "",
//                             },
//                         ],
//                         [
//                             rowLabel("Contact Number"),
//                             {
//                                 text: familyInfo?.parents?.father_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text: familyInfo?.parents?.mother_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.parents?.guardian_contact || "",
//                                 fontSize: 10,
//                             },
//                             {
//                                 text:
//                                     familyInfo?.contact
//                                         ?.emergency_contact_number || "",
//                                 fontSize: 10,
//                             },
//                         ],
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading(
//                 "B. Siblings (Eldest to Youngest) including Family Member",
//             ),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [100, 62, 24, 42, 40, 40, "*", 58],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("RELATIONSHIP"),
//                             th("AGE"),
//                             th("GENDER"),
//                             th("CIVIL STATUS"),
//                             th("Living w/ Family or Not?"),
//                             th(
//                                 "Educational Attainment / Occupation & Company Name",
//                             ),
//                             th("Monthly Income"),
//                         ],
//                         ...padRows(
//                             familyInfo?.siblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.relationship || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: sibling?.age || "", fontSize: 10 },
//                                 { text: sibling?.gender || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.civil_status || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: sibling?.living_with_family || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: sibling?.education_occupation || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: sibling?.monthly_income || "",
//                                     fontSize: 10,
//                                 },
//                             ]) || [],
//                             6,
//                             8,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             subHeading(
//                 "C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance",
//             ),

//             {
//                 table: {
//                     headerRows: 1,
//                     widths: [120, 55, "*", "*", 80],
//                     body: [
//                         [
//                             th("NAME"),
//                             th("YEAR LEVEL"),
//                             th("SCHOOL"),
//                             th("COURSE"),
//                             th("SCHOOL YEAR"),
//                         ],
//                         ...padRows(
//                             familyInfo?.tzuChiSiblings?.map((sibling) => [
//                                 { text: sibling?.name || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.year_level || "",
//                                     fontSize: 10,
//                                 },
//                                 { text: sibling?.school || "", fontSize: 10 },
//                                 { text: sibling?.course || "", fontSize: 10 },
//                                 {
//                                     text: sibling?.school_year || "",
//                                     fontSize: 10,
//                                 },
//                             ]) || [],
//                             2,
//                             5,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // OTHER ASSISTANCE
//             // ------------------------------------------------------------
//             {
//                 text: "Assistance from Other Association, Organization, School Discount, etc.",
//                 fontSize: 11,
//                 bold: true,
//                 decoration: "underline",
//                 margin: [0, 3, 0, 3],
//             },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ["*", "*", "*"],
//                     body: [
//                         [
//                             th("NAME OF COMPANY ORGANIZATION/ASSOCIATION"),
//                             th("TYPE OF SUPPORT"),
//                             th("HOW MUCH?"),
//                         ],
//                         ...padRows(
//                             otherAssistance?.map((assistance) => [
//                                 {
//                                     text: assistance?.organization_name || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: assistance?.support_type || "",
//                                     fontSize: 10,
//                                 },
//                                 {
//                                     text: assistance?.amount || "",
//                                     fontSize: 10,
//                                 },
//                             ]) || [],
//                             2,
//                             3,
//                         ),
//                     ],
//                 },
//                 layout: tableLayout,
//             },

//             // ------------------------------------------------------------
//             // PAGE 2
//             // ------------------------------------------------------------
//             {
//                 pageBreak: "before",
//                 stack: [
//                     {
//                         image: logoBase64,
//                         width: 300,
//                         alignment: "center",
//                         absolutePosition: { y: 10 },
//                     },
//                     {
//                         text: "What is your expectation from Tzu Chi Foundation?",
//                         fontSize: 12,
//                         bold: true,
//                         alignment: "left",
//                         margin: [0, 40, 0, 0],
//                     },
//                     // thickLine(572, 1.5),
//                     {
//                         text: applicationInfo?.expectation,
//                         fontSize: 10,
//                         alignment: "left",
//                         margin: [10, 4, 10, 4],
//                     },
//                     thickLine(572, 1.5),

//                     {
//                         text: [
//                             {
//                                 text: "CHARACTER REFERENCE ",
//                                 fontSize: 12,
//                                 bold: true,
//                             },
//                             {
//                                 text: "(Name 3 Person not related to your family who can vouch yourself)",
//                                 fontSize: 8,
//                                 italics: true,
//                             },
//                         ],
//                         margin: [0, 10, 0, 5],
//                     },

//                     {
//                         table: {
//                             headerRows: 1,
//                             widths: ["*", "*", "*", "*", "*"],
//                             body: [
//                                 [
//                                     th("NAME"),
//                                     th("ADDRESS"),
//                                     th("COMPANY"),
//                                     th("POSITION"),
//                                     th("CONTACT #"),
//                                 ],
//                                 ...padRows(
//                                     characterReference?.map((character) => [
//                                         {
//                                             text: character?.name || "",
//                                             fontSize: 10,
//                                         },
//                                         {
//                                             text: character?.address || "",
//                                             fontSize: 10,
//                                         },
//                                         {
//                                             text: character?.company || "",
//                                             fontSize: 10,
//                                         },
//                                         {
//                                             text: character?.position || "",
//                                             fontSize: 10,
//                                         },
//                                         {
//                                             text:
//                                                 character?.contact_number || "",
//                                             fontSize: 10,
//                                         },
//                                     ]) || [],
//                                     3,
//                                     5,
//                                 ),
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Attestation
//                     {
//                         text: "I hereby attest that the information I have provided is true and correct. I also consents Tzu Chi Foundation to obtain and retain my personal information for the purpose of this application.",
//                         fontSize: 10,
//                         italics: true,
//                         alignment: "center",
//                         margin: [10, 8, 10, 0],
//                     },

//                     // Signature line
//                     {
//                         canvas: [
//                             {
//                                 type: "line",
//                                 x1: 186,
//                                 y1: 0,
//                                 x2: 386,
//                                 y2: 0,
//                                 lineWidth: 1,
//                             },
//                         ],
//                         margin: [0, 30, 0, 3],
//                     },
//                     {
//                         text: "Applicant Name w/ Signature / Date",
//                         fontSize: 9,
//                         alignment: "center",
//                         margin: [0, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Senior high school track legend
//                     {
//                         columns: [
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "SENIOR HIGH SCHOOL TRACK LEGEND:",
//                                         fontSize: 9,
//                                         bold: true,
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "HUMM * ", bold: true },
//                                             "- Humanities & Social Sciences",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "STEM * ", bold: true },
//                                             "- Science, Technology, Engineering & Mathematics",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "GAS ", bold: true },
//                                             "- General Academic Strand",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                 ],
//                             },
//                             {
//                                 width: "*",
//                                 stack: [
//                                     {
//                                         text: "The symbol appeared means priority & has higher chance to be accepted *",
//                                         fontSize: 7,
//                                         italics: true,
//                                         alignment: "right",
//                                         margin: [0, 0, 0, 2],
//                                     },
//                                     {
//                                         text: [
//                                             { text: "ABM * ", bold: true },
//                                             "- Accountancy, Business & Management",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             { text: "TVL ", bold: true },
//                                             "- Technical - Vocational - Livelihood",
//                                         ],
//                                         fontSize: 8,
//                                     },
//                                     {
//                                         text: [
//                                             {
//                                                 text: "Specialization: choose ",
//                                                 italics: true,
//                                             },
//                                             {
//                                                 text: "your own specialization related to the course you want to take in college.",
//                                                 italics: true,
//                                             },
//                                         ],
//                                         fontSize: 7,
//                                         margin: [28, 0, 0, 0],
//                                     },
//                                 ],
//                             },
//                         ],
//                         margin: [15, 0, 0, 6],
//                     },

//                     {
//                         text: "List of Courses Accepted for College",
//                         fontSize: 11,
//                         bold: true,
//                         alignment: "center",
//                         margin: [0, 2, 0, 6],
//                     },
//                     {
//                         columns: [
//                             courseColumn(COURSES_COL_1),
//                             courseColumn(COURSES_COL_2),
//                             courseColumn(COURSES_COL_3),
//                         ],
//                         columnGap: 6,
//                     },
//                     {
//                         text: [
//                             { text: "NOTE: ", bold: true },
//                             "This symbol means “priority” and has a higher chance of being accepted into the program *",
//                         ],
//                         fontSize: 6.5,
//                         italics: true,
//                         margin: [0, 0, 0, 2],
//                     },

//                     thickLine(),

//                     // Qualifications / requirements
//                     {
//                         table: {
//                             headerRows: 2,
//                             widths: [190, 70, "*", 58],
//                             body: [
//                                 [
//                                     th("QUALIFICATIONS", 7, {
//                                         rowSpan: 2,
//                                         margin: [0, 8, 0, 0],
//                                     }),
//                                     th("REQUIREMENTS", 7, { colSpan: 3 }),
//                                     {},
//                                     {},
//                                 ],
//                                 [
//                                     {},
//                                     th("QUANTITY"),
//                                     th("DESCRIPTION"),
//                                     th("SUBMIT DURING:", 6),
//                                 ],
//                                 ...REQUIREMENT_ROWS,
//                             ],
//                         },
//                         layout: tableLayout,
//                     },

//                     // Instructions
//                     {
//                         text: "Read & understand instruction carefully:",
//                         fontSize: 9,
//                         bold: true,
//                         margin: [0, 8, 0, 2],
//                     },
//                     {
//                         ol: [
//                             "Priority applicant must study at any public/government colleges or state university.",
//                             "Only applicant with complete requirements will be accepted and undergo the process.",
//                             "Enclosed all the requirements in one (1) White Long Folder and fasten on the left.",
//                             "Applicant with failing grade or not meet the desired grade requirements will not be accepted.",
//                             "All applicant are subject to undergo process of application, home visitation, interview and approval.",
//                             "The applicant will received a notification reply either thru text messages or a letter on the acceptance or rejection of application.",
//                         ],
//                         fontSize: 8,
//                         margin: [8, 0, 0, 4],
//                     },

//                     thickLine(),

//                     // Office use table
//                     {
//                         table: {
//                             widths: [55, "*", 75, "*", 75, "*"],
//                             body: [
//                                 [
//                                     officeLabel("Office Received by:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Group / District:"),
//                                     officeBlank(),
//                                     officeLabel("Case Referred by:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     officeLabel("Date Received:"),
//                                     officeBlank(),
//                                     officeLabel("Assigned Volunteer:"),
//                                     officeBlank(),
//                                     officeLabel("Referral Contact #:"),
//                                     officeBlank(),
//                                 ],
//                                 [
//                                     {
//                                         text: "",
//                                         colSpan: 4,
//                                         border: [false, false, false, false],
//                                     },
//                                     {},
//                                     {},
//                                     {},
//                                     officeLabel("Relationship to Beneficiary:"),
//                                     officeBlank(),
//                                 ],
//                             ],
//                         },
//                         layout: tableLayout,
//                     },
//                 ],
//             },

//             // ------------------------------------------------------------
//             // REQUIREMENT IMAGES
//             // ------------------------------------------------------------
//             ...(requirementImages.length > 0
//                 ? [
//                       {
//                           pageBreak: "before",
//                           stack: [
//                               {
//                                   text: "Requirements",
//                                   fontSize: 16,
//                                   alignment: "center",
//                                   margin: [0, 0, 0, 10],
//                               },
//                               ...requirementImages,
//                           ],
//                       },
//                   ]
//                 : []),
//         ];

//         const docDefinition = {
//             content: content,
//             pageSize: {
//                 width: 612, // 8.5 inches
//                 height: 936, // 13 inches (long)
//             },
//             pageMargins: [20, 40, 20, 65],
//             defaultStyle: {
//                 font: "Arial",
//                 fontSize: 10,
//             },
//             // Footer on every page: data privacy policy, page number, form number
//             footer: (currentPage) => ({
//                 margin: [35, 0, 35, 0],
//                 stack: [
//                     {
//                         text: PRIVACY_POLICY,
//                         fontSize: 6,
//                         lineHeight: 1.5,
//                         italics: true,
//                         margin: [0, 0, 0, 8],
//                     },
//                     {
//                         columns: [
//                             { text: "", width: "*" },
//                             {
//                                 text: String(currentPage),
//                                 width: "auto",
//                                 fontSize: 8,
//                                 alignment: "center",
//                             },
//                             {
//                                 text: FORM_NUMBER,
//                                 width: "*",
//                                 fontSize: 8,
//                                 alignment: "right",
//                             },
//                         ],
//                     },
//                 ],
//             }),
//             images: {},
//         };

//         const pdfDoc = pdfMake.createPdf(docDefinition);

//         if (action === "download") {
//             pdfDoc.download(`Student_Application_${applicationId}.pdf`);
//         } else if (action === "view") {
//             pdfDoc.open(false, pdfWindow);
//         }
//     } catch (err) {
//         console.error("Error creating PDF:", err);
//         alert(`Error creating PDF: ${err.message}`);
//     }
// };



















import { convertImageToBase64 } from "./convertImageToBase64";
import FormLogo from "/src/assets/form_logo.png";

// ---------------------------------------------------------------------------
// Fonts
// Put the font files in /src/assets/fonts/.
// Liberation Sans is metric-compatible with Arial. If you have the real Arial
// (arial.ttf, arialbd.ttf, ariali.ttf, arialbi.ttf) or Tahoma Bold
// (tahomabd.ttf), drop them in and just change the imports below.
// ---------------------------------------------------------------------------

import ArialRegular from "/src/assets/fonts/LiberationSans-Regular.ttf";
import ArialBold from "/src/assets/fonts/LiberationSans-Bold.ttf";
import ArialItalic from "/src/assets/fonts/LiberationSans-Italic.ttf";
import ArialBoldItalic from "/src/assets/fonts/LiberationSans-BoldItalic.ttf";
import TahomaBold from "/src/assets/fonts/DejaVuSans-Bold.ttf"; // stand-in for tahomabd.ttf
import MSGothic from "/src/assets/fonts/MS-PGothic.ttf";

const FONT_FILES = {
    "Arial-Regular.ttf": ArialRegular,
    "Arial-Bold.ttf": ArialBold,
    "Arial-Italic.ttf": ArialItalic,
    "Arial-BoldItalic.ttf": ArialBoldItalic,
    "Tahoma-Bold.ttf": TahomaBold,
    "MS-PGothic.ttf": MSGothic,
};

const PDF_FONTS = {
    Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
    },
    Arial: {
        normal: "Arial-Regular.ttf",
        bold: "Arial-Bold.ttf",
        italics: "Arial-Italic.ttf",
        bolditalics: "Arial-BoldItalic.ttf",
    },
    Tahoma: {
        normal: "Tahoma-Bold.ttf",
        bold: "Tahoma-Bold.ttf",
        italics: "Tahoma-Bold.ttf",
        bolditalics: "Tahoma-Bold.ttf",
    },
    Gothic: {
        normal: "MS-PGothic.ttf",
    },
};

const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
};

// Works with both pdfmake 0.2.x (pdfMake.vfs / pdfMake.fonts) and
// pdfmake 0.3.x (addVirtualFileSystem / addFonts)
const registerFonts = (pdfMake, baseVfs, customFonts) => {
    if (typeof pdfMake.addVirtualFileSystem === "function") {
        // 0.3.x: only pass string (base64) entries
        const baseFiles = Object.fromEntries(
            Object.entries(baseVfs || {}).filter(
                ([, value]) => typeof value === "string",
            ),
        );
        pdfMake.addVirtualFileSystem(baseFiles);
        pdfMake.addVirtualFileSystem(customFonts);
        pdfMake.addFonts(PDF_FONTS);
    } else {
        // 0.2.x
        pdfMake.vfs = { ...baseVfs, ...customFonts };
        pdfMake.fonts = PDF_FONTS;
    }
};

// Cache so the fonts are only downloaded once per page load
let fontCache = null;
const loadFonts = async () => {
    if (fontCache) return fontCache;
    const entries = await Promise.all(
        Object.entries(FONT_FILES).map(async ([name, url]) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load font ${name}`);
            return [name, arrayBufferToBase64(await res.arrayBuffer())];
        }),
    );
    fontCache = Object.fromEntries(entries);
    return fontCache;
};

// ---------------------------------------------------------------------------
// Shared styling helpers (match the printed template)
// ---------------------------------------------------------------------------
const GREY = "#d9d9d9";

const tableLayout = {
    hLineWidth: () => 0.75,
    vLineWidth: () => 0.75,
    hLineColor: () => "#000000",
    vLineColor: () => "#000000",
    paddingLeft: () => 4,
    paddingRight: () => 4,
    paddingTop: () => 3,
    paddingBottom: () => 3,
};

// Small italic bold label + value (used in the personal information table)
const field = (label, value, extra = {}) => ({
    stack: [
        { text: label, bold: true, fontSize: 6, italics: true },
        { text: value, fontSize: 10 },
    ],
    ...extra,
});

const fieldWithExtra = (label, value, extra = {}) => ({
    stack: [
        {
            text: label,
            fontSize: 6,
            italics: true,
        },
        { text: value, fontSize: 10 },
    ],
    ...extra,
});

// Grey table header cell
const th = (text, fontSize = 7, extra = {}) => ({
    text,
    bold: true,
    alignment: "center",
    fontSize,
    fillColor: GREY,
    ...extra,
});

// Row label (left column of the parent/guardian table)
const rowLabel = (text) => ({
    text,
    bold: true,
    fontSize: 8,
    alignment: "right",
});

// Section heading (14pt bold underlined)
const sectionHeading = (text) => ({
    text,
    fontSize: 12,
    bold: true,
    decoration: "underline",
    margin: [0, 3, 0, 1],
});

// Sub heading (A. / B. / C.)
const subHeading = (text) => ({
    text,
    fontSize: 10,
    bold: true,
    margin: [0, 3, 0, 3],
});

// Pad a list of rows with blank rows so the table looks like the template
const padRows = (rows, min, cols) => {
    const out = [...rows];
    while (out.length < min) {
        out.push(
            Array.from({ length: cols }, () => ({ text: "", fontSize: 8 })),
        );
    }
    return out;
};

// Thick separator line used on page 2
const thickLine = (width = 572, lineWidth = 3) => ({
    canvas: [
        {
            type: "line",
            x1: 0,
            y1: 0,
            x2: width,
            y2: 0,
            lineWidth,
            lineColor: "#333333",
        },
    ],
    margin: [0, 4, 0, 4],
});

const PRIVACY_POLICY =
    "DATA PRIVACY POLICY: This form is strictly for Tzu Chi Bohol Office internal use only. Reproduction in all forms and mediums is strictly prohibited and requires permission from the management. Moreover, all personal information contained in this form remains confidential and will not be disclosed to a third party unless authorized by the signatory and/or management and /or required by governing institutional compliances.";

const FORM_NUMBER = "Form No. SS-ME-001";

// ---------------------------------------------------------------------------
// Dynamic sections built from CriteriaDataContext data
// (strands, courses, qualifications, requirements, instructions)
// ---------------------------------------------------------------------------

// SHS track legend: strands = [{ strand, description }]
const buildStrandLegendColumns = (strands = []) => {
    const items = strands.map((s) => ({
        text: [
            { text: `${s?.strand || ""} `, bold: true },
            `- ${s?.description || ""}`,
        ],
        fontSize: 8,
    }));
    const mid = Math.ceil(items.length / 2);
    return {
        left: items.slice(0, mid),
        right: items.slice(mid),
    };
};

const courseColumn = (list) => ({
    width: "*",
    stack: list.map((c) => ({ text: c, fontSize: 6.5, margin: [0, 0, 0, 4] })),
});

// Courses: courses = [{ course }], split evenly across 3 columns
const buildCourseColumns = (courses = []) => {
    const names = courses.map((c) => c?.course || "");
    const perCol = Math.ceil(names.length / 3) || 1;
    return [
        courseColumn(names.slice(0, perCol)),
        courseColumn(names.slice(perCol, perCol * 2)),
        courseColumn(names.slice(perCol * 2)),
    ];
};

// Qualifications / requirements table cells
const q = (text) => ({ text: text || "", fontSize: 7 });

// qualifications = [{ qualification }], requirements = [{ quantity, description, submit }]
// The template lists qualifications and requirements independently (the
// requirements column commonly has more rows than the qualifications
// column), so rows are built up to the longer of the two lists.
const buildRequirementRows = (qualifications = [], requirements = []) => {
    const rowCount = Math.max(qualifications.length, requirements.length, 1);
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
        const qualification = qualifications[i]?.qualification || "";
        const requirement = requirements[i] || {};
        rows.push([
            q(qualification),
            q(requirement.quantity),
            q(requirement.description),
            q(requirement.submit),
        ]);
    }
    return rows;
};

// Office-use table label cell
const officeLabel = (text) => ({
    text,
    fontSize: 8,
    alignment: "right",
    margin: [0, 2, 0, 2],
});
const officeBlank = () => ({ text: "", fontSize: 8 });

export const generatePDF = async (
    type,
    action,
    applicationId,
    scholarId,
    applicantData,
    pdfWindow,
    criteriaData,
) => {
    // criteriaData comes from useCriteriaDataContext() in the calling
    // component (a React hook can't be called here, since generatePDF is a
    // plain async function, not a component or custom hook).
    const {
        strands = [], // strand, description
        courses = [], // course
        qualifications = [], // qualification
        requirements = [], // quantity, description, submit
        instructions = [], // instruction
    } = criteriaData || {};

    console.log(criteriaData);
    console.log(applicantData);

    const { getProfilePicture } = await import("./getPdfProfilePicture.js");
    const { getRequirements } = await import("./getRequirements.js");

    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const fontsExport = pdfFontsModule.default || pdfFontsModule;
    const vfs = fontsExport.vfs || fontsExport.pdfMake?.vfs || fontsExport;
    const customFonts = await loadFonts();
    registerFonts(pdfMake, vfs, customFonts);

    if (!applicantData) {
        alert("No student data available");
        return;
    }

    try {
        // Convert logo to base64
        const logoBase64 = await convertImageToBase64(FormLogo);

        // Get profile picture as base64 using existing endpoint
        let profilePictureBase64 = null;
        if (type === "new") {
            if (applicationId) {
                profilePictureBase64 = await getProfilePicture(
                    applicationId,
                    "profile-picture",
                );

                if (!profilePictureBase64) {
                    console.warn(
                        "Failed to get profile picture, PDF will be generated without it",
                    );
                }
            }
        } else {
            if (scholarId) {
                profilePictureBase64 = await getProfilePicture(
                    scholarId,
                    "profile-picture",
                );

                if (!profilePictureBase64) {
                    console.warn(
                        "Failed to get profile picture, PDF will be generated without it",
                    );
                }
            }
        }

        let requirementsBase64 = null;
        if (applicationId) {
            requirementsBase64 = await getRequirements(applicationId);

            if (!requirementsBase64) {
                console.warn(
                    "Failed to get requirements, PDF will be generated without them",
                );
            }
        }

        const requirementImages = [];
        if (requirementsBase64 && Array.isArray(requirementsBase64)) {
            requirementsBase64.forEach((requirement) => {
                if (requirement.success && requirement.base64) {
                    requirementImages.push({
                        image: requirement.base64,
                        width: 500,
                        alignment: "center",
                        margin: [0, 10, 0, 10],
                    });
                }
            });
        }

        // Extract data for easier access
        const {
            applicationInfo,
            personalInfo,
            educationalBackground,
            familyInfo,
            otherAssistance,
            characterReference,
        } = applicantData;

        // Dynamic pieces built from criteriaData
        const strandLegend = buildStrandLegendColumns(strands);
        const courseColumns = buildCourseColumns(courses);
        const requirementRows = buildRequirementRows(qualifications, requirements);
        const instructionItems = instructions.map((i) => i?.instruction || "");

        const content = [
            // ------------------------------------------------------------
            // HEADER (unchanged)
            // ------------------------------------------------------------
            {
                image: logoBase64,
                width: 300,
                alignment: "center",
                absolutePosition: { y: 10 },
            },
            {
                text: "慈濟安心就學學費補助申請表",
                font: "Gothic",
                fontSize: 12,
                alignment: "center",
                margin: [0, 25, 0, 0],
            },
            {
                text: "Tzu Chi Educational Assistance Program",
                font: "Tahoma",
                fontSize: 12,
                bold: true,
                alignment: "center",
                margin: [0, 8, 0, 0],
            },
            // Only render the picture when one exists (pdfmake throws on null images)
            ...(profilePictureBase64
                ? [
                      {
                          image: profilePictureBase64,
                          width: 115,
                          height: 105,
                          alignment: "right",
                          absolutePosition: { x: 5, y: 24 },
                      },
                  ]
                : []),
            {
                text: "APPLICATION FORM",
                font: "Tahoma",
                fontSize: 14,
                bold: true,
                decoration: "underline",
                alignment: "center",
                margin: [0, 0, 0, 17],
            },

            // ------------------------------------------------------------
            // REMINDERS
            // ------------------------------------------------------------
            {
                text: [
                    { text: "REMINDERS:", bold: true },
                    " Please fill-up the form neatly & completely. Any misleading information may lead to disqualification.",
                ],
                fontSize: 10,
                margin: [0, 0, 0, 8],
            },

            // ------------------------------------------------------------
            // PERSONAL INFORMATION
            // ------------------------------------------------------------
            {
                columns: [
                    {
                        width: "*",
                        text: "PERSONAL INFORMATION",
                        fontSize: 12,
                        bold: true,
                        decoration: "underline",
                        alignment: "left",
                    },
                    {
                        width: "auto",
                        text: "Status: " + applicationInfo?.type,
                        fontSize: 10,
                        bold: true,
                        decoration: "underline",
                        alignment: "right",
                        margin: [0, 4, 30, 0],
                    },
                    {
                        width: "auto",
                        text: "SY: " + applicationInfo?.school_year,
                        fontSize: 10,
                        bold: true,
                        decoration: "underline",
                        alignment: "right",
                        margin: [0, 4, 0, 0],
                    },
                ],
                margin: [0, 0, 0, 2],
            },
            {
                table: {
                    widths: [190, "*", "*", "*", "*"],
                    body: [
                        [
                            fieldWithExtra(
                                [
                                    { text: "Name", bold: true },
                                    {
                                        text: " (Last Name, First Name, Middle Name, Suffix)",
                                    },
                                ],
                                [
                                    personalInfo?.last_name
                                        ? `${personalInfo.last_name},`
                                        : "",
                                    personalInfo?.first_name,
                                    personalInfo?.middle_name,
                                    personalInfo?.suffix
                                        ? `, ${personalInfo.suffix}`
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .trim() || "",
                            ),
                            field("Gender", personalInfo?.gender || ""),
                            field("Age", personalInfo?.age || ""),
                            field("Birthdate", personalInfo?.birthdate || "", {
                                colSpan: 2,
                            }),
                            {},
                        ],
                        [
                            field(
                                "Home Address",
                                personalInfo?.home_address || "",
                            ),
                            field(
                                "Subd./Village",
                                personalInfo?.subdivision || "",
                            ),
                            field("Barangay", personalInfo?.barangay || ""),
                            field(
                                "City/Municipality",
                                personalInfo?.city || "",
                            ),
                            field("Zip Code", personalInfo?.zip_code || ""),
                        ],
                        [
                            field(
                                "Personal Contact",
                                personalInfo?.contact_number || "",
                            ),
                            field(
                                "Secondary Contact",
                                personalInfo?.secondary_contact || "",
                                { colSpan: 2 },
                            ),
                            {},
                            field("Religion", personalInfo?.religion || ""),
                            field(
                                "Civil Status",
                                personalInfo?.civil_status || "",
                            ),
                        ],
                        [
                            field(
                                "Facebook Account",
                                personalInfo?.facebook || "",
                            ),
                            field("Email Address", personalInfo?.email || "", {
                                colSpan: 3,
                            }),
                            {},
                            {},
                            field("Birthplace", personalInfo?.birthplace || ""),
                        ],
                    ],
                },
                layout: tableLayout,
            },

            // ------------------------------------------------------------
            // EDUCATIONAL BACKGROUND
            // ------------------------------------------------------------
            sectionHeading("EDUCATIONAL BACKGROUND"),
            {
                table: {
                    headerRows: 1,
                    widths: [40, "*", 45, "*"],
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
                            rowLabel("School"),
                            {
                                text:
                                    educationalBackground?.previous_school ||
                                    "",
                                fontSize: 10,
                            },
                            rowLabel(
                                applicationInfo?.type === "New"
                                    ? "Incoming Grade/Year Level"
                                    : "Year Level",
                            ),
                            {
                                text:
                                    applicationInfo?.type === "New"
                                        ? educationalBackground?.incoming_grade ||
                                          ""
                                        : educationalBackground?.year_level ||
                                          "",
                                fontSize: 10,
                            },
                        ],
                        [
                            rowLabel("Location"),
                            {
                                text:
                                    educationalBackground?.previous_location ||
                                    "",
                                fontSize: 10,
                            },
                            rowLabel("School"),
                            {
                                text:
                                    educationalBackground?.present_school || "",
                                fontSize: 10,
                            },
                        ],
                        [
                            rowLabel("Honor/Award"),
                            {
                                text:
                                    educationalBackground?.previous_honor || "",
                                fontSize: 10,
                            },
                            rowLabel("Location"),
                            {
                                text:
                                    educationalBackground?.present_location ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                        [
                            rowLabel("GWA"),
                            {
                                text: educationalBackground?.previous_gwa || "",
                                fontSize: 10,
                            },
                            rowLabel("Course 1"),
                            {
                                text:
                                    educationalBackground?.present_course1 ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                        [
                            rowLabel("Course Taken"),
                            {
                                text:
                                    educationalBackground?.previous_course ||
                                    "",
                                fontSize: 10,
                            },
                            rowLabel("Course 2"),
                            {
                                text:
                                    educationalBackground?.present_course2 ||
                                    "",
                                fontSize: 10,
                            },
                        ],
                    ],
                },
                layout: tableLayout,
            },

            // ------------------------------------------------------------
            // FAMILY INFORMATION
            // ------------------------------------------------------------
            sectionHeading("FAMILY INFORMATION"),
            subHeading("A. Parent/Guardian"),

            {
                table: {
                    headerRows: 1,
                    widths: [80, "*", "*", "*", 120],
                    body: [
                        [
                            th("NAME / AGE", 8, {
                                rowSpan: 2,
                                margin: [0, 12, 0, 0],
                            }),
                            th("FATHER", 8),
                            th("MOTHER", 8),
                            th("GUARDIAN", 8),
                            th("Contact Person In Case of Emergency", 7),
                        ],
                        [
                            {},
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
                                    {
                                        text:
                                            (familyInfo?.parents
                                                ?.guardian_name === "" ||
                                                familyInfo?.parents
                                                    ?.guardian_name === null) &&
                                            familyInfo?.parents?.guardian_age <
                                                1
                                                ? ""
                                                : " / ",
                                        fontSize: 10,
                                    },
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
                            rowLabel("Educational Attainment"),
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
                            rowLabel("Occupation"),
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
                            rowLabel("Monthly Income"),
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
                                    familyInfo?.parents?.guardian_income < 1
                                        ? "0"
                                        : familyInfo?.parents
                                              ?.guardian_income || "",
                                fontSize: 10,
                            },
                            {
                                text: "",
                            },
                        ],
                        [
                            rowLabel("Contact Number"),
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
                            {
                                text:
                                    familyInfo?.contact
                                        ?.emergency_contact_number || "",
                                fontSize: 10,
                            },
                        ],
                    ],
                },
                layout: tableLayout,
            },

            subHeading(
                "B. Siblings (Eldest to Youngest) including Family Member",
            ),

            {
                table: {
                    headerRows: 1,
                    widths: [100, 62, 24, 42, 40, 40, "*", 58],
                    body: [
                        [
                            th("NAME"),
                            th("RELATIONSHIP"),
                            th("AGE"),
                            th("GENDER"),
                            th("CIVIL STATUS"),
                            th("Living w/ Family or Not?"),
                            th(
                                "Educational Attainment / Occupation & Company Name",
                            ),
                            th("Monthly Income"),
                        ],
                        ...padRows(
                            familyInfo?.siblings?.map((sibling) => [
                                { text: sibling?.name || "", fontSize: 10 },
                                {
                                    text: sibling?.relationship || "",
                                    fontSize: 10,
                                },
                                { text: sibling?.age || "", fontSize: 10 },
                                { text: sibling?.gender || "", fontSize: 10 },
                                {
                                    text: sibling?.civil_status || "",
                                    fontSize: 10,
                                },
                                {
                                    text: sibling?.living_with_family || "",
                                    fontSize: 10,
                                },
                                {
                                    text: sibling?.education_occupation || "",
                                    fontSize: 10,
                                },
                                {
                                    text: sibling?.monthly_income || "",
                                    fontSize: 10,
                                },
                            ]) || [],
                            6,
                            8,
                        ),
                    ],
                },
                layout: tableLayout,
            },

            subHeading(
                "C. Siblings Enjoying/Enjoyed Tzu Chi Educational Assistance",
            ),

            {
                table: {
                    headerRows: 1,
                    widths: [120, 55, "*", "*", 80],
                    body: [
                        [
                            th("NAME"),
                            th("YEAR LEVEL"),
                            th("SCHOOL"),
                            th("COURSE"),
                            th("SCHOOL YEAR"),
                        ],
                        ...padRows(
                            familyInfo?.tzuChiSiblings?.map((sibling) => [
                                { text: sibling?.name || "", fontSize: 10 },
                                {
                                    text: sibling?.year_level || "",
                                    fontSize: 10,
                                },
                                { text: sibling?.school || "", fontSize: 10 },
                                { text: sibling?.course || "", fontSize: 10 },
                                {
                                    text: sibling?.school_year || "",
                                    fontSize: 10,
                                },
                            ]) || [],
                            2,
                            5,
                        ),
                    ],
                },
                layout: tableLayout,
            },

            // ------------------------------------------------------------
            // OTHER ASSISTANCE
            // ------------------------------------------------------------
            {
                text: "Assistance from Other Association, Organization, School Discount, etc.",
                fontSize: 11,
                bold: true,
                decoration: "underline",
                margin: [0, 3, 0, 3],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ["*", "*", "*"],
                    body: [
                        [
                            th("NAME OF COMPANY ORGANIZATION/ASSOCIATION"),
                            th("TYPE OF SUPPORT"),
                            th("HOW MUCH?"),
                        ],
                        ...padRows(
                            otherAssistance?.map((assistance) => [
                                {
                                    text: assistance?.organization_name || "",
                                    fontSize: 10,
                                },
                                {
                                    text: assistance?.support_type || "",
                                    fontSize: 10,
                                },
                                {
                                    text: assistance?.amount || "",
                                    fontSize: 10,
                                },
                            ]) || [],
                            2,
                            3,
                        ),
                    ],
                },
                layout: tableLayout,
            },

            // ------------------------------------------------------------
            // PAGE 2
            // ------------------------------------------------------------
            {
                pageBreak: "before",
                stack: [
                    {
                        image: logoBase64,
                        width: 300,
                        alignment: "center",
                        absolutePosition: { y: 10 },
                    },
                    {
                        text: "What is your expectation from Tzu Chi Foundation?",
                        fontSize: 12,
                        bold: true,
                        alignment: "left",
                        margin: [0, 40, 0, 0],
                    },
                    // thickLine(572, 1.5),
                    {
                        text: applicationInfo?.expectation,
                        fontSize: 10,
                        alignment: "left",
                        margin: [10, 4, 10, 4],
                    },
                    thickLine(572, 1.5),

                    {
                        text: [
                            {
                                text: "CHARACTER REFERENCE ",
                                fontSize: 12,
                                bold: true,
                            },
                            {
                                text: "(Name 3 Person not related to your family who can vouch yourself)",
                                fontSize: 8,
                                italics: true,
                            },
                        ],
                        margin: [0, 10, 0, 5],
                    },

                    {
                        table: {
                            headerRows: 1,
                            widths: ["*", "*", "*", "*", "*"],
                            body: [
                                [
                                    th("NAME"),
                                    th("ADDRESS"),
                                    th("COMPANY"),
                                    th("POSITION"),
                                    th("CONTACT #"),
                                ],
                                ...padRows(
                                    characterReference?.map((character) => [
                                        {
                                            text: character?.name || "",
                                            fontSize: 10,
                                        },
                                        {
                                            text: character?.address || "",
                                            fontSize: 10,
                                        },
                                        {
                                            text: character?.company || "",
                                            fontSize: 10,
                                        },
                                        {
                                            text: character?.position || "",
                                            fontSize: 10,
                                        },
                                        {
                                            text:
                                                character?.contact_number || "",
                                            fontSize: 10,
                                        },
                                    ]) || [],
                                    3,
                                    5,
                                ),
                            ],
                        },
                        layout: tableLayout,
                    },

                    // Attestation
                    {
                        text: "I hereby attest that the information I have provided is true and correct. I also consents Tzu Chi Foundation to obtain and retain my personal information for the purpose of this application.",
                        fontSize: 10,
                        italics: true,
                        alignment: "center",
                        margin: [10, 8, 10, 0],
                    },

                    // Signature line
                    {
                        canvas: [
                            {
                                type: "line",
                                x1: 186,
                                y1: 0,
                                x2: 386,
                                y2: 0,
                                lineWidth: 1,
                            },
                        ],
                        margin: [0, 30, 0, 3],
                    },
                    {
                        text: "Applicant Name w/ Signature / Date",
                        fontSize: 9,
                        alignment: "center",
                        margin: [0, 0, 0, 4],
                    },

                    thickLine(),

                    // Senior high school track legend (dynamic: strands)
                    {
                        columns: [
                            {
                                width: "*",
                                stack: [
                                    {
                                        text: "SENIOR HIGH SCHOOL TRACK LEGEND:",
                                        fontSize: 9,
                                        bold: true,
                                        margin: [0, 0, 0, 2],
                                    },
                                    ...strandLegend.left,
                                ],
                            },
                            {
                                width: "*",
                                stack: [
                                    {
                                        text: "The symbol appeared means priority & has higher chance to be accepted *",
                                        fontSize: 7,
                                        italics: true,
                                        alignment: "right",
                                        margin: [0, 0, 0, 2],
                                    },
                                    ...strandLegend.right,
                                    {
                                        text: [
                                            {
                                                text: "Specialization: choose ",
                                                italics: true,
                                            },
                                            {
                                                text: "your own specialization related to the course you want to take in college.",
                                                italics: true,
                                            },
                                        ],
                                        fontSize: 7,
                                        margin: [28, 0, 0, 0],
                                    },
                                ],
                            },
                        ],
                        margin: [15, 0, 0, 6],
                    },

                    {
                        text: "List of Courses Accepted for College",
                        fontSize: 11,
                        bold: true,
                        alignment: "center",
                        margin: [0, 2, 0, 6],
                    },
                    {
                        columns: courseColumns,
                        columnGap: 6,
                    },
                    {
                        text: [
                            { text: "NOTE: ", bold: true },
                            "This symbol means “priority” and has a higher chance of being accepted into the program *",
                        ],
                        fontSize: 6.5,
                        italics: true,
                        margin: [0, 0, 0, 2],
                    },

                    thickLine(),

                    // Qualifications / requirements (dynamic)
                    {
                        table: {
                            headerRows: 2,
                            widths: [190, 70, "*", 58],
                            body: [
                                [
                                    th("QUALIFICATIONS", 7, {
                                        rowSpan: 2,
                                        margin: [0, 8, 0, 0],
                                    }),
                                    th("REQUIREMENTS", 7, { colSpan: 3 }),
                                    {},
                                    {},
                                ],
                                [
                                    {},
                                    th("QUANTITY"),
                                    th("DESCRIPTION"),
                                    th("SUBMIT DURING:", 6),
                                ],
                                ...requirementRows,
                            ],
                        },
                        layout: tableLayout,
                    },

                    // Instructions (dynamic)
                    {
                        text: "Read & understand instruction carefully:",
                        fontSize: 9,
                        bold: true,
                        margin: [0, 8, 0, 2],
                    },
                    {
                        ol: instructionItems,
                        fontSize: 8,
                        margin: [8, 0, 0, 4],
                    },

                    thickLine(),

                    // Office use table
                    {
                        table: {
                            widths: [55, "*", 75, "*", 75, "*"],
                            body: [
                                [
                                    officeLabel("Office Received by:"),
                                    officeBlank(),
                                    officeLabel("Assigned Group / District:"),
                                    officeBlank(),
                                    officeLabel("Case Referred by:"),
                                    officeBlank(),
                                ],
                                [
                                    officeLabel("Date Received:"),
                                    officeBlank(),
                                    officeLabel("Assigned Volunteer:"),
                                    officeBlank(),
                                    officeLabel("Referral Contact #:"),
                                    officeBlank(),
                                ],
                                [
                                    {
                                        text: "",
                                        colSpan: 4,
                                        border: [false, false, false, false],
                                    },
                                    {},
                                    {},
                                    {},
                                    officeLabel("Relationship to Beneficiary:"),
                                    officeBlank(),
                                ],
                            ],
                        },
                        layout: tableLayout,
                    },
                ],
            },

            // ------------------------------------------------------------
            // REQUIREMENT IMAGES
            // ------------------------------------------------------------
            ...(requirementImages.length > 0
                ? [
                      {
                          pageBreak: "before",
                          stack: [
                              {
                                  text: "Requirements",
                                  fontSize: 16,
                                  alignment: "center",
                                  margin: [0, 0, 0, 10],
                              },
                              ...requirementImages,
                          ],
                      },
                  ]
                : []),
        ];

        const docDefinition = {
            content: content,
            pageSize: {
                width: 612, // 8.5 inches
                height: 936, // 13 inches (long)
            },
            pageMargins: [20, 40, 20, 65],
            defaultStyle: {
                font: "Arial",
                fontSize: 10,
            },
            // Footer on every page: data privacy policy, page number, form number
            footer: (currentPage) => ({
                margin: [35, 0, 35, 0],
                stack: [
                    {
                        text: PRIVACY_POLICY,
                        fontSize: 6,
                        lineHeight: 1.5,
                        italics: true,
                        margin: [0, 0, 0, 8],
                    },
                    {
                        columns: [
                            { text: "", width: "*" },
                            {
                                text: String(currentPage),
                                width: "auto",
                                fontSize: 8,
                                alignment: "center",
                            },
                            {
                                text: FORM_NUMBER,
                                width: "*",
                                fontSize: 8,
                                alignment: "right",
                            },
                        ],
                    },
                ],
            }),
            images: {},
        };

        const pdfDoc = pdfMake.createPdf(docDefinition);

        if (action === "download") {
            pdfDoc.download(`Student_Application_${applicationId}.pdf`);
        } else if (action === "view") {
            pdfDoc.open(false, pdfWindow);
        }
    } catch (err) {
        console.error("Error creating PDF:", err);
        alert(`Error creating PDF: ${err.message}`);
    }
};
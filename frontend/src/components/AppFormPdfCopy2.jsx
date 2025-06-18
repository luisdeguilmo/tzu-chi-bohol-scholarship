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

    // Function to validate and clean base64 image data for pdfMake
    const validateAndCleanBase64Image = (base64Data) => {
        try {
            if (!base64Data) {
                console.warn('No base64 data provided');
                return null;
            }

            let cleanBase64 = base64Data;
            let mimeType = null;

            // If it's a data URL, extract the base64 part and mime type
            if (base64Data.startsWith('data:')) {
                const dataUrlMatch = base64Data.match(/^data:([^;]+);base64,(.+)$/);
                if (!dataUrlMatch) {
                    console.error('Invalid data URL format');
                    return null;
                }
                mimeType = dataUrlMatch[1];
                cleanBase64 = dataUrlMatch[2];
            }

            // Validate base64 string format
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
                console.error('Invalid base64 characters');
                return null;
            }

            // Test base64 decoding
            try {
                const decoded = atob(cleanBase64);
                if (decoded.length === 0) {
                    console.error('Base64 decodes to empty string');
                    return null;
                }
            } catch (e) {
                console.error('Base64 decoding failed:', e);
                return null;
            }

            // Validate image format for pdfMake
            const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (mimeType && !supportedFormats.includes(mimeType.toLowerCase())) {
                console.warn(`Unsupported image format for pdfMake: ${mimeType}`);
                return null;
            }

            // Return the full data URL format that pdfMake expects
            if (base64Data.startsWith('data:')) {
                return base64Data;
            } else {
                // If no mime type was detected, default to JPEG
                const defaultMimeType = mimeType || 'image/jpeg';
                return `data:${defaultMimeType};base64,${cleanBase64}`;
            }

        } catch (error) {
            console.error('Base64 validation failed:', error);
            return null;
        }
    };

    // Function to get profile picture as base64 using existing endpoint
    const getProfilePictureBase64 = async (applicationId) => {
        try {
            console.log("Getting profile picture for application ID:", applicationId);
            
            const response = await axios.get(
                `http://localhost:8000/backend/api/applications/${applicationId}/2x2-picture`,
                {
                    timeout: 15000, // Increased timeout
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            console.log("Profile picture endpoint response:", response.data);

            let base64Image = null;
            
            // Handle different response formats
            if (response.data && response.data.success) {
                base64Image = response.data.profile_picture_base64 || response.data.base64;
            } else if (response.data && response.data.profile_picture_base64) {
                base64Image = response.data.profile_picture_base64;
            } else if (response.data && response.data.base64) {
                base64Image = response.data.base64;
            }

            if (!base64Image) {
                console.warn("No base64 image data found in response");
                return null;
            }

            // Validate and clean the base64 data specifically for pdfMake
            const validatedImage = validateAndCleanBase64Image(base64Image);
            if (!validatedImage) {
                console.warn("Base64 image validation failed for pdfMake");
                return null;
            }

            console.log("Successfully validated profile picture for pdfMake");
            return validatedImage;

        } catch (error) {
            console.error("Error getting profile picture:", error);
            
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            } else if (error.request) {
                console.error("Network error - no response received");
            } else {
                console.error("Request setup error:", error.message);
            }
            
            return null;
        }
    };

    // Convert FormLogo to base64 with pdfMake compatibility
    const convertLogoToBase64 = async () => {
        try {
            const response = await fetch(FormLogo);
            if (!response.ok) {
                throw new Error(`Failed to fetch logo: ${response.status}`);
            }
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    // Validate the result for pdfMake
                    const validatedResult = validateAndCleanBase64Image(result);
                    if (!validatedResult) {
                        console.warn('Logo validation failed, using fallback');
                        resolve(null);
                    } else {
                        resolve(validatedResult);
                    }
                };
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    reject(error);
                };
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

            setStudentData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setError("Failed to load student data. Please try again.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
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
            
            // Get profile picture as base64 using existing endpoint
            let profilePictureBase64 = null;
            if (studentId) {
                console.log("Getting profile picture for student ID:", studentId);
                profilePictureBase64 = await getProfilePictureBase64(studentId);
                 
                if (!profilePictureBase64) {
                    console.warn("Failed to get profile picture, PDF will be generated without it");
                }
            }

            console.log("Profile picture base64 available:", !!profilePictureBase64);
            console.log("Logo base64 available:", !!logoBase64);

            // Extract data for easier access
            const {
                applicationInfo = {},
                personalInfo = {},
                educationalBackground = {},
                familyInfo = {},
                otherAssistance = {},
                requirements = {},
            } = studentData;

            const content = [
                // Logo at the top - only include if valid
                ...(logoBase64
                    ? [
                          {
                              image: logoBase64,
                              width: 150,
                              alignment: "center",
                              margin: [0, 0, 0, 10],
                          },
                      ]
                    : []),

                {
                    text: "ORV Assistance Program",
                    fontSize: 16,
                    bold: true,
                    alignment: "center",
                    margin: [0, 10, 0, 5],
                },
                {
                    text: "APPLICATION FORM",
                    fontSize: 18,
                    bold: true,
                    decoration: "underline",
                    alignment: "center",
                    margin: [0, 0, 0, 20],
                },

                // Application Info Header
                {
                    columns: [
                        {
                            text: "PERSONAL INFORMATION",
                            fontSize: 14,
                            bold: true,
                            decoration: "underline",
                            width: "*",
                        },
                        {
                            text: `Status: ${applicationInfo.status || "N/A"}`,
                            fontSize: 10,
                            bold: true,
                            width: "auto",
                            alignment: "right",
                        },
                        {
                            text: `SY: ${applicationInfo.school_year || "N/A"}`,
                            fontSize: 10,
                            bold: true,
                            width: "auto",
                            alignment: "right",
                        },
                    ],
                    margin: [0, 10, 0, 15],
                },

                // Personal Information Table
                {
                    table: {
                        widths: ["30%", "70%"],
                        body: [
                            [
                                "Full Name:",
                                `${personalInfo.first_name || ""} ${
                                    personalInfo.middle_name || ""
                                } ${personalInfo.last_name || ""}`.trim() ||
                                    "N/A",
                            ],
                            [
                                "Date of Birth:",
                                personalInfo.date_of_birth || "N/A",
                            ],
                            ["Gender:", personalInfo.gender || "N/A"],
                            [
                                "Contact Number:",
                                personalInfo.contact_number || "N/A",
                            ],
                            ["Email:", personalInfo.email || "N/A"],
                            ["Address:", personalInfo.address || "N/A"],
                        ],
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 0, 0, 20],
                },

                // Educational Background
                {
                    text: "EDUCATIONAL BACKGROUND",
                    fontSize: 14,
                    bold: true,
                    decoration: "underline",
                    margin: [0, 10, 0, 10],
                },
                {
                    table: {
                        widths: ["30%", "70%"],
                        body: [
                            [
                                "School Name:",
                                educationalBackground.school_name || "N/A",
                            ],
                            [
                                "Course/Program:",
                                educationalBackground.course || "N/A",
                            ],
                            [
                                "Year Level:",
                                educationalBackground.year_level || "N/A",
                            ],
                            ["GPA/Grade:", educationalBackground.gpa || "N/A"],
                        ],
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 0, 0, 20],
                },

                // Family Information
                {
                    text: "FAMILY INFORMATION",
                    fontSize: 14,
                    bold: true,
                    decoration: "underline",
                    margin: [0, 10, 0, 10],
                },
                {
                    table: {
                        widths: ["30%", "70%"],
                        body: [
                            ["Father's Name:", familyInfo.father_name || "N/A"],
                            [
                                "Father's Occupation:",
                                familyInfo.father_occupation || "N/A",
                            ],
                            ["Mother's Name:", familyInfo.mother_name || "N/A"],
                            [
                                "Mother's Occupation:",
                                familyInfo.mother_occupation || "N/A",
                            ],
                            [
                                "Annual Family Income:",
                                familyInfo.annual_income || "N/A",
                            ],
                            [
                                "Number of Siblings:",
                                familyInfo.siblings_count || "N/A",
                            ],
                        ],
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 0, 0, 20],
                },

                // Other Assistance
                {
                    text: "OTHER ASSISTANCE RECEIVED",
                    fontSize: 14,
                    bold: true,
                    decoration: "underline",
                    margin: [0, 10, 0, 10],
                },
                {
                    text: otherAssistance.details || "None",
                    fontSize: 12,
                    margin: [0, 0, 0, 20],
                },

                // Requirements Status
                {
                    text: "REQUIREMENTS STATUS",
                    fontSize: 14,
                    bold: true,
                    decoration: "underline",
                    margin: [0, 10, 0, 10],
                },
                {
                    table: {
                        widths: ["50%", "50%"],
                        body: Object.entries(requirements).map(
                            ([key, value]) => [
                                key.replace(/_/g, " ").toUpperCase(),
                                value ? "Submitted" : "Pending",
                            ]
                        ),
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 0, 0, 20],
                },

                // Profile Picture - only include if we have valid base64 data
                ...(profilePictureBase64
                    ? [
                          {
                              text: "STUDENT PROFILE PICTURE",
                              fontSize: 14,
                              bold: true,
                              decoration: "underline",
                              alignment: "center",
                              margin: [0, 20, 0, 10],
                          },
                          {
                              image: profilePictureBase64,
                              width: 150,
                              height: 150,
                              alignment: "center",
                              margin: [0, 0, 0, 20],
                          },
                      ]
                    : [
                          {
                              text: "No profile picture available",
                              fontSize: 10,
                              alignment: "center",
                              italics: true,
                              margin: [0, 20, 0, 0],
                          },
                      ]),
            ];

            const docDefinition = {
                content: content,
                pageSize: "A4",
                pageMargins: [40, 40, 40, 40],
                defaultStyle: {
                    fontSize: 10,
                },
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: "center",
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                },
            };

            console.log("Creating PDF with pdfMake...");
            const pdfDoc = pdfMake.createPdf(docDefinition);

            if (action === "download") {
                pdfDoc.download(`Student_Application_${studentId}.pdf`);
            } else if (action === "view") {
                pdfDoc.open();
            }

            console.log("PDF generation completed successfully");

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







// public function getProfilePicture64($application_id) {
//     try {
//         $profilePictureModel = new ProfilePictureModel();
//         $profile_url = $profilePictureModel->getFileUrlByApplicationId($application_id);
        
//         if (!$profile_url) {
//             http_response_code(404);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Profile picture not found"
//             ]);
//             return;
//         }

//         // Convert URL to file path
//         $parsedUrl = parse_url($profile_url);
//         $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];
        
//         // Validate file exists and is readable
//         if (!file_exists($filePath) || !is_readable($filePath)) {
//             http_response_code(404);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Profile picture file not accessible",
//                 "debug" => [
//                     "path" => $filePath,
//                     "exists" => file_exists($filePath),
//                     "readable" => is_readable($filePath)
//                 ]
//             ]);
//             return;
//         }

//         // Read file and convert to base64
//         $imageData = file_get_contents($filePath);
//         if ($imageData === false) {
//             http_response_code(500);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Failed to read profile picture file"
//             ]);
//             return;
//         }

//         // Validate that we actually have image data
//         if (empty($imageData)) {
//             http_response_code(500);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Profile picture file is empty"
//             ]);
//             return;
//         }

//         // Get MIME type - using multiple methods for compatibility
//         $mimeType = null;
        
//         // Method 1: Try finfo if available
//         if (class_exists('finfo')) {
//             try {
//                 $finfo = new \finfo(FILEINFO_MIME_TYPE);
//                 $detectedMimeType = $finfo->buffer($imageData);
//                 if ($detectedMimeType && strpos($detectedMimeType, 'image/') === 0) {
//                     $mimeType = $detectedMimeType;
//                 }
//             } catch (\Exception $e) {
//                 error_log("finfo failed: " . $e->getMessage());
//             }
//         }
        
//         // Method 2: Fallback to getimagesizefromstring
//         if (!$mimeType) {
//             try {
//                 $imageInfo = getimagesizefromstring($imageData);
//                 if ($imageInfo !== false && isset($imageInfo['mime'])) {
//                     $mimeType = $imageInfo['mime'];
//                 }
//             } catch (\Exception $e) {
//                 error_log("getimagesizefromstring failed: " . $e->getMessage());
//             }
//         }
        
//         // Method 3: Fallback to file extension
//         if (!$mimeType) {
//             $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
//             $mimeTypes = [
//                 'jpg' => 'image/jpeg',
//                 'jpeg' => 'image/jpeg',
//                 'png' => 'image/png',
//                 'gif' => 'image/gif',
//                 'webp' => 'image/webp',
//                 'bmp' => 'image/bmp'
//             ];
//             $mimeType = $mimeTypes[$extension] ?? 'image/jpeg'; // Default to jpeg
//         }
        
//         // Validate it's a supported image format
//         $supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
//         if (!in_array($mimeType, $supportedFormats)) {
//             http_response_code(400);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Unsupported image file type: " . $mimeType
//             ]);
//             return;
//         }

//         // Convert to base64
//         $base64 = base64_encode($imageData);
        
//         // Validate base64 encoding was successful
//         if ($base64 === false || empty($base64)) {
//             http_response_code(500);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Failed to encode image as base64"
//             ]);
//             return;
//         }
        
//         // Test that the base64 can be decoded (additional validation)
//         if (base64_decode($base64, true) === false) {
//             http_response_code(500);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Base64 encoding validation failed"
//             ]);
//             return;
//         }
        
//         // Create proper data URL format
//         $base64Image = 'data:' . $mimeType . ';base64,' . $base64;
        
//         // Final validation - ensure the data URL format is correct
//         if (!preg_match('/^data:image\/[a-z]+;base64,[A-Za-z0-9+\/]+=*$/', $base64Image)) {
//             http_response_code(500);
//             echo json_encode([
//                 "success" => false,
//                 "message" => "Invalid data URL format generated"
//             ]);
//             return;
//         }

//         // Success response
//         echo json_encode([
//             "success" => true,
//             "profile_picture_base64" => $base64Image,
//             "base64" => $base64Image, // Alternative key for compatibility
//             "mime_type" => $mimeType,
//             "file_size" => strlen($imageData),
//             "base64_length" => strlen($base64)
//         ]);

//     } catch (\Exception $e) {
//         error_log("Profile picture error: " . $e->getMessage());
//         error_log("Stack trace: " . $e->getTraceAsString());
//         http_response_code(500);
//         echo json_encode([
//             "success" => false,
//             "message" => "Internal server error while processing profile picture"
//         ]);
//     }
// }
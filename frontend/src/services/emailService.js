import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useState } from "react";

export const manageApplication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    const approveApplication = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=approve`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_approved: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success(
                    "Application approved and notification email sent successfully!",
                );
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error approving application:", err);
            toast.error("Error approving application.");
            return false;
            setIsLoading(false);
        }
    };

    const approveRenewApplication = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=approve_renew`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_approved: 1,
                    status: "scholar",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Application approved!");
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error approving application:", err);
            toast.error("Error approving application.");
            return false;
            setIsLoading(false);
        }
    };

    const rejectApplication = async (applicant, feedback) => {
        try {
            setIsLoading(true);
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=reject`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_rejected: 1,
                    feedback: feedback,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success(
                    "Application rejected and notification email sent successfully!",
                );
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error rejecting application:", err);
            toast.error("Error rejecting application.");
            setIsLoading(false);
            return false;
        }
    };

    const rejectRenewApplication = async (applicant, feedback) => {
        try {
            setIsLoading(true);
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=reject_renew`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_rejected: 1,
                    status: "application_rejected",
                    feedback: feedback,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Application rejected!");
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error rejecting application:", err);
            toast.error("Error rejecting application.");
            setIsLoading(false);
            return false;
        }
    };

    const sendExaminationResult = async (applicants) => {
        try {
            setIsLoading(true);

            // const { date, time } = result;
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=examination_result`,
                {
                    applicants: applicants,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success("Email sent successfully!");
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Failed to send email:", err);
            toast.error("Failed to send email.");
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToInterviewPassed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=interview_passed`,
                {
                    application_id: applicant?.application_id,
                    first_name: applicant?.first_name,
                    last_name: applicant?.last_name,
                    email: applicant?.email,
                    is_initial_interview_passed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success(
                    "Interview marked as passed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }

            toast.error("Failed to update interview status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating interview status:", err);
            toast.error("An error occurred while updating interview status.");
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToInterviewFailed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=interview_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_initial_interview_failed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.data.success) {
                toast.success(
                    "Interview marked as failed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }
            toast.error("Failed to update interview status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating interview status:", err);
            toast.error("An error occurred while updating interview status.");
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToHomeVisitationPassed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=home_visitation_passed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_home_visitation_passed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success(
                    "Home Visitation marked as passed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }

            toast.error("Failed to update home visitation status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating home visitation status:", err);
            toast.error(
                "An error occurred while updating home visitation status.",
            );
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToHomeVisitationFailed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=home_visitation_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_home_visitation_failed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.data.success) {
                toast.success(
                    "Home Visitation marked as failed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }
            toast.error("Failed to update interview status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating home visitation status:", err);
            toast.error(
                "An error occurred while updating home visitation status.",
            );
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToFinalInterviewPassed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=final_interview_passed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_final_interview_passed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                toast.success(
                    "Interview marked as passed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }

            toast.error("Failed to update interview status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating interview status:", err);
            toast.error("An error occurred while updating interview status.");
            setIsLoading(false);
            return false;
        }
    };

    const updateStatusToFinalInterviewFailed = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/application-management.php?action=final_interview_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_final_interview_failed: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.data.success) {
                toast.success(
                    "Interview marked as failed. Notification email sent to applicant.",
                );
                setIsLoading(false);
                return true;
            }
            toast.error("Failed to update interview status.");
            setIsLoading(false);
            return false;
        } catch (err) {
            console.error("Error updating interview status:", err);
            toast.error("An error occurred while updating interview status.");
            setIsLoading(false);
            return false;
        }
    };

    return {
        isLoading,
        approveApplication,
        approveRenewApplication,
        rejectApplication,
        rejectRenewApplication,
        sendExaminationResult,
        updateStatusToInterviewPassed,
        updateStatusToInterviewFailed,
        updateStatusToHomeVisitationPassed,
        updateStatusToHomeVisitationFailed,
        updateStatusToFinalInterviewPassed,
        updateStatusToFinalInterviewFailed,
    };
};

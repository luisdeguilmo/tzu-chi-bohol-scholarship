import axios from "axios";
import { toast } from "react-toastify";
import {
    sendApplicationApprovalEmail,
    sendApplicationRejectionEmail,
} from "./emailServiceCopy";
import BASE_URL from "../config";
import { getSchedule } from "../utils/getSchedule";
import { getVenue } from "../utils/getVenue";
import { useState } from "react";

export const manageApplication = () => {
    const [isLoading, setIsLoading] = useState(false);

    const approveApplication = async (applicant) => {
        try {
            // Only update status if email was sent successfully
            setIsLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=approve`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_approved: 1,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Application approved and notification email sent successfully!"
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

    const rejectApplication = async (applicant, feedback) => {
        try {
            setIsLoading(true);
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=reject`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_rejected: 1,
                    feedback: feedback,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Application rejected and notification email sent successfully!"
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

    const sendSchedule = async (
        applicants,
        batches,
        selectedBatchInBatches
    ) => {
        try {
            setIsLoading(true);
            const result = getSchedule(batches, selectedBatchInBatches);
            const value = getVenue(batches, selectedBatchInBatches);

            const { date, time } = result;
            const { venue } = value;

            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=send_schedule`,
                {
                    applicants: applicants,
                    date: date,
                    time: time,
                    batch: selectedBatchInBatches,
                    venue: venue,
                }
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

    const sendExaminationPassed = async (applicants) => {
        try {
            setIsLoading(true);

            // const { date, time } = result;
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=examination_passed`,
                {
                    applicants: applicants,
                }
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

    const sendExaminationFailed = async (applicants) => {
        try {
            setIsLoading(true);

            // const { date, time } = result;
            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=examination_failed`,
                {
                    applicants: applicants,
                }
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
                `${BASE_URL}app/views/application-management.php?action=interview_passed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_initial_interview_passed: 1,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Interview marked as passed. Notification email sent to applicant."
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
                `${BASE_URL}app/views/application-management.php?action=interview_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_initial_interview_failed: 1,
                }
            );
            if (response.data.success) {
                toast.success(
                    "Interview marked as failed. Notification email sent to applicant."
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
                `${BASE_URL}app/views/application-management.php?action=home_visitation_passed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_home_visitation_passed: 1,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Home Visitation marked as passed. Notification email sent to applicant."
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
                "An error occurred while updating home visitation status."
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
                `${BASE_URL}app/views/application-management.php?action=home_visitation_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_home_visitation_failed: 1,
                }
            );
            if (response.data.success) {
                toast.success(
                    "Home Visitation marked as failed. Notification email sent to applicant."
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
                "An error occurred while updating home visitation status."
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
                `${BASE_URL}app/views/application-management.php?action=final_interview_passed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_final_interview_passed: 1,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Interview marked as passed. Notification email sent to applicant."
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
                `${BASE_URL}app/views/application-management.php?action=final_interview_failed`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    is_final_interview_failed: 1,
                }
            );
            if (response.data.success) {
                toast.success(
                    "Interview marked as failed. Notification email sent to applicant."
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
        rejectApplication,
        sendSchedule,
        sendExaminationPassed,
        sendExaminationFailed,
        updateStatusToInterviewPassed,
        updateStatusToInterviewFailed,
        updateStatusToHomeVisitationPassed,
        updateStatusToHomeVisitationFailed,
        updateStatusToFinalInterviewPassed,
        updateStatusToFinalInterviewFailed,
    };
};

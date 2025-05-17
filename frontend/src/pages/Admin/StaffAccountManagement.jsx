import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StaffAccountManagement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [rowItemId, setRowItemId] = useState(0);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    // const [newRole, setNewRole] = useState("");

    const [staffAccounts, setStaffAccounts] = useState([]);

    const fetchStaffAccounts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/staff-accounts.php`
            );
            setStaffAccounts(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching staff data:", err);
            setError("Failed to load staff data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffAccounts();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on search term
    const filteredStaffAccounts = staffAccounts.filter((staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredStaffAccounts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStaffAccounts.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Handle page changes
    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleButtonState = (name, email, role, id) => {
        setEdit(true);
        setNewName(name);
        setNewEmail(email);
        // setNewRole(role);
        setRowItemId(id);
    };

    const handleNameChange = (value) => {
        setNewName(value);
    };

    const handleEmailChange = (value) => {
        setNewEmail(value);
    };

    // const handleRoleChange = (value) => {
    //     setNewRole(value);
    // };

    const handleEdit = async (id) => {
        setEdit(false);

        // Check if the user cancelled or submitted an empty string
        if (
            newName === null ||
            newName.trim() === "" ||
            newEmail === null ||
            newEmail.trim() === ""
            
        ) {
            return; // Exit if cancelled or empty
        }

        // newRole === null ||
        //     newRole.trim() === ""

        try {
            // Create the data structure
            const data = {
                staff: {
                    id: id,
                    name: newName,
                    email: newEmail,
                    // role: newRole,
                },
            };

            const response = await fetch(
                "http://localhost:8000/app/views/staff-accounts.php",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            // Check for success and update the UI
            if (result.success) {
                // Update the local state to reflect the change
                const updatedStaffAccounts = staffAccounts.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              name: newName,
                              email: newEmail,
                            //   role: newRole,
                          }
                        : item
                );
                setStaffAccounts(updatedStaffAccounts);

                // Show success message
                toast.success("Staff account updated successfully.");
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error updating staff account:", error);
            alert("Failed to update staff account");
        }
    };

    // Handle staff deletion
    const handleDelete = async (id, index) => {
        try {
            // Make the API call to delete
            await axios.delete(
                `http://localhost:8000/app/views/staff-accounts.php?id=${id}`
            );

            // Update local state after successful deletion
            const updatedStaffAccounts = staffAccounts.filter(
                (staff) => staff.id !== id
            );
            setStaffAccounts(updatedStaffAccounts);

            toast.success("Staff account deleted successfully.");

            if (index === 0) goToPreviousPage();
        } catch (error) {
            console.error("Error deleting staff account:", error);
            alert("Failed to delete staff account");
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl text-left font-bold text-gray-800 my-6">
                    Staff Account Management
                </h2>
            </div>
            <div className="max-w-7xl mx-auto bg-white rounded-md shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        Staff Accounts
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search staff accounts..."
                            className="pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100 text-green-800 text-center">
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Email
                                </th>
                                {/* <th
                                    scope="col"
                                    className="py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Role
                                </th> */}
                                <th
                                    scope="col"
                                    className="py-3 text-xs font-medium uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((staff, index) => (
                                <tr
                                    key={staff.id}
                                    className="hover:bg-gray-50 transition-colors text-center"
                                >
                                    {edit && rowItemId === staff.id ? (
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            <input
                                                className="p-2 w-full border-[1px] outline-green-500"
                                                type="text"
                                                onChange={(e) =>
                                                    handleNameChange(
                                                        e.target.value
                                                    )
                                                }
                                                value={newName}
                                            />
                                        </td>
                                    ) : (
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {staff.name}
                                        </td>
                                    )}
                                    {edit && rowItemId === staff.id ? (
                                        <td className="py-4 text-sm text-gray-500">
                                            <input
                                                className="p-2 w-full border-[1px] outline-green-500"
                                                type="email"
                                                onChange={(e) =>
                                                    handleEmailChange(
                                                        e.target.value
                                                    )
                                                }
                                                value={newEmail}
                                            />
                                        </td>
                                    ) : (
                                        <td className="py-4 max-w-md break-words text-sm text-gray-500">
                                            {staff.email}
                                        </td>
                                    )}
                                    {/* {edit && rowItemId === staff.id ? (
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select
                                                className="p-2 w-full border-[1px] outline-green-500"
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        e.target.value
                                                    )
                                                }
                                                value={newRole}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Staff">Staff</option>
                                            </select>
                                        </td>
                                    ) : (
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {staff.role}
                                        </td>
                                    )} */}
                                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                {
                                                    {
                                                        edit &&
                                                        rowItemId ===
                                                            staff.id
                                                            ? handleEdit(
                                                                  staff.id
                                                              )
                                                            : handleButtonState(
                                                                  staff.name,
                                                                  staff.email,
                                                                  staff.role,
                                                                  staff.id
                                                              );
                                                    }
                                                }
                                            }}
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
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            {edit &&
                                            rowItemId === staff.id
                                                ? "Save Changes"
                                                : "Edit"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    staff.id,
                                                    currentItems.length - 1
                                                )
                                            }
                                            className="inline-flex items-center text-red-600 hover:text-red-900"
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                                                />
                                            </svg>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <div className="text-center py-10">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="mt-2 text-gray-500">
                                No staff accounts found. Try adjusting your search
                                or create a new staff account.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}

                <div className="flex justify-between items-center mt-6">
                    <Form
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        onSuccess={fetchStaffAccounts}
                    />
                    {filteredStaffAccounts.length > 0 && (
                        <>
                            <div className="text-sm text-gray-600">
                                Showing {indexOfFirstItem + 1}-
                                {Math.min(
                                    indexOfLastItem,
                                    filteredStaffAccounts.length
                                )}{" "}
                                of {filteredStaffAccounts.length} staff accounts
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-md ${
                                        currentPage === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-600 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    disabled={
                                        currentPage === totalPages ||
                                        totalPages === 0
                                    }
                                    className={`px-4 py-2 rounded-md ${
                                        currentPage === totalPages ||
                                        totalPages === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600 transition-all"
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

function Form({ isOpen, setIsOpen, onSuccess }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [role, setRole] = useState("Staff");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Create the data structure that matches your backend expectations
        const data = {
            staff: {
                name: name,
                email: email,
                // role: role,
                password: password
            },
        };

        try {
            const response = await fetch(
                "http://localhost:8000/app/views/staff-accounts.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");
                setName("");
                setEmail("");
                // setRole("Staff");
                setPassword("");
                setConfirmPassword("");
                setIsOpen(false); // Close the modal on success
                if (onSuccess) onSuccess();
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to create staff account. Please try again.");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Create Staff Account
            </button>

            {isOpen && (
                <div
                    className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">
                                Create New Staff Account
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    placeholder="Full Name"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            {/* <div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    required
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div> */}

                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full outline-none border-b-[2px] border-gray-400 py-2 mt-1 box-border hover:border-black focus:border-green-500"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600`}
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffAccountManagement;
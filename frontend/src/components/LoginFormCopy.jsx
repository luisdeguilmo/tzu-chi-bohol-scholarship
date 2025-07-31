import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const userType = location.state;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        console.log(userType);
        
        try {
            setLoading(true);

            const data = {
                type: userType.type,
                email: email,
                password: password,
            };

            // Send the POST request with the data in the body
            const response = await axios.post(
                `http://localhost:8000/app/views/login.php`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Access the data directly from the response
            const result = response.data;

            if (result.success) {
                toast.success("Login successful!");
                if (userType.type === "Scholar") {
                    navigate("/scholar/dashboard");
                } else if (userType.type === "Staff") {
                    navigate("/staff/dashboard");
                } else if (userType.type === "Admin") {
                    navigate("/admin/dashboard");
                }
            } else {
                setError(
                    result.message || "Invalid credentials. Please try again."
                );
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                "Login failed. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-12 rounded-lg shadow-md w-[80%] sm:max-w-[450px]">
                <h2 className="text-4xl font-bold text-center mb-10">
                    {userType?.type || "User"} Login
                </h2>
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
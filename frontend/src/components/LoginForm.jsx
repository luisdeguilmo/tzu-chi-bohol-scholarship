import { useState } from "react";
import { useLocation } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const location = useLocation();
    const userType = location.state;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch("https://yourdomain.com/login.php", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            if (result.role === "student") {
                window.location.href = "/student-dashboard";
            } else if (result.role === "staff") {
                window.location.href = "/staff-dashboard";
            } else if (result.role === "admin") {
                window.location.href = "/admin-dashboard";
            }
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-12 rounded-lg shadow-md w-[80%] sm:max-w-[450px]">
                <h2 className="text-4xl font-bold text-center mb-10">{userType?.type} Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
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
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            try {
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(token.split(".")[1]));

                // Check if token is expired
                if (payload.exp * 1000 > Date.now()) {
                    setUser(payload);
                    // Set default axios header
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                } else {
                    // Token expired
                    logout();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(userData);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

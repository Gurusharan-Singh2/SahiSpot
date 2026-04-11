import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
        setToken(storedToken);
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user", e);
            logout();
        }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful!");
      return data;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      throw error;
    }
  };

  const signupSendOtp = async (name, email, password, phone_number) => {
    try {
      const response = await fetch("http://localhost:8000/api/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone_number }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");
      return data;
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
  };

  const signupVerifyOtp = async (name, email, password, phone_number, otp, role) => {
    try {
        const response = await fetch("http://localhost:8000/api/signup/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone_number, otp, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Signup failed");

        if (data.token) {
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Signup successful!");
        } else {
             
             toast.success("Signup successful! Please login.");
        }
        return data;
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  const value = {
    user,
    token,
    loading,
    login,
    signupSendOtp,
    signupVerifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

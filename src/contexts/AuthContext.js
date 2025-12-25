import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    
    setLoading(false); // Set loading to false after checking
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log("Calling apiService.login with:", { email, password });
      const response = await apiService.login({ email, password });
      console.log("API response:", response);
      console.log("Response data:", response?.data);

      // Handle both direct response and axios response.data
      const responseData = response?.data || response;
      console.log("Using response data:", responseData);

      if (!responseData?.access_token) {
        console.error("No access_token in response:", responseData);
        throw new Error("Invalid login response - no access token");
      }

      const { access_token, refresh_token, user } = responseData;
      console.log("Extracted data:", {
        access_token: access_token ? "present" : "missing",
        refresh_token: refresh_token ? "present" : "missing",
        user: user ? "present" : "missing"
      });

      if (!user) {
        console.error("No user data in response:", responseData);
        throw new Error("User information not provided in login response");
      }

      // Test localStorage availability (important for mobile)
      try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        console.log("localStorage is available");
      } catch (storageError) {
        console.error("localStorage not available:", storageError);
        throw new Error("Local storage not available - required for authentication");
      }

      // Store tokens and user data
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token || "");
      localStorage.setItem("user", JSON.stringify(user));

      // Verify storage worked
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        console.error("Failed to store authentication data");
        throw new Error("Failed to store authentication data");
      }

      setUser(user);
      console.log("User authenticated and stored successfully");
      return { success: true, ...responseData };
    } catch (error) {
      console.error("Login error details:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      console.error("Login failed with message:", message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
  setLoading(true);
  try {
    const response = await apiService.signup({
      full_name: fullName,
      email: email,
      password: password,
    });

    return { success: true, ...response.data };
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Signup failed";

    console.error("Signup failed:", message);
    return { success: false, error: message };
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

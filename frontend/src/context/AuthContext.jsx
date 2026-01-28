import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [role, setRole] = useState("user"); // Assuming role is part of user data
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      let userObj = null;
      if (userStr) {
        try {
          userObj = JSON.parse(userStr);
        } catch {
          userObj = null;
        }
      }
      if (token && userObj) {
        setIsAuthenticated(true);
        setUser(userObj);
        setRole(userObj.isAdmin ? "Admin" : "user");
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setRole(userData.isAdmin ? "Admin" : "user");
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Value object to be provided to consumers
  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
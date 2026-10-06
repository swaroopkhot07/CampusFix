import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('campusfix_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfix_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verify stored token on initial load
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('campusfix_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('campusfix_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Backend connection warning during session check:', err.message);
        // Retain offline stored user for resilient experience if backend momentarily restarts
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  /**
   * Student Login
   */
  const login = async ({ email, enrollmentNumber, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, enrollmentNumber, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Student login failed.');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('campusfix_token', data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Admin Login
   */
  const adminLogin = async ({ identifier, password }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Administrative login failed.');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('campusfix_token', data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Student Registration
   */
  const register = async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('campusfix_token', data.token);
      localStorage.setItem('campusfix_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('campusfix_token');
    localStorage.removeItem('campusfix_user');
  };

  const isAuthenticated = Boolean(token && currentUser);
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isLoading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

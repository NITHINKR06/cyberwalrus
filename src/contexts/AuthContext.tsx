import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (updateData: { username?: string; email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem('user');
    if (demoUser) {
      try {
        const parsedUser = JSON.parse(demoUser);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    // Check for stored token and validate it
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          totalPoints: data.user.totalPoints || 0,
          currentStreak: data.user.currentStreak || 0,
          level: data.user.level || 1,
        });
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('authToken', data.token);
      
      // Set user data
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        totalPoints: data.user.totalPoints || 0,
        currentStreak: data.user.currentStreak || 0,
        level: data.user.level || 1,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('authToken', data.token);
      
      // Set user data
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        totalPoints: data.user.totalPoints || 0,
        currentStreak: data.user.currentStreak || 0,
        level: data.user.level || 1,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUser = async (updateData: { username?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update user data in context
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        totalPoints: data.user.totalPoints || 0,
        currentStreak: data.user.currentStreak || 0,
        level: data.user.level || 1,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Also clear demo user
    // Clear session cookie by making a logout request
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

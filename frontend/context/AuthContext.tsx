"use client";
import React, { createContext, useState } from "react";
interface User {
  id: string;

  name: string;

  email: string;

  isAdmin: boolean;

  subscription: {
    plan: "none" | "basic" | "standard" | "premium";

    expiresAt: string | null;
  };
}
interface AuthState {
  user: User | null;

  token: string | null;
}
interface AuthContextType {
  user: User | null;

  token: string | null;

  login: (email: string, password: string) => Promise<void>;

  register: (name: string, email: string, password: string) => Promise<void>;

  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") return { token: null, user: null };

  try {
    const token = localStorage.getItem("token");

    const user = localStorage.getItem("user");

    return {
      token,

      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const logout = () => {
    setAuth({ user: null, token: null });

    localStorage.removeItem("token");

    localStorage.removeItem("user");
  };
  return (
    <AuthContext.Provider
      value={{ user: auth.user, token: auth.token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

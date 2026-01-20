import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isGuest: boolean;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("auth_token");
    });
    const [isGuest, setIsGuest] = useState<boolean>(() => {
        return localStorage.getItem("is_guest") === "true";
    });

    const isAuthenticated = !!token;

    useEffect(() => {
        if (token) {
            localStorage.setItem("auth_token", token);
        } else {
            localStorage.removeItem("auth_token");
        }
    }, [token]);

    useEffect(() => {
        if (isGuest) {
            localStorage.setItem("is_guest", "true");
        } else {
            localStorage.removeItem("is_guest");
        }
    }, [isGuest]);

    const login = async (username: string, password: string) => {
        const BASE_URL = import.meta.env.VITE_API_URL;

        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const res = await fetch(`${BASE_URL}login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-API-Key": import.meta.env.VITE_API_KEY,
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.detail || "Login failed");
        }

        const data = await res.json();
        setToken(data.access_token);
        setIsGuest(false);
    };

    const logout = () => {
        setToken(null);
        setIsGuest(false);
    };

    const continueAsGuest = () => {
        setToken(null);
        setIsGuest(true);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isGuest,
                token,
                login,
                logout,
                continueAsGuest,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

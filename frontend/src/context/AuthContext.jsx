import {
    useState,
    useEffect,
    useCallback,
} from "react";
import { AuthContext } from "./authContextInstance.js";

const DEFAULT_USER = {
    id: "builder-default",
    name: "Builder",
    email: "builder@buildforge.ai",
    token: "guest-token",
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                return JSON.parse(savedUser);
            }
        } catch {
            return DEFAULT_USER;
        }
        return DEFAULT_USER;
    });

    const [loading, setLoading] = useState(false);

    const login = useCallback((token, userData) => {
        try {
            const newUser = {
                ...DEFAULT_USER,
                ...(userData || {}),
                token: token || "guest-token",
            };
            localStorage.setItem("token", newUser.token);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);
        } catch (e) {
            console.error("Failed to save auth state", e);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(DEFAULT_USER);
    }, []);

    const isAuthenticated = true;

    return (
        <AuthContext.Provider
            value={{
                user: user || DEFAULT_USER,
                loading: false,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
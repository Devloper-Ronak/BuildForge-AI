import { useContext } from "react";
import { AuthContext } from "./authContextInstance.js";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return {
            user: null,
            loading: false,
            isAuthenticated: false,
            login: () => {},
            logout: () => {},
        };
    }
    return context;
};

export default useAuth;

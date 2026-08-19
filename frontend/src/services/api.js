import axios from "axios";

const API = axios.create({
    // Use env variable in production, localhost in development
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
    },
});


/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */
API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        const publicRoutes = [
            "/auth/login",
            "/auth/register",
            "/auth/google",
            "/auth/verify-email",
            "/auth/resend-otp",
            "/auth/forgot-password",
            "/auth/reset-password",
        ];

        const isPublicRoute =
            publicRoutes.some((route) =>
                config.url?.includes(route)
            );

        console.log(
            "🌐 API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;

            console.log(
                "🔐 AUTH HEADER: Attached"
            );

        } else if (!isPublicRoute) {

            console.warn(
                "🔐 AUTH HEADER: Missing for protected route"
            );

        } else {

            console.log(
                "🌐 Public authentication route"
            );
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/* =========================================================
   RESPONSE INTERCEPTOR
   ========================================================= */

API.interceptors.response.use(

    (response) => {

        console.log(
            "✅ API RESPONSE:",
            response.status,
            response.config?.url
        );

        return response;
    },

    (error) => {

        console.error(
            "❌ API ERROR:",
            error?.response?.status,
            error?.response?.data
        );

        if (
            error?.response?.status === 401
        ) {

            console.warn(
                "🔒 Authentication expired or missing."
            );

            /*
             * Do NOT immediately remove the token here
             * while debugging.
             *
             * Otherwise you can lose useful information.
             */

            const currentToken =
                localStorage.getItem("token");

            console.log(
                "🔍 Token at 401:",
                currentToken ?
                "EXISTS" :
                "MISSING"
            );
        }

        return Promise.reject(error);
    }
);


export default API;
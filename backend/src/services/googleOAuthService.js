import dotenv from "dotenv";
dotenv.config();

import { findUserByEmail, findUserByGoogleId, createUser, updateUser } from "./userService.js";
import generateToken from "../utils/generateToken.js";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export const getGoogleConfig = () => {
    return {
        clientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackUrl:
            process.env.GOOGLE_CALLBACK_URL ||
            "http://localhost:5001/api/auth/google/callback",
    };
};

/**
 * Generate Google OAuth 2.0 Authorization URL
 */
export const getGoogleAuthUrl = (state = "auth_state") => {
    const { clientId, callbackUrl } = getGoogleConfig();

    if (!clientId) {
        return null;
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackUrl,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account", // Force Google account selection
        state,
    });

    return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
};

/**
 * Exchange Authorization Code for Access & ID Tokens
 */
export const exchangeCodeForTokens = async (code, redirectUri) => {
    const { clientId, clientSecret, callbackUrl } = getGoogleConfig();
    const activeRedirectUri = redirectUri || callbackUrl;

    if (!clientId || !clientSecret) {
        throw new Error("Google OAuth Client ID or Client Secret is missing in server environment.");
    }

    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: activeRedirectUri,
            grant_type: "authorization_code",
        }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(data.error_description || data.error || "Failed to exchange Google OAuth code.");
    }

    return data;
};

/**
 * Fetch Google User Profile via Access Token
 */
export const getGoogleUserProfile = async (accessToken) => {
    const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile from Google.");
    }

    return await response.json();
};

/**
 * Authenticate or Register Google User in Application Database
 */
export const handleGoogleUserAuth = async (profile) => {
    if (!profile || !profile.email) {
        throw new Error("Invalid profile information received from Google.");
    }

    const cleanEmail = profile.email.trim().toLowerCase();
    const cleanName = profile.name ? profile.name.trim() : cleanEmail.split("@")[0];
    const googleId = profile.sub || profile.id || `google_${Date.now()}`;
    const avatar = profile.picture || null;

    let user = findUserByGoogleId(googleId) || findUserByEmail(cleanEmail);

    if (user) {
        // Account linking: update Google ID, avatar, verified status, and last login
        user = updateUser(user.id, {
            name: user.name || cleanName,
            avatar: avatar || user.avatar,
            googleId: user.googleId || googleId,
            emailVerified: true, // Google accounts are pre-verified
            authProvider: user.authProvider || "google",
            lastLoginAt: new Date().toISOString(),
        });
        console.log(`✅ [GOOGLE-AUTH] Existing user signed in: ${cleanEmail}`);
    } else {
        // Create new user with Google identity
        user = createUser({
            name: cleanName,
            email: cleanEmail,
            emailVerified: true,
            avatar,
            googleId,
            authProvider: "google",
            lastLoginAt: new Date().toISOString(),
        });
        console.log(`✅ [GOOGLE-AUTH] New user registered via Google: ${cleanEmail}`);
    }

    const token = generateToken(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
            authProvider: user.authProvider,
        },
        token,
    };
};

export default {
    getGoogleConfig,
    getGoogleAuthUrl,
    exchangeCodeForTokens,
    getGoogleUserProfile,
    handleGoogleUserAuth,
};

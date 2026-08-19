import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
    findUserByEmail,
    findUserById,
    findUserByResetTokenHash,
    createUser,
    updateUser,
} from "../services/userService.js";
import { generateAndSendOtp } from "../services/otpService.js";
import {
    getGoogleAuthUrl,
    exchangeCodeForTokens,
    getGoogleUserProfile,
    handleGoogleUserAuth,
} from "../services/googleOAuthService.js";
import generateToken from "../utils/generateToken.js";
import { sendPasswordResetEmail } from "../services/mailService.js";

// ======================
// SIGNUP
// ======================
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = findUserByEmail(cleanEmail);

        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(400).json({
                    success: false,
                    message: "An account already exists with this email. Please log in.",
                });
            }

            // User exists but unverified: update password and send fresh OTP
            const hashedPassword = await bcrypt.hash(password, 10);
            updateUser(existingUser.id, {
                name: cleanName,
                passwordHash: hashedPassword,
            });

            const otpResult = await generateAndSendOtp(cleanEmail, cleanName);

            return res.status(200).json({
                success: true,
                message: "Verification code sent to your email.",
                email: cleanEmail,
                devOtp: otpResult?.devOtp,
                mailDelivered: otpResult?.mailDelivered,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        createUser({
            name: cleanName,
            email: cleanEmail,
            passwordHash: hashedPassword,
            emailVerified: false,
            authProvider: "local",
        });

        const otpResult = await generateAndSendOtp(cleanEmail, cleanName);

        return res.status(201).json({
            success: true,
            message: "Account created! A 6-digit verification code has been sent to your email.",
            email: cleanEmail,
            devOtp: otpResult?.devOtp,
            mailDelivered: otpResult?.mailDelivered,
        });
    } catch (error) {
        console.error("❌ SIGNUP ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed. Please try again.",
        });
    }
};

// ======================
// LOGIN
// ======================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = findUserByEmail(cleanEmail);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Check if user was registered with Google without a password
        if (!user.passwordHash && user.authProvider === "google") {
            return res.status(400).json({
                success: false,
                message: "This account was created with Google. Please use 'Sign in with Google'.",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash || "");

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Please enter correct password",
            });
        }

        // Email Verification Gate
        if (!user.emailVerified) {
            let resendRes = null;
            try {
                resendRes = await generateAndSendOtp(cleanEmail, user.name);
            } catch (e) {
                console.warn("Could not resend OTP on unverified login:", e.message);
            }

            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in. A new code has been sent to your email.",
                isVerified: false,
                email: cleanEmail,
                devOtp: resendRes?.devOtp,
            });
        }

        // Update last login
        updateUser(user.id, {
            lastLoginAt: new Date().toISOString(),
        });

        // Generate JWT
        const token = generateToken(user.id);

        console.log("✅ Login successful for:", user.email);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    emailVerified: user.emailVerified,
                },
                token,
            },
        });
    } catch (error) {
        console.error("❌ LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login. Please try again.",
        });
    }
};

// ======================
// GOOGLE OAUTH: GET AUTH URL
// ======================
export const googleAuthUrl = async (req, res) => {
    try {
        const state = req.query.state || "buildforge_oauth_" + Date.now();
        const url = getGoogleAuthUrl(state);

        if (!url) {
            return res.status(200).json({
                success: false,
                configured: false,
                message: "Google Client ID is not configured in backend environment variables.",
            });
        }

        return res.status(200).json({
            success: true,
            configured: true,
            url,
        });
    } catch (error) {
        console.error("❌ GOOGLE AUTH URL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate Google authorization URL.",
        });
    }
};

// ======================
// GOOGLE OAUTH: CALLBACK REDIRECT
// ======================
export const googleCallback = async (req, res) => {
    try {
        const { code, error } = req.query;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        if (error) {
            console.warn("Google OAuth cancelled or failed:", error);
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Google authentication cancelled.")}`);
        }

        if (!code) {
            return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent("Authorization code missing from Google.")}`);
        }

        const tokens = await exchangeCodeForTokens(code);
        const profile = await getGoogleUserProfile(tokens.access_token);
        const { user, token } = await handleGoogleUserAuth(profile);

        const redirectUrl = `${frontendUrl}/auth/google/callback?token=${token}&user=${encodeURIComponent(
            JSON.stringify(user)
        )}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("❌ GOOGLE CALLBACK ERROR:", error);
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
            `${frontendUrl}/login?error=${encodeURIComponent(
                error.message || "Google authentication failed."
            )}`
        );
    }
};

// ======================
// GOOGLE OAUTH: DIRECT TOKEN / IDENTITY SERVICES
// ======================
export const googleTokenAuth = async (req, res) => {
    try {
        const { email, name, googleId, picture, accessToken } = req.body;

        let profile = {
            email,
            name,
            sub: googleId,
            picture,
        };

        if (accessToken) {
            try {
                profile = await getGoogleUserProfile(accessToken);
            } catch (e) {
                console.warn("Could not fetch userinfo via token, falling back to body:", e.message);
            }
        }

        if (!profile.email) {
            return res.status(400).json({
                success: false,
                message: "Valid Google email is required.",
            });
        }

        const { user, token } = await handleGoogleUserAuth(profile);

        return res.status(200).json({
            success: true,
            message: "Google authentication successful.",
            token,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.error("❌ GOOGLE TOKEN AUTH ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Google authentication failed.",
        });
    }
};

// ======================
// FORGOT PASSWORD (ANTI-ENUMERATION)
// ======================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = findUserByEmail(cleanEmail);

        // Standard Anti-Enumeration response message
        const genericSuccessMessage =
            "If an account exists for this email, you will receive a password reset link shortly.";

        if (!user) {
            // Return 200 without exposing that email does not exist
            return res.status(200).json({
                success: true,
                message: genericSuccessMessage,
            });
        }

        // Generate 32-byte cryptographically secure reset token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Also generate 6-digit OTP code for dual support
        const plainOtp = String(crypto.randomInt(100000, 1000000));
        const otpHash = await bcrypt.hash(plainOtp, 10);

        updateUser(user.id, {
            resetTokenHash: tokenHash,
            resetTokenExpiresAt: expiresAt,
            otpHash,
            otpExpiresAt: expiresAt,
            otpAttempts: 0,
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

        console.log(`\n=======================================================`);
        console.log(`🔑 [PASSWORD RESET REQUEST]`);
        console.log(`📧 Recipient: ${cleanEmail}`);
        console.log(`🔗 Reset Link: ${resetUrl}`);
        console.log(`🔢 Reset OTP:  >>> [ ${plainOtp} ] <<<`);
        console.log(`⏰ Expiry:     15 minutes`);
        console.log(`=======================================================\n`);

        try {
            await sendPasswordResetEmail(cleanEmail, user.name, resetUrl, plainOtp);
        } catch (mailErr) {
            console.warn(`⚠️ [MAIL SERVICE] Password reset email warning: ${mailErr.message}`);
        }

        return res.status(200).json({
            success: true,
            message: genericSuccessMessage,
        });
    } catch (err) {
        console.error("❌ FORGOT PASSWORD ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request. Please try again.",
        });
    }
};

// ======================
// RESET PASSWORD
// ======================
export const resetPassword = async (req, res) => {
    try {
        const { email, token, otp, newPassword } = req.body;

        if (!email || (!token && !otp) || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, reset token/code, and new password are required.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = findUserByEmail(cleanEmail);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset request.",
            });
        }

        let isAuthorized = false;

        // 1. Verify via SHA-256 Token
        if (token) {
            const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");
            if (
                user.resetTokenHash &&
                user.resetTokenHash === tokenHash &&
                user.resetTokenExpiresAt &&
                user.resetTokenExpiresAt > Date.now()
            ) {
                isAuthorized = true;
            }
        }

        // 2. Verify via 6-Digit OTP Fallback
        if (!isAuthorized && otp && user.otpHash && user.otpExpiresAt) {
            if (user.otpExpiresAt > Date.now()) {
                const otpMatch = await bcrypt.compare(String(otp).trim(), user.otpHash);
                if (otpMatch) {
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset code. Please request a new link.",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password, mark email verified, clear reset tokens
        updateUser(user.id, {
            passwordHash: hashedPassword,
            emailVerified: true,
            resetTokenHash: null,
            resetTokenExpiresAt: null,
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0,
            updatedAt: new Date().toISOString(),
        });

        console.log(`✅ [PASSWORD RESET SUCCESS] Updated password for ${cleanEmail}`);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in with your new password.",
        });
    } catch (err) {
        console.error("❌ RESET PASSWORD ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again.",
        });
    }
};

export default {
    signup,
    login,
    googleAuthUrl,
    googleCallback,
    googleTokenAuth,
    forgotPassword,
    resetPassword,
};
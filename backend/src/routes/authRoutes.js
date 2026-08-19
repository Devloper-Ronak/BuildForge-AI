import express from "express";
import rateLimit from "express-rate-limit";

import {
    signupValidator,
    loginValidator,
    resetPasswordValidator,
    validate,
} from "../middleware/validators.js";

import {
    signup,
    login,
    googleAuthUrl,
    googleCallback,
    googleTokenAuth,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";

import { verifyOTP, resendOTP } from "../controllers/otpController.js";

const router = express.Router();

// Rate limiting for auth attempts
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 30, // Max 30 attempts per window
    message: {
        success: false,
        message: "Too many attempts. Please try again later.",
    },
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again in 15 minutes.",
    },
});

// ======================
// LOCAL AUTH ROUTES
// ======================

router.post("/register", authLimiter, signupValidator, validate, signup);
router.post("/signup", authLimiter, signupValidator, validate, signup);

router.post("/login", authLimiter, loginValidator, validate, login);

// ======================
// GOOGLE OAUTH ROUTES
// ======================

// 1. Get Google OAuth Consent URL (Server-side Code Flow)
router.get("/google/url", googleAuthUrl);

// 2. Google OAuth Redirect Callback
router.get("/google/callback", googleCallback);

// 3. Google Identity Services / Token Endpoint
router.post("/google/token", googleTokenAuth);
router.post("/google", googleTokenAuth);

// ======================
// OTP VERIFICATION ROUTES
// ======================

router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/verify-email", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);

// ======================
// PASSWORD RESET ROUTES
// ======================

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidator, validate, resetPassword);

export default router;
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUser } from "./userService.js";
import { sendVerificationEmail } from "./mailService.js";

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export const generateSecureOTP = () => {
    // Generates a secure random integer between 100000 and 999999
    return String(crypto.randomInt(100000, 1000000));
};

/**
 * Generates OTP, hashes it with bcrypt, saves to user record, and sends email.
 * NEVER returns or stores plaintext OTP in database.
 */
export const generateAndSendOtp = async (email, name) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
        throw new Error("User account not found.");
    }

    const plainOtp = generateSecureOTP();
    const otpHash = await bcrypt.hash(plainOtp, 10);
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    updateUser(user.id, {
        otpHash,
        otpExpiresAt: expiresAt,
        otpAttempts: 0,
        otpCreatedAt: new Date().toISOString(),
    });

    console.log(`\n=======================================================`);
    console.log(`🔐 [SECURE OTP SERVICE] 6-Digit Code Generated`);
    console.log(`📧 Recipient: ${cleanEmail}`);
    console.log(`🔢 Code:      >>> [ ${plainOtp} ] <<< (Logged for local dev only)`);
    console.log(`⏰ Expiry:    10 minutes`);
    console.log(`=======================================================\n`);

    let mailDelivered = false;
    try {
        const mailRes = await sendVerificationEmail(cleanEmail, name || user.name, plainOtp);
        mailDelivered = mailRes?.success && mailRes?.provider !== "console";
    } catch (mailErr) {
        console.warn(`⚠️ [MAIL SERVICE] Email delivery warning: ${mailErr.message}`);
    }

    return {
        success: true,
        expiresInSeconds: 600,
        devOtp: plainOtp,
        mailDelivered,
    };
};

/**
 * Verifies the provided 6-digit OTP against the stored bcrypt hash.
 */
export const verifyOtpCode = async (email, providedOtp) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
        return {
            success: false,
            message: "User account not found.",
        };
    }

    if (!user.otpHash || !user.otpExpiresAt) {
        return {
            success: false,
            message: "No verification code requested or code has expired.",
        };
    }

    // Check expiration
    if (Date.now() > user.otpExpiresAt) {
        updateUser(user.id, {
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0,
        });
        return {
            success: false,
            message: "Verification code has expired. Please request a new code.",
        };
    }

    // Check maximum attempts
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        updateUser(user.id, {
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0,
        });
        return {
            success: false,
            message: "Too many failed attempts. Please request a new verification code.",
        };
    }

    // Compare hash
    const isMatch = await bcrypt.compare(String(providedOtp).trim(), user.otpHash);

    if (!isMatch) {
        const nextAttempts = (user.otpAttempts || 0) + 1;
        updateUser(user.id, {
            otpAttempts: nextAttempts,
        });

        const remaining = MAX_OTP_ATTEMPTS - nextAttempts;
        return {
            success: false,
            message:
                remaining > 0
                    ? `Invalid verification code. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining.`
                    : "Too many failed attempts. Please request a new verification code.",
        };
    }

    // Valid OTP: mark email verified and invalidate OTP
    const updatedUser = updateUser(user.id, {
        emailVerified: true,
        otpHash: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        lastLoginAt: new Date().toISOString(),
    });

    return {
        success: true,
        user: updatedUser,
    };
};

export default {
    generateSecureOTP,
    generateAndSendOtp,
    verifyOtpCode,
};

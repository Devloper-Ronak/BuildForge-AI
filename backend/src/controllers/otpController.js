import { verifyOtpCode, generateAndSendOtp } from "../services/otpService.js";
import generateToken from "../utils/generateToken.js";
import { findUserByEmail } from "../services/userService.js";

// ======================
// VERIFY OTP (SIGNUP)
// ======================
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email address and 6-digit verification code are required.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const result = await verifyOtpCode(cleanEmail, String(otp).trim());

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message || "Invalid or expired verification code.",
            });
        }

        const user = result.user;
        const token = generateToken(user.id);

        console.log(`✅ [OTP-VERIFIED] Email ${cleanEmail} verified. Generated session token.`);

        return res.status(200).json({
            success: true,
            message: "🎉 Email verified successfully! Welcome to BuildForge AI.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                emailVerified: true,
            },
        });
    } catch (err) {
        console.error("❌ VERIFY OTP ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to verify code. Please try again.",
        });
    }
};

// ======================
// RESEND OTP
// ======================
export const resendOTP = async (req, res) => {
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

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Your email is already verified. Please log in.",
            });
        }

        const otpResult = await generateAndSendOtp(cleanEmail, user.name);

        return res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email.",
            devOtp: otpResult?.devOtp,
        });
    } catch (err) {
        console.error("❌ RESEND OTP ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to resend verification code. Please try again.",
        });
    }
};

export default {
    verifyOTP,
    resendOTP,
};
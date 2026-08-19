import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// ==========================================
// CREATE NODEMAILER TRANSPORTER (GMAIL/SMTP)
// ==========================================
const getSmtpTransporter = () => {
    // 1. Direct Gmail Configuration
    const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || process.env.EMAIL_PASS;

    if (gmailUser && gmailPass) {
        return nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: gmailUser.trim(),
                pass: gmailPass.replace(/\s+/g, ""),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    // 2. Custom SMTP Configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
        return nodemailer.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    return null;
};

// ==========================================
// SEND VERIFICATION EMAIL (SIGNUP OTP)
// ==========================================
export const sendVerificationEmail = async (email, name, otp) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name || "Builder";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your BuildForge AI account</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.06);" cellspacing="0" cellpadding="0">
                    <!-- HEADER -->
                    <tr>
                        <td style="background:#2547e7;padding:32px 30px;text-align:center;">
                            <div style="font-size:32px;line-height:1;">🚀</div>
                            <h1 style="color:#ffffff;margin:10px 0 0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">BuildForge AI</h1>
                            <p style="color:#e0e7ff;margin:4px 0 0;font-size:13.5px;">Next-Generation AI Architecture Suite</p>
                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="padding:32px 32px 24px;">
                            <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px;">Please verify your email address</h2>
                            <p style="font-size:14.5px;color:#475569;line-height:1.6;margin:0 0 18px;">
                                Hi <b>${cleanName}</b>, welcome aboard! We've sent a 6-digit verification code to activate your account. Please enter the code below:
                            </p>

                            <!-- OTP CODE BOX -->
                            <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:14px;padding:20px;text-align:center;margin:22px 0;">
                                <span style="display:block;font-size:11.5px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;font-weight:600;margin-bottom:6px;">Your 6-Digit Verification Code</span>
                                <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2547e7;font-family:Courier,monospace;">
                                    ${otp}
                                </div>
                                <span style="display:block;font-size:12px;color:#94a3b8;margin-top:8px;">Valid for 10 minutes</span>
                            </div>

                            <p style="font-size:12.5px;color:#64748b;line-height:1.5;margin:18px 0 0;">
                                ⚠️ If you did not request this verification, please disregard this email. Your email address will remain secure.
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding:18px 32px 24px;border-top:1px solid #f1f5f9;background:#fafafa;text-align:center;">
                            <p style="font-size:12px;color:#94a3b8;margin:0;">
                                &copy; ${new Date().getFullYear()} BuildForge AI. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    // 1. Try Gmail / SMTP via Nodemailer
    const smtpTransporter = getSmtpTransporter();
    if (smtpTransporter) {
        try {
            const sender =
                process.env.EMAIL_FROM ||
                process.env.GMAIL_USER ||
                process.env.SMTP_USER ||
                "BuildForge AI <noreply@buildforge.ai>";

            await smtpTransporter.sendMail({
                from: `"BuildForge AI" <${sender}>`,
                to: cleanEmail,
                subject: `${otp} is your BuildForge AI verification code`,
                html: htmlContent,
            });

            console.log(`✅ [GMAIL/SMTP] Verification email sent to ${cleanEmail}`);
            return { success: true, provider: "smtp" };
        } catch (smtpError) {
            console.warn(`⚠️ [GMAIL/SMTP] Delivery warning: ${smtpError.message}`);
        }
    }

    // 2. Try Resend API if configured
    if (resend && resendApiKey) {
        try {
            const fromEmail = process.env.EMAIL_FROM || "BuildForge AI <onboarding@resend.dev>";
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: cleanEmail,
                subject: `${otp} is your BuildForge AI verification code`,
                html: htmlContent,
            });

            if (!error && data) {
                console.log(`✅ [RESEND] Verification email sent to ${cleanEmail}`);
                return { success: true, provider: "resend", data };
            }
        } catch (resendError) {
            console.warn(`⚠️ [RESEND] Delivery error: ${resendError.message}`);
        }
    }

    return { success: true, provider: "console" };
};

// ==========================================
// SEND PASSWORD RESET EMAIL (LINK + OTP)
// ==========================================
export const sendPasswordResetEmail = async (email, name, resetUrl, otp) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name || "Builder";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your BuildForge AI Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.06);" cellspacing="0" cellpadding="0">
                    <!-- HEADER -->
                    <tr>
                        <td style="background:#2547e7;padding:32px 30px;text-align:center;">
                            <div style="font-size:32px;line-height:1;">🔐</div>
                            <h1 style="color:#ffffff;margin:10px 0 0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">BuildForge AI</h1>
                            <p style="color:#e0e7ff;margin:4px 0 0;font-size:13.5px;">Password Reset Request</p>
                        </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                        <td style="padding:32px 32px 24px;">
                            <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 12px;">Reset Your Password</h2>
                            <p style="font-size:14.5px;color:#475569;line-height:1.6;margin:0 0 20px;">
                                Hi <b>${cleanName}</b>, we received a request to reset your BuildForge AI password. Click the button below or use your verification code:
                            </p>

                            <!-- ONE-CLICK RESET BUTTON -->
                            ${
                                resetUrl
                                    ? `
                            <div style="text-align:center;margin:24px 0 20px;">
                                <a href="${resetUrl}" style="background:#2547e7;color:#ffffff;padding:13px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(37,71,231,0.25);">
                                    Reset My Password
                                </a>
                            </div>`
                                    : ""
                            }

                            <!-- OTP CODE BOX -->
                            <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:14px;padding:18px;text-align:center;margin:20px 0;">
                                <span style="display:block;font-size:11.5px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;font-weight:600;margin-bottom:4px;">Verification Code</span>
                                <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#2547e7;font-family:Courier,monospace;">
                                    ${otp}
                                </div>
                                <span style="display:block;font-size:12px;color:#94a3b8;margin-top:6px;">Expires in 15 minutes</span>
                            </div>

                            <p style="font-size:12.5px;color:#64748b;line-height:1.5;margin:18px 0 0;">
                                If you did not request a password reset, you can safely ignore this email. Your password remains unchanged.
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding:18px 32px 24px;border-top:1px solid #f1f5f9;background:#fafafa;text-align:center;">
                            <p style="font-size:12px;color:#94a3b8;margin:0;">
                                &copy; ${new Date().getFullYear()} BuildForge AI. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    // 1. Try Gmail / SMTP via Nodemailer
    const smtpTransporter = getSmtpTransporter();
    if (smtpTransporter) {
        try {
            const sender =
                process.env.EMAIL_FROM ||
                process.env.GMAIL_USER ||
                process.env.SMTP_USER ||
                "BuildForge AI <noreply@buildforge.ai>";

            await smtpTransporter.sendMail({
                from: `"BuildForge AI" <${sender}>`,
                to: cleanEmail,
                subject: "Reset your BuildForge AI Password",
                html: htmlContent,
            });

            console.log(`✅ [GMAIL/SMTP] Password reset email sent to ${cleanEmail}`);
            return { success: true, provider: "smtp" };
        } catch (smtpError) {
            console.warn(`⚠️ [GMAIL/SMTP] Delivery warning: ${smtpError.message}`);
        }
    }

    // 2. Try Resend API if configured
    if (resend && resendApiKey) {
        try {
            const fromEmail = process.env.EMAIL_FROM || "BuildForge AI <onboarding@resend.dev>";
            const { data, error } = await resend.emails.send({
                from: fromEmail,
                to: cleanEmail,
                subject: "Reset your BuildForge AI Password",
                html: htmlContent,
            });

            if (!error && data) {
                console.log(`✅ [RESEND] Password reset email sent to ${cleanEmail}`);
                return { success: true, provider: "resend", data };
            }
        } catch (resendError) {
            console.warn(`⚠️ [RESEND] Delivery error: ${resendError.message}`);
        }
    }

    return { success: true, provider: "console" };
};

export default {
    sendVerificationEmail,
    sendPasswordResetEmail,
};
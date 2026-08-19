import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth.js";
import toast from "react-hot-toast";
import { FiChevronLeft, FiAlertTriangle, FiCheck } from "react-icons/fi";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthLogin } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");

  const inputs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleChange = (value, index) => {
    // Only allow numeric digits
    if (!/^[0-9]?$/.test(value)) return;

    setErrorMessage("");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next box if character was entered
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^[0-9]{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputs.current[5]?.focus();
      setErrorMessage("");
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your registered email address.");
      toast.error("Please enter your registered email address.");
      return;
    }

    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await API.post("/auth/verify-otp", {
        email: cleanEmail,
        otp: code,
      });

      if (res.data?.success) {
        if (res.data.token) {
          setAuthLogin(res.data.token, res.data.user);
          toast.success(res.data.message || "🎉 Email verified successfully! Welcome to BuildForge AI.");
          navigate("/dashboard", { replace: true });
        } else {
          toast.success("🎉 Email verified! You can now log in.");
          navigate("/login", { replace: true });
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
      const msg =
        err.response?.data?.message ||
        "Invalid or expired verification code. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);

      // Clear OTP input fields on error
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your email to resend code.");
      return;
    }

    try {
      setResending(true);
      setErrorMessage("");

      const res = await API.post("/auth/resend-otp", { email: cleanEmail });

      toast.success(res.data?.message || "A new verification code has been sent to your email.");
      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setSeconds(60);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      const msg = err.response?.data?.message || "Failed to resend verification code.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-container">
        {/* TOP NAV ROW WITH BACK BUTTON & LOGO */}
        <div className="auth-nav-row">
          <button
            type="button"
            className="auth-back-btn"
            onClick={() => navigate("/signup")}
            title="Go to Signup"
            aria-label="Back"
          >
            <FiChevronLeft size={20} />
          </button>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🚀</span>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.3px" }}>
              BuildForge AI
            </span>
          </div>
          <div style={{ width: "36px" }} />
        </div>

        {/* TITLE & SUBTITLE */}
        <h1 className="auth-title auth-title-left" style={{ marginTop: "8px" }}>
          Please verify your email address
        </h1>

        <p className="auth-subtitle">
          We've sent a verification code to{" "}
          <span className="highlight-email">{email || "your email address"}</span>
          . Please enter the code below.
        </p>

        {/* DEV OTP AUTO-FILL HELPER BADGE */}
        {devOtp && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px dashed #3b82f6",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "12.5px", color: "#1d4ed8" }}>
              🔑 Verification Code: <strong style={{ letterSpacing: "2px", fontSize: "14px" }}>{devOtp}</strong>
            </div>
            <button
              type="button"
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "11.5px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => {
                const digits = String(devOtp).split("");
                setOtp(digits);
                inputs.current[5]?.focus();
              }}
            >
              Auto-fill
            </button>
          </div>
        )}

        {/* EMAIL INPUT IF NOT PASSED */}
        {!location.state?.email && (
          <div className="auth-input-group" style={{ marginBottom: "16px" }}>
            <label className="auth-label" htmlFor="verify-email-input">
              Email Address
            </label>
            <input
              id="verify-email-input"
              type="email"
              className="auth-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {/* 6-DIGIT OTP FORM */}
        <form onSubmit={handleVerify}>
          <div className="auth-input-group">
            <label className="auth-label">Enter Code</label>
            <div className="auth-otp-row" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className={`auth-otp-box ${digit ? "filled" : ""} ${
                    errorMessage ? "auth-input-error" : ""
                  }`}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          {/* INLINE ERROR ALERT */}
          {errorMessage && (
            <div className="auth-error-alert" role="alert" style={{ marginBottom: "14px" }}>
              <FiAlertTriangle className="auth-error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? (
              <>
                <div className="auth-spinner" />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* RESEND AREA */}
        <div className="auth-resend-row">
          Didn't receive your email?
          {seconds > 0 ? (
            <span style={{ marginLeft: "6px", color: "#94a3b8" }}>
              Resend in <b>{seconds}s</b>
            </span>
          ) : (
            <button
              type="button"
              className="auth-resend-link"
              onClick={handleResendOTP}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
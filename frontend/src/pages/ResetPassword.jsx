import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import PasswordStrengthMeter, { checkPasswordCriteria } from "../components/PasswordStrengthMeter";
import { FiChevronLeft, FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialToken = queryParams.get("token") || location.state?.token || "";
  const initialEmail = queryParams.get("email") || location.state?.email || "";
  const initialOtp = location.state?.otp ? String(location.state.otp).trim() : "";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [otp, setOtp] = useState(initialOtp);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialToken) setToken(initialToken);
    if (initialEmail) setEmail(initialEmail);
  }, [initialToken, initialEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Email address is required.");
      toast.error("Email address is required.");
      return;
    }

    if (!token && !otp) {
      setErrorMessage("Reset token or 6-digit verification code is required.");
      toast.error("Please provide your reset token or code.");
      return;
    }

    // Password criteria check
    const criteria = checkPasswordCriteria(password);
    if (!criteria.minLength || !criteria.hasUpper || !criteria.hasLower || !criteria.hasNumber || !criteria.hasSpecial) {
      setErrorMessage("Password does not meet the security requirements.");
      toast.error("Please ensure your new password meets all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await API.post("/auth/reset-password", {
        email: cleanEmail,
        token: token || undefined,
        otp: otp || undefined,
        newPassword: password,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Password reset successfully! Please log in.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.response?.data?.message ||
        "Password reset failed. The link or code may have expired.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
            onClick={() => navigate("/forgot-password")}
            title="Back"
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
          Reset Password
        </h1>

        <p className="auth-subtitle">
          Create a new secure password for{" "}
          <span className="highlight-email">{email || "your account"}</span>.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* EMAIL (if not prefilled) */}
          {!initialEmail && (
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reset-email">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                className="auth-input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* CODE (if no token in URL) */}
          {!token && (
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="reset-otp">
                6-Digit Code
              </label>
              <input
                id="reset-otp"
                type="text"
                className="auth-input"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          )}

          {/* NEW PASSWORD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="reset-new-password">
              New Password
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reset-new-password"
                type={showPassword ? "text" : "password"}
                className={`auth-input ${errorMessage ? "auth-input-error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setErrorMessage("");
                  setPassword(e.target.value);
                }}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* PASSWORD STRENGTH METER */}
            <PasswordStrengthMeter password={password} showRequirements={Boolean(password)} />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="reset-confirm-password">
              Confirm New Password
            </label>
            <div className="auth-input-wrapper">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={`auth-input ${
                  errorMessage && password !== confirmPassword ? "auth-input-error" : ""
                }`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setErrorMessage("");
                  setConfirmPassword(e.target.value);
                }}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* INLINE ERROR ALERT */}
          {errorMessage && (
            <div className="auth-error-alert" role="alert">
              <FiAlertTriangle className="auth-error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="auth-spinner" />
                <span>Resetting password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* BOTTOM LINK */}
        <div className="auth-footer-text">
          <Link to="/login" className="auth-footer-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiChevronLeft, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your registered email address.");
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await API.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setSubmitted(true);
      toast.success(
        res.data?.message ||
          "If an account exists for this email, you will receive a password reset link."
      );
    } catch (err) {
      console.error("Forgot password error:", err);
      // Safe fallback message
      setSubmitted(true);
      toast.success(
        "If an account exists for this email, you will receive a password reset link."
      );
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
            onClick={() => navigate("/login")}
            title="Back to Login"
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
          Forgot Password?
        </h1>

        <p className="auth-subtitle">
          Enter the email address registered with your account. We'll send you a link to reset your password.
        </p>

        {submitted ? (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              padding: "18px 16px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <FiCheckCircle size={28} color="#16a34a" style={{ marginBottom: "8px" }} />
            <p style={{ fontSize: "14px", color: "#166534", margin: "0 0 6px", fontWeight: "600" }}>
              Check Your Inbox
            </p>
            <p style={{ fontSize: "13px", color: "#15803d", margin: 0, lineHeight: 1.5 }}>
              If an account exists for <b>{email}</b>, you will receive a password reset email with a secure link and code.
            </p>
          </div>
        ) : (
          /* FORM */
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="forgot-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="forgot-email"
                  type="email"
                  className={`auth-input ${errorMessage ? "auth-input-error" : ""}`}
                  placeholder="Rhebhek@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setErrorMessage("");
                    setEmail(e.target.value);
                  }}
                  required
                  autoComplete="email"
                />
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
                  <span>Sending reset link...</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}

        {/* BOTTOM LINK */}
        <div className="auth-footer-text">
          Remembered password?
          <Link to="/login" className="auth-footer-link">
            Log in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import PasswordStrengthMeter, { checkPasswordCriteria } from "../components/PasswordStrengthMeter";
import { FiChevronLeft, FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrorMessage("");
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    // Password criteria check
    const criteria = checkPasswordCriteria(password);
    if (!criteria.minLength || !criteria.hasUpper || !criteria.hasLower || !criteria.hasNumber || !criteria.hasSpecial) {
      setErrorMessage("Password does not meet the security requirements.");
      toast.error("Please ensure password meets all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!form.agreeTerms) {
      setErrorMessage("Please accept the terms of use and privacy policy to continue.");
      toast.error("Please accept the terms of use to continue.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const payload = {
        name: cleanName,
        email: cleanEmail,
        password,
      };

      const res = await API.post("/auth/register", payload);

      if (res.data?.success) {
        toast.success(res.data.message || "Verification code sent to your email!");
        navigate("/verify-email", {
          state: {
            email: cleanEmail,
            name: cleanName,
            devOtp: res.data.devOtp,
          },
        });
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Registration failed. Please check your details and try again.";
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
            onClick={() => navigate("/login")}
            title="Go to Login"
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

        <h1 className="auth-title" style={{ marginTop: "4px", marginBottom: "20px" }}>
          Create Account
        </h1>

        {/* SIGNUP FORM */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* FULL NAME FIELD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="register-name">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <input
                id="register-name"
                name="name"
                type="text"
                className={`auth-input ${errorMessage && !form.name ? "auth-input-error" : ""}`}
                placeholder="Becca Ade"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          </div>

          {/* EMAIL ADDRESS FIELD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <input
                id="register-email"
                name="email"
                type="email"
                className={`auth-input ${errorMessage && !form.email ? "auth-input-error" : ""}`}
                placeholder="Rhebhek@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="register-password">
              Password
            </label>
            <div className="auth-input-wrapper">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`auth-input ${errorMessage && !form.password ? "auth-input-error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
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
            <PasswordStrengthMeter password={form.password} showRequirements={Boolean(form.password)} />
          </div>

          {/* CONFIRM PASSWORD FIELD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`auth-input ${
                  errorMessage && form.password !== form.confirmPassword ? "auth-input-error" : ""
                }`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
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

          {/* TERMS & PRIVACY CHECKBOX */}
          <label className="auth-checkbox-group">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
            />
            <span>
              By Creating an Account, i accept BuildForge AI{" "}
              <Link to="/home" target="_blank" rel="noreferrer">
                terms of Use
              </Link>{" "}
              and{" "}
              <Link to="/home" target="_blank" rel="noreferrer">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="auth-spinner" />
                <span>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* BOTTOM LINK */}
        <div className="auth-footer-text">
          Already have an account?
          <Link to="/login" className="auth-footer-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
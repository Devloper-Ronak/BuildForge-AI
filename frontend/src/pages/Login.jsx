import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/useAuth.js";
import toast from "react-hot-toast";
import { FiChevronLeft, FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const { login: setAuthLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    keepSignedIn: true,
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage("Please enter your email and password.");
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await API.post("/auth/login", {
        email: cleanEmail,
        password: cleanPassword,
      });

      const responseData = response?.data || {};
      const loginData = responseData?.data || responseData;
      const token = loginData?.token || responseData?.token;
      const user = loginData?.user || responseData?.user;

      if (!token) {
        throw new Error("Authentication token was not returned.");
      }

      setAuthLogin(token, user);
      toast.success(`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}!`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (error?.response?.status === 403) {
        toast.error("Please verify your email before logging in.");
        navigate("/verify-email", {
          state: {
            email: cleanEmail,
            devOtp: error.response?.data?.devOtp,
          },
        });
        return;
      }

      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password.";

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
            onClick={() => navigate("/home")}
            title="Go to Home"
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
          Welcome Back
        </h1>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="auth-form" noValidate>
          {/* EMAIL FIELD */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <input
                id="login-email"
                name="email"
                type="email"
                className={`auth-input ${errorMessage ? "auth-input-error" : ""}`}
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
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot Password?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`auth-input ${errorMessage ? "auth-input-error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
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
          </div>

          {/* INLINE ERROR ALERT */}
          {errorMessage && (
            <div className="auth-error-alert" role="alert">
              <FiAlertTriangle className="auth-error-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* KEEP ME SIGNED IN CHECKBOX */}
          <label className="auth-checkbox-group">
            <input
              type="checkbox"
              name="keepSignedIn"
              checked={form.keepSignedIn}
              onChange={handleChange}
            />
            <span>Keep me signed in</span>
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
                <span>Signing in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* BOTTOM LINK */}
        <div className="auth-footer-text">
          Don't have an account?
          <Link to="/signup" className="auth-footer-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
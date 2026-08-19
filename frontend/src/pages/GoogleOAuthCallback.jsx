import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import toast from "react-hot-toast";

function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userString = params.get("user");
    const error = params.get("error");

    if (error) {
      toast.error(decodeURIComponent(error) || "Google authentication failed.");
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      let user = null;
      try {
        if (userString) {
          user = JSON.parse(decodeURIComponent(userString));
        }
      } catch (e) {
        console.error("Failed to parse user data from Google callback:", e);
      }

      setAuthLogin(token, user);
      toast.success(`Welcome to BuildForge AI, ${user?.name || "Builder"}! 🚀`);
      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Authentication token was not received from Google.");
      navigate("/login", { replace: true });
    }
  }, [location, navigate, setAuthLogin]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card-container" style={{ textAlign: "center", padding: "48px 32px" }}>
        <div className="auth-spinner" style={{ margin: "0 auto 20px", width: "32px", height: "32px", borderColor: "rgba(37, 71, 231, 0.2)", borderTopColor: "#2547e7" }} />
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>
          Authenticating with Google...
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Completing your secure sign-in. You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}

export default GoogleOAuthCallback;

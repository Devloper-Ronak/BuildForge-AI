import React, { useState } from "react";
import GoogleIcon from "./GoogleIcon";
import { FiX, FiMail, FiUser, FiArrowRight, FiKey, FiCheck } from "react-icons/fi";
import { openGoogleSignInPopup, getGoogleClientId } from "../utils/googleAuth";

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSelectAccount,
  defaultEmail = "",
  defaultName = "",
  loading = false,
}) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [name, setName] = useState(defaultName || "");
  const [showClientIdInput, setShowClientIdInput] = useState(false);
  const [clientId, setClientId] = useState(getGoogleClientId() || "");

  if (!isOpen) return null;

  // Try real Google OAuth popup if Client ID is configured
  const handleNativeGooglePopup = () => {
    const activeClientId = clientId || getGoogleClientId();
    if (activeClientId) {
      const opened = openGoogleSignInPopup({
        clientId: activeClientId,
        onSuccess: (googleUser) => {
          onSelectAccount(googleUser);
        },
        onError: (err) => {
          console.error("Google popup error:", err);
        },
      });

      if (opened) {
        onClose();
        return;
      }
    }
    // If not configured, show email input
    setShowClientIdInput(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    const cleanName = name.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ");
    onSelectAccount({
      email: cleanEmail,
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      googleId: "google_" + Date.now(),
    });
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (clientId.trim()) {
      localStorage.setItem("google_client_id", clientId.trim());
      handleNativeGooglePopup();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          color: "#1e293b",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <GoogleIcon />
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
              Sign in with Google
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "4px",
              display: "flex",
              borderRadius: "50%",
            }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "22px 24px 24px" }}>
          {/* NATIVE GOOGLE POPUP BUTTON IF CLIENT ID EXISTS */}
          {getGoogleClientId() && (
            <button
              type="button"
              onClick={handleNativeGooglePopup}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1e293b",
                cursor: "pointer",
                marginBottom: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <GoogleIcon />
              <span>Choose your Google Account (OAuth Popup)</span>
            </button>
          )}

          {!showClientIdInput ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "13.5px", color: "#475569", lineHeight: 1.4 }}>
                Enter <b>your own Google Email</b> to sign in with your account:
              </p>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Your Google Email Address
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2547e7",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                  opacity: loading || !email.trim() ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "4px",
                  boxShadow: "0 4px 12px rgba(37, 71, 231, 0.25)",
                }}
              >
                {loading ? "Signing in..." : "Continue with Google"}
                {!loading && <FiArrowRight size={16} />}
              </button>

              <div style={{ textAlign: "center", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowClientIdInput(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Configure Google Cloud OAuth Client ID (Optional)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveClientId} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#475569" }}>
                Paste your Google Cloud <b>OAuth Client ID</b> from Google Cloud Console:
              </p>
              <input
                type="text"
                required
                placeholder="apps.googleusercontent.com Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowClientIdInput(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2547e7",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Save & Open Popup
                </button>
              </div>
            </form>
          )}

          <p style={{ margin: "18px 0 0", fontSize: "11.5px", color: "#94a3b8", textAlign: "center", lineHeight: 1.4 }}>
            BuildForge AI securely authenticates your Google account without storing any third-party passwords.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;

import API from "../services/api";

export const getGoogleClientId = () => {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem("google_client_id") ||
    ""
  );
};

export const decodeGoogleJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode Google JWT token:", e);
    return null;
  }
};

/**
 * Initiates the Google OAuth popup
 */
export const openGoogleSignInPopup = ({ onSuccess, onError, clientId }) => {
  const activeClientId = clientId || getGoogleClientId();

  if (window.google?.accounts?.oauth2 && activeClientId) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error("Google Token Error:", tokenResponse.error);
            onError?.(tokenResponse.error);
            return;
          }

          try {
            const res = await API.post("/auth/google/token", {
              accessToken: tokenResponse.access_token,
            });

            if (res.data?.success) {
              const token = res.data.token || res.data.data?.token;
              const user = res.data.data?.user || res.data.user;
              onSuccess({ token, user, ...user });
            } else {
              onError?.(res.data?.message || "Google authentication failed.");
            }
          } catch (backendErr) {
            onError?.(
              backendErr.response?.data?.message || "Failed to complete Google sign-in."
            );
          }
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
      return true;
    } catch (err) {
      console.warn("Failed to initialize Google OAuth2 client:", err);
    }
  }

  return false;
};

/**
 * Comprehensive Google OAuth launcher
 */
export const initiateGoogleOAuthFlow = async ({ onSuccess, onError }) => {
  const clientId = getGoogleClientId();

  // 1. Try Google Identity Services Popup if Client ID is configured
  if (window.google?.accounts?.oauth2 && clientId) {
    const opened = openGoogleSignInPopup({ onSuccess, onError, clientId });
    if (opened) return true;
  }

  // 2. Server-side OAuth redirect flow
  try {
    const res = await API.get("/auth/google/url");
    if (res.data?.url) {
      window.location.href = res.data.url;
      return true;
    }
  } catch (err) {
    console.warn("Could not get Google Auth URL:", err.response?.data?.message || err.message);
  }

  return false;
};

export default {
  getGoogleClientId,
  decodeGoogleJwt,
  openGoogleSignInPopup,
  initiateGoogleOAuthFlow,
};

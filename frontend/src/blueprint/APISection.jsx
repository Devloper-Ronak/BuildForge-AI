import { motion } from "framer-motion";
import { useState } from "react";
import { FaCopy, FaCheck, FaLock, FaGlobe } from "react-icons/fa";

/* ================= SAFE HELPERS ================= */

const safeText = (value, fallback = "") => {
  if (value == null) return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim() || fallback;
  }

  if (Array.isArray(value)) {
    return value.map((v) => safeText(v)).filter(Boolean).join(", ") || fallback;
  }

  if (typeof value === "object") {
    if (value.title || value.name || value.description) {
      return value.title || value.name || value.description;
    }
    return JSON.stringify(value, null, 2);
  }

  return fallback;
};

/* ================= NORMALIZER ================= */

function normalizeApis(project) {
  if (!project) return [];

  if (Array.isArray(project.restApis)) return project.restApis;
  if (Array.isArray(project.apis)) return project.apis;
  if (Array.isArray(project.apiEndpoints)) return project.apiEndpoints;

  return [];
}

export default function APISection({ project }) {
  const apis = normalizeApis(project);
  const [copied, setCopied] = useState("");

  if (!apis.length) return null;

  const copyEndpoint = async (endpoint, event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(endpoint);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <section className="blueprint-card api-section" id="RESTAPIs">
      <div className="section-heading">
        <div className="section-badge">🌐 REST API DESIGN</div>
        <h2>AI Generated REST APIs</h2>
        <p>
          Standardized RESTful API contracts designed with secure authentication, payload validation, semantic HTTP verbs, and production-ready conventions.
        </p>
      </div>

      <div className="api-grid">
        {apis.map((api, index) => {
          const method = (api.method || "GET").toUpperCase();
          const endpoint = safeText(api.endpoint || api.path, "/api/v1/resource");
          const name = safeText(api.name || api.title, `${method} ${endpoint}`);
          const purpose = safeText(api.purpose || api.description, "Processes client request payload.");
          const auth = safeText(api.authentication, "Required (JWT Bearer Token)");
          const isPublic = auth.toLowerCase().includes("public");

          const reqData = api.requestBody || api.request?.body || api.request;
          const resData = api.successResponse?.body || api.successResponse || api.response;

          return (
            <motion.div
              key={`${method}-${endpoint}-${index}`}
              className="api-pro-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              viewport={{ once: true }}
            >
              <div className="api-top">
                <span className={`api-method ${method.toLowerCase()}`}>{method}</span>
                <span className="api-version">{api.version || "v1"}</span>
              </div>

              <div className="api-title">
                <h3>{name}</h3>
                <code className="endpoint-code">{endpoint}</code>
              </div>

              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>{purpose}</p>

              {/* Authentication */}
              <div className="api-block">
                <h4>Authentication & Access Control</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {isPublic ? (
                    <span className="api-tag" style={{ color: "#34d399", borderColor: "rgba(52, 211, 153, 0.3)" }}>
                      <FaGlobe style={{ marginRight: "4px" }} /> Public Endpoint
                    </span>
                  ) : (
                    <span className="api-tag" style={{ color: "#818cf8", borderColor: "rgba(129, 140, 248, 0.3)" }}>
                      <FaLock style={{ marginRight: "4px" }} /> {auth}
                    </span>
                  )}
                </div>
              </div>

              {/* Request Payload */}
              <div className="api-block">
                <h4>Request Payload</h4>
                <pre className="api-json">
                  {typeof reqData === "object"
                    ? JSON.stringify(reqData, null, 2)
                    : safeText(reqData, "None (No request body required)")}
                </pre>
              </div>

              {/* Success Response */}
              <div className="api-block">
                <h4>Success Response (HTTP 200/201)</h4>
                <pre className="api-json">
                  {typeof resData === "object"
                    ? JSON.stringify(resData, null, 2)
                    : safeText(resData, "{ success: true, data: { ... } }")}
                </pre>
              </div>

              {/* Footer / Copy Button */}
              <div className="api-footer">
                <button
                  type="button"
                  className="copy-endpoint-btn"
                  onClick={(e) => copyEndpoint(endpoint, e)}
                >
                  {copied === endpoint ? (
                    <>
                      <FaCheck style={{ color: "#34d399" }} /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <FaCopy /> Copy Endpoint Path
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import {
  FaServer,
  FaLayerGroup,
  FaDatabase,
  FaShieldAlt,
  FaExchangeAlt,
  FaCloud,
  FaExpandArrowsAlt,
  FaProjectDiagram,
  FaCogs,
  FaRoute,
} from "react-icons/fa";

/* ================= SAFE HELPER ================= */

const safeText = (value, fallback = "") => {
  if (value == null) return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim() || fallback;
  }

  if (Array.isArray(value)) {
    return value.map(v => safeText(v)).filter(Boolean).join(", ") || fallback;
  }

  if (typeof value === "object") {
    return (
      value.title ||
      value.name ||
      value.style ||
      value.description ||
      value.summary ||
      fallback
    );
  }

  return fallback;
};

export default function ArchitectureSection({ project }) {
  if (!project?.architecture) return null;

  const architecture = project.architecture;
  const components = Array.isArray(architecture.components) ? architecture.components : [];
  const dataFlow = Array.isArray(architecture.dataFlow) ? architecture.dataFlow : [];

  const layerCards = [
    {
      key: "style",
      icon: <FaLayerGroup />,
      title: "Architecture Style",
      value: architecture.style || architecture.type,
    },
    {
      key: "frontend",
      icon: <FaServer />,
      title: "Frontend Architecture",
      value: architecture.frontendArchitecture,
    },
    {
      key: "backend",
      icon: <FaServer />,
      title: "Backend Architecture",
      value: architecture.backendArchitecture,
    },
    {
      key: "database",
      icon: <FaDatabase />,
      title: "Database Architecture",
      value: architecture.databaseArchitecture,
    },
    {
      key: "auth",
      icon: <FaShieldAlt />,
      title: "Authentication Flow",
      value: architecture.authenticationFlow,
    },
    {
      key: "request",
      icon: <FaExchangeAlt />,
      title: "Request Lifecycle",
      value: architecture.requestFlow,
    },
    {
      key: "deployment",
      icon: <FaCloud />,
      title: "Deployment Strategy",
      value: architecture.deploymentArchitecture,
    },
    {
      key: "scaling",
      icon: <FaExpandArrowsAlt />,
      title: "Auto-Scaling Strategy",
      value: architecture.scalingStrategy,
    },
    {
      key: "communication",
      icon: <FaProjectDiagram />,
      title: "Service Communication",
      value: architecture.communication,
    },
  ];

  return (
    <section className="blueprint-card architecture-section" id="SystemArchitecture">
      <div className="section-heading architecture-heading">
        <div className="section-badge architecture-badge">🏗 SYSTEM ARCHITECTURE</div>
        <h2 className="architecture-main-title">Enterprise Software Architecture</h2>
        <p className="architecture-subtitle">
          A cloud-native software architecture designed for high availability, zero-trust security, sub-second latency, and horizontal scalability.
        </p>
      </div>

      {/* Overview Card */}
      {architecture.description && (
        <motion.div
          className="architecture-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="overview-title">📖 Architecture Overview</h3>
          <p className="overview-text">{safeText(architecture.description)}</p>
        </motion.div>
      )}

      {/* Architectural Components Grid */}
      {components.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "1.2rem", color: "#818cf8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaCogs /> Core Architectural Components & Services
          </h3>

          <div className="architecture-grid">
            {components.map((comp, index) => {
              const cName = safeText(comp.name, `Component ${index + 1}`);
              const cResp = safeText(comp.responsibility, "Executes domain business workflows.");
              const cTech = safeText(comp.technology, "Node.js / Express / React");
              const cScal = safeText(comp.scalability, "Horizontally scalable container instance");
              const cSec = safeText(comp.security, "Role-based access authorization");

              return (
                <motion.div
                  key={index}
                  className="architecture-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                >
                  <div className="architecture-icon">
                    <FaServer />
                  </div>

                  <h3 className="architecture-card-title">{cName}</h3>
                  <p className="architecture-card-text">{cResp}</p>

                  <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px", fontSize: "0.8rem", color: "#94a3b8" }}>
                    <div style={{ marginBottom: "4px" }}>
                      <strong style={{ color: "#a5b4fc" }}>Tech:</strong> {cTech}
                    </div>
                    {cScal && (
                      <div style={{ marginBottom: "4px" }}>
                        <strong style={{ color: "#a5b4fc" }}>Scaling:</strong> {cScal}
                      </div>
                    )}
                    {cSec && (
                      <div>
                        <strong style={{ color: "#a5b4fc" }}>Security:</strong> {cSec}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Layer Highlights Grid */}
      <div style={{ marginTop: "36px" }}>
        <h3 style={{ fontSize: "1.2rem", color: "#818cf8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <FaLayerGroup /> Architecture Layer Specifications
        </h3>

        <div className="architecture-grid">
          {layerCards
            .filter(
              (card) =>
                card.value !== undefined &&
                card.value !== null &&
                safeText(card.value) !== ""
            )
            .map((card, index) => (
              <motion.div
                key={card.key}
                className="architecture-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                <div className={`architecture-icon architecture-icon-${index}`}>
                  {card.icon}
                </div>

                <h3 className="architecture-card-title">{card.title}</h3>
                <p className="architecture-card-text">{safeText(card.value)}</p>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Request Lifecycle Data Flow */}
      {dataFlow.length > 0 && (
        <div style={{ marginTop: "36px" }}>
          <h3 style={{ fontSize: "1.2rem", color: "#818cf8", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaRoute /> Request Lifecycle & Data Flow Pipeline
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {dataFlow.map((step, sIdx) => (
              <div
                key={sIdx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  background: "rgba(15, 23, 42, 0.7)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <span
                  style={{
                    background: "#4f46e5",
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {sIdx + 1}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                  {safeText(step).replace(/^\d+\.\s*/, "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
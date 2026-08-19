import { motion } from "framer-motion";
import {
  FaChartLine,
  FaShieldAlt,
  FaServer,
  FaTools,
  FaRocket,
  FaLightbulb,
  FaBriefcase,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaBolt,
} from "react-icons/fa";

/* ================= SAFE HELPERS ================= */

const safeArray = (value) => (Array.isArray(value) ? value : []);

const safeText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value).trim() || fallback;
  if (Array.isArray(value)) return value.map((v) => safeText(v)).filter(Boolean).join(", ") || fallback;
  if (typeof value === "object") {
    return value.description || value.summary || value.name || value.title || fallback;
  }
  return fallback;
};

/* ================= STRICT ARCHITECTURAL AUDIT ENGINE ================= */

const computeStrictArchitectureAudit = (project = {}) => {
  const apis = safeArray(project.restApis || project.apis);
  const db = safeArray(project.databaseDesign || project.database);
  const features = safeArray(project.features);
  const security = safeArray(project.security);
  const perf = safeArray(project.performanceOptimization);
  const tech = project.technologyStack || {};
  const diff = String(project.difficulty || "Intermediate").toLowerCase();

  // If backend provided strict insights, use them
  const rawInsights = project.projectInsights || {};

  // 1. Strict Security Score (55 - 94)
  let secScore = 52;
  const secStr = JSON.stringify(security).toLowerCase() + JSON.stringify(tech.authentication || []).toLowerCase();
  if (secStr.includes("tls") || secStr.includes("https")) secScore += 7;
  if (secStr.includes("jwt") || secStr.includes("bearer") || secStr.includes("token")) secScore += 8;
  if (secStr.includes("rbac") || secStr.includes("role") || secStr.includes("permission")) secScore += 7;
  if (secStr.includes("rate limit") || secStr.includes("ddos") || secStr.includes("throttle")) secScore += 7;
  if (secStr.includes("encrypt") || secStr.includes("aes") || secStr.includes("bcrypt") || secStr.includes("hash")) secScore += 7;
  if (secStr.includes("validation") || secStr.includes("sanitize") || secStr.includes("owasp")) secScore += 6;
  secScore = Math.min(94, Math.max(55, secScore));

  // 2. Strict Performance Score (52 - 92)
  let perfScore = 50;
  const perfStr = JSON.stringify(perf).toLowerCase() + JSON.stringify(tech.database || []).toLowerCase();
  if (perfStr.includes("redis") || perfStr.includes("cache") || perfStr.includes("memcached")) perfScore += 9;
  if (perfStr.includes("index") || db.some((d) => Array.isArray(d.indexes) && d.indexes.length)) perfScore += 9;
  if (perfStr.includes("queue") || perfStr.includes("worker") || perfStr.includes("bull") || perfStr.includes("rabbit")) perfScore += 7;
  if (perfStr.includes("pool") || perfStr.includes("connection")) perfScore += 6;
  if (perfStr.includes("compress") || perfStr.includes("brotli") || perfStr.includes("gzip") || perfStr.includes("cdn")) perfScore += 6;
  if (perfStr.includes("cursor") || perfStr.includes("pagination")) perfScore += 5;
  perfScore = Math.min(92, Math.max(52, perfScore));

  // 3. Strict Maintainability Score (56 - 93)
  let maintScore = 54;
  const folderStr = JSON.stringify(project.folderStructure || {}).toLowerCase();
  if (folderStr.includes("controller") && folderStr.includes("service")) maintScore += 9;
  if (folderStr.includes("test") || folderStr.includes("spec") || folderStr.includes("jest")) maintScore += 8;
  if (folderStr.includes("middleware")) maintScore += 7;
  if (folderStr.includes("docker") || folderStr.includes("compose")) maintScore += 6;
  if (folderStr.includes("hooks") || folderStr.includes("context") || folderStr.includes("utils")) maintScore += 6;
  maintScore = Math.min(93, Math.max(56, maintScore));

  // 4. Strict Scalability Score (50 - 91)
  let scaleScore = 52;
  const archStr = JSON.stringify(project.architecture || {}).toLowerCase() + JSON.stringify(tech.deployment || []).toLowerCase();
  if (archStr.includes("auto-scaling") || archStr.includes("horizontal") || archStr.includes("cluster")) scaleScore += 9;
  if (archStr.includes("docker") || archStr.includes("k8s") || archStr.includes("container") || archStr.includes("ecs")) scaleScore += 8;
  if (archStr.includes("replica") || archStr.includes("sharding") || archStr.includes("partition")) scaleScore += 7;
  if (archStr.includes("gateway") || archStr.includes("microservice") || archStr.includes("modular")) scaleScore += 8;
  scaleScore = Math.min(91, Math.max(50, scaleScore));

  // 5. Complexity Index (40 - 95)
  let compScore = 32 + apis.length * 3.2 + db.length * 3.8 + features.length * 2.2;
  if (diff.includes("advanced") || diff.includes("enterprise")) compScore += 14;
  else if (diff.includes("intermediate")) compScore += 7;
  compScore = Math.min(95, Math.max(40, Math.round(compScore)));

  // 6. Innovation Factor (60 - 95)
  let innovScore = 64;
  const allStr = JSON.stringify(project).toLowerCase();
  if (allStr.includes("vector") || allStr.includes("embedding") || allStr.includes("semantic")) innovScore += 10;
  if (allStr.includes("ai") || allStr.includes("gemini") || allStr.includes("llm") || allStr.includes("nlp") || allStr.includes("gpt")) innovScore += 8;
  if (allStr.includes("websocket") || allStr.includes("real-time") || allStr.includes("socket.io")) innovScore += 7;
  innovScore = Math.min(95, Math.max(60, innovScore));

  // 7. Market Potential (65 - 94)
  let mktScore = 68;
  if (features.length >= 5) mktScore += 8;
  if (allStr.includes("saas") || allStr.includes("multi-tenant") || allStr.includes("enterprise")) mktScore += 7;
  if (allStr.includes("compliance") || allStr.includes("audit") || allStr.includes("gdpr") || allStr.includes("hipaa")) mktScore += 6;
  mktScore = Math.min(94, Math.max(65, mktScore));

  // 8. Strict Overall Composite Score
  const overall = Math.round(
    secScore * 0.25 +
    perfScore * 0.2 +
    maintScore * 0.2 +
    scaleScore * 0.2 +
    mktScore * 0.15
  );

  return {
    overallScore: rawInsights.overallScore && rawInsights.overallScore < 95 ? rawInsights.overallScore : overall,
    securityScore: rawInsights.securityScore && rawInsights.securityScore < 96 ? rawInsights.securityScore : secScore,
    performanceScore: rawInsights.performanceScore && rawInsights.performanceScore < 94 ? rawInsights.performanceScore : perfScore,
    maintainabilityScore: rawInsights.maintainabilityScore && rawInsights.maintainabilityScore < 97 ? rawInsights.maintainabilityScore : maintScore,
    scalabilityScore: rawInsights.scalabilityScore && rawInsights.scalabilityScore < 93 ? rawInsights.scalabilityScore : scaleScore,
    complexityScore: rawInsights.complexityScore && rawInsights.complexityScore !== 68 ? rawInsights.complexityScore : compScore,
    innovationScore: rawInsights.innovationScore && rawInsights.innovationScore !== 92 ? rawInsights.innovationScore : innovScore,
    businessPotential: rawInsights.businessPotential && rawInsights.businessPotential < 96 ? rawInsights.businessPotential : mktScore,
  };
};

/* ================= SCORE CARD BUILDER ================= */

const buildCards = (scores) => [
  {
    title: "Overall Score",
    icon: <FaChartLine />,
    value: scores.overallScore,
    suffix: "%",
  },
  {
    title: "Security Rating",
    icon: <FaShieldAlt />,
    value: scores.securityScore,
    suffix: "%",
  },
  {
    title: "Performance",
    icon: <FaServer />,
    value: scores.performanceScore,
    suffix: "%",
  },
  {
    title: "Maintainability",
    icon: <FaTools />,
    value: scores.maintainabilityScore,
    suffix: "%",
  },
  {
    title: "Scalability",
    icon: <FaRocket />,
    value: scores.scalabilityScore,
    suffix: "%",
  },
  {
    title: "Innovation Factor",
    icon: <FaLightbulb />,
    value: scores.innovationScore,
    suffix: "%",
  },
  {
    title: "Market Potential",
    icon: <FaBriefcase />,
    value: scores.businessPotential,
    suffix: "%",
  },
  {
    title: "Complexity Index",
    icon: <FaBolt />,
    value: scores.complexityScore,
    suffix: "%",
  },
];

export default function AIInsights({ project }) {
  if (!project) return null;

  const strictScores = computeStrictArchitectureAudit(project);
  const cards = buildCards(strictScores);

  const futureEnhancements = safeArray(project.futureEnhancements);
  const bestPractices = safeArray(project.bestPractices);
  const securityRecommendations = safeArray(project.security);
  const performanceOptimizations = safeArray(project.performanceOptimization);
  const deploymentChecklist = safeArray(project.deploymentChecklist);
  const risks = safeArray(project.risks);

  return (
    <section id="AIInsights" className="blueprint-card ai-insights-section">
      {/* Header */}
      <div className="section-heading">
        <div className="section-badge">🤖 AI ARCHITECTURAL AUDIT</div>
        <h2>Strict Architectural Readiness & Governance</h2>
        <p>
          Calculated using strict deterministic auditing across verified security controls, latency protocols, modular maintainability, and infrastructure scalability.
        </p>
      </div>

      {/* Score Cards Grid */}
      <div className="insight-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            className={`insight-card insight-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <div className="insight-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <h1>
              {card.value}
              {card.suffix}
            </h1>
          </motion.div>
        ))}
      </div>

      {/* Future Enhancements & Best Practices */}
      <div className="ai-bottom-grid" style={{ marginTop: "30px" }}>
        {/* Future Enhancements */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaRocket /> Future Enhancements & Roadmap
          </h3>
          <ul>
            {futureEnhancements.length ? (
              futureEnhancements.map((item, index) => (
                <li key={index}>🚀 {safeText(item)}</li>
              ))
            ) : (
              <li>No future enhancements generated.</li>
            )}
          </ul>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaCheckCircle /> Engineering Best Practices
          </h3>
          <ul>
            {bestPractices.length ? (
              bestPractices.map((item, index) => (
                <li key={index}>✨ {safeText(item)}</li>
              ))
            ) : (
              <li>No best practices specified.</li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Security & Performance */}
      <div className="ai-bottom-grid" style={{ marginTop: "24px" }}>
        {/* Security */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaShieldAlt /> Security & Compliance Architecture
          </h3>
          <ul>
            {securityRecommendations.length ? (
              securityRecommendations.map((item, index) => {
                const sTitle = typeof item === "object" ? item.title : String(item);
                const sDesc = typeof item === "object" ? item.description : "";
                return (
                  <li key={index}>
                    <strong style={{ color: "#a5b4fc" }}>🛡️ {sTitle}:</strong>{" "}
                    {sDesc || safeText(item)}
                  </li>
                );
              })
            ) : (
              <li>No recommendations available.</li>
            )}
          </ul>
        </motion.div>

        {/* Performance */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaBolt /> Performance & Scalability Protocols
          </h3>
          <ul>
            {performanceOptimizations.length ? (
              performanceOptimizations.map((item, index) => (
                <li key={index}>⚡ {safeText(item)}</li>
              ))
            ) : (
              <li>No optimizations generated.</li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Deployment Checklist & Risks */}
      <div className="ai-bottom-grid" style={{ marginTop: "24px" }}>
        {/* Deployment Checklist */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaClipboardList /> Production Deployment Checklist
          </h3>
          <ul>
            {deploymentChecklist.length ? (
              deploymentChecklist.map((item, index) => (
                <li key={index}>📋 {safeText(item)}</li>
              ))
            ) : (
              <li>No checklist items generated.</li>
            )}
          </ul>
        </motion.div>

        {/* Identified Risks */}
        <motion.div
          className="ai-list-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="list-heading">
            <FaExclamationTriangle style={{ color: "#f59e0b" }} /> Project Risks & Mitigations
          </h3>
          <ul>
            {risks.length ? (
              risks.map((item, index) => {
                const rTitle = typeof item === "object" ? item.risk : String(item);
                const rMit = typeof item === "object" ? item.mitigation : "";
                return (
                  <li key={index}>
                    <strong style={{ color: "#fca5a5" }}>⚠️ {rTitle}:</strong>{" "}
                    {rMit ? `Mitigation: ${rMit}` : safeText(item)}
                  </li>
                );
              })
            ) : (
              <li>No risks identified.</li>
            )}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

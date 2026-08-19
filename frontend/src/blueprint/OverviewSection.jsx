import { motion } from "framer-motion";

/* ==========================================================
   SAFE VALUE PARSER
========================================================== */

const safeValue = (value, fallback = "") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim() || fallback;
  }

  if (Array.isArray(value)) {
    return value
      .map((v) => safeValue(v))
      .filter(Boolean)
      .join(", ") || fallback;
  }

  if (typeof value === "object") {
    return (
      value.title ||
      value.name ||
      value.label ||
      value.heading ||
      value.objective ||
      value.role ||
      value.description ||
      value.details ||
      value.summary ||
      value.text ||
      value.metric ||
      value.successMetric ||
      value.measurement ||
      value.overview ||
      fallback
    );
  }

  return fallback;
};

/* ==========================================================
   COMPONENT
========================================================== */

function OverviewSection({ project }) {
  if (!project) return null;

  /* ==========================================================
     TARGET USERS
  ========================================================== */

  const targetUsers =
    project.targetUsers ||
    project.targetAudience ||
    project.endUsers ||
    project.audience ||
    project.userTypes ||
    project.users ||
    [];

  /* ==========================================================
     BUSINESS OBJECTIVES
  ========================================================== */

  const businessObjectives =
    project.businessObjectives ||
    project.businessGoals ||
    project.objectives ||
    project.goals ||
    [];

  /* ==========================================================
     INFO CARDS
  ========================================================== */

  const cards = [
    {
      icon: "🎯",
      title: "Project Goal",
      value: project.goal || project.projectOverview?.projectGoal,
    },
    {
      icon: "🏢",
      title: "Industry",
      value: project.industry || project.domain || project.projectOverview?.industry,
    },
    {
      icon: "💻",
      title: "Project Type",
      value: project.projectType || project.projectOverview?.projectType || "Web Application",
    },
    {
      icon: "⚡",
      title: "Difficulty",
      value: project.difficulty || project.level || project.projectOverview?.difficulty || "Intermediate",
    },
    {
      icon: "⏳",
      title: "Estimated Duration",
      value: project.estimatedDuration || project.duration || project.projectOverview?.estimatedDuration || "6–8 Weeks",
    },
    {
      icon: "👨‍💻",
      title: "Team Size",
      value: project.estimatedTeamSize || project.teamSize || project.projectOverview?.teamSize || "2–4 Engineers",
    },
    {
      icon: "📈",
      title: "Scalability",
      value: project.scalability || project.projectOverview?.scalability || "Horizontal microservices auto-scaling",
    },
    {
      icon: "🏗️",
      title: "Architecture",
      value: project.architectureStyle || project.architecture?.style || project.architecture?.type || "Layered Modular Architecture",
    },
  ];

  const overviewText =
    project.projectDescription ||
    project.overview ||
    project.description ||
    project.projectOverview?.overview ||
    "A comprehensive software architecture engineered for high throughput, security, and developer velocity.";

  const problemText =
    project.problemStatement ||
    project.problem ||
    project.projectOverview?.problemStatement ||
    "Legacy systems and fragmented tooling create severe operational friction and high maintenance costs.";

  const solutionText =
    project.solution ||
    project.proposedSolution ||
    project.recommendedSolution ||
    project.projectOverview?.proposedSolution ||
    "An integrated, cloud-native architecture combining scalable APIs, reactive UI, and robust data persistence.";

  return (
    <section className="overview-section" id="ProjectOverview">
      {/* ==========================================================
          PROJECT DETAILS (Overview, Problem, Solution)
      ========================================================== */}
      <div className="overview-details-grid">
        {/* PROJECT OVERVIEW */}
        <motion.div
          className="overview-content-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="overview-card-title overview-blue">📘 Project Overview</h3>
          <p className="overview-card-text">{overviewText}</p>
        </motion.div>

        {/* PROBLEM */}
        <motion.div
          className="overview-content-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h3 className="overview-card-title overview-red">🚨 Problem Statement</h3>
          <p className="overview-card-text">{problemText}</p>
        </motion.div>

        {/* SOLUTION */}
        <motion.div
          className="overview-content-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="overview-card-title overview-green">💡 Proposed Solution</h3>
          <p className="overview-card-text">{solutionText}</p>
        </motion.div>
      </div>

      {/* ==========================================================
          PROJECT METRIC CARDS
      ========================================================== */}
      <div className="overview-grid">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="overview-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.03 }}
          >
            <div className="overview-icon">{card.icon}</div>
            <h3 className={`overview-box-title overview-color-${index + 1}`}>
              {card.title}
            </h3>
            <p className="overview-box-text">{safeValue(card.value, "Enterprise SaaS")}</p>
          </motion.div>
        ))}
      </div>

      {/* ==========================================================
          TARGET USERS
      ========================================================== */}
      {Array.isArray(targetUsers) && targetUsers.length > 0 && (
        <section className="target-users-section">
          <div className="overview-section-heading">
            <h2>🎯 Target Users & Stakeholders</h2>
            <p>The primary personas and actors interacting with this system.</p>
          </div>

          <div className="target-users-grid">
            {targetUsers.map((user, index) => {
              let title = `User Role ${index + 1}`;
              let description = "";

              if (typeof user === "string") {
                if (user.includes(":")) {
                  const parts = user.split(":");
                  title = parts[0].trim();
                  description = parts.slice(1).join(":").trim();
                } else {
                  title = user.trim();
                  description = "Interacts with primary workflows and operational interfaces.";
                }
              } else if (typeof user === "object" && user !== null) {
                title = user.title || user.name || user.role || `User Persona ${index + 1}`;
                description = user.description || user.details || user.summary || user.text || "Engages with system capabilities.";
              }

              return (
                <motion.div
                  key={index}
                  className="target-user-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="target-user-icon">👤</div>
                  <h3 className={`target-user-title target-color-${index + 1}`}>
                    {title}
                  </h3>
                  {description && (
                    <p className="target-user-description">{description}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==========================================================
          BUSINESS OBJECTIVES
      ========================================================== */}
      {Array.isArray(businessObjectives) && businessObjectives.length > 0 && (
        <section className="business-objectives-section">
          <div className="overview-section-heading">
            <h2>📈 Strategic Business Objectives</h2>
            <p>
              Target milestones and quantifiable business outcomes generated for this architecture.
            </p>
          </div>

          <div className="objective-grid">
            {businessObjectives.map((item, index) => {
              let title = `Objective ${index + 1}`;
              let description = "";
              let metric = "";

              if (typeof item === "string") {
                const str = item.trim();
                if (str.includes(":")) {
                  const parts = str.split(":");
                  title = parts[0].trim();
                  description = parts.slice(1).join(":").trim();
                } else {
                  title = str;
                  description = `Strategic operational target for ${project.projectName || "the platform"}.`;
                }
              } else if (typeof item === "object" && item !== null) {
                title = item.title || item.objective || item.name || item.goal || `Strategic Objective ${index + 1}`;
                description = item.description || item.details || item.summary || item.text || "";
                metric = item.successMetric || item.metric || item.measurement || "";
              }

              return (
                <motion.div
                  key={index}
                  className="objective-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="objective-top">
                    <div className="objective-icon">✔</div>
                    <h3 className={`objective-title objective-color-${index + 1}`}>
                      {title}
                    </h3>
                  </div>

                  {description && (
                    <p className="objective-description">{description}</p>
                  )}

                  {metric && (
                    <div className="objective-metric">
                      <span className="metric-icon">📊</span>
                      <span className="metric-text">{metric}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==========================================================
          EXECUTIVE SUMMARY
      ========================================================== */}
      {project.executiveSummary && (
        <motion.section
          className="executive-summary-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="overview-section-heading">
            <h2>📄 Executive Architectural Summary</h2>
            <p>
              A synthesis of technical architecture, scalability approach, and business value.
            </p>
          </div>

          <div className="executive-summary-card">
            <p className="executive-summary-text">{project.executiveSummary}</p>
          </div>
        </motion.section>
      )}
    </section>
  );
}

export default OverviewSection;
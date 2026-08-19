import { motion } from "framer-motion";
import { FaClock, FaCheckCircle, FaBullseye, FaTasks } from "react-icons/fa";

/* ================= SAFE HELPERS ================= */

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
      value.objective ||
      value.task ||
      value.description ||
      fallback
    );
  }

  return fallback;
};

function RoadmapSection({ project }) {
  if (!project) return null;

  const roadmap = Array.isArray(project.developmentRoadmap)
    ? project.developmentRoadmap
    : Array.isArray(project.roadmap)
    ? project.roadmap
    : [];

  if (roadmap.length === 0) return null;

  return (
    <section className="blueprint-card roadmap-section" id="Roadmap">
      {/* Heading */}
      <div className="section-heading">
        <div className="section-badge">🗺 DEVELOPMENT ROADMAP</div>
        <h2 className="roadmap-title">AI Generated Development Timeline</h2>
        <p className="roadmap-subtitle">
          A phased implementation roadmap engineered for progressive delivery, verifiable milestones, continuous testing, and seamless cloud deployment.
        </p>
      </div>

      {/* Timeline */}
      <div className="roadmap-container">
        {roadmap.map((phase, index) => {
          const title = safeText(phase.phase || phase.title, `Phase ${index + 1}: Implementation Milestone`);
          const timeline = safeText(phase.timeline || phase.duration, `Weeks ${index * 2 + 1}-${index * 2 + 2}`);
          const goal = safeText(phase.goal, "Establish milestone architectural deliverables.");
          const objectives = Array.isArray(phase.objectives) ? phase.objectives : [];
          const tasks = Array.isArray(phase.tasks) ? phase.tasks : [];
          const deliverables = Array.isArray(phase.deliverables)
            ? phase.deliverables
            : phase.deliverable
            ? [phase.deliverable]
            : [];

          return (
            <motion.div
              key={phase.phase || index}
              className="roadmap-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              {/* LEFT */}
              <div className="roadmap-left">
                <div className="roadmap-circle">{index + 1}</div>
                {index !== roadmap.length - 1 && <div className="roadmap-line" />}
              </div>

              {/* RIGHT */}
              <div className="roadmap-right">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <h3 className="phase-title" style={{ margin: 0 }}>
                    🚀 {title}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(99, 102, 241, 0.15)",
                      color: "#818cf8",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    <FaClock /> {timeline}
                  </span>
                </div>

                {/* Goal */}
                {goal && (
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px", fontStyle: "italic" }}>
                    <strong>Goal:</strong> {goal}
                  </p>
                )}

                {/* Objectives */}
                {objectives.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <h4 className="roadmap-small-heading">
                      <FaBullseye style={{ color: "#818cf8", marginRight: "6px" }} /> Strategic Objectives
                    </h4>
                    <ul className="roadmap-list">
                      {objectives.map((item, i) => (
                        <li key={i}>
                          <span>🎯</span>
                          <span>{safeText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {tasks.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <h4 className="roadmap-small-heading">
                      <FaTasks style={{ color: "#818cf8", marginRight: "6px" }} /> Implementation Tasks
                    </h4>
                    <ul className="roadmap-list">
                      {tasks.map((task, i) => (
                        <li key={i}>
                          <span>⚙️</span>
                          <span>{safeText(task)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {deliverables.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <h4 className="roadmap-small-heading">
                      <FaCheckCircle style={{ color: "#34d399", marginRight: "6px" }} /> Phase Deliverables
                    </h4>
                    <ul className="roadmap-list">
                      {deliverables.map((item, i) => (
                        <li key={i}>
                          <span>✅</span>
                          <span style={{ color: "#a7f3d0", fontWeight: 500 }}>{safeText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default RoadmapSection;
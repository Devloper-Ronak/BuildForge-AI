import { motion } from "framer-motion";

/* ================= SAFE TEXT ================= */

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
      value.description ||
      value.summary ||
      value.text ||
      fallback
    );
  }

  return fallback;
};

function FeaturesSection({ project }) {
  if (!project) return null;

  const rawFeatures =
    Array.isArray(project?.features)
      ? project.features
      : Array.isArray(project?.coreFeatures)
      ? project.coreFeatures
      : Array.isArray(project?.productFeatures)
      ? project.productFeatures
      : [];

  if (rawFeatures.length === 0) return null;

  return (
    <section className="blueprint-card feature-section" id="CoreFeatures">
      {/* Section Heading */}
      <div className="section-heading">
        <div className="section-badge">✨ PRODUCT CAPABILITIES</div>
        <h2 className="feature-title">AI Recommended Core Features</h2>
        <p>
          Discover intelligent, production-grade features engineered specifically for your project. Every capability is tailored to your business model, maximizing operational efficiency, user engagement, and architectural scalability.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="feature-grid">
        {rawFeatures.map((feature, index) => {
          const name = safeText(feature.name || feature.title, `Feature ${index + 1}`);
          const priority = safeText(feature.priority, "High");
          const complexity = safeText(feature.complexity, index < 2 ? "High" : "Medium");
          const estimatedTime = safeText(feature.estimatedTime, "4-6 Days");
          const description = safeText(
            feature.description,
            "A core capability designed to streamline user workflows and operational throughput."
          );
          const businessImpact = safeText(
            feature.businessImpact,
            "Dramatically improves process throughput and enhances end-user satisfaction."
          );
          const technicalNotes = safeText(
            feature.technicalNotes,
            "Engineered with modular service boundaries, transactional integrity, and automated telemetry logging."
          );

          const priorityClass =
            priority.toLowerCase() === "critical"
              ? "critical"
              : priority.toLowerCase() === "high"
              ? "high"
              : priority.toLowerCase() === "low"
              ? "low"
              : "medium";

          return (
            <motion.div
              key={feature.id || index}
              className="feature-pro-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <div className="feature-top">
                <div className="feature-icon">🚀</div>
                <div className="feature-number">{String(index + 1).padStart(2, "0")}</div>
              </div>

              <h3 className="feature-card-title">{name}</h3>
              <p className="feature-description">{description}</p>

              <div className="feature-meta">
                <span className={`feature-tag priority-${priorityClass}`}>
                  ⚡ {priority} Priority
                </span>
                <span className="feature-tag">⚙️ {complexity} Complexity</span>
                <span className="feature-tag">⏳ {estimatedTime}</span>
              </div>

              <div className="feature-extra">
                <strong>💼 Business Impact</strong>
                <p>{businessImpact}</p>
              </div>

              <div className="feature-extra">
                <strong>🛠️ Technical Architecture</strong>
                <p>{technicalNotes}</p>
              </div>

              <div className="feature-footer">
                <span>Production Feature #{index + 1}</span>
                <span className="badge-ai-ready">AI Engineered</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesSection;
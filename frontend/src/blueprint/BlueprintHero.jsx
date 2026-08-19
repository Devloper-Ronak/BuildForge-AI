import { motion } from "framer-motion";

function BlueprintHero({ idea, loading }) {
  const safeIdea = idea?.trim() || "Your AI Blueprint";

  return (
    <motion.div
      className="blueprint-hero"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hero-badge">
        🚀 AI Generated Blueprint
      </div>

      {/* IDEA SECTION */}
      <h1 className="hero-title">
    {safeIdea}
</h1>

<h2 className="hero-subtitle">
    Enterprise AI Software Blueprint
</h2>

      {/* DESCRIPTION */}
      <p className="hero-description">
  Transform your idea into a complete enterprise-grade software blueprint powered by AI.
  Instantly generate scalable system architecture, modern technology recommendations,
  optimized database design, secure REST APIs, implementation roadmap, deployment
  strategy, and production-ready documentation—all tailored for real-world development.
</p>

      {/* STATS */}
      <div className="hero-stats">
    <div className="hero-chip">⚡ Instant Generation</div>
    <div className="hero-chip">🧠 AI Engineered</div>
    <div className="hero-chip">📦 Production Ready</div>
    <div className="hero-chip">🚀 Enterprise Grade</div>
</div>

      {/* LOADING STATE */}
      {loading && (
        <motion.div
          className="loading-banner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner" />
          <span>AI is generating complete project...</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default BlueprintHero;
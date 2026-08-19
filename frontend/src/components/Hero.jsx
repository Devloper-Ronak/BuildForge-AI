import { Link } from "react-router-dom";
import { FaRocket, FaCode, FaDatabase, FaShieldAlt, FaFilePdf } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero" style={{ padding: "80px 20px 60px 20px", textAlign: "center", position: "relative" }}>
      <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
        🚀 Next-Gen AI Software Architecture Engine
      </div>

      <h1 style={{ fontSize: "3.2rem", fontWeight: 800, lineHeight: 1.2, maxWidth: "900px", margin: "0 auto 20px auto" }}>
        Transform Your Idea Into a
        <span className="gradient"> Startup-Ready Software Blueprint</span>
      </h1>

      <p style={{ fontSize: "1.15rem", color: "rgba(255, 255, 255, 0.75)", maxWidth: "780px", margin: "0 auto 36px auto", lineHeight: 1.6 }}>
        Build complete enterprise-grade software specifications with AI — including system topologies, relational and document schemas, REST API contracts, phased implementation roadmaps, and executive PDF reports in seconds.
      </p>

      {/* Primary Action Button */}
      <div className="hero-buttons" style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
        <Link to="/dashboard">
          <button className="primary-btn" style={{ fontSize: "1.05rem", padding: "16px 36px", display: "inline-flex", alignItems: "center", gap: "10px", borderRadius: "14px" }}>
            <FaRocket /> Start Building Blueprint →
          </button>
        </Link>
      </div>

      {/* Feature Highlights Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <FaCode style={{ color: "#818cf8" }} />
          <span>Production-Ready APIs</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <FaDatabase style={{ color: "#34d399" }} />
          <span>ACID & Document Schemas</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <FaShieldAlt style={{ color: "#fbbf24" }} />
          <span>Zero-Trust Security</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          <FaFilePdf style={{ color: "#f472b6" }} />
          <span>Executive PDF Reports</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
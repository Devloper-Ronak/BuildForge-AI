import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRocket, FaLightbulb } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const handleSectionClick = (sectionId) => {
    if (isHome) {
      const elem = document.getElementById(sectionId);
      if (elem) {
        const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    } else {
      navigate(`/home#${sectionId}`);
    }
  };

  return (
    <header
      className="main-glass-navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "64px",
        zIndex: 1100,
        background: "rgba(8, 14, 28, 0.85)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          width: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* 🚀 LOGO & BRAND */}
        <Link
          to="/home"
          className="logo-container"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              borderRadius: "12px",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
            }}
          >
            <FaRocket style={{ color: "#ffffff", fontSize: "19px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                fontSize: "1.38rem",
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.3px",
                background: "linear-gradient(90deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BuildForge AI
            </h2>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                background: "rgba(99, 102, 241, 0.2)",
                color: "#a5b4fc",
                padding: "2px 7px",
                borderRadius: "20px",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                letterSpacing: "0.5px",
              }}
            >
              PRO
            </span>
          </div>
        </Link>

        {/* 🧭 NAVIGATION LINKS */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Link
            to="/home"
            style={{
              color: isHome ? "#ffffff" : "rgba(226, 232, 240, 0.75)",
              background: isHome ? "rgba(255, 255, 255, 0.08)" : "transparent",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "7px 14px",
              borderRadius: "10px",
              border: isHome ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isHome) {
                e.target.style.color = "#ffffff";
                e.target.style.background = "rgba(255, 255, 255, 0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isHome) {
                e.target.style.color = "rgba(226, 232, 240, 0.75)";
                e.target.style.background = "transparent";
              }
            }}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => handleSectionClick("features")}
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "rgba(226, 232, 240, 0.75)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "7px 14px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ffffff";
              e.target.style.background = "rgba(255, 255, 255, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(226, 232, 240, 0.75)";
              e.target.style.background = "transparent";
            }}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => handleSectionClick("about")}
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "rgba(226, 232, 240, 0.75)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "7px 14px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ffffff";
              e.target.style.background = "rgba(255, 255, 255, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(226, 232, 240, 0.75)";
              e.target.style.background = "transparent";
            }}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => handleSectionClick("contact")}
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "rgba(226, 232, 240, 0.75)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              padding: "7px 14px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ffffff";
              e.target.style.background = "rgba(255, 255, 255, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(226, 232, 240, 0.75)";
              e.target.style.background = "transparent";
            }}
          >
            Contact Us
          </button>

          {/* 💡 GENERATE BLUEPRINT CTA */}
          <Link
            to="/dashboard"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "700",
              padding: "9px 20px",
              borderRadius: "24px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              border: "1px solid rgba(165, 180, 252, 0.35)",
              marginLeft: "10px",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(99, 102, 241, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
            }}
          >
            <FaLightbulb style={{ fontSize: "14px" }} />
            <span>Generate Blueprint</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
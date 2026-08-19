function Footer() {
  return (
    <footer className="footer">
      <div
        className="footer-card"
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="footer-logo" style={{ margin: "0 auto 25px auto" }}>
          🚀 BuildForge AI
        </div>

        <h2 style={{ textAlign: "center", margin: "0 auto 18px auto", width: "100%" }}>
          AI-Powered Software Architecture
          <span style={{ textAlign: "center", display: "block", margin: "10px auto 0 auto" }}>
            Built for Modern Developers
          </span>
        </h2>

        <p style={{ textAlign: "center", margin: "0 auto 45px auto", maxWidth: "760px" }}>
          BuildForge AI transforms innovative ideas into complete,
          production-ready software projects with intelligent architecture,
          scalable databases, API planning, and AI-powered development
          roadmaps.
        </p>

        <div className="footer-links" style={{ display: "flex", justifyContent: "center", gap: "45px" }}>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-divider"></div>

        <span className="copyright" style={{ textAlign: "center", display: "block" }}>
          © 2026 BuildForge AI · Designed & Developed by Ronak Khan
        </span>
      </div>
    </footer>
  );
}

export default Footer;
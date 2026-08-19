import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />

      <Hero />

      <Features />

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="about-badge">
            ABOUT BUILDFORGE AI
          </div>

          <h2 style={{ textAlign: "center" }}>
            Build Better Software
            <span>With Artificial Intelligence</span>
          </h2>

          <p style={{ textAlign: "center", margin: "0 auto" }}>
            BuildForge AI empowers students, developers, and startups to transform
            simple ideas into complete software projects with intelligent
            architecture, scalable database design, API planning, and
            implementation roadmaps—all within seconds.
          </p>

          <div className="about-stats" style={{ width: "100%" }}>
            <div className="stat-box">
              <h3>AI</h3>
              <span>Powered Platform</span>
            </div>

            <div className="stat-box">
              <h3>10+</h3>
              <span>Smart AI Modules</span>
            </div>

            <div className="stat-box">
              <h3>24/7</h3>
              <span>Instant Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-card" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="contact-badge">
            GET IN TOUCH
          </div>

          <h2 className="about-title" style={{ textAlign: "center" }}>
            Let's Build Something
            <span>Amazing Together</span>
          </h2>

          <p style={{ textAlign: "center", margin: "0 auto" }}>
            Have a question, a project idea, or want to collaborate?
            Feel free to reach out through any of the platforms below.
          </p>

          <div className="contact-info" style={{ width: "100%", justifyContent: "center" }}>
            <div
              className="contact-box"
              onClick={() => {
                navigator.clipboard.writeText("ronakkhan60966@gmail.com");
                alert("Email copied successfully!");
              }}
            >
              <span>📧</span>
              <h3>Email Support</h3>
              <p>ronakkhan60966@gmail.com</p>
            </div>

            <a
              href="https://www.linkedin.com/in/ronak-khan-587ba2328/"
              target="_blank"
              rel="noreferrer"
              className="contact-box"
            >
              <span>💼</span>
              <h3>LinkedIn</h3>
              <p>Connect Professionally</p>
            </a>

            <a
              href="https://github.com/Devloper-Ronak"
              target="_blank"
              rel="noreferrer"
              className="contact-box"
            >
              <span>🌐</span>
              <h3>GitHub</h3>
              <p>Explore Open Source Projects</p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
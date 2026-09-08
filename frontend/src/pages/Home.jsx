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

  const teamMembers = [
    {
      name: "Ronak Khan",
      initials: "RK",
      email: "ronakkhan60966@gmail.com",
      linkedin: "https://www.linkedin.com/in/ronak-khan-587ba2328/",
      github: "https://github.com/Devloper-Ronak",
    },
    {
      name: "Ali Noor",
      initials: "AN",
      email: "alinoor73027@gmail.com",
      linkedin: "https://www.linkedin.com/in/ali-noor-86b414343/",
      github: "https://github.com/Ali73027",
    },
  ];

  return (
    <>
      <Navbar />

      <Hero />

      <Features />

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="about-section">
        <div
          className="about-card"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="about-badge">ABOUT BUILDFORGE AI</div>

          <h2
            style={{
              textAlign: "center",
              width: "100%",
              margin: "0 auto 25px auto",
            }}
          >
            Build Better Software
            <span
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              With Artificial Intelligence
            </span>
          </h2>

          <p
            style={{
              textAlign: "center",
              margin: "0 auto",
              maxWidth: "800px",
            }}
          >
            BuildForge AI empowers students, developers, and startups to
            transform simple ideas into complete software projects with
            intelligent architecture, scalable database design, API planning,
            and implementation roadmaps—all within seconds.
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

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="contact-section">
        <div
          className="contact-card"
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          <div className="contact-badge">GET IN TOUCH</div>

          <h2
            className="about-title"
            style={{
              textAlign: "center",
              width: "100%",
              margin: "0 auto 20px auto",
            }}
          >
            Let's Build Something
            <span
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Amazing Together
            </span>
          </h2>

          <p
            style={{
              textAlign: "center",
              margin: "0 auto 45px auto",
              maxWidth: "750px",
            }}
          >
            Have a question, a project idea, or want to collaborate?
            Feel free to reach out to our team through any of the platforms
            below.
          </p>

          {/* ================= TEAM MEMBERS ================= */}
          <div
            className="team-members"
            style={{
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "30px",
            }}
          >
            {teamMembers.map((member) => (
              <div
                className="team-member-card"
                key={member.name}
                style={{
                  width: "100%",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Member Name */}
                <div
                  className="team-member-info"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className="team-avatar">{member.initials}</div>

                  <h3>{member.name}</h3>

                  <p>BuildForge AI Team</p>
                </div>

                {/* Contact Cards */}
                <div
                  className="team-contact-grid"
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: "12px",
                  }}
                >
                  {/* EMAIL */}
                  <a
                    href={`mailto:${member.email}`}
                    className="team-contact-box"
                  >
                    <span className="team-contact-icon">📧</span>

                    <h4>Email</h4>

                    <p>{member.email}</p>
                  </a>

                  {/* LINKEDIN */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-contact-box"
                  >
                    <span className="team-contact-icon">💼</span>

                    <h4>LinkedIn</h4>

                    <p>Connect Professionally</p>
                  </a>

                  {/* GITHUB */}
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-contact-box"
                  >
                    <span className="team-contact-icon">🌐</span>

                    <h4>GitHub</h4>

                    <p>Explore Projects</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaRocket,
  FaDatabase,
  FaCode,
  FaRobot,
  FaLightbulb,
  FaMagic,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth.js";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [idea, setIdea] = useState("");

  const popularBlueprints = [
    "AI Resume Screening & Ranking Platform",
    "AI Automated Interview Management System",
    "Healthcare Patient Portal & Telemedicine Engine",
    "E-Commerce Microservices Engine with Multi-Tenant Checkout",
    "Real-Time Collaborative Canvas & Distributed Whiteboard",
    "FinTech Equity & Startup Investment Portfolio Tracker",
    "Smart Attendance System with Geofencing & Biometrics",
    "Adaptive EdTech LMS with Personalized Learning Pathways",
  ];

  const handleGenerate = (customPrompt) => {
    const targetIdea = (customPrompt || idea).trim();
    if (!targetIdea) {
      toast.error("Please describe your project idea or select a popular blueprint.");
      return;
    }

    navigate("/blueprint", {
      state: {
        idea: targetIdea,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="dashboard" style={{ paddingTop: "96px", maxWidth: "1200px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
        {/* Header Hero */}
        <div className="dashboard-logo" style={{ textAlign: "center", marginBottom: "36px" }}>
          <div className="dashboard-badge" style={{ display: "inline-block", marginBottom: "12px" }}>
            🚀 Enterprise Software Architecture Engine
          </div>

          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, margin: "0 0 16px 0", color: "#ffffff", lineHeight: 1.2 }}>
            Transform Your Concept Into
            <span style={{ background: "linear-gradient(90deg, #818cf8 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Production-Ready Architecture</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
            Generate comprehensive system topologies, relational and document schemas, REST API contracts, phased implementation roadmaps, and executive PDF reports in seconds.
          </p>
        </div>

        {/* Generator Card */}
        <div className="generator-card" style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "24px", padding: "32px", backdropFilter: "blur(16px)" }}>
          <div className="generator-header">
            <FaLightbulb />
            <div>
              <h2>Describe Your Software Vision</h2>
              <p>
                Enter your project idea below or choose a blueprint, and let BuildForge AI synthesize your architecture.
              </p>
            </div>
          </div>

          {/* Project Input Textarea */}
          <textarea
            placeholder="Example: Build an AI-powered Hospital Management System with doctor scheduling, patient records, payment gateway, tele-health video consults, and analytics..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
          />

          {/* Popular Blueprints */}
          <h3 className="example-title" style={{ marginTop: "24px" }}>
            <FaMagic style={{ marginRight: "6px", color: "#818cf8" }} />
            Popular Project Blueprints (1-Click Generate)
          </h3>

          <div className="example-chips">
            {popularBlueprints.map((item, index) => (
              <button
                key={index}
                className="chip"
                onClick={() => {
                  setIdea(item);
                  handleGenerate(item);
                }}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Primary Generate Button */}
          <button
            className="generate-btn"
            onClick={() => handleGenerate()}
            type="button"
            style={{ marginTop: "24px" }}
          >
            🚀 Generate AI Architectural Blueprint
          </button>
        </div>

        {/* Structured Metrics Row */}
        <div
          className="stats-row"
          style={{
            marginTop: "40px",
            marginBottom: "60px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            width: "100%",
          }}
        >
          <div
            className="metric-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: "20px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="metric-icon"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                fontSize: "1.3rem",
                marginBottom: "14px",
                boxShadow: "0 8px 20px rgba(79, 70, 229, 0.35)",
              }}
            >
              <FaRocket />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.2 }}>
              100%
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
              Production Ready
            </p>
          </div>

          <div
            className="metric-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: "20px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="metric-icon"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                color: "#ffffff",
                fontSize: "1.3rem",
                marginBottom: "14px",
                boxShadow: "0 8px 20px rgba(14, 165, 233, 0.35)",
              }}
            >
              <FaDatabase />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.2 }}>
              ACID & NoSQL
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
              Database Schemas
            </p>
          </div>

          <div
            className="metric-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: "20px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="metric-icon"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                fontSize: "1.3rem",
                marginBottom: "14px",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
              }}
            >
              <FaCode />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.2 }}>
              RESTful
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
              API Specifications
            </p>
          </div>

          <div
            className="metric-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "28px 20px",
              borderRadius: "20px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="metric-icon"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontSize: "1.3rem",
                marginBottom: "14px",
                boxShadow: "0 8px 20px rgba(236, 72, 153, 0.35)",
              }}
            >
              <FaRobot />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", lineHeight: 1.2 }}>
              24/7
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
              AI Architecture Engine
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
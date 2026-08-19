import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import BlueprintHero from "../blueprint/BlueprintHero";
import OverviewSection from "../blueprint/OverviewSection";
import FeaturesSection from "../blueprint/FeaturesSection";
import TechStackSection from "../blueprint/TechStackSection";
import DatabaseSection from "../blueprint/DatabaseSection";
import APISection from "../blueprint/APISection";
import FolderSection from "../blueprint/FolderSection";
import ArchitectureSection from "../blueprint/ArchitectureSection";
import RoadmapSection from "../blueprint/RoadmapSection";
import AIInsights from "../blueprint/AIInsights";
import ActionButtons from "../blueprint/ActionButtons";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "../blueprint/blueprint.css";

/* =========================================================
   HELPERS
========================================================= */

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
};

const extractBlueprint = (body) => {
  if (!body) return null;

  // If body itself is the blueprint
  if (
    isObject(body) &&
    (body.projectName || body.projectDescription || body.features || body.technologyStack || body.architecture)
  ) {
    return body;
  }

  // If wrapped in body.data
  if (isObject(body.data)) {
    if (isObject(body.data.project)) return body.data.project;
    if (isObject(body.data.blueprint)) return body.data.blueprint;
    if (isObject(body.data.data)) return body.data.data;
    if (
      body.data.projectName ||
      body.data.projectDescription ||
      body.data.features ||
      body.data.technologyStack ||
      body.data.architecture
    ) {
      return body.data;
    }
  }

  // If wrapped in body.project or body.blueprint
  if (isObject(body.project)) return body.project;
  if (isObject(body.blueprint)) return body.blueprint;

  return null;
};

/* =========================================================
   COMPONENT
========================================================= */

function Blueprint() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve idea from navigation state, session storage, or default fallback
  const passedIdea = location.state?.idea;
  const storedIdea = typeof window !== "undefined" ? sessionStorage.getItem("buildforge_active_idea") : "";
  const initialIdea = (passedIdea || storedIdea || "AI Resume Screening & Ranking Platform").trim();

  const [idea, setIdea] = useState(initialIdea);
  const [project, setProject] = useState(() => {
    // If navigation state has new idea, generate fresh; else use cached if available
    if (passedIdea && passedIdea !== storedIdea) {
      return null;
    }
    try {
      const cached = sessionStorage.getItem("buildforge_active_blueprint");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  });

  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [showTop, setShowTop] = useState(false);

  const generationStarted = useRef(false);

  const sections = useMemo(
    () => [
      { id: "ProjectOverview", label: "🎯 Overview" },
      { id: "CoreFeatures", label: "✨ Features" },
      { id: "TechStack", label: "⚡ Tech Stack" },
      { id: "SystemArchitecture", label: "🏗️ Architecture" },
      { id: "DatabaseSchema", label: "🗄️ Database" },
      { id: "RESTAPIs", label: "🌐 REST APIs" },
      { id: "FolderStructure", label: "📁 Structure" },
      { id: "Roadmap", label: "🚀 Roadmap" },
      { id: "AIInsights", label: "📊 AI Insights" },
      { id: "ProjectActions", label: "📄 Export PDF" },
    ],
    []
  );

  /* =========================================================
     SCROLL OBSERVER
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);

      const sectionElements = sections.map((sec) =>
        document.getElementById(sec.id)
      );

      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  /* =========================================================
     GENERATE BLUEPRINT
  ========================================================= */

  const generateBlueprint = useCallback(async () => {
    const targetIdea = idea.trim() || "AI Resume Screening & Ranking Platform";

    try {
      setLoading(true);
      setError("");

      const payload = {
        projectIdea: targetIdea,
        idea: targetIdea,
        difficulty: location.state?.difficulty || "Intermediate",
        techStack: safeArray(location.state?.techStack || []),
      };

      const res = await API.post("/ai/generate", payload);
      const data = res?.data;

      if (!data || !data.success) {
        throw new Error(data?.message || "Failed to generate project blueprint.");
      }

      const extracted = extractBlueprint(data);

      if (!extracted || typeof extracted !== "object") {
        throw new Error("Invalid architectural blueprint structure returned by AI engine.");
      }

      setProject(extracted);

      // Cache active blueprint in sessionStorage so page reloads / direct navigation work seamlessly
      try {
        sessionStorage.setItem("buildforge_active_idea", targetIdea);
        sessionStorage.setItem("buildforge_active_blueprint", JSON.stringify(extracted));
      } catch {
        // quota exceeded or private mode fallback
      }
    } catch (err) {
      console.error("Blueprint generation error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred while communicating with the AI architecture engine."
      );
    } finally {
      setLoading(false);
    }
  }, [idea, location.state]);

  useEffect(() => {
    if (project) {
      setLoading(false);
      return;
    }

    if (generationStarted.current) return;
    generationStarted.current = true;
    generateBlueprint();
  }, [project, generateBlueprint]);

  /* =========================================================
     EXPORT EXECUTIVE PDF (MULTI-PAGE VECTOR SPECIFICATION)
  ========================================================= */

  const exportPDF = useCallback(async () => {
    if (!project) {
      toast.error("Please generate a blueprint first.");
      return;
    }
    if (exporting) return;

    setExporting(true);
    const pName = project.projectName || idea || "BuildForge-Blueprint";
    const filename = String(pName)
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "BuildForge-Blueprint";

    try {
      toast.loading("📄 Compiling Executive Architectural PDF Report...", { id: "pdf-toast" });

      const response = await API.post(
        "/projects/export-pdf",
        { idea, project },
        { responseType: "blob" }
      );

      const blob = response.data;
      if (!blob || blob.size === 0) {
        throw new Error("Server returned an empty PDF document.");
      }

      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("🎉 Executive PDF Blueprint downloaded successfully!", { id: "pdf-toast" });
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error(err.response?.data?.message || "Failed to export PDF blueprint.", { id: "pdf-toast" });
    } finally {
      setExporting(false);
    }
  }, [project, idea, exporting]);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="blueprint-page-bg">
        <Navbar />
        <div
          className="blueprint-loading"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="loading-card"
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "24px",
              padding: "48px 36px",
              textAlign: "center",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="spinner" style={{ width: "50px", height: "50px", margin: "0 auto 20px auto" }} />
            <h2 style={{ fontSize: "1.7rem", color: "#fff", marginBottom: "12px", fontWeight: 800 }}>
              Architecting Your Software Blueprint...
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: "500px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              BuildForge AI is generating system topology, domain entities, REST APIs, and roadmaps for <strong style={{ color: "#818cf8" }}>"{idea}"</strong>
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <span className="loading-tag">⚡ System Topology</span>
              <span className="loading-tag">🗄️ Database Schemas</span>
              <span className="loading-tag">🌐 REST APIs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error || !project) {
    return (
      <div className="blueprint-page-bg">
        <Navbar />
        <div
          className="blueprint-error"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="error-card"
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "24px",
              padding: "48px 36px",
              textAlign: "center",
              maxWidth: "580px",
              width: "100%",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="error-icon" style={{ fontSize: "2.8rem", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "1.8rem", color: "#ffffff", marginBottom: "12px", fontWeight: 800 }}>
              Architecture Generation Failed
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.6, marginBottom: "28px" }}>
              {error || "Unable to synthesize software architecture. Please try again."}
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  generationStarted.current = false;
                  generateBlueprint();
                }}
                style={{ padding: "12px 28px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 700 }}
              >
                🔄 Retry Synthesis
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
                style={{ padding: "12px 24px", borderRadius: "12px", fontSize: "0.95rem" }}
              >
                ← Back to Vision Builder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     SUCCESS VIEW
  ========================================================= */

  return (
    <div className="blueprint-page-bg">
      <Navbar />

      {/* FIXED QUICK NAVIGATION BAR UNDER MAIN NAVBAR */}
      <nav
        className="blueprint-quick-nav"
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          width: "100%",
          height: "54px",
          zIndex: 1050,
          background: "rgba(8, 14, 28, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
          padding: "9px 20px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                background:
                  activeSection === sec.id
                    ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                color: activeSection === sec.id ? "#ffffff" : "#94a3b8",
                border:
                  activeSection === sec.id
                    ? "1px solid rgba(99, 102, 241, 0.6)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {sec.label}
            </button>
          ))}

          <button
            type="button"
            onClick={exportPDF}
            disabled={exporting}
            style={{
              marginLeft: "auto",
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)",
              whiteSpace: "nowrap",
            }}
          >
            {exporting ? "⏳ Exporting..." : "📄 Export PDF"}
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <motion.main
        className="blueprint-container"
        style={{
          paddingTop: "130px",
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* PRINTABLE HIGH-FIDELITY AREA (EXACT UI CLONE) */}
        <div id="blueprint-printable-area" className="blueprint-printable-area">
          <BlueprintHero idea={idea} project={project} loading={loading} />

          <div id="ProjectOverview">
            <OverviewSection idea={idea} project={project} />
          </div>

          <FeaturesSection project={project} />
          <TechStackSection project={project} />
          <ArchitectureSection project={project} />
          <DatabaseSection project={project} />
          <APISection project={project} />
          <FolderSection project={project} />
          <RoadmapSection project={project} />
          <AIInsights project={project} />
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <ActionButtons
          project={project}
          exporting={exporting}
          onExport={exportPDF}
        />
      </motion.main>

      {/* BACK TO TOP BUTTON */}
      {showTop && (
        <button
          type="button"
          className="back-to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Blueprint;
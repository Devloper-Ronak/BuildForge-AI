import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  FaArrowLeft,
  FaRocket,
  FaCode,
  FaDatabase,
  FaServer,
  FaFolderOpen,
  FaClock,
  FaProjectDiagram,
  FaFilePdf,
  FaFileCode,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projects/${id}`);

      if (res.data?.success && res.data.data) {
        setProject(res.data.data);
      } else {
        setProject(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Unable to load project blueprint.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id, loadProject]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await API.get(`/projects/export/${id}`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      const rawName = project?.project?.projectName || project?.idea || "BuildForge-Blueprint";
      const filename = String(rawName)
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-+|-+$/g, "");
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("🎉 PDF Blueprint exported successfully!");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Failed to export PDF blueprint.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      const response = await API.get(`/projects/export-json/${id}`);
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(response.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `${(project?.project?.projectName || project?.idea || "blueprint").slice(0, 30)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("JSON Blueprint downloaded!");
    } catch (err) {
      console.error("JSON Export error:", err);
      toast.error("Failed to export JSON blueprint.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-page" style={{ minHeight: "60vh" }}>
          <div className="spinner" style={{ margin: "0 auto 16px auto" }} />
          <h2>Loading Project Blueprint...</h2>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="loading-page" style={{ minHeight: "60vh" }}>
          <h2>Project Blueprint Not Found</h2>
          <Link to="/projects" className="back-btn" style={{ marginTop: "16px" }}>
            <FaArrowLeft /> Back to My Projects
          </Link>
        </div>
      </>
    );
  }

  const rawData = project.project || {};

  // Extract technology stack items safely
  let techItems = [];
  if (Array.isArray(rawData.techStack)) {
    techItems = rawData.techStack.map((t) => (typeof t === "object" ? t.name || t.title : String(t)));
  } else if (rawData.technologyStack && typeof rawData.technologyStack === "object") {
    const all = [
      ...(rawData.technologyStack.frontend || []),
      ...(rawData.technologyStack.backend || []),
      ...(rawData.technologyStack.database || []),
      ...(rawData.technologyStack.authentication || []),
      ...(rawData.technologyStack.ai || []),
      ...(rawData.technologyStack.devops || []),
      ...(rawData.technologyStack.testing || []),
    ];
    techItems = all.map((t) => (typeof t === "object" ? t.name || t.title : String(t)));
  }

  // Extract feature names safely
  let featureItems = [];
  if (Array.isArray(rawData.features)) {
    featureItems = rawData.features.map((f) =>
      typeof f === "object"
        ? {
            name: f.name || f.title || "Core Feature",
            desc: f.description || "",
            priority: f.priority || "High",
            impact: f.businessImpact || "",
          }
        : { name: String(f), desc: "", priority: "High", impact: "" }
    );
  }

  // Extract database schema safely
  let dbItems = [];
  const rawDbList = Array.isArray(rawData.databaseDesign)
    ? rawData.databaseDesign
    : Array.isArray(rawData.database)
    ? rawData.database
    : [];
  dbItems = rawDbList.map((d) =>
    typeof d === "object"
      ? {
          name: d.collection || d.name || "Collection",
          desc: d.purpose || d.description || "",
          fields: Array.isArray(d.fields) ? d.fields : [],
        }
      : { name: String(d), desc: "", fields: [] }
  );

  // Extract APIs safely
  let apiItems = [];
  const rawApiList = Array.isArray(rawData.restApis)
    ? rawData.restApis
    : Array.isArray(rawData.apis)
    ? rawData.apis
    : [];
  apiItems = rawApiList.map((a) =>
    typeof a === "object"
      ? {
          method: a.method || "GET",
          endpoint: a.endpoint || a.path || "/api",
          desc: a.description || a.purpose || "",
          auth: a.authentication || "Required",
        }
      : { method: "GET", endpoint: String(a), desc: "", auth: "Required" }
  );

  // Extract roadmap safely
  let roadmapItems = [];
  const rawRoadmapList = Array.isArray(rawData.developmentRoadmap)
    ? rawData.developmentRoadmap
    : Array.isArray(rawData.roadmap)
    ? rawData.roadmap
    : [];
  roadmapItems = rawRoadmapList.map((r) =>
    typeof r === "object"
      ? {
          phase: r.phase || r.title || "Milestone",
          time: r.timeline || r.duration || "Weeks 1-2",
          goal: r.goal || "",
          tasks: Array.isArray(r.tasks) ? r.tasks : [],
        }
      : { phase: String(r), time: "Phase", goal: "", tasks: [] }
  );

  const safeData = {
    title: rawData.projectName || project.idea || "Software Blueprint",
    tagline: rawData.tagline || "",
    overview: rawData.projectDescription || rawData.overview || rawData.summary || "No overview available.",
    difficulty: rawData.difficulty || project.difficulty || "Intermediate",
    duration: rawData.estimatedDuration || rawData.duration || project.duration || "6–8 Weeks",
    teamSize: rawData.estimatedTeamSize || rawData.teamSize || "2–4 Developers",
    features: featureItems,
    techStack: techItems,
    database: dbItems,
    apis: apiItems,
    roadmap: roadmapItems,
  };

  return (
    <>
      <Navbar />

      <div className="details-page" style={{ paddingTop: "96px", maxWidth: "1200px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
        {/* Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <Link to="/projects" className="back-btn" style={{ margin: 0 }}>
            <FaArrowLeft /> Back to My Projects
          </Link>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="signup-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <FaFilePdf /> {exporting ? "Generating PDF..." : "Export Executive PDF"}
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="details-header" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", color: "#fff", marginBottom: "6px" }}>{safeData.title}</h1>
          {safeData.tagline && <p style={{ color: "#818cf8", fontSize: "1.1rem", fontStyle: "italic", marginBottom: "16px" }}>{safeData.tagline}</p>}
          <p style={{ color: "#cbd5e1", lineHeight: 1.6, fontSize: "0.95rem" }}>{safeData.overview}</p>

          <div className="header-badges" style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", padding: "6px 14px", borderRadius: "14px", fontSize: "0.85rem", border: "1px solid rgba(99, 102, 241, 0.4)" }}>
              ⚡ Difficulty: {safeData.difficulty}
            </span>
            <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#a7f3d0", padding: "6px 14px", borderRadius: "14px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
              ⏳ Timeline: {safeData.duration}
            </span>
            <span style={{ background: "rgba(236, 72, 153, 0.2)", color: "#fbcfe8", padding: "6px 14px", borderRadius: "14px", fontSize: "0.85rem", border: "1px solid rgba(236, 72, 153, 0.4)" }}>
              👥 Team: {safeData.teamSize}
            </span>
          </div>
        </div>

        {/* FEATURES */}
        {safeData.features.length > 0 && (
          <div className="details-card" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaRocket style={{ color: "#818cf8" }} /> Key Features & Capabilities
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {safeData.features.map((item, index) => (
                <div key={index} style={{ background: "rgba(30, 41, 59, 0.5)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <h3 style={{ color: "#fff", fontSize: "1rem", margin: 0 }}>{item.name}</h3>
                    <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", padding: "2px 8px", borderRadius: "8px" }}>
                      {item.priority}
                    </span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.4, margin: "6px 0" }}>{item.desc}</p>
                  {item.impact && (
                    <p style={{ color: "#34d399", fontSize: "0.8rem", margin: 0 }}>
                      <strong>Impact:</strong> {item.impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK */}
        {safeData.techStack.length > 0 && (
          <div className="details-card" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaCode style={{ color: "#818cf8" }} /> Technology Stack
            </h2>
            <div className="tag-grid" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {safeData.techStack.map((item, index) => (
                <span key={index} className="tag" style={{ background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", padding: "6px 14px", borderRadius: "12px", fontSize: "0.85rem", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* DATABASE */}
        {safeData.database.length > 0 && (
          <div className="details-card" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaDatabase style={{ color: "#818cf8" }} /> Database Schema & Collections
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {safeData.database.map((item, index) => (
                <div key={index} style={{ background: "rgba(30, 41, 59, 0.5)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 6px 0" }}>🗄️ {item.name}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "10px" }}>{item.desc}</p>
                  {item.fields.length > 0 && (
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {item.fields.slice(0, 4).map((f, fi) => (
                        <div key={fi}>• {f.name} ({f.type})</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APIs */}
        {safeData.apis.length > 0 && (
          <div className="details-card" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaServer style={{ color: "#818cf8" }} /> REST API Contracts
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {safeData.apis.map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(30, 41, 59, 0.4)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.8rem", padding: "2px 8px", borderRadius: "6px", background: item.method === "POST" ? "rgba(99,102,241,0.3)" : "rgba(16,185,129,0.3)", color: item.method === "POST" ? "#818cf8" : "#34d399" }}>
                      {item.method}
                    </span>
                    <code style={{ color: "#fff", fontSize: "0.9rem" }}>{item.endpoint}</code>
                  </div>
                  <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROADMAP */}
        {safeData.roadmap.length > 0 && (
          <div className="details-card" style={{ background: "rgba(15, 23, 42, 0.7)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "40px" }}>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FaClock style={{ color: "#818cf8" }} /> Implementation Roadmap
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {safeData.roadmap.map((item, index) => (
                <div key={index} style={{ padding: "14px 18px", background: "rgba(30, 41, 59, 0.4)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <strong style={{ color: "#fff", fontSize: "0.95rem" }}>🚀 {item.phase}</strong>
                    <span style={{ color: "#818cf8", fontSize: "0.8rem", fontWeight: 600 }}>{item.time}</span>
                  </div>
                  {item.goal && <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "4px 0" }}>{item.goal}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectDetails;
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEye, FaPlus, FaSearch, FaRocket, FaFilePdf } from "react-icons/fa";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth.js";
import toast from "react-hot-toast";

function Projects() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [exportingId, setExportingId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const res = await API.get("/projects/my-projects");

      if (res.data?.success && Array.isArray(res.data.data)) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
      setProjects([]);
      if (error?.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Unable to load saved projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blueprint?")) {
      return;
    }

    try {
      await API.delete(`/projects/delete/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project blueprint deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleQuickExportPDF = async (id, title, e) => {
    e.stopPropagation();
    try {
      setExportingId(id);
      const response = await API.get(`/projects/export/${id}`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      const filename = String(title || "BuildForge-Blueprint")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-+|-+$/g, "");
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("🎉 PDF Blueprint downloaded successfully!");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Failed to export PDF blueprint.");
    } finally {
      setExportingId(null);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = search.toLowerCase();
    const title = (p.idea || p.project?.projectName || "").toLowerCase();
    const overview = (p.project?.overview || "").toLowerCase();
    return title.includes(q) || overview.includes(q);
  });

  return (
    <>
      <Navbar />

      <div className="dashboard-container" style={{ paddingTop: "96px", minHeight: "85vh", maxWidth: "1300px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "30px" }}>
          <div>
            <h1 className="title" style={{ margin: 0, textAlign: "left", fontSize: "1.8rem", color: "#fff" }}>
              📂 Saved Project Blueprints
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
              Manage, review, and export your generated architectural blueprints.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link
              to="/dashboard"
              className="signup-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <FaPlus /> New Blueprint
            </Link>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(30, 41, 59, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "8px 16px",
            marginBottom: "28px",
            gap: "10px",
          }}
        >
          <FaSearch style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search saved blueprints by title, idea, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              width: "100%",
              fontSize: "15px",
            }}
          />
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="loading-page" style={{ minHeight: "250px" }}>
            <div className="spinner" style={{ margin: "0 auto 16px auto" }} />
            <h2>Loading your blueprints...</h2>
          </div>
        )}

        {/* NOT LOGGED IN STATE */}
        {!loading && !isAuthenticated && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              background: "rgba(17, 24, 39, 0.6)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <FaRocket style={{ fontSize: "40px", color: "#818cf8", marginBottom: "16px" }} />
            <h2>Sign in to view saved blueprints</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginBottom: "20px" }}>
              Log into your account to securely access all your generated project plans.
            </p>
            <Link to="/login" className="signup-btn" style={{ textDecoration: "none" }}>
              Login to Account
            </Link>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && isAuthenticated && projects.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              background: "rgba(17, 24, 39, 0.6)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <FaRocket style={{ fontSize: "40px", color: "#818cf8", marginBottom: "16px" }} />
            <h2>No saved blueprints found</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.6)", marginBottom: "20px" }}>
              Generate your first software architecture blueprint to get started!
            </p>
            <Link to="/dashboard" className="signup-btn" style={{ textDecoration: "none" }}>
              Generate a Blueprint 🚀
            </Link>
          </div>
        )}

        {/* GRID */}
        {!loading && (
          <div className="grid">
            {filteredProjects.map((p) => {
              const details = p.project || {};
              const title = details.projectName || p.idea;
              const difficulty = details.difficulty || p.difficulty || "Intermediate";
              const duration = details.duration || p.duration || "6 Weeks";

              return (
                <div
                  className="card"
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <h2>{title}</h2>

                  <p className="desc">
                    {details.overview
                      ? details.overview.length > 140
                        ? details.overview.slice(0, 140) + "..."
                        : details.overview
                      : "Complete software blueprint with architecture, schema, APIs, and roadmap."}
                  </p>

                  <div className="meta">
                    <span>⚡ {difficulty}</span>
                    <span>⏳ {duration}</span>
                  </div>

                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/projects/${p.id}`} className="view">
                      <FaEye style={{ marginRight: "4px" }} /> View
                    </Link>

                    <button
                      type="button"
                      className="view"
                      onClick={(e) => handleQuickExportPDF(p.id, title, e)}
                      disabled={exportingId === p.id}
                      style={{ background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}
                    >
                      <FaFilePdf style={{ marginRight: "4px" }} />{" "}
                      {exportingId === p.id ? "Exporting..." : "PDF"}
                    </button>

                    <button
                      className="delete"
                      onClick={(e) => deleteProject(p.id, e)}
                      type="button"
                    >
                      <FaTrash style={{ marginRight: "4px" }} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
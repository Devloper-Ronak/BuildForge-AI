import { motion } from "framer-motion";
import { useState } from "react";
import { FaFolderOpen, FaCopy, FaCheck, FaFolder, FaFileCode } from "react-icons/fa";
import toast from "react-hot-toast";

/* =========================================================
   RECURSIVE TREE FLATTENER
========================================================= */

const getFileIcon = (filename) => {
  if (!filename || typeof filename !== "string") return "📄";
  const lower = filename.toLowerCase();

  if (lower.endsWith(".jsx") || lower.endsWith(".tsx")) return "⚛️";
  if (lower.endsWith(".js") || lower.endsWith(".ts")) return "📜";
  if (lower.endsWith(".css") || lower.endsWith(".scss")) return "🎨";
  if (lower.endsWith(".json") || lower.endsWith(".yaml") || lower.endsWith(".yml")) return "⚙️";
  if (lower.includes("docker") || lower.endsWith(".dockerfile")) return "🐳";
  if (lower.endsWith(".env") || lower.includes("secret") || lower.includes("key")) return "🔒";
  if (lower.endsWith(".md") || lower.endsWith(".txt")) return "📝";
  if (lower.endsWith(".ico") || lower.endsWith(".png") || lower.endsWith(".svg")) return "🖼️";
  if (lower.endsWith(".test.js") || lower.endsWith(".spec.js")) return "🧪";
  if (lower.endsWith(".sql") || lower.endsWith(".prisma")) return "🗄️";

  return "📄";
};

const flattenTree = (node, depth = 0) => {
  const items = [];

  if (Array.isArray(node)) {
    node.forEach((file) => {
      if (typeof file === "string") {
        items.push({ type: "file", name: file, depth });
      } else if (typeof file === "object" && file !== null) {
        items.push(...flattenTree(file, depth));
      }
    });
  } else if (typeof node === "object" && node !== null) {
    Object.entries(node).forEach(([key, val]) => {
      if (key === "root" && Array.isArray(val)) {
        val.forEach((file) => {
          items.push({ type: "file", name: String(file), depth });
        });
      } else if (Array.isArray(val)) {
        items.push({ type: "dir", name: key, depth });
        val.forEach((file) => {
          if (typeof file === "object" && file !== null) {
            items.push(...flattenTree(file, depth + 1));
          } else {
            items.push({ type: "file", name: String(file), depth: depth + 1 });
          }
        });
      } else if (typeof val === "object" && val !== null) {
        items.push({ type: "dir", name: key, depth });
        items.push(...flattenTree(val, depth + 1));
      } else {
        items.push({ type: "file", name: `${key}: ${val}`, depth });
      }
    });
  }

  return items;
};

/* =========================================================
   DEFAULT RICH ENTERPRISE FALLBACKS
========================================================= */

const DEFAULT_FRONTEND_TREE = {
  src: {
    assets: ["logo.svg", "styles.css", "theme.js"],
    components: ["Navbar.jsx", "Sidebar.jsx", "DataGrid.jsx", "StatCard.jsx", "Modal.jsx", "FilterBar.jsx"],
    pages: ["Dashboard.jsx", "Blueprint.jsx", "Projects.jsx", "ProjectDetails.jsx", "Analytics.jsx", "Settings.jsx"],
    services: ["api.js", "authService.js", "projectService.js", "analyticsService.js"],
    hooks: ["useAuth.js", "useFetch.js", "useDebounce.js", "useWebSocket.js"],
    context: ["AuthContext.jsx", "ThemeContext.jsx"],
    utils: ["formatters.js", "validators.js", "constants.js"],
    root: ["App.jsx", "main.jsx", "index.css", "routes.jsx"]
  },
  public: ["favicon.ico", "robots.txt", "logo.svg", "manifest.json"],
  root: ["package.json", "vite.config.js", "tailwind.config.js", ".env.example", "README.md"]
};

const DEFAULT_BACKEND_TREE = {
  src: {
    config: ["database.js", "env.js", "redis.js", "passport.js"],
    controllers: ["authController.js", "projectController.js", "userController.js", "exportController.js", "analyticsController.js"],
    middleware: ["authMiddleware.js", "rateLimiter.js", "errorHandler.js", "requestValidator.js"],
    models: ["User.js", "Project.js", "Session.js", "AuditLog.js", "Notification.js"],
    routes: ["apiRouter.js", "authRoutes.js", "projectRoutes.js", "userRoutes.js", "analyticsRoutes.js"],
    services: ["authService.js", "projectService.js", "aiService.js", "emailService.js", "exportService.js", "cacheService.js"],
    utils: ["apiResponse.js", "tokenHelper.js", "logger.js", "crypto.js"],
    root: ["server.js", "app.js"]
  },
  tests: ["unit/auth.test.js", "integration/api.test.js", "setup.js"],
  scripts: ["migrate.js", "seed.js"],
  root: ["package.json", "docker-compose.yml", "Dockerfile", ".env.example", "README.md"]
};

/* =========================================================
   COMPONENT
========================================================= */

function FolderSection({ project }) {
  const [copiedSection, setCopiedSection] = useState("");

  if (!project) return null;

  const rawStructure = project.folderStructure || project.folders || {};

  // Ensure both frontend and backend trees are rich and deep
  let frontendNode = rawStructure.frontend || rawStructure.client || DEFAULT_FRONTEND_TREE;
  let backendNode = rawStructure.backend || rawStructure.server || DEFAULT_BACKEND_TREE;

  // Check if frontend or backend tree is too shallow
  if (
    typeof frontendNode === "object" &&
    (!frontendNode.src || typeof frontendNode.src !== "object" || Object.keys(frontendNode.src).length === 0)
  ) {
    frontendNode = DEFAULT_FRONTEND_TREE;
  }

  if (
    typeof backendNode === "object" &&
    (!backendNode.src || typeof backendNode.src !== "object" || Object.keys(backendNode.src).length === 0)
  ) {
    backendNode = DEFAULT_BACKEND_TREE;
  }

  const sections = [
    {
      title: "Frontend Architecture (Client)",
      badge: "REACT / VITE SPA",
      items: flattenTree(frontendNode),
    },
    {
      title: "Backend Architecture (API Server)",
      badge: "NODE.JS / EXPRESS / MONGO",
      items: flattenTree(backendNode),
    },
  ];

  const copyTree = (title, items) => {
    try {
      const text = items
        .map((item) => {
          const indent = "  ".repeat(item.depth);
          return item.type === "dir" ? `${indent}📁 ${item.name}/` : `${indent}📄 ${item.name}`;
        })
        .join("\n");

      navigator.clipboard.writeText(`${title} - Project Folder Structure:\n\n${text}`);
      setCopiedSection(title);
      toast.success(`Copied ${title} folder tree!`);
      setTimeout(() => setCopiedSection(""), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <section className="blueprint-card folder-section" id="FolderStructure">
      <div className="section-heading folder-heading">
        <div className="section-badge folder-badge">📁 PROJECT STRUCTURE</div>
        <h2 className="folder-main-title">Enterprise Project Folder Structure</h2>
        <p className="folder-subtitle">
          Complete, production-ready directory trees and modular file architectures engineered for high maintainability, strict separation of concerns, and team scalability.
        </p>
      </div>

      <div className="folder-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="folder-pro-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="folder-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  className={`folder-icon folder-icon-${index}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: index === 0 ? "rgba(99, 102, 241, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    color: index === 0 ? "#818cf8" : "#34d399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  <FaFolderOpen />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                    {section.title}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>
                    {section.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyTree(section.title, section.items)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#cbd5e1",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                {copiedSection === section.title ? (
                  <>
                    <FaCheck style={{ color: "#34d399" }} /> Copied
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy Tree
                  </>
                )}
              </button>
            </div>

            {/* Tree Terminal Window */}
            <div
              className="folder-list"
              style={{
                background: "rgba(10, 15, 29, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "14px",
                padding: "16px",
                fontFamily: "Fira Code, Consolas, Monaco, monospace",
                fontSize: "0.85rem",
                lineHeight: "1.6",
                maxHeight: "480px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {section.items.map((item, i) => {
                const isDir = item.type === "dir";
                const paddingLeft = `${item.depth * 18}px`;

                return (
                  <div
                    key={`${section.title}-${i}`}
                    style={{
                      paddingLeft,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: isDir ? "#93c5fd" : "#cbd5e1",
                      fontWeight: isDir ? 700 : 400,
                      paddingTop: isDir ? "4px" : "1px",
                      paddingBottom: isDir ? "4px" : "1px",
                    }}
                  >
                    <span style={{ opacity: 0.85, fontSize: "0.9rem" }}>
                      {isDir ? "📁" : getFileIcon(item.name)}
                    </span>
                    <span
                      style={{
                        color: isDir ? "#60a5fa" : item.name.endsWith(".jsx") ? "#a5b4fc" : item.name.endsWith(".js") ? "#fde047" : "#e2e8f0",
                      }}
                    >
                      {item.name}
                      {isDir && "/"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="folder-footer"
              style={{
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#10b981",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              <span>✓ PRODUCTION READY ARCHITECTURE</span>
              <span style={{ color: "#64748b" }}>{section.items.length} items</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FolderSection;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProjectDetails from "./pages/ProjectDetails";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Blueprint from "./pages/Blueprint";
import SavedProjects from "./pages/SavedProjects";
import Projects from "./pages/Projects";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e1b4b 0%, #020617 50%, #000000 100%)",
        color: "white",
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Default Landing Page */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Core Application Pages (Open Access) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blueprint" element={<Blueprint />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/saved-projects" element={<SavedProjects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
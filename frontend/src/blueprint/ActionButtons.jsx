import { FaFilePdf, FaSpinner, FaDownload } from "react-icons/fa";

function ActionButtons({
  project,
  exporting,
  onExport,
}) {
  const noProject = !project;

  return (
    <section
      id="ProjectActions"
      className="blueprint-action-bar-container"
      style={{
        margin: "50px 0 70px 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="blueprint-action-bar-card"
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "radial-gradient(120% 120% at 50% 0%, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          borderRadius: "28px",
          padding: "48px 36px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(99, 102, 241, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow ambient background element */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "450px",
            height: "300px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* CENTER-ALIGNED HEADER */}
        <div
          className="action-bar-header"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "32px",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <span
            className="action-bar-badge"
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)",
              color: "#c7d2fe",
              padding: "8px 22px",
              borderRadius: "30px",
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              border: "1px solid rgba(129, 140, 248, 0.45)",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span>📄</span> EXECUTIVE ARCHITECTURAL REPORT
          </span>

          <h2
            style={{
              fontSize: "2.3rem",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              margin: "0 0 14px 0",
              lineHeight: 1.25,
              background: "linear-gradient(90deg, #ffffff 0%, #c7d2fe 50%, #e0e7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px rgba(99, 102, 241, 0.3))",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Download Executive Architecture Specification
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.05rem",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            Export the complete multi-page architectural report with system topologies, database schemas, REST APIs, and implementation milestones.
          </p>
        </div>

        {/* CENTERED PROMINENT PDF DOWNLOAD BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <button
            type="button"
            className={`blueprint-action-card action-pdf ${exporting ? "is-loading" : ""}`}
            onClick={onExport}
            disabled={noProject || exporting}
            title="Download an executive multi-page PDF architectural blueprint report"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              padding: "20px 48px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)",
              border: "1px solid rgba(252, 165, 165, 0.4)",
              borderRadius: "18px",
              boxShadow: "0 15px 35px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              cursor: exporting ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              maxWidth: "520px",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              if (!exporting) {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 22px 50px rgba(239, 68, 68, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              {exporting ? (
                <FaSpinner className="spin-icon" />
              ) : (
                <FaFilePdf />
              )}
            </div>

            <div style={{ textAlign: "left" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  letterSpacing: "0.2px",
                }}
              >
                {exporting ? "Generating PDF Report..." : "Export PDF"}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.88rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {exporting ? "Compiling specification..." : "Download printable multi-page architecture report"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ActionButtons;
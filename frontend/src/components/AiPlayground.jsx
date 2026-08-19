import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AiPlayground = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a software idea or query.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await API.post("/ai/generate", {
        projectIdea: prompt.trim(),
      });

      if (res.data?.success && res.data.data) {
        setResponse(res.data.data);
        toast.success("AI Blueprint Generated!");
      }
    } catch (error) {
      console.error("Playground error:", error);
      toast.error(error.response?.data?.message || "Error connecting to AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <h2 style={{ color: "#818cf8", marginBottom: "8px" }}>🤖 AI Software Architecture Playground</h2>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px" }}>
        Test the architecture generator in real-time.
      </p>

      <textarea
        rows="3"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter any project idea or feature requirement..."
        style={{
          width: "100%",
          padding: "12px",
          background: "#1e293b",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
        }}
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="generate-btn"
        style={{
          marginTop: "12px",
          padding: "10px 24px",
          cursor: "pointer",
        }}
        type="button"
      >
        {loading ? "Generating Architecture..." : "Generate Architecture"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            background: "#111827",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 style={{ color: "#a5b4fc", marginBottom: "8px" }}>{response.projectName}</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.6" }}>{response.overview || response.summary}</p>
        </div>
      )}
    </div>
  );
};

export default AiPlayground;
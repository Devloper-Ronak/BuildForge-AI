import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AiBox = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a software idea or prompt.");
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
        toast.success("Blueprint generated!");
      } else {
        toast.error("Failed to generate response.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error(error.response?.data?.message || "Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", background: "rgba(17, 24, 39, 0.7)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <h2 style={{ color: "#818cf8", marginBottom: "12px" }}>🤖 BuildForge AI Quick Assistant</h2>

      <textarea
        rows="3"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something or describe a feature..."
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#1e293b",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="generate-btn"
        style={{ marginTop: "12px", padding: "10px 20px" }}
        type="button"
      >
        {loading ? "Generating..." : "Ask AI"}
      </button>

      {response && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#0f172a", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
          <h3 style={{ color: "#a5b4fc" }}>{response.projectName || "Generated Blueprint"}</h3>
          <p style={{ marginTop: "8px", color: "rgba(255, 255, 255, 0.8)" }}>{response.overview || response.summary}</p>
        </div>
      )}
    </div>
  );
};

export default AiBox;
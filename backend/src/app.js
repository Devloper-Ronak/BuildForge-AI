import express from "express";
import cors from "cors";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { securityMiddleware } from "./middleware/security.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

securityMiddleware(app);

// Allowed origins configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://build-forge-ai-eight.vercel.app",
    "https://buildforge-ai-backend.onrender.com"
];

app.use(
    cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps or curl) or if origin is allowed
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(logger);

console.log("🔥 BACKEND APP LOADED");

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "BuildForge AI Backend Running 🚀",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);

export default app;
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import { config } from "./config/env.js";

console.log("RESEND =", process.env.RESEND_API_KEY);

const PORT = config.PORT;

app.listen(PORT, () => {

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 BuildForge AI Started");
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

});
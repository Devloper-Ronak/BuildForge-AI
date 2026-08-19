import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: Number(process.env.PORT) || 5001,

    NODE_ENV: process.env.NODE_ENV || "development",

    JWT_SECRET: process.env.JWT_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY || "",

    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
};
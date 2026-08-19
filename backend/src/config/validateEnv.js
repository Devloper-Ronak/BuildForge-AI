import { config } from "./env.js";

export const validateEnv = () => {
    const required = [
        "JWT_SECRET",
    ];

    const missing = required.filter(
        (key) => !process.env[key]
    );

    if (missing.length > 0) {
        console.error("\n❌ Missing required environment variables:\n");

        missing.forEach((key) => {
            console.error(`• ${key}`);
        });

        console.error("\nPlease update your .env file.\n");

        process.exit(1);
    }

    const hasAIProvider =
        Boolean(config.OPENAI_API_KEY) ||
        Boolean(config.GROQ_API_KEY);

    if (!hasAIProvider) {
        console.warn(
            "\n⚠️ No AI provider configured. " +
            "Add OPENAI_API_KEY or GROQ_API_KEY to enable AI generation.\n"
        );
    }

    console.log("✅ Environment configuration loaded.");
};
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

/* ============================================================
   GROQ CLIENT
============================================================ */

const apiKey =
    process.env.GROQ_API_KEY;

if (!apiKey) {
    console.warn(
        "⚠️ GROQ_API_KEY is missing from .env"
    );
}

const groq =
    apiKey ?
    new Groq({
        apiKey,
    }) :
    null;

/* ============================================================
   GENERATE WITH GROQ
============================================================ */

export const generateWithGroq = async(
    prompt,
    options = {}
) => {

    if (!groq) {
        throw new Error(
            "GROQ_API_KEY is missing. Add it to your .env file."
        );
    }

    if (!prompt ||
        typeof prompt !== "string" ||
        !prompt.trim()
    ) {
        throw new Error(
            "Groq prompt cannot be empty."
        );
    }

    const {
        model =
            "llama-3.3-70b-versatile",
            temperature = 0.2,
            maxTokens = 4096,
    } = options;

    console.log(
        "🟣 Groq model:",
        model
    );

    const completion =
        await groq.chat.completions.create({

            model,

            messages: [{
                    role: "system",
                    content: "You are a software architecture expert. Return only valid JSON. Do not use markdown code fences.",
                },

                {
                    role: "user",
                    content: prompt.trim(),
                },
            ],

            temperature,

            max_tokens: maxTokens,

            response_format: {
                type: "json_object",
            },
        });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error(
            "Groq returned an empty response."
        );
    }

    console.log(
        "✅ Groq response generated."
    );

    return content;
};

/* ============================================================
   DEFAULT EXPORT
============================================================ */

export default groq;
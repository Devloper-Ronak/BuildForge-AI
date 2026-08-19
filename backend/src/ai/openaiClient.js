import openai from "../config/openai.js";

export const generateWithOpenAI = async(prompt) => {
    if (!openai) {
        throw new Error("OpenAI API key is not configured.");
    }

    const response =
        await openai.chat.completions.create({
            model: "gpt-4o-mini",

            messages: [{
                    role: "system",
                    content: "You are an expert software architect. " +
                        "Return ONLY valid JSON. " +
                        "Never return Markdown or explanations.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

            temperature: 0.2,

            response_format: {
                type: "json_object",
            },
        });

    const text =
        response?.choices?.[0]?.message?.content?.trim();

    if (!text) {
        throw new Error(
            "OpenAI returned an empty response."
        );
    }

    return text;
};
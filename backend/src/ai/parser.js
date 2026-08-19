import { jsonrepair } from "jsonrepair";

const cleanAIText = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .replace(/^\uFEFF/, "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
};

const extractJSONObject = (text) => {
    const cleaned = cleanAIText(text);

    if (!cleaned) {
        throw new Error("AI returned an empty response.");
    }

    const firstBrace = cleaned.indexOf("{");

    if (firstBrace === -1) {
        throw new Error(
            "AI response does not contain a JSON object."
        );
    }

    let depth = 0;
    let inString = false;
    let escaped = false;
    let lastClosingBrace = -1;

    for (let i = firstBrace; i < cleaned.length; i += 1) {
        const char = cleaned[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === "\\") {
                escaped = true;
                continue;
            }

            if (char === '"') {
                inString = false;
            }

            continue;
        }

        if (char === '"') {
            inString = true;
            continue;
        }

        if (char === "{") {
            depth += 1;
        } else if (char === "}") {
            depth -= 1;
            lastClosingBrace = i;

            if (depth === 0) {
                return cleaned.slice(firstBrace, i + 1);
            }
        }
    }

    // If depth never reached 0, try up to the last closing brace or return from firstBrace
    if (lastClosingBrace !== -1 && lastClosingBrace > firstBrace) {
        return cleaned.slice(firstBrace, lastClosingBrace + 1);
    }

    return cleaned.slice(firstBrace);
};

const parseJSON = (jsonText) => {
    try {
        return JSON.parse(jsonText);
    } catch {
        try {
            // Attempt repair with jsonrepair
            const repaired = jsonrepair(jsonText);
            return JSON.parse(repaired);
        } catch (repairError) {
            console.error("❌ JSON PARSING & REPAIR FAILED");
            console.error("Error:", repairError.message);
            console.error(
                "Response snippet:",
                jsonText.slice(0, 500)
            );

            throw new Error(
                `AI returned invalid JSON: ${repairError.message}`
            );
        }
    }
};

export const parseAIResponse = (text) => {
    if (
        text &&
        typeof text === "object" &&
        !Array.isArray(text)
    ) {
        return text;
    }

    const extracted = extractJSONObject(text);
    return parseJSON(extracted);
};

export default {
    parseAIResponse,
};
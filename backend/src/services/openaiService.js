import {
    generateAI,
} from "./aiService.js";


// ==========================================
// Generate AI Response
// ==========================================

export const generateAIResponse = async(
    prompt
) => {

    try {

        if (
            typeof prompt === "string"
        ) {

            return await generateAI({

                projectIdea: prompt,

                techStack: [],

                difficulty: "Intermediate",

            });

        }


        if (
            prompt &&
            typeof prompt === "object"
        ) {

            return await generateAI({

                projectIdea: prompt.projectIdea ||
                    prompt.idea ||
                    "",

                techStack: prompt.techStack || [],

                difficulty: prompt.difficulty ||
                    "Intermediate",

            });

        }


        throw new Error(
            "Invalid AI prompt."
        );

    } catch (error) {

        console.error(
            "❌ AI Response Service Error:",
            error.message
        );

        throw error;
    }

};
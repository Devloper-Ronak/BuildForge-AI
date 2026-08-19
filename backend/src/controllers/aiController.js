// backend/src/controllers/aiController.js

import { generateAI } from "../services/aiService.js";

export const createBlueprint = async(req, res) => {
    const startedAt = Date.now();

    try {
        const {
            projectIdea,
            techStack,
            difficulty,
        } = req.body || {};

        if (
            typeof projectIdea !== "string" ||
            !projectIdea.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Project idea is required.",
                data: null,
            });
        }

        console.log("\n======================================");
        console.log("🚀 BUILD FORGE AI BLUEPRINT REQUEST");
        console.log("======================================");
        console.log("Project:", projectIdea.trim());
        console.log("Tech Stack:", techStack);
        console.log("Difficulty:", difficulty || "Intermediate");

        const blueprint = await generateAI({
            projectIdea: projectIdea.trim(),
            techStack,
            difficulty: difficulty || "Intermediate",
        });

        if (!blueprint ||
            typeof blueprint !== "object" ||
            Array.isArray(blueprint)
        ) {
            throw new Error(
                "AI returned an invalid blueprint object."
            );
        }

        console.log(
            `✅ Blueprint generated in ${
                Date.now() - startedAt
            }ms`
        );

        return res.status(200).json({
            success: true,
            message: "Blueprint generated successfully.",
            data: blueprint,
        });

    } catch (error) {
        console.error("\n======================================");
        console.error("❌ BLUEPRINT GENERATION ERROR");
        console.error("======================================");

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Stack:",
            error?.stack
        );

        console.error(
            `Duration: ${Date.now() - startedAt}ms`
        );

        return res.status(500).json({
            success: false,
            message: error?.message ||
                "Blueprint generation failed.",
            data: null,
        });
    }
};
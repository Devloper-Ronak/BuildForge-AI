import {
    getUserProjectById,
} from "./projectService.js";

// ==========================================
// GET PROJECT FOR EXPORT
// ==========================================

export const getProjectForExport = (
    projectId,
    userId
) => {
    if (!projectId) {
        throw new Error(
            "Project ID is required."
        );
    }

    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    const project =
        getUserProjectById(
            projectId,
            userId
        );

    if (!project) {
        throw new Error(
            "Project not found or unauthorized."
        );
    }

    return project;
};

// ==========================================
// MARKDOWN EXPORT
// ==========================================

export const convertToMarkdown = (
        project
    ) => {
        const data =
            project.project || {};

        const features =
            Array.isArray(
                data.features
            ) ?
            data.features :
            [];

        const techStack =
            Array.isArray(
                data.techStack
            ) ?
            data.techStack :
            [];

        const apis =
            Array.isArray(
                data.apis
            ) ?
            data.apis :
            [];

        return `# ${project.idea || "BuildForge AI Project"}

## Overview

${data.overview || "No overview available."}

## Goal

${data.goal || "No goal specified."}

## Industry

${data.industry || "Not specified."}

## Target Users

${data.targetUsers || "Not specified."}

## Difficulty

${data.difficulty || project.difficulty || "Intermediate"}

## Duration

${data.duration || project.duration || "Not specified."}

## Technology Stack

${techStack.length
        ? techStack
              .map(
                  (tech) =>
                      `- ${tech}`
              )
              .join("\n")
        : "- No technologies specified."
}

## Features

${features.length
        ? features
              .map(
                  (feature) =>
                      `- ${feature}`
              )
              .join("\n")
        : "- No features specified."
}

## APIs

${apis.length
        ? apis
              .map(
                  (api) =>
                      `- ${typeof api === "string"
                          ? api
                          : JSON.stringify(api)
                      }`
              )
              .join("\n")
        : "- No APIs specified."
}

## Generated Project Code

\`\`\`
${data.code || project.code || "No code available."}
\`\`\`

---

Created At: ${
        project.createdAt || "Unknown"
    }

Last Viewed: ${
        project.lastViewedAt ||
        "Never"
    }

Favorite: ${
        project.favorite
            ? "Yes"
            : "No"
    }
`;
};

// ==========================================
// JSON EXPORT
// ==========================================

export const convertToJSON = (
    project
) => {
    return {
        id: project.id,

        userId: project.userId,

        idea: project.idea,

        project:
            project.project || {},

        difficulty:
            project.difficulty,

        duration:
            project.duration,

        favorite:
            project.favorite,

        favoriteAt:
            project.favoriteAt,

        createdAt:
            project.createdAt,

        updatedAt:
            project.updatedAt,

        lastViewedAt:
            project.lastViewedAt,

        history:
            project.history || [],

        versions:
            project.versions || [],
    };
};
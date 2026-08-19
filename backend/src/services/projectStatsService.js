import {
    getUserProjects,
} from "./projectService.js";

// ==========================================
// PROJECT STATISTICS
// ==========================================

export const getProjectStatistics = (
    userId
) => {
    if (!userId) {
        throw new Error(
            "User ID is required."
        );
    }

    const projects =
        getUserProjects(userId);

    const totalProjects =
        projects.length;

    let totalFeatures = 0;

    let totalApis = 0;

    let totalCollections = 0;

    const technologyUsage = {};

    const difficulty = {
        Easy: 0,
        Intermediate: 0,
        Advanced: 0,
        Hard: 0,
    };

    projects.forEach(
        (project) => {

            const data =
                project.project || {};

            // --------------------------
            // Difficulty
            // --------------------------

            const level =
                data.difficulty ||
                project.difficulty ||
                "Intermediate";

            if (
                difficulty[level] !==
                undefined
            ) {
                difficulty[level]++;
            }

            // --------------------------
            // Features
            // --------------------------

            totalFeatures +=
                Array.isArray(
                    data.features
                ) ?
                data.features.length :
                0;

            // --------------------------
            // APIs
            // --------------------------

            totalApis +=
                Array.isArray(
                    data.apis
                ) ?
                data.apis.length :
                0;

            // --------------------------
            // Database
            // --------------------------

            if (
                Array.isArray(
                    data.database
                )
            ) {
                totalCollections +=
                    data.database.length;
            } else if (
                data.database &&
                typeof data.database ===
                "object"
            ) {
                totalCollections +=
                    Object.keys(
                        data.database
                    ).length;
            }

            // --------------------------
            // Technologies
            // --------------------------

            const techStack =
                Array.isArray(
                    data.techStack
                ) ?
                data.techStack :
                [];

            techStack.forEach(
                (tech) => {
                    technologyUsage[tech] =
                        (
                            technologyUsage[
                                tech
                            ] || 0
                        ) + 1;
                }
            );
        }
    );

    const averageFeatures =
        totalProjects > 0 ?
        (
            totalFeatures /
            totalProjects
        ).toFixed(1) :
        "0.0";

    const averageApis =
        totalProjects > 0 ?
        (
            totalApis /
            totalProjects
        ).toFixed(1) :
        "0.0";

    const latestProject =
        projects.length > 0 ?
        projects[0] :
        null;

    return {
        totalProjects,

        totalFeatures,

        totalApis,

        totalCollections,

        averageFeatures,

        averageApis,

        technologyUsage,

        difficulty,

        latestProject,
    };
};
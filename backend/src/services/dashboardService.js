import {
    getUserProjects,
} from "./projectService.js";


export const getDashboardAnalytics = (userId) => {

    if (!userId) {
        throw new Error(
            "User ID is required"
        );
    }

    const projects =
        getUserProjects(userId);

    const totalProjects =
        projects.length;

    const favoriteProjects =
        projects.filter(
            project => project.favorite === true
        ).length;

    const recentlyViewed =
        projects.filter(
            project => project.lastViewedAt
        ).length;

    const latestProject =
        projects.length > 0 ?
        [...projects].sort(
            (a, b) =>
            new Date(
                b.updatedAt ||
                b.createdAt
            ) -
            new Date(
                a.updatedAt ||
                a.createdAt
            )
        )[0] :
        null;

    const difficulty = {
        easy: 0,
        intermediate: 0,
        advanced: 0,
    };

    const technologyUsage = {};

    projects.forEach((project) => {

        const blueprint =
            project.project || {};

        const level =
            String(
                blueprint.difficulty ||
                project.difficulty ||
                "Intermediate"
            ).toLowerCase();

        if (level === "easy") {
            difficulty.easy++;
        } else if (
            level === "advanced" ||
            level === "hard"
        ) {
            difficulty.advanced++;
        } else {
            difficulty.intermediate++;
        }

        const techStack =
            Array.isArray(
                blueprint.techStack
            ) ?
            blueprint.techStack :
            [];

        techStack.forEach((tech) => {

            const name =
                String(tech).trim();

            if (!name) return;

            technologyUsage[name] =
                (technologyUsage[name] || 0) + 1;
        });
    });

    const mostUsedTech =
        Object.entries(
            technologyUsage
        )
        .sort(
            (a, b) => b[1] - a[1]
        )
        .slice(0, 5);

    return {

        totalProjects,

        favoriteProjects,

        recentlyViewed,

        latestProject,

        difficulty,

        mostUsedTech,
    };
};
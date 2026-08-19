import {
    getAllProjects,
} from "../services/projectService.js";

import {
    successResponse,
    errorResponse,
} from "../utils/apiResponse.js";

export const getAnalytics = (req, res) => {

    try {

        const projects = getAllProjects().filter(
            project => String(project.userId) === String(req.user.id)
        );

        const totalProjects = projects.length;

        const favoriteProjects = projects.filter(
            project => project.favorite === true
        ).length;

        const difficulty = {
            Beginner: 0,
            Intermediate: 0,
            Advanced: 0,
        };

        const techStack = {};

        projects.forEach(project => {

            const level = project.project?.difficulty;

            if (difficulty[level] !== undefined) {
                difficulty[level]++;
            }

            const techs = project.project?.techStack || [];

            if (Array.isArray(techs)) {

                techs.forEach(tech => {

                    techStack[tech] =
                        (techStack[tech] || 0) + 1;

                });

            }

        });

        return successResponse(

            res,

            {

                totalProjects,

                favoriteProjects,

                difficulty,

                techStack,

            },

            "Analytics fetched successfully"

        );

    } catch (error) {

        console.error(error);

        return errorResponse(

            res,

            "Server Error",

            500

        );

    }

};
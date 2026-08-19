import {
    saveProject,
    getUserProjects,
    getUserProjectById,
    findDuplicateProject,
    removeProject,
    updateProject,
    toggleFavorite,
    getFavoriteProjects,
    updateRecentlyViewed,
    getRecentlyViewedProjects,
    getProjectVersions,
    restoreProjectVersion,
    saveProjectVersion,
    getProjectHistory,
} from "../services/projectService.js";

import {
    successResponse,
    errorResponse,
} from "../utils/apiResponse.js";

/* =========================================================
   HELPER
   Get authenticated user ID safely
========================================================= */

const getUserId = (req) => {
    return req.user?.id || req.user?.userId || null;
};

/* =========================================================
   CREATE PROJECT
   POST /api/projects/save
========================================================= */
export const createProject = (req, res) => {

    try {

        const userId =
            req.user?.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const {
            idea,
            project,
        } = req.body;

        if (!idea ||
            typeof idea !== "string" ||
            !idea.trim()
        ) {
            return errorResponse(
                res,
                "Project idea is required",
                400
            );
        }

        if (!project ||
            typeof project !== "object"
        ) {
            return errorResponse(
                res,
                "Project blueprint is required",
                400
            );
        }

        const duplicate =
            findDuplicateProject(
                userId,
                idea.trim()
            );

        if (duplicate) {
            return errorResponse(
                res,
                "Project already saved.",
                409
            );
        }

        const newProject =
            saveProject({
                userId,

                idea: idea.trim(),

                project,
            });

        return successResponse(
            res,
            newProject,
            "Project saved successfully",
            201
        );

    } catch (error) {

        console.error(
            "CREATE PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to save project",
            500
        );
    }
};


/* =========================================================
   GET ALL PROJECTS FOR LOGGED-IN USER
   GET /api/projects/all
========================================================= */

export const fetchProjects = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const projects = getUserProjects(userId);

        return successResponse(
            res,
            projects,
            "Projects fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ FETCH PROJECTS ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch projects",
            500
        );
    }
};


/* =========================================================
   GET MY PROJECTS
   GET /api/projects/my-projects
========================================================= */

export const fetchMyProjects = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const projects = getUserProjects(userId);

        return successResponse(
            res,
            projects,
            "User projects fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ MY PROJECTS ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch user projects",
            500
        );
    }
};


/* =========================================================
   GET PROJECT BY ID
   GET /api/projects/:id
========================================================= */

export const getProjectById = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        if (!projectId) {
            return errorResponse(
                res,
                "Project ID is required",
                400
            );
        }

        const project = getUserProjectById(
            projectId,
            userId
        );

        if (!project) {
            return errorResponse(
                res,
                "Project not found",
                404
            );
        }

        /*
         * Update recently viewed timestamp.
         */
        updateRecentlyViewed(
            projectId,
            userId
        );

        const updatedProject =
            getUserProjectById(
                projectId,
                userId
            );

        return successResponse(
            res,
            updatedProject || project,
            "Project fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ GET PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch project",
            500
        );
    }
};


/* =========================================================
   DELETE PROJECT
   DELETE /api/projects/delete/:id
========================================================= */

export const deleteProject = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const project = getUserProjectById(
            projectId,
            userId
        );

        if (!project) {
            return errorResponse(
                res,
                "Project not found or access denied",
                404
            );
        }

        const deleted = removeProject(projectId);

        if (!deleted) {
            return errorResponse(
                res,
                "Unable to delete project",
                500
            );
        }

        return successResponse(
            res,
            null,
            "Project deleted successfully"
        );
    } catch (error) {
        console.error(
            "❌ DELETE PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to delete project",
            500
        );
    }
};


/* =========================================================
   UPDATE PROJECT
   PUT /api/projects/update/:id
========================================================= */

export const editProject = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        if (!projectId) {
            return errorResponse(
                res,
                "Project ID is required",
                400
            );
        }

        const existingProject =
            getUserProjectById(
                projectId,
                userId
            );

        if (!existingProject) {
            return errorResponse(
                res,
                "Project not found or access denied",
                404
            );
        }

        const updatedData = {
            ...req.body,
            userId,
        };

        const updated = updateProject(
            projectId,
            updatedData
        );

        if (!updated) {
            return errorResponse(
                res,
                "Project update failed",
                500
            );
        }

        return successResponse(
            res,
            updated,
            "Project updated successfully"
        );
    } catch (error) {
        console.error(
            "❌ UPDATE PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to update project",
            500
        );
    }
};


/* =========================================================
   SEARCH PROJECTS
   GET /api/projects/search
========================================================= */

export const searchProject = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const keyword =
            typeof req.query.keyword === "string" ?
            req.query.keyword.trim().toLowerCase() :
            "";

        const difficulty =
            typeof req.query.difficulty === "string" ?
            req.query.difficulty.trim().toLowerCase() :
            "";

        const projects = getUserProjects(userId);

        const filtered = projects.filter((project) => {
            const blueprint =
                project.project || {};

            const searchableText =
                JSON.stringify({
                    idea: project.idea,
                    overview: blueprint.overview,
                    goal: blueprint.goal,
                    industry: blueprint.industry,
                    targetUsers: blueprint.targetUsers,
                    features: blueprint.features,
                    techStack: blueprint.techStack,
                    apis: blueprint.apis,
                    database: blueprint.database,
                }).toLowerCase();

            const projectDifficulty =
                String(
                    blueprint.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase();

            const matchesKeyword = !keyword ||
                searchableText.includes(keyword);

            const matchesDifficulty = !difficulty ||
                projectDifficulty === difficulty;

            return (
                matchesKeyword &&
                matchesDifficulty
            );
        });

        return successResponse(
            res,
            filtered,
            "Projects searched successfully"
        );
    } catch (error) {
        console.error(
            "❌ SEARCH PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Project search failed",
            500
        );
    }
};


/* =========================================================
   PAGINATION
   GET /api/projects/page/list
========================================================= */

export const getPaginatedProjects = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(req.query.limit) || 6,
                1
            ),
            50
        );

        const projects = getUserProjects(userId);

        const startIndex =
            (page - 1) * limit;

        const paginatedProjects =
            projects.slice(
                startIndex,
                startIndex + limit
            );

        return successResponse(
            res, {
                projects: paginatedProjects,
                totalProjects: projects.length,
                currentPage: page,
                totalPages: Math.ceil(
                    projects.length / limit
                ),
            },
            "Projects fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ PAGINATION ERROR:",
            error
        );

        return errorResponse(
            res,
            "Pagination failed",
            500
        );
    }
};


/* =========================================================
   TOGGLE FAVORITE
   PATCH /api/projects/favorite/:id
========================================================= */

export const favoriteProject = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        if (!projectId) {
            return errorResponse(
                res,
                "Project ID is required",
                400
            );
        }

        const project = toggleFavorite(
            projectId,
            userId
        );

        if (!project) {
            return errorResponse(
                res,
                "Project not found",
                404
            );
        }

        return successResponse(
            res,
            project,
            project.favorite ?
            "Project added to favorites." :
            "Project removed from favorites."
        );
    } catch (error) {
        console.error(
            "❌ FAVORITE PROJECT ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to update favorite",
            500
        );
    }
};


/* =========================================================
   GET FAVORITES
   GET /api/projects/favorites
========================================================= */

export const fetchFavoriteProjects = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const favorites =
            getFavoriteProjects(userId);

        return successResponse(
            res,
            favorites,
            "Favorite projects fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ FAVORITES ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch favorites",
            500
        );
    }
};


/* =========================================================
   RECENTLY VIEWED
   GET /api/projects/recently-viewed
========================================================= */

export const getRecentlyViewed = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const projects =
            getRecentlyViewedProjects(
                userId
            );

        return successResponse(
            res,
            projects,
            "Recently viewed projects fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ RECENTLY VIEWED ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch recently viewed projects",
            500
        );
    }
};


/* =========================================================
   GET PROJECT VERSIONS
   GET /api/projects/versions/:id
========================================================= */

export const fetchProjectVersions = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const versions =
            getProjectVersions(
                projectId,
                userId
            );

        if (versions === null) {
            return errorResponse(
                res,
                "Project not found",
                404
            );
        }

        return successResponse(
            res,
            versions,
            "Project versions fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ PROJECT VERSIONS ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch project versions",
            500
        );
    }
};


/* =========================================================
   SAVE PROJECT VERSION
   POST /api/projects/versions/:id
========================================================= */

export const createProjectVersion = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const project =
            getUserProjectById(
                projectId,
                userId
            );

        if (!project) {
            return errorResponse(
                res,
                "Project not found",
                404
            );
        }

        const saved =
            saveProjectVersion(
                projectId
            );

        if (!saved) {
            return errorResponse(
                res,
                "Unable to save project version",
                500
            );
        }

        const versions =
            getProjectVersions(
                projectId,
                userId
            );

        return successResponse(
            res,
            versions,
            "Project version saved successfully"
        );
    } catch (error) {
        console.error(
            "❌ SAVE VERSION ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to save project version",
            500
        );
    }
};


/* =========================================================
   RESTORE VERSION
   POST /api/projects/restore/:id
========================================================= */

export const restoreVersion = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        const version =
            req.body?.version;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        if (
            version === undefined ||
            version === null ||
            version === ""
        ) {
            return errorResponse(
                res,
                "Version number is required",
                400
            );
        }

        const restored =
            restoreProjectVersion(
                projectId,
                version,
                userId
            );

        if (!restored) {
            return errorResponse(
                res,
                "Version not found",
                404
            );
        }

        return successResponse(
            res,
            restored,
            "Project restored successfully"
        );
    } catch (error) {
        console.error(
            "❌ RESTORE VERSION ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to restore project version",
            500
        );
    }
};


/* =========================================================
   PROJECT HISTORY
   GET /api/projects/history/:id
========================================================= */

export const fetchProjectHistory = (req, res) => {
    try {
        const userId = getUserId(req);
        const projectId = req.params.id;

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        const project =
            getUserProjectById(
                projectId,
                userId
            );

        if (!project) {
            return errorResponse(
                res,
                "Project not found",
                404
            );
        }

        const history =
            getProjectHistory(
                projectId
            );

        return successResponse(
            res,
            history || [],
            "Project history fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ PROJECT HISTORY ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch project history",
            500
        );
    }
};


/* =========================================================
   DASHBOARD ANALYTICS
   GET /api/projects/analytics/dashboard
========================================================= */

export const dashboardAnalytics = (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return errorResponse(
                res,
                "Authentication required",
                401
            );
        }

        /*
         * IMPORTANT:
         * Analytics are calculated only from
         * the authenticated user's projects.
         */

        const projects =
            getUserProjects(userId);

        const totalProjects =
            projects.length;

        const favoriteProjects =
            projects.filter(
                (project) =>
                project.favorite === true
            ).length;

        const recentlyViewed =
            projects.filter(
                (project) =>
                Boolean(project.lastViewedAt)
            ).length;

        const easy =
            projects.filter(
                (project) =>
                (
                    project.project?.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase() === "easy"
            ).length;

        const intermediate =
            projects.filter(
                (project) =>
                (
                    project.project?.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase() === "intermediate"
            ).length;

        const advanced =
            projects.filter(
                (project) =>
                (
                    project.project?.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase() === "advanced"
            ).length;

        const hard =
            projects.filter(
                (project) =>
                (
                    project.project?.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase() === "hard"
            ).length;

        const technologyUsage = {};

        projects.forEach((project) => {
            const techStack =
                project.project?.techStack || [];

            if (!Array.isArray(techStack)) {
                return;
            }

            techStack.forEach((technology) => {
                if (!technology) {
                    return;
                }

                const tech =
                    String(technology).trim();

                if (!tech) {
                    return;
                }

                technologyUsage[tech] =
                    (technologyUsage[tech] || 0) + 1;
            });
        });

        const mostUsedTech =
            Object.entries(
                technologyUsage
            )
            .sort(
                (a, b) =>
                b[1] - a[1]
            )
            .slice(0, 5);

        const totalFeatures =
            projects.reduce(
                (total, project) =>
                total +
                (
                    Array.isArray(
                        project.project?.features
                    ) ?
                    project.project.features.length :
                    0
                ),
                0
            );

        const totalApis =
            projects.reduce(
                (total, project) =>
                total +
                (
                    Array.isArray(
                        project.project?.apis
                    ) ?
                    project.project.apis.length :
                    0
                ),
                0
            );

        const latestProject =
            projects.length > 0 ? [...projects].sort(
                (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )[0] :
            null;

        return successResponse(
            res, {
                totalProjects,

                favoriteProjects,

                recentlyViewed,

                totalFeatures,

                totalApis,

                difficulty: {
                    easy,
                    intermediate,
                    advanced,
                    hard,
                },

                technologyUsage,

                mostUsedTech,

                latestProject,
            },
            "Dashboard analytics fetched successfully"
        );
    } catch (error) {
        console.error(
            "❌ DASHBOARD ANALYTICS ERROR:",
            error
        );

        return errorResponse(
            res,
            "Failed to fetch dashboard analytics",
            500
        );
    }
};
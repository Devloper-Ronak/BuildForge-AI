import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDirectory = path.join(
    process.cwd(),
    "src",
    "data"
);

const filePath = path.join(
    dataDirectory,
    "projects.json"
);

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
        recursive: true,
    });
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
        filePath,
        "[]",
        "utf-8"
    );
}

// ==========================================
// INTERNAL HELPERS
// ==========================================

const readProjects = () => {
    try {
        const data = fs.readFileSync(
            filePath,
            "utf-8"
        );

        if (!data.trim()) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed) ?
            parsed :
            [];
    } catch (error) {
        console.error(
            "❌ Failed to read projects.json:",
            error.message
        );

        return [];
    }
};

const writeProjects = (projects) => {
    fs.writeFileSync(
        filePath,
        JSON.stringify(projects, null, 2),
        "utf-8"
    );
};

// ==========================================
// GET ALL PROJECTS
// ==========================================

export const getAllProjects = () => {
    return readProjects();
};

// ==========================================
// GET USER PROJECTS
// ==========================================

export const getUserProjects = (userId) => {
    if (!userId) {
        return [];
    }

    return readProjects()
        .filter(
            (project) =>
            String(project.userId) ===
            String(userId)
        )
        .sort(
            (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
};

// ==========================================
// FIND PROJECT BY ID
// ==========================================

export const findProjectById = (id) => {
    if (!id) {
        return null;
    }

    return readProjects().find(
        (project) =>
        String(project.id) ===
        String(id)
    ) || null;
};

// ==========================================
// FIND USER PROJECT BY ID
// ==========================================

export const getUserProjectById = (
    projectId,
    userId
) => {
    if (!projectId || !userId) {
        return null;
    }

    return readProjects().find(
        (project) =>
        String(project.id) ===
        String(projectId) &&
        String(project.userId) ===
        String(userId)
    ) || null;
};

// ==========================================
// FIND USER PROJECT
// Alias for compatibility
// ==========================================

export const findUserProject = (
    projectId,
    userId
) => {
    return getUserProjectById(
        projectId,
        userId
    );
};

// ==========================================
// CHECK DUPLICATE PROJECT
// ==========================================

export const isDuplicateProject = (
    userId,
    idea
) => {
    if (!userId || !idea) {
        return null;
    }

    const normalizedIdea =
        String(idea)
        .trim()
        .toLowerCase();

    return readProjects().find(
        (project) =>
        String(project.userId) ===
        String(userId) &&
        String(project.idea || "")
        .trim()
        .toLowerCase() ===
        normalizedIdea
    ) || null;
};

// ==========================================
// DUPLICATE PROJECT ALIAS
// ==========================================

export const findDuplicateProject = (
    userId,
    idea
) => {
    return isDuplicateProject(
        userId,
        idea
    );
};

// ==========================================
// SAVE PROJECT
// ==========================================

export const saveProject = (projectData) => {
    if (!projectData) {
        throw new Error(
            "Project data is required"
        );
    }

    const projects = readProjects();

    const project =
        projectData.project || {};

    const newProject = {
        id: crypto.randomUUID(),

        userId: projectData.userId,

        idea: projectData.idea || "",

        project,

        difficulty: project.difficulty ||
            projectData.difficulty ||
            "Intermediate",

        duration: project.duration ||
            projectData.duration ||
            "Not specified",

        favorite: false,

        favoriteAt: null,

        lastViewedAt: null,

        createdAt: new Date().toISOString(),

        updatedAt: null,

        history: [],

        versions: [],
    };

    projects.push(newProject);

    writeProjects(projects);

    return newProject;
};

// ==========================================
// UPDATE PROJECT
// ==========================================

export const updateProject = (
    id,
    updatedData
) => {
    const projects = readProjects();

    const index = projects.findIndex(
        (project) =>
        String(project.id) ===
        String(id)
    );

    if (index === -1) {
        return null;
    }

    const currentProject =
        projects[index];

    if (!currentProject.history) {
        currentProject.history = [];
    }

    // Save old version in history
    currentProject.history.push({
        savedAt: new Date().toISOString(),

        data: {
            idea: currentProject.idea,

            project: currentProject.project,
        },
    });

    projects[index] = {
        ...currentProject,

        ...updatedData,

        updatedAt: new Date().toISOString(),

        history: currentProject.history,

        versions: currentProject.versions || [],
    };

    writeProjects(projects);

    return projects[index];
};

// ==========================================
// DELETE PROJECT
// ==========================================

export const removeProject = (
    id,
    userId = null
) => {
    const projects = readProjects();

    const originalLength =
        projects.length;

    const updatedProjects =
        projects.filter((project) => {

            const sameId =
                String(project.id) ===
                String(id);

            if (!sameId) {
                return true;
            }

            if (!userId) {
                return false;
            }

            return (
                String(project.userId) !==
                String(userId)
            );
        });

    if (
        updatedProjects.length ===
        originalLength
    ) {
        return false;
    }

    writeProjects(
        updatedProjects
    );

    return true;
};

// ==========================================
// SEARCH PROJECTS
// ==========================================

export const searchProjects = (
    keyword = "",
    difficulty = "",
    userId = null
) => {
    let projects = readProjects();

    if (userId) {
        projects =
            projects.filter(
                (project) =>
                String(
                    project.userId
                ) === String(userId)
            );
    }

    const search =
        String(keyword || "")
        .trim()
        .toLowerCase();

    const difficultySearch =
        String(difficulty || "")
        .trim()
        .toLowerCase();

    return projects.filter(
        (project) => {

            const projectData =
                project.project || {};

            const projectIdea =
                String(
                    project.idea || ""
                ).toLowerCase();

            const overview =
                String(
                    projectData.overview ||
                    ""
                ).toLowerCase();

            const goal =
                String(
                    projectData.goal ||
                    ""
                ).toLowerCase();

            const industry =
                String(
                    projectData.industry ||
                    ""
                ).toLowerCase();

            const targetUsers =
                String(
                    projectData.targetUsers ||
                    ""
                ).toLowerCase();

            const features =
                JSON.stringify(
                    projectData.features || []
                ).toLowerCase();

            const projectDifficulty =
                String(
                    projectData.difficulty ||
                    project.difficulty ||
                    ""
                ).toLowerCase();

            const matchesKeyword = !search ||
                projectIdea.includes(
                    search
                ) ||
                overview.includes(
                    search
                ) ||
                goal.includes(
                    search
                ) ||
                industry.includes(
                    search
                ) ||
                targetUsers.includes(
                    search
                ) ||
                features.includes(
                    search
                );

            const matchesDifficulty = !difficultySearch ||
                projectDifficulty ===
                difficultySearch;

            return (
                matchesKeyword &&
                matchesDifficulty
            );
        }
    );
};

// ==========================================
// PAGINATION
// ==========================================

export const getProjectsWithPagination = (
    page = 1,
    limit = 6,
    userId = null
) => {
    let projects = readProjects();

    if (userId) {
        projects =
            projects.filter(
                (project) =>
                String(
                    project.userId
                ) === String(userId)
            );
    }

    projects.sort(
        (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    const safePage =
        Math.max(
            Number(page) || 1,
            1
        );

    const safeLimit =
        Math.max(
            Number(limit) || 6,
            1
        );

    const startIndex =
        (safePage - 1) *
        safeLimit;

    const paginatedProjects =
        projects.slice(
            startIndex,
            startIndex +
            safeLimit
        );

    return {
        projects: paginatedProjects,

        totalProjects: projects.length,

        currentPage: safePage,

        totalPages: Math.ceil(
            projects.length /
            safeLimit
        ),
    };
};

// ==========================================
// TOGGLE FAVORITE
// ==========================================

export const toggleFavorite = (
    projectId,
    userId
) => {
    const projects = readProjects();

    const index =
        projects.findIndex(
            (project) =>
            String(
                project.id
            ) === String(projectId) &&
            String(
                project.userId
            ) === String(userId)
        );

    if (index === -1) {
        return null;
    }

    const project =
        projects[index];

    project.favorite = !Boolean(
        project.favorite
    );

    project.favoriteAt =
        project.favorite ?
        new Date().toISOString() :
        null;

    project.updatedAt =
        new Date().toISOString();

    writeProjects(projects);

    return project;
};

// ==========================================
// GET FAVORITE PROJECTS
// ==========================================

export const getFavoriteProjects = (
    userId
) => {
    return getUserProjects(
        userId
    ).filter(
        (project) =>
        project.favorite === true
    );
};

// ==========================================
// UPDATE RECENTLY VIEWED
// ==========================================

export const updateRecentlyViewed = (
    projectId,
    userId
) => {
    const projects = readProjects();

    const index =
        projects.findIndex(
            (project) =>
            String(
                project.id
            ) === String(projectId) &&
            String(
                project.userId
            ) === String(userId)
        );

    if (index === -1) {
        return null;
    }

    projects[index].lastViewedAt =
        new Date().toISOString();

    writeProjects(projects);

    return projects[index];
};

// ==========================================
// GET RECENTLY VIEWED
// ==========================================

export const getRecentlyViewedProjects = (
    userId
) => {
    return getUserProjects(
            userId
        )
        .filter(
            (project) =>
            project.lastViewedAt
        )
        .sort(
            (a, b) =>
            new Date(
                b.lastViewedAt
            ) -
            new Date(
                a.lastViewedAt
            )
        )
        .slice(0, 10);
};

// ==========================================
// SAVE VERSION
// ==========================================

export const saveProjectVersion = (
    id,
    userId = null
) => {
    const projects = readProjects();

    const index =
        projects.findIndex(
            (project) => {

                const sameId =
                    String(
                        project.id
                    ) === String(id);

                if (!sameId) {
                    return false;
                }

                if (!userId) {
                    return true;
                }

                return (
                    String(
                        project.userId
                    ) === String(userId)
                );
            }
        );

    if (index === -1) {
        return false;
    }

    if (!projects[index].versions) {
        projects[index].versions = [];
    }

    projects[index].versions.push({
        version: projects[index]
            .versions.length + 1,

        savedAt: new Date().toISOString(),

        project: JSON.parse(
            JSON.stringify(
                projects[index]
                .project
            )
        ),
    });

    projects[index].updatedAt =
        new Date().toISOString();

    writeProjects(projects);

    return true;
};

// ==========================================
// GET VERSION HISTORY
// ==========================================

export const getProjectVersions = (
    id,
    userId
) => {
    const project =
        getUserProjectById(
            id,
            userId
        );

    if (!project) {
        return null;
    }

    return project.versions || [];
};

// ==========================================
// RESTORE VERSION
// ==========================================

export const restoreProjectVersion = (
    id,
    versionNumber,
    userId
) => {
    const projects = readProjects();

    const index =
        projects.findIndex(
            (project) =>
            String(
                project.id
            ) === String(id) &&
            String(
                project.userId
            ) === String(userId)
        );

    if (index === -1) {
        return null;
    }

    const version =
        (
            projects[index]
            .versions || []
        ).find(
            (item) =>
            Number(
                item.version
            ) ===
            Number(
                versionNumber
            )
        );

    if (!version) {
        return null;
    }

    // Save current version before restoring
    if (!projects[index].history) {
        projects[index].history = [];
    }

    projects[index].history.push({
        savedAt: new Date().toISOString(),

        data: {
            idea: projects[index].idea,

            project: projects[index].project,
        },
    });

    projects[index].project =
        JSON.parse(
            JSON.stringify(
                version.project
            )
        );

    projects[index].updatedAt =
        new Date().toISOString();

    writeProjects(projects);

    return projects[index];
};

// ==========================================
// PROJECT HISTORY
// ==========================================

export const getProjectHistory = (
    id,
    userId = null
) => {
    const project = userId ?
        getUserProjectById(
            id,
            userId
        ) :
        findProjectById(id);

    if (!project) {
        return null;
    }

    return project.history || [];
};

// ==========================================
// PROJECT STATS
// ==========================================

export const getProjectStats = (
    userId = null
) => {
    const projects = userId ?
        getUserProjects(userId) :
        readProjects();

    const totalProjects =
        projects.length;

    const oneWeekAgo =
        new Date();

    oneWeekAgo.setDate(
        oneWeekAgo.getDate() - 7
    );

    const projectsThisWeek =
        projects.filter(
            (project) =>
            new Date(
                project.createdAt
            ) >= oneWeekAgo
        ).length;

    const difficulty = {
        Easy: 0,
        Intermediate: 0,
        Advanced: 0,
        Hard: 0,
    };

    const techUsage = {};

    projects.forEach(
        (project) => {

            const projectData =
                project.project || {};

            const level =
                projectData.difficulty ||
                project.difficulty ||
                "Intermediate";

            if (
                difficulty[level] !==
                undefined
            ) {
                difficulty[level]++;
            }

            (
                projectData.techStack || []
            ).forEach(
                (tech) => {
                    techUsage[tech] =
                        (
                            techUsage[tech] ||
                            0
                        ) + 1;
                }
            );
        }
    );

    const mostUsedTech =
        Object.entries(
            techUsage
        )
        .sort(
            (a, b) =>
            b[1] - a[1]
        )
        .slice(0, 5);

    return {
        totalProjects,

        projectsThisWeek,

        aiBlueprints: totalProjects,

        difficulty,

        mostUsedTech,
    };
};
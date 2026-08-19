import express from "express";

import {
    projectValidator,
    validate,
} from "../middleware/validators.js";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createProject,
    fetchProjects,
    fetchMyProjects,
    getProjectById,
    deleteProject,
    editProject,
    searchProject,
    getPaginatedProjects,
    favoriteProject,
    fetchFavoriteProjects,
    getRecentlyViewed,
    fetchProjectHistory,
    fetchProjectVersions,
    restoreVersion,
    dashboardAnalytics,
} from "../controllers/projectController.js";

import {
    exportProjectJSON,
    exportProjectPDF,
    exportDirectPDF,
} from "../controllers/exportController.js";

const router = express.Router();

console.log("📦 projectRoutes Loaded");

/*
=========================================================
TEST
=========================================================
*/

router.get(
    "/test",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Project Routes Working",
        });
    }
);


/*
=========================================================
CREATE / SAVE PROJECT
=========================================================
*/

router.post(
    "/save",
    authMiddleware,
    projectValidator,
    validate,
    createProject
);


/*
=========================================================
GET ALL PROJECTS
=========================================================
*/

router.get(
    "/all",
    authMiddleware,
    fetchProjects
);


/*
=========================================================
GET LOGGED-IN USER PROJECTS
=========================================================
*/

router.get(
    "/my-projects",
    authMiddleware,
    fetchMyProjects
);


/*
=========================================================
SEARCH PROJECTS
=========================================================
*/

router.get(
    "/search",
    searchProject
);


/*
=========================================================
PAGINATED PROJECTS
=========================================================
*/

router.get(
    "/page/list",
    getPaginatedProjects
);


/*
=========================================================
FAVORITE / UNFAVORITE PROJECT
=========================================================
*/

router.patch(
    "/favorite/:id",
    authMiddleware,
    favoriteProject
);


/*
=========================================================
GET FAVORITE PROJECTS
=========================================================
*/

router.get(
    "/favorites",
    authMiddleware,
    fetchFavoriteProjects
);


/*
=========================================================
GET RECENTLY VIEWED PROJECTS
=========================================================
*/

router.get(
    "/recently-viewed",
    authMiddleware,
    getRecentlyViewed
);


/*
=========================================================
DASHBOARD ANALYTICS
=========================================================
*/

router.get(
    "/analytics/dashboard",
    authMiddleware,
    dashboardAnalytics
);


/*
=========================================================
PROJECT VERSION HISTORY
=========================================================
*/

router.get(
    "/versions/:id",
    authMiddleware,
    fetchProjectVersions
);

router.post(
    "/restore/:id",
    authMiddleware,
    restoreVersion
);


/*
=========================================================
PROJECT HISTORY
=========================================================
*/

router.get(
    "/history/:id",
    authMiddleware,
    fetchProjectHistory
);


/*
=========================================================
EXPORT PROJECT
=========================================================
*/

router.get(
    "/export/:id",
    authMiddleware,
    exportProjectPDF
);

router.post(
    "/export-pdf",
    authMiddleware,
    exportDirectPDF
);

router.get(
    "/export-json/:id",
    authMiddleware,
    exportProjectJSON
);


/*
=========================================================
GET PROJECT BY ID
=========================================================
*/

router.get(
    "/:id",
    authMiddleware,
    getProjectById
);


/*
=========================================================
UPDATE PROJECT
=========================================================
*/

router.put(
    "/update/:id",
    authMiddleware,
    editProject
);


/*
=========================================================
DELETE PROJECT
=========================================================
*/

router.delete(
    "/delete/:id",
    authMiddleware,
    deleteProject
);

export default router;
import {
    getDashboardAnalytics,
} from "../services/dashboardService.js";


/* =========================================================
   GET USER DASHBOARD
========================================================= */

export const getDashboard = (req, res) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const dashboard =
            getDashboardAnalytics(userId);

        return res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message ||
                "Unable to load dashboard",
        });
    }
};
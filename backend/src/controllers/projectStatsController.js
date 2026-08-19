import {
    getProjectStatistics,
} from "../services/projectStatsService.js";


/* =========================================================
   GET PROJECT STATISTICS
========================================================= */

export const getProjectStats = (req, res) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const stats =
            getProjectStatistics(userId);

        return res.status(200).json({
            success: true,
            data: stats,
        });

    } catch (error) {

        console.error(
            "PROJECT STATISTICS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message ||
                "Unable to load statistics",
        });
    }
};
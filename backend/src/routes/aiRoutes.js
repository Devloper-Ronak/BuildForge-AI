import express from "express";

import {
    createBlueprint,
} from "../controllers/aiController.js";

import {
    aiValidator,
    validate,
} from "../middleware/validators.js";

const router = express.Router();

router.post(
    "/generate",
    aiValidator,
    validate,
    createBlueprint
);

router.get(
    "/test",
    (req, res) => {

        return res.status(200).json({
            success: true,
            message: "AI routes are working.",
        });

    }
);

export default router;
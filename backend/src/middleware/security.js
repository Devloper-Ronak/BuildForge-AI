import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";

export const securityMiddleware = (app) => {
    app.use(
        helmet({
            crossOriginResourcePolicy: false,
        })
    );

    app.use(
        compression()
    );

    app.use(
        hpp()
    );

    app.use(
        express.json({
            limit: "50mb",
        })
    );

    app.use(
        express.urlencoded({
            extended: true,
            limit: "50mb",
        })
    );

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 500,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many requests. Please try again later.",
        },
    });

    app.use(limiter);
};
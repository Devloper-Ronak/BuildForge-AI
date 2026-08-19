export const healthCheck = (req, res) => {

    return res.status(200).json({

        success: true,

        service: "BuildForge AI Backend",

        version: "1.0.0",

        status: "Running",

        uptime: process.uptime(),

        timestamp: new Date().toISOString(),

        environment: process.env.NODE_ENV || "development",

    });

};
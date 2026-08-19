export const validateProject = (
    req,
    res,
    next
) => {
    const { idea, project } = req.body;

    if (
        typeof idea !== "string" ||
        !idea.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Project idea is required.",
        });
    }

    if (!project ||
        typeof project !== "object" ||
        Array.isArray(project)
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid project blueprint is required.",
        });
    }

    next();
};
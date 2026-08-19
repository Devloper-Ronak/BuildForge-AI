export const logger = (
    req,
    res,
    next
) => {
    const currentTime =
        new Date().toISOString();

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    console.log(
        "📅",
        currentTime
    );

    console.log(
        "📨",
        req.method
    );

    console.log(
        "🌐",
        req.originalUrl
    );

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

    next();
};
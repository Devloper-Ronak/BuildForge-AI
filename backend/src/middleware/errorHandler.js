const errorHandler = (
    err,
    req,
    res,
    next
) => {
    console.error(
        "❌ SERVER ERROR:",
        err
    );

    const statusCode =
        err.statusCode || 500;

    const message =
        statusCode === 500 ?
        "Internal Server Error." :
        err.message;

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;
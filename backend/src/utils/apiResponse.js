export const successResponse = (
    res,
    arg1 = null,
    arg2 = null,
    statusCode = 200
) => {
    let message = "Success";
    let data = null;

    if (typeof arg1 === "string") {
        message = arg1;
        data = arg2;
    } else {
        data = arg1;
        message = typeof arg2 === "string" ? arg2 : "Success";
    }

    if (typeof arg2 === "number") {
        statusCode = arg2;
    }

    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    });
};

export const errorResponse = (
    res,
    message = "Internal Server Error",
    statusCode = 500,
    errors = null
) => {
    if (typeof message === "number") {
        const temp = message;
        message = typeof statusCode === "string" ? statusCode : "An error occurred";
        statusCode = temp;
    }

    return res.status(statusCode).json({
        success: false,
        message: typeof message === "string" ? message : "An error occurred",
        ...(errors ? { errors } : {}),
        timestamp: new Date().toISOString(),
    });
};

export default {
    successResponse,
    errorResponse,
};
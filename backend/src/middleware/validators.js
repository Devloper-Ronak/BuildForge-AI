import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg || "Validation failed.",
            errors: errors.array(),
        });
    }

    next();
};

export const signupValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character."),
];

export const loginValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),
];

export const resetPasswordValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character."),
];

export const aiValidator = [
    body("projectIdea")
        .trim()
        .notEmpty()
        .withMessage("Project idea is required.")
        .isLength({ min: 2, max: 2000 })
        .withMessage("Project idea must be between 2 and 2000 characters."),

    body("techStack").optional(),
    body("difficulty").optional(),
];

export const projectValidator = [
    body("idea")
        .trim()
        .notEmpty()
        .withMessage("Project idea is required."),

    body("project")
        .notEmpty()
        .withMessage("Project blueprint is required."),
];
import jwt from "jsonwebtoken";

const DEFAULT_GUEST_USER = {
    id: "builder-default",
    name: "Builder",
    email: "builder@buildforge.ai",
};

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7).trim();

            if (token && token !== "guest-token" && process.env.JWT_SECRET) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = decoded.id || decoded.userId || decoded._id;

                    if (userId) {
                        req.user = {
                            ...decoded,
                            id: userId,
                        };
                        return next();
                    }
                } catch {
                    // Fall back to default user
                }
            }
        }

        // Open access: attach default guest user so all APIs work seamlessly
        req.user = DEFAULT_GUEST_USER;
        return next();
    } catch (error) {
        req.user = DEFAULT_GUEST_USER;
        return next();
    }
};

export default authMiddleware;
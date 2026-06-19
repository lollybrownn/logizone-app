const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT from the Authorization header (Bearer token).
 * Attaches the decoded payload ({ id, role }) to req.user.
 */
function authenticate(req, res, next) {
    try {
        const header = req.headers["authorization"];
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

/**
 * Restricts a route to a given set of roles.
 * Usage: authorize("Owner"), authorize("Owner", "Staff Gudang")
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
}

module.exports = { authenticate, authorize };
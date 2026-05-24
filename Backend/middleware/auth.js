const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — verifies JWT on every protected route.
 * Attaches req.user (without password) if valid.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized — no token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "Not authorized — account not found" });
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized — token invalid or expired" });
  }
};

/**
 * authorize(...roles) — role-based access control.
 * Call after protect(). Rejects if req.user.role not in allowed list.
 *
 * Examples:
 *   authorize("admin")                    — admin only
 *   authorize("admin", "doctor")          — admin or doctor
 *   authorize("admin", "receptionist")    — admin or receptionist
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({
        message: `Access denied — '${req.user.role}' role is not permitted to access this resource`,
      });

    next();
  };
};

module.exports = { protect, authorize };
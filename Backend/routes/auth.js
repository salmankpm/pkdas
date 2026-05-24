const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ─────────────────────────────────────────────────────────────
// POST /auth/login
// Public — all roles use this single login endpoint
// ─────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty || null,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /auth/signup
// ADMIN ONLY — creates doctor or receptionist accounts
// Doctors and receptionists have NO access to this endpoint
// ─────────────────────────────────────────────────────────────
router.post("/signup", protect, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Name, email, password and role are all required" });

    // Admin can only create doctor or receptionist — never another admin
    if (!["doctor", "receptionist"].includes(role))
      return res.status(403).json({
        message: "Forbidden: admin can only create doctor or receptionist accounts",
      });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "An account with this email already exists" });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      specialty: role === "doctor" ? specialty : undefined,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /auth/users
// ADMIN/RECEPTIONIST — list all doctors and receptionists
// ─────────────────────────────────────────────────────────────
router.get("/users", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /auth/users/:id
// ADMIN ONLY — edit a staff account
// ─────────────────────────────────────────────────────────────
router.put("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent editing another admin
    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot edit admin accounts" });

    user.name      = req.body.name      || user.name;
    user.email     = req.body.email     ? req.body.email.toLowerCase() : user.email;
    user.specialty = req.body.specialty !== undefined ? req.body.specialty : user.specialty;

    if (req.body.password && req.body.password.trim() !== "") {
      user.password = req.body.password; // pre-save hook re-hashes it
    }

    await user.save();
    res.json({ message: "Staff account updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /auth/users/:id
// ADMIN ONLY — delete a staff account
// ─────────────────────────────────────────────────────────────
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot delete admin accounts" });

    await user.deleteOne();
    res.json({ message: "Staff account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /auth/me  — any logged-in user
// ─────────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
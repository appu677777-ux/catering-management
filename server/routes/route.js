const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/userModel");


// 🔐 Helper: combine middlewares
const protect = (...roles) => [
  authMiddleware,
  roleMiddleware(...roles)
];


// ==============================
// 🔑 AUTH ROUTES
// ==============================
router.post("/login", login);

router.post(
  "/register",
  ...protect("admin"),
  register
);


// ==============================
// 🔒 ROLE TEST ROUTES (OPTIONAL)
// ==============================
router.get("/admin", ...protect("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/captain", ...protect("admin", "captain"), (req, res) => {
  res.json({ message: "Welcome Captain/Admin" });
});

router.get("/user", ...protect("admin", "captain", "user"), (req, res) => {
  res.json({ message: "Welcome User" });
});

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user
  });
});


// ==============================
// 👥 USER MANAGEMENT (ADMIN)
// ==============================

// GET all users
router.get("/users", ...protect("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user role
router.patch("/users/:id/role", ...protect("admin"), async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
router.delete("/users/:id", ...protect("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
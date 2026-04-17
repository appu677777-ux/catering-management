const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/userModel");

// Admin only
router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

// Captain + Admin
router.get("/captain", authMiddleware, roleMiddleware("admin", "captain"), (req, res) => {
  res.json({ message: "Welcome Captain/Admin" });
});

// User (all roles can access)
router.get("/user", authMiddleware, roleMiddleware("admin", "captain", "user"), (req, res) => {
  res.json({ message: "Welcome User" });
});

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user
  });
});
// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/register",
  authMiddleware,
  roleMiddleware("admin"),
  register
);
router.post("/login", login); //

module.exports = router;
const express = require("express");
const router = express.Router();

const {createEvent,getEvents,updateEvent,deleteEvent} = require("../controllers/eventController");
const {getAdminDashboard,getCaptainDashboard,getUserDashboard} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Only Admin can create
router.post("/", authMiddleware, roleMiddleware("admin"), createEvent);

// All logged users can view
router.get("/", authMiddleware, getEvents);

// Admin only update/delete
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateEvent);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEvent);

// Admin Dashboard
router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminDashboard
);

// Captain Dashboard
router.get(
  "/captain/dashboard",
  authMiddleware,
  roleMiddleware("captain"),
  getCaptainDashboard
);

// User Dashboard
router.get(
  "/user/dashboard",
  authMiddleware,
  roleMiddleware("user"),
  getUserDashboard
);

module.exports = router;
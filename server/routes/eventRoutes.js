const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getAdminDashboard,
  getCaptainDashboard,
  getUserDashboard,
  updateDeliveryStatus,
  updateReturnStatus,
  updateEventPayment,
  getAvailableEvents,
  bookEvent,
  removeUserFromEvent
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/multerMiddleware");


// 🔐 Helper middleware
const protect = (...roles) => [
  authMiddleware,
  roleMiddleware(...roles)
];


// ==============================
// 🎉 EVENT CRUD (ADMIN)
// ==============================

// CREATE EVENT (with images)
router.post(
  "/",
  ...protect("admin"),
  upload.fields([
    { name: "eventImages", maxCount: 5 },
    { name: "rentalImages", maxCount: 10 }
  ]),
  createEvent
);

// UPDATE EVENT
router.put("/:id", ...protect("admin"), updateEvent);

// DELETE EVENT
router.delete("/:id", ...protect("admin"), deleteEvent);


// ==============================
// 📦 EVENT STATUS (CAPTAIN)
// ==============================

// DELIVERY STATUS
router.patch("/:id/delivery", ...protect("captain"), updateDeliveryStatus);

// RETURN STATUS
router.patch("/:id/return", ...protect("captain"), updateReturnStatus);


// ==============================
// 📊 DASHBOARDS
// ==============================

// ADMIN DASHBOARD
router.get("/admin/dashboard", ...protect("admin"), getAdminDashboard);

// CAPTAIN DASHBOARD
router.get("/captain/dashboard", ...protect("captain"), getCaptainDashboard);

// USER DASHBOARD
router.get("/user/dashboard", ...protect("user"), getUserDashboard);


// ==============================
// 💰 PAYMENTS (ADMIN)
// ==============================

router.put("/:id/payment", ...protect("admin"), updateEventPayment);


// ==============================
// 📄 COMMON (ALL AUTH USERS)
// ==============================

// GET ALL EVENTS
router.get("/", authMiddleware, getEvents);

//book events 
router.get(
  "/available",
  authMiddleware,
  roleMiddleware("captain", "user"),
  getAvailableEvents
);

router.patch(
  "/:id/book",
  authMiddleware,
  roleMiddleware("captain", "user"),
  bookEvent
);

router.patch(
  "/:id/remove-user",
  authMiddleware,
  roleMiddleware("admin"),
  removeUserFromEvent
);


module.exports = router;
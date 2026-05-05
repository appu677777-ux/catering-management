const Event = require("../models/Event");
const User = require("../models/userModel");

const mongoose = require("mongoose");

exports.createEvent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const data = req.body || {};

    // =====================
    // SAFE CAPTAINS
    // =====================
    let captainsArray = [];

    if (data.captains) {
      captainsArray = Array.isArray(data.captains)
        ? data.captains
        : [data.captains];
    }

    captainsArray = captainsArray.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    // =====================
    // SAFE STAFF
    // =====================
    let staffArray = [];

    if (data.staff) {
      staffArray = Array.isArray(data.staff)
        ? data.staff
        : [data.staff];
    }

    staffArray = staffArray.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    // =====================
    // SAFE MENU
    // =====================
    let parsedMenu = [];

    if (data.menu) {
      try {
        parsedMenu =
          typeof data.menu === "string"
            ? JSON.parse(data.menu)
            : data.menu;

        parsedMenu = parsedMenu.map(item => ({
          name: item.name,
          price: Number(item.price)
        }));
      } catch (err) {
        console.log("Menu parse error:", err);
      }
    }

    // =====================
    // FILES SAFE ACCESS
    // =====================
    const files = req.files || {};
    const eventImages = files["eventImages"] || [];
    const rentalImages = files["rentalImages"] || [];

    // =====================
    // EVENT IMAGES
    // =====================
    const images = eventImages.map(file => file.filename);

    // =====================
    // RENTAL ITEMS
    // =====================
    let rentalItems = [];

    if (data.rentalItems) {
      try {
        const parsedRental =
          typeof data.rentalItems === "string"
            ? JSON.parse(data.rentalItems)
            : data.rentalItems;

        rentalItems = (parsedRental || []).map((item, index) => ({
          name: item?.name || "",
          quantity: Number(item?.quantity || 0),

          // ✅ FIXED: use rentalImages (NOT req.files[index])
          image: rentalImages[index]?.filename || "",

          deliveryStatus: "pending",
          returnStatus: "pending"
        }));

      } catch (err) {
        console.log("Rental parse error:", err);
      }
    }

    // =====================
    // FETCH USERS
    // =====================
    const captains = await User.find({ _id: { $in: captainsArray } });
    const staff = await User.find({ _id: { $in: staffArray } });



    // 👇 MUST BE HERE
    const totalCost = Number(data.totalCost || 0);

    const captainShare = 800;
    const staffShare = 450;

    const perCaptain = captainShare;
    const perStaff = staffShare;
    // =====================
    // COST DISTRIBUTION
    // =====================
    const costDistribution = {
      captain: {
        share: captainShare,
        bonus: null,
        fine: null,
        amountReceived: null,
        due: captainShare
      },
      staff: {
        share: staffShare,
        bonus: null,
        fine: null,
        amountReceived: null,
        due: staffShare
      }
    };

    // =====================
    // CREATE EVENT
    // =====================
    const event = new Event({
      title: data.title,
      type: data.type,
      location: data.location,
      totalPeople: Number(data.totalPeople || 0),
      totalCost,
      menu: parsedMenu,
      captains: captainsArray,
      staff: staffArray,
      images,
      rentalItems, // ✅ added properly

      costDistribution: {
        captainShare,
        staffShare
      },
      earnings: {
        perCaptain,
        perStaff
      }
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.log("🔥 FINAL ERROR:", error);
    res.status(500).json({
      error: error.message
    });
  }
};
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("captains", "name email")
      .populate("staff", "name email");

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("captains", "name email") // 👈 ADD
      .populate("staff", "name email")     // 👈 ADD
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCaptainDashboard = async (req, res) => {
  try {
    const events = await Event.find({
      captains: req.user.id
    })
      .populate("staff", "name email");

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const events = await Event.find({
      staff: req.user.id
    });

    // Add earnings info
    const data = events.map(event => ({
      eventId: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      earning: event.earnings?.perStaff || 0,
      status: event.status
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { index } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.rentalItems[index].deliveryStatus = "delivered";

    await event.save();

    res.json({ message: "Delivery updated", event });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { index } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.rentalItems[index].returnStatus = "returned";

    await event.save();

    res.json({ message: "Return updated", event });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateEventPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { staff, captain } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔧 Update STAFF (if provided)
    if (staff) {
      const s = event.costDistribution.staff;

      s.share = staff.share ?? s.share;
      s.bonus = staff.bonus ?? s.bonus;
      s.fine = staff.fine ?? s.fine;
      s.amountReceived = staff.amountReceived ?? s.amountReceived;

      const share = s.share || 0;
      const bonus = s.bonus || 0;
      const fine = s.fine || 0;
      const received = s.amountReceived || 0;

      s.due = share + bonus - fine - received;
    }

    // 🔧 Update CAPTAIN (optional support)
    if (captain) {
      const c = event.costDistribution.captain;

      c.share = captain.share ?? c.share;
      c.bonus = captain.bonus ?? c.bonus;
      c.fine = captain.fine ?? c.fine;
      c.amountReceived = captain.amountReceived ?? c.amountReceived;

      const share = c.share || 0;
      const bonus = c.bonus || 0;
      const fine = c.fine || 0;
      const received = c.amountReceived || 0;

      c.due = share + bonus - fine - received;
    }

    await event.save();

    res.json({
      message: "Payment updated successfully",
      event
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
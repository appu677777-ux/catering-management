const Event = require("../models/Event");
const User = require("../models/userModel");

// CREATE EVENT WITH ASSIGN LOGIC
exports.createEvent = async (req, res) => {
  try {
    const data = req.body;

    // 🔍 Fetch users
    const captains = await User.find({ _id: { $in: data.captains } });
    const staff = await User.find({ _id: { $in: data.staff } });

    // 🛑 Validate roles
    const invalidCaptain = captains.find(u => u.role !== "captain");
    if (invalidCaptain) {
      return res.status(400).json({ message: "Invalid captain selected" });
    }

    const invalidStaff = staff.find(u => u.role !== "user");
    if (invalidStaff) {
      return res.status(400).json({ message: "Invalid staff selected" });
    }

    // 💰 Cost Calculation
    const totalCost = data.totalCost;

    const captainShare = totalCost * 0.3;
    const staffShare = totalCost * 0.7;

    const perCaptain = captains.length > 0 ? captainShare / captains.length : 0;
    const perStaff = staff.length > 0 ? staffShare / staff.length : 0;

    const event = new Event({
      ...data,
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
      message: "Event created with assignment",
      event
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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

  } catch (error) {
    res.status(500).json({ error: error.message });
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
      .populate("captains", "name email")
      .populate("staff", "name email");

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
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
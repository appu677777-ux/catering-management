const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["marriage", "housewarming", "birthday", "other"],
    required: true
  },

  location: String,

  date: Date,

  totalPeople: Number,

  menu: [
    {
      name: String,
      price: Number
    }
  ],

  captains: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  staff: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  totalCost: Number,

  costDistribution: {
    captainShare: Number,
    staffShare: Number
  },

  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending"
  },
  earnings: {
  perCaptain: Number,
  perStaff: Number
},

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
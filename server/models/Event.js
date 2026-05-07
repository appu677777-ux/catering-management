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

  date: {
    type: Date,
    required: true,
  },
  time: {
    start: {
      type: String,
      required: true
    },

    end: {
      type: String,
      required: true
    }
  },

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
  images: [String],
  imageURLs: [String],

  costDistribution: {
    captain: {
      share: {
        type: Number,
        default: 800
      },
      bonus: {
        type: Number,
        default: 0
      },
      fine: {
        type: Number,
        default: 0
      },
      amountReceived: {
        type: Number,
        default: 0
      },
      due: {
        type: Number,
        default: 800
      }
    },

    staff: {
      share: {
        type: Number,
        default: 450
      },
      bonus: {
        type: Number,
        default: 0
      },
      fine: {
        type: Number,
        default: 0
      },
      amountReceived: {
        type: Number,
        default: 0
      },
      due: {
        type: Number,
        default: 450
      }
    }
  },
  slotCount: {
    captainSlot: {
      type: Number,
    },

    staffSlot: {
      type: Number,
    }
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
  rentalItems: [
    {
      name: String,
      quantity: Number,
      image: String,

      deliveryStatus: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending"
      },

      returnStatus: {
        type: String,
        enum: ["pending", "returned"],
        default: "pending"
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // ✅ FIX ADDED

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://appu677777-ux-catering-management.vercel.app" // your frontend
    ],
    credentials: true
  })
);
app.options("*", cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("API Running...");
});

const route = require("./routes/route");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/events", eventRoutes);
app.use("/api/auth", route);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

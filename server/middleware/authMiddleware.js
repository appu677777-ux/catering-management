const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.header("Authorization");

    if (!header) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // 🔥 Remove "Bearer "
    const token = header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : header;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message); // debug
    res.status(401).json({ message: "Invalid token" });
  }
};
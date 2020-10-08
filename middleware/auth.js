const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get Token From Header
  const token = req.header("x-auth-token");

  // Check if no Token
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization denied." });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not Valid" });
  }
};

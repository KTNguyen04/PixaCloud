const jwt = require("jsonwebtoken");
const config = require("../config/config");
module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("header", req.body);
  // console.log("header", req.headers);
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, config.authentication.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token." });
    }
    req.user = decoded;
    next();
  });
};

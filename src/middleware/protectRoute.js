const jwt = require('jsonwebtoken');
const isAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { isAuthenticate };

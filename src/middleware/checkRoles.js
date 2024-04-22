const User = require("../models/User");

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const userId = req.user.userID;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(500).json({ message: "User not found" });
      }

      const userRole = user.role;

      if (userRole === requiredRole) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient permissions" });
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return res.status(500).json({ message: "Error retrieving user data" });
    }
  };
};

module.exports = checkRole;

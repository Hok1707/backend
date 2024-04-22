const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtSecret = process.env.JWT_SECRET;
const logger = require("../config/logger");

const authController = {
  register: async (req, res) => {
    logger.info("Register User");
    const { username, password, email } = req.body;
    try {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        email,
        password: hashedPassword,
      });
      logger.info("Register successfully");
      res.status(200).json({
        message: "User created successfully",
      });
    } catch (error) {
      logger.error("Error signing user", error.errorResponse);
      res
        .status(500)
        .json({ message: "Failed to create user", error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 3) user.status = "INACTIVE";
        await user.save();
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const maxAge = 3 * 60 * 60;
      const accessToken = jwt.sign(
        { id: user._id, email, role: user.role },
        jwtSecret,
        { expiresIn: maxAge }
      );
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: maxAge * 1000,
      });
      user.loginAttempts = 0;
      await user.save();
      logger.info("Login successfully");
      res.status(200).json({
        message: "Login successful",
        // user: {
        //   _id: user._id,
        //   username: user.username,
        //   email: user.email,
        //   role: user.role,
        //   status: user.status,
        // },
        access_token: accessToken,
      });
    } catch (error) {
      logger.error(error.errorResponse);
      res.status(400).json({ message: "Login failed", error: error.message });
    }
  },
};

module.exports = authController;

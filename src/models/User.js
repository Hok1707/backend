const mongoose = require("mongoose");

const userStatusEnum = ["ACTIVE", "INACTIVE"];
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Invalid Username"],
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      unique: [true, "Email already exists in the system!!!"],
      lowercase: true,
      trim: true,
      required: [true, "Email not provided"],
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    role: {
      type: String,
      default: "USER",
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password not provided"],
    },
    loginAttempt: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: userStatusEnum,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;

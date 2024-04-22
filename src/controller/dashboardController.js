const logger = require("../config/logger");
const Transaction = require("../models/Transaction");
const UserModel = require("../models/User");

exports.getAllData = async (req, res) => {
  try {
    const userList = await UserModel.find().select("username email");
    const allTransaction = await Transaction.find()
      .select("-__v -createdAt -updatedAt")
      .populate({ path: "user", select: "email" });

    if (userList.length === 0 && allTransaction.length === 0) {
      res.status(500).json({
        message: "Data not found",
      });
    }
    logger.info("Get dashboard data successfully");
    res.status(200).json({
      message: "Get dashboard data successfully",
      listUser: userList,
      listTransaction: allTransaction,
    });
  } catch (error) {
    logger.error("Error getting dashboard data", { error: error.message });
    res.status(500).json({
      message: "Failed to get dashboard data",
    });
  }
};

const Transaction = require("../models/Transaction.js");
const logger = require("../config/logger");

exports.doTransaction = async (req, res) => {
  try {
    const { amount, description, category, type } = req.body;
    const userID = req.user.userID;

    const modifiedAmount = Math.abs(amount);

    if (modifiedAmount <= 0  || !description || !category || !type) {
      logger.error("Please provide all the details");
      return res
        .status(400)
        .json({ message: "Please provide all the details" });
    }

    const transaction = await Transaction.create({
      amount: modifiedAmount,
      description,
      category,
      type,
      user: userID,
      date: new Date(),
    });

    logger.info("Transaction created successfully", {
      transactionID: transaction._id,
    });
    res.status(200).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    logger.error("Error doing transaction", { error: error.message });
    res.status(500).json({
      message: "Failed to do transaction",
    });
  }
};

exports.getTransactionsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const transactions = await Transaction.find({
      date: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) },
    })
      .select("-__v -createdAt -updatedAt")
      .populate({ path: "user", select: "email" });
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found for this year",
      });
    }
  } catch (error) {
    logger.error("Error getting transactions by year", {
      error: error.message,
    });
    res.status(500).json({
      message: "Failed to get transactions by year",
    });
  }
};

exports.getTransactionsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    })
      .select("-__v -createdAt -updatedAt")
      .populate({ path: "user", select: "email" });
    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found for this month",
      });
    }
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    logger.error("Error getting transactions by month", {
      error: error.message,
    });
    res.status(500).json({
      message: "Failed to get transactions by month",
    });
  }
};

exports.getTransactionsByDay = async (req, res) => {
  try {
    const { year, month, day } = req.params;

    const startDate = new Date(`${year}-${month}-${day}`);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate },
    })
      .select("-__v -createdAt -updatedAt")
      .populate({ path: "user", select: "email" });

    const formattedTransactions = transactions.map((transaction) => ({
      ...transaction.toObject(),
      date: formatDate(transaction.date),
    }));
    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found for this day",
      });
    }
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: formattedTransactions,
    });
  } catch (error) {
    logger.error("Error getting transactions by day", { error: error.message });
    res.status(500).json({
      message: "Failed to get transactions by day",
    });
  }
};

exports.getUserTotalMoney = async (req, res) => {
  try {
    const userID = req.user.userID;

    const transactions = await Transaction.find({ user: userID }).select(
      "-__v -createdAt -updatedAt -user"
    );

    let totalIncome = 0;
    let totalOutcome = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "outcome") {
        totalOutcome += transaction.amount;
      }
    });

    const totalMoney = totalIncome - totalOutcome;

    if (totalIncome === 0) {
      return res.status(404).json({
        message: "No transaction found",
      });
    }
    res.status(200).json({
      message: "User total money retrieved successfully",
      data: {
        totalIncome,
        totalOutcome,
        totalMoney,
      },
      listTransaction: transactions,
    });
  } catch (error) {
    logger.error("Error getting user total money", { error: error.message });
    res.status(500).json({
      message: "Failed to get user total money",
    });
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

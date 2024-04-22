const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");
const isAuthenticate = require("../middleware/verifyToken");

router.post("/create", isAuthenticate, transactionController.doTransaction);

router.get("/year/:year", isAuthenticate, transactionController.getTransactionsByYear);

router.get("/month/:year/:month", isAuthenticate, transactionController.getTransactionsByMonth);

router.get("/day/:year/:month/:day", isAuthenticate, transactionController.getTransactionsByDay);

router.get("/total/amount", isAuthenticate,transactionController.getUserTotalMoney);

module.exports = router;

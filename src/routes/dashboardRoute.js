const express =require('express');
const router =express.Router();
const dashboardController =require("../controller/dashboardController");
const checkRoles = require("../middleware/checkRoles");
const isAuthenticate = require("../middleware/verifyToken");

router.get("", isAuthenticate,checkRoles('ADMIN'),dashboardController.getAllData);

module.exports = router;
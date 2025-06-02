const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance-controller");
const { isAuthenticated } = require("../middlewares/auth-middleware");

router.get("/", isAuthenticated, attendanceController.getAttendancePage);
router.get("/export", isAuthenticated, attendanceController.exportAttendance);

module.exports = router;

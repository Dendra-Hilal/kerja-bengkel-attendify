const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student-controller");
const { isAuthenticated } = require("../middlewares/auth-middleware");

router.get("/", isAuthenticated, studentController.getStudentPage);
router.get("/edit/:id", isAuthenticated, studentController.getEditPage);
router.post("/update/:id", isAuthenticated, studentController.postEditStudent);
router.get("/delete/:id", isAuthenticated, studentController.deleteStudentData);

module.exports = router;

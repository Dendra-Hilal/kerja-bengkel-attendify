const express = require("express");
const router = express.Router();
const managementController = require("../controllers/management-controller");
const { authorizeRoles } = require("../middlewares/auth-middleware");

router.get("/", authorizeRoles("admin"), managementController.getManagementPage);
router.get("/register", authorizeRoles("admin"), managementController.getRegisterPage);
router.post("/register", authorizeRoles("admin"), managementController.postRegisterUser);
router.get("/edit/:id", authorizeRoles("admin"), managementController.getEditPage);
router.post("/edit/:id", authorizeRoles("admin"), managementController.postEditUser);
router.get("/delete/:id", authorizeRoles("admin"), managementController.deleteUser);

module.exports = router;

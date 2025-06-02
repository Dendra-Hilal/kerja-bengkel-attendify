const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card-controller");
const { authorizeRoles } = require("../middlewares/auth-middleware");

router.get("/", authorizeRoles("admin"), cardController.getCardPage);
router.post("/register", authorizeRoles("admin"), cardController.postRegisterCard);

module.exports = router;

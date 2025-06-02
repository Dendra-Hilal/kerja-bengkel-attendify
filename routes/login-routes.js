const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login-controller");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", loginController.getLoginPage);
router.post("/login", loginController.getLogin);
router.get("/logout", loginController.getLogout);

module.exports = router;

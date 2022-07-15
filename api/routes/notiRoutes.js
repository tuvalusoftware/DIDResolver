const express = require("express");
const authController = require("../controllers/authController");
const notiController = require("../controllers/notiController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.post("/noti", notiController.createNotification);

module.exports = router;
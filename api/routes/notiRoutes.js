const express = require("express");
const authController = require("../controllers/authController");
const notiController = require("../controllers/notiController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.post("/noti", notiController.createNotification);
router.put("/noti", notiController.changeNotificationStatus);
router.delete("/noti", notiController.revokeNotification);

module.exports = router;

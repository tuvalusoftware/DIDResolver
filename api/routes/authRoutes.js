const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.get("/auth/public-key", authController.requestGetPublicKeyFromAddress);
router.get('/auth/verify', authController.verifyToken);

module.exports = router;

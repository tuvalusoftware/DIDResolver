const express = require("express");
const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.get("/", documentController.getDIDDocument);
router.post("/", documentController.createDIDDocument);

module.exports = router;

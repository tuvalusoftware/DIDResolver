const express = require("express");
const authController = require("../controllers/authController");
const didController = require("../controllers/didController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.get("/did", didController.retrieveUserDid);
router.get("/did/all", didController.retrieveAllUsersDid);

module.exports = router;

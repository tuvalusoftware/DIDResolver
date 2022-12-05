const express = require("express");
const credentialController = require("../controllers/credentialController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.post("/", credentialController.createCredential);
router.get("/", credentialController.getCredential);
router.put("/", credentialController.updateCredential);

module.exports = router;

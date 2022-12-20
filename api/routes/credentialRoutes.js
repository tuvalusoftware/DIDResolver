const express = require("express");
const credentialController = require("../controllers/cardano/credentialController");
const authController = require("../controllers/cardano/authController");

// * Algorand credential controllers
const algorandCredentialController = require('../controllers/algorand/credentialController');
const router = express.Router();

router.use(authController.ensureAuthenticated);

// * Cardano networks
router.post("/", credentialController.createCredential);
router.get("/", credentialController.getCredential);
router.put("/", credentialController.updateCredential);

// * Algorand networks
router.post('/v2/', algorandCredentialController.createCredential)

module.exports = router;

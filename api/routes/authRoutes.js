const express = require("express");

// * Cardano controllers
const authController = require("../controllers/cardano/authController");

// * Algorand controllers
const algorandAuthController = require("../controllers/algorand/authController");

const router = express.Router();

// * V1 ( Cardano network supported )
router.get("/public-key", authController.requestGetPublicKeyFromAddress);
router.get("/public-key/v2", algorandAuthController.verifyAlgorandAddress);
router.get("/verify", authController.verifyToken);

// * V2 ( Algorand network supported )
router.get("/v2/verify", algorandAuthController.verifyToken);

module.exports = router;

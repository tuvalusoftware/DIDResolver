import express from "express";

// * Cardano controllers
import authController from "../controllers/cardano/authController.js";

// * Algorand controllers
import algorandAuthController from "../controllers/algorand/authController.js";

const router = express.Router();

// * V1 ( Cardano network supported )
router.get("/public-key", authController.requestGetPublicKeyFromAddress);
router.get("/public-key/v2", algorandAuthController.verifyAlgorandAddress);
router.get("/verify", authController.verifyToken);

// * V2 ( Algorand network supported )
router.get("/v2/verify", algorandAuthController.verifyToken);

export default router;

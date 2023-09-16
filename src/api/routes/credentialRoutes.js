import express from "express";
import credentialController from "../controllers/cardano/credentialController.js";
import authController from "../controllers/cardano/authController.js";

// * Algorand credential controllers
import algorandCredentialController from "../controllers/algorand/credentialController.js";
const router = express.Router();

router.use(authController.ensureAuthenticated);

// * Cardano networks
router.post("/", credentialController.createCredential);
router.get("/", credentialController.getCredential);
router.put("/", credentialController.updateCredential);

// * Algorand networks
router.post("/v2/", algorandCredentialController.createCredential);

export default router;

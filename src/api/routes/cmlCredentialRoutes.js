import express from "express";
import cmlCredentialController from "../controllers/credentialController.js";
const router = express.Router();

router.route("").post(cmlCredentialController.createCredential);
router.route("/:credentialHash").get(cmlCredentialController.getCredential);
router
  .route("/all/:contractId")
  .get(cmlCredentialController.getCredentialsOfContract);

export default router;

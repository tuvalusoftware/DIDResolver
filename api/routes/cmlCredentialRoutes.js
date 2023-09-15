import express from "express";
import cmlCredentialController from "../controllers/credential/credential.js";
const router = express.Router();

router.post("", cmlCredentialController.createCredential);
router.get("/:credentialHash", cmlCredentialController.getCredential);
router.get(
  "/all/:contractId",
  cmlCredentialController.getCredentialsOfContract
);

export default router;

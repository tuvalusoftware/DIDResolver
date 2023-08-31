import express from "express";
import cmlCredentialController from "../controllers/credential/credential.js";
const router = express.Router();

router.post("", cmlCredentialController.createCredential);

export default router;

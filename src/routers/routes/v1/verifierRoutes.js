import express from "express";
import verifierController from "../../controllers/v1/verifierController.js";

const router = express.Router();

router.post("/certificate", verifierController.verifyCertificate);
router.post("/credential", verifierController.verifyVerifiableCredential);

export default router;

import express from "express";
import documentController from "../controllers/documentController.js";

const router = express.Router();

router.post("", documentController.createDocument);
router.post("/testing", documentController.createDocument);
router.post("/revoke", documentController.revokeDocument);
router.post("/hash", documentController.hashDocument);
router.post("/lastest-version", documentController.checkLastestVersion);
router.post("/plot-certificate", documentController.createPlotCertification);
router.put("/plot-certificate", documentController.updatePlotCertification);
router.get(
  "/endorsement/:did",
  documentController.getEndorsementChainOfCertificate
);

export default router;

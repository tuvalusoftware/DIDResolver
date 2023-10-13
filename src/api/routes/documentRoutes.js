import express from "express";
import documentController from "../controllers/documentController.js";

const router = express.Router();
router.post(
    "/certificate/add-claimant",
    documentController.addClaimantToCertificate
);
router.route("/hash").post(documentController.hashDocument);
router.route("/lastest-version").post(documentController.checkLastestVersion);
router
    .route("/certificate")
    .post(documentController.createPlotCertification)
    .put(documentController.updatePlotCertification)
    .delete(documentController.revokePlotCertification);
router.get(
    "/endorsement/:did",
    documentController.getEndorsementChainOfCertificate
);
router.get("/:did", documentController.getDocument);

export default router;

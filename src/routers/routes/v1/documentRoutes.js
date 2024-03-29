import express from "express";
import documentController from "../../controllers/v1/documentController.js";

const router = express.Router();
router.post(
    "/certificate/add-claimant",
    documentController.addClaimantToCertificate
);
router.route("/lastest-version").post(documentController.checkLastestVersion);
router
    .route("/certificate")
    .post(documentController.createPlotCertification)
    .put(documentController.updatePlotCertification)
    .delete(documentController.revokePlotCertification);
router.get("/:did", documentController.getDocument);

export default router;

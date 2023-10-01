import express from "express";
import documentController from "../controllers/documentController.js";

const router = express.Router();

router
  .route("")
  .post(documentController.createDocument)
  .put(documentController.updateDocument);
router.route("/testing").post(documentController.createDocument);
router.route("/revoke").post(documentController.revokeDocument);
router.route("/hash").post(documentController.hashDocument);
router
  .route("/lastest-version")
  .post(documentController.checkLastestVersion)
  .get(documentController.getLastestVersion);
router
  .route("/plot-certificate/:did")
  .post(documentController.createPlotCertification)
  .put(documentController.updatePlotCertification)
  .get(documentController.getPlotCertification);
router.get(
  "/endorsement/:did",
  documentController.getEndorsementChainOfCertificate
);
router.get("/qrcode-verify", documentController.verifyCertificateQrCode);
router.get("/:did", documentController.getDocument);

export default router;

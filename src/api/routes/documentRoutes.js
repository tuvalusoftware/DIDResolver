import express from "express";
import documentController from "../controllers/documentController.js";

const router = express.Router();

router.route("").post(documentController.createDocument);
router.route("/testing").post(documentController.createDocument);
router.route("/revoke").post(documentController.revokeDocument);
router.route("/hash").post(documentController.hashDocument);
router.route("/lastest-version").post(documentController.checkLastestVersion);
router
  .route("/plot-certificate")
  .post(documentController.createPlotCertification)
  .put(documentController.updatePlotCertification);
router
  .route("/endorsement/:did")
  .get(documentController.getEndorsementChainOfCertificate);
router.route("/qrcode-verify").get(documentController.verifyCertificateQrCode);

export default router;

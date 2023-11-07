import express from "express";
import documentController from "../../controllers/v2/documentController.js";

const router = express.Router();
router.route("/certificate").post(documentController.createPlotCertification);

export default router;

import express from "express";
import pdfController from "../controllers/pdf/pdfController.js";

const router = express.Router();
router.post("", pdfController.savePdfFile);
router.get("", pdfController.readPdfFile);
router.post('/verify', pdfController.verifyPdfFile);

export default router;

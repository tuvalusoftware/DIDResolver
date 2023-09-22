import express from "express";
import multer from "multer";
import pdfController from "../controllers/pdfController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.post("", pdfController.savePdfFile);
router.get("/:did", pdfController.getPdf);
router.post("/verify", pdfController.verifyPdfFile);
router.post(
  "/upload-verify",
  upload.single("file"),
  pdfController.verifyUploadedPdf
);

// * Phase 4
router.post("/v2", pdfController.verifyPdfFileV2);

export default router;

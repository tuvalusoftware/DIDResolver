import express from "express";
import multer from "multer";
import pdfController from "../controllers/pdf/pdfController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.post("", pdfController.savePdfFile);
router.get("", pdfController.readPdfFile);
router.post("/verify", pdfController.verifyPdfFile);
router.post(
  "/upload-verify",
  upload.single("file"),
  pdfController.verifyUploadedPdf
);

export default router;

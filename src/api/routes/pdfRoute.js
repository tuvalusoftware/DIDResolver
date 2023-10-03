import express from "express";
import multer from "multer";
import pdfController from "../controllers/pdfController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.route("/").post(pdfController.savePdfFile);
router.route("/:did").get(pdfController.getPdf);
router.route("/verify").post(pdfController.verifyPdfFile);
router
  .route("/upload-verify")
  .post(upload.single("file"), pdfController.verifyUploadedPdf);
router.route("/v2").post(pdfController.verifyPdfFileV2);

export default router;

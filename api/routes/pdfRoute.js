import express from "express";
import pdfController from "../controllers/pdf/pdfController.js";

const router = express.Router();
router.post("", pdfController.savePdfFile);
router.post("/upload", pdfController.savePdfToDatabase);

export default router;

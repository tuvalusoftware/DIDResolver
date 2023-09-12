import express from "express";
import multer from "multer";
import documentController from "../controllers/document/documentController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.get("", documentController.getContract);
router.post("", documentController.createContract);
router.post(
  "/verify",
  upload.single("file"),
  documentController.verifyContract
);

export default router;

import express from "express";
import documentController from "../controllers/document/documentController.js";

const router = express.Router();

router.post("", documentController.createDocument);
router.post("/revoke", documentController.revokeDocument);
router.post("/multiple", documentController.multipleDocumentSigning);

export default router;

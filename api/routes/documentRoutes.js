import express from "express";
import documentController from "../controllers/document/documentController.js";

const router = express.Router();

router.post('', documentController.createDocument);

export default router;
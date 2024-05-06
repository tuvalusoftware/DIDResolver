import express from "express";
import documentController from "../controllers/document.controller.js";

const router = express.Router();

router.route("/").post(documentController.createDocument);

export default router;
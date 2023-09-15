import express from "express";
import documentController from "../controllers/document/documentController.js";

const router = express.Router();

router.post("", documentController.createDocument);
router.post("/testing", documentController.createDocument);
router.post("/revoke", documentController.revokeDocument);
router.post("/hash", documentController.hashDocument);
router.post("/block", documentController.blockContract);
router.post("/check-block", documentController.checkBlockContractStatus);

export default router;

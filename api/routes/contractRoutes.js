import express from 'express';
import documentController from "../controllers/document/documentController.js";

const router = express.Router();

router.post('', documentController.createContract);
router.post('/verify', documentController.verifyContract);

export default router;
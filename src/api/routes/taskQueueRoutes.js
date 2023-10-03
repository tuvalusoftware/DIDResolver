import express from "express";
import taskQueueController from "../controllers/taskQueueController.js";

const router = express.Router();

router.post("/revoke", taskQueueController.revokeDocument);
router.post("/create", taskQueueController.createDocument);
router.post("/plot-mint", taskQueueController.createPlotDocument);
router.post(
  "/claimant-credential",
  taskQueueController.createClaimantCredential
);

export default router;

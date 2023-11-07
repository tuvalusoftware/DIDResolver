import express from "express";
import taskQueueController from "../../controllers/v1/taskQueueController.js";

const router = express.Router();

router.post("/revoke", taskQueueController.revokeDocument);
router.post("/create", taskQueueController.createDocument);
router.post("/plot-mint", taskQueueController.createPlotDocument);
router.put("/plot-mint", taskQueueController.updatePlotDocument);
router.post("/add-claimant", taskQueueController.addClaimant);
router.post(
    "/claimant-credential",
    taskQueueController.createClaimantCredential
);
router.post(
    "/credential-policy",
    taskQueueController.createClaimantCredentialWithPolicyId
);

export default router;

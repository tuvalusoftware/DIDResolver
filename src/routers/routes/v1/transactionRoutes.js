import express from "express";
import transactionController from "../../controllers/v1/transactionController.js";

const router = express.Router();

router
    .route("/did-to-transaction")
    .post(transactionController.getTransactionIdByDid);

export default router;

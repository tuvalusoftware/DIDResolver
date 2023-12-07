import express from "express";
import contractController from "../../controllers/v2/contractController.js";

const router = express.Router();

router.post("/", contractController.createContract);

export default router;

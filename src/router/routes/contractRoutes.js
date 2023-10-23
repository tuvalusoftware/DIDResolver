import express from "express";
import multer from "multer";
import contractController from "../controllers/contractController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/claimant", contractController.getClaimantContract);
router.post("/", contractController.createContract);
router.get("/:did", contractController.getContract);
router.put("/", contractController.updateContract);
router.post("/sign", contractController.signContract);

export default router;

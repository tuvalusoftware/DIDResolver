import express from "express";
import contractController from "../../controllers/v1/contractController.js";

const router = express.Router();

router.post("/", contractController.createContract);
router.get("/:did", contractController.getContract);
router.put("/", contractController.updateContract);
router.post("/sign", contractController.signContract);

export default router;

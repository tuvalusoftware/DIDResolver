import express from "express";
import multer from "multer";
import contractController from "../controllers/contractController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", contractController.createContract);
router.get("/:did", contractController.getContract);

export default router;

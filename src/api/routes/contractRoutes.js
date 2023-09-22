import express from "express";
import multer from "multer";
import contractController from "../controllers/contract/contractController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.get("", contractController.getContract);
router.post("", contractController.createContract);
router.post("/block", contractController.blockContract);
router.post("/check-block", contractController.checkBlockContractStatus);
router.post(
  "/verify",
  upload.single("file"),
  contractController.verifyContract
);

export default router;

import express from "express";
import multer from "multer";
import contractController from "../controllers/contractController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router
  .route("")
  .get(contractController.getContract)
  .post(contractController.createContract);
router.route("/isLocked").get(contractController.getLockedStatus);
router
  .route("/lock-contract")
  .post(contractController.assignCredentialToContract)
  .delete(contractController.unlockCertificateFromContract);
router
  .route("/verify")
  .post(upload.single("file"), contractController.verifyContract);

export default router;

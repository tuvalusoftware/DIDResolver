import express from "express";
import authController from "../controllers/cardano/authController.js";
import didController from "../controllers/cardano/didController.js";
const router = express.Router();

router.use(authController.ensureAuthenticated);
router.get("", didController.retrieveUserDid);
router.post("", didController.createUserDid);
router.put("", didController.updateUserDid);
router.delete("", didController.deleteUserDid);
router.get("/all", didController.retrieveAllUsersDid);

export default router;

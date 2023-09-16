import express from "express";
import userController from "../controllers/user/userController.js";

const router = express.Router();

router.get('', userController.getUserDid)

export default router;

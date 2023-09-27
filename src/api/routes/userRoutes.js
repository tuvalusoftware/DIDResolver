import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.route("").get(userController.getUserDid);

export default router;

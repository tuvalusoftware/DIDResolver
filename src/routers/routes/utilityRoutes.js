import express from "express";
import utilityController from "../controllers/utilityController.js";

const router = express.Router();

router.route("/unsalt").post(utilityController.unsaltData);

export default router;

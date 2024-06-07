import express from "express";
import didController from "../controllers/did.controller.js";

const router = express.Router();

router.route("/").post(didController.createDid);

export default router;

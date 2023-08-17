import express from "express";
import commonlandsController from "../controllers/commonlands/plotController.js";
const router = express.Router();

router.get("", commonlandsController.getPlotDetailByPlotId);
router.get("/seedPhrase", commonlandsController.getSeedPhrase);

export default router;

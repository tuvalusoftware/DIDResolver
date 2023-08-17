import express from "express";
import accessTokenController from "../controllers/cardano/accessTokenController.js";
const router = express.Router();

router
  .route("/")
  .post(accessTokenController.setCookie)
  .delete(accessTokenController.clearCookie);

export default router;

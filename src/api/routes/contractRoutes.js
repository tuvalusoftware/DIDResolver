import express from "express";
import multer from "multer";
import contractController from "../controllers/contractController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

export default router;

import express from "express";
import {
  createMonografi,
  getAllMonografi,
} from "../controllers/monografi.controller.js";

const router = express.Router();

router.get("/", getAllMonografi);
router.post("/", createMonografi);

export default router;

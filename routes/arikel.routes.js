import express from "express";
import {
  createArtikel,
  getAllArtikel,
} from "../controllers/artikel.controller.js";

const router = express.Router();

router.get("/", getAllArtikel);
router.post("/", createArtikel);

export default router;

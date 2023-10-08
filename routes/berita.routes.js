import express from "express";

import {
  createBerita,
  deleteBerita,
  getAllBerita,
  getBeritaById,
  updateBerita,
} from "../controllers/berita.controller.js";

const router = express.Router();

router.get("/", getAllBerita);
router.get("/:id", getBeritaById);
router.post("/", createBerita);
router.post("/:id", updateBerita);
router.delete("/:id", deleteBerita);

export default router;

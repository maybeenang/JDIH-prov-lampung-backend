import express from "express";
import authJwt from "../middleware/authJwt.js";
import {
  createBerita,
  deleteBerita,
  getAllBerita,
  getBeritaById,
  updateBerita,
} from "../controllers/berita.controller.js";

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Credentials",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", getAllBerita);
router.get("/:id", getBeritaById);
router.post("/", authJwt.verifyToken, createBerita);
router.post("/:id", authJwt.verifyToken, updateBerita);
router.delete("/:id", authJwt.verifyToken, deleteBerita);

export default router;

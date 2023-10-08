import express from "express";
import {
  createGalery,
  getAllGalery,
} from "../controllers/galery.controller.js";

const router = express.Router();

router.get("/", getAllGalery);
router.post("/", createGalery);

export default router;

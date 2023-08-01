import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/berita", (req, res) => {
  res.send("Hello Berita");
});

export default router;

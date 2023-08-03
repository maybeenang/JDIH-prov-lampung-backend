import express from "express";
import authJwt from "../middleware/authJwt.js";

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Credentials",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", [authJwt.verifyToken], (req, res) => {
  console.log(req.session);
  return res.status(200).send({
    message: "Welcome to the API!",
  });
});

export default router;

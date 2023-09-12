import authController from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );

  next();
});

router.post(
  "/signup",
  authController.signUp
);

router.post("/signin", authController.signIn);
router.post("/refresh", authController.refreshToken);
router.post("/signout", authController.signOut);

export default router;

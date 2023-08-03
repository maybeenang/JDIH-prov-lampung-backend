import verifySignUp from "../middleware/verifySignUp.js";
import authController from "../controllers/auth.controller.js";
import authJwt from "../middleware/authJwt.js";
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
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signUp
);

router.post("/signin", authController.signIn);
router.post("/refresh", authController.refreshToken);
router.post("/signout", authController.signOut);

export default router;

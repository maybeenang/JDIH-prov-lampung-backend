import verifySignUp from "../middleware/verifySignUp.js";
import authController from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );

  next();
});

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signUp
);

router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);

export default router;

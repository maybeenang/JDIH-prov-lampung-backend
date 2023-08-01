import express from "express";
import userController from "../controllers/user.controller.js";
import authJwt from "../middleware/authJwt.js";

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", userController.publicAccess);
router.get("/user", [authJwt.verifyToken], userController.userAccess);
router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.adminAccess
);

export default router;

import authJwt from "../middleware/authJwt.js";
import {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} from "../controllers/user.controller.js";

export const userRoutes = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/test/all", allAccess);

  app.get("/test/user", [authJwt.verifyToken], userBoard);

  app.get(
    "/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    moderatorBoard
  );

  app.get("/test/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
};

import verifySignUp from "../middleware/verifySignUp.js";
import { signup, signin, signout } from "../controllers/auth.controller.js";

export const authRoutes = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    signup
  );

  app.post("/auth/signin", signin);

  app.get("/auth/signout", signout);
};

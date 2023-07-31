import { authRoutes } from "./auth.routes.js";
import { userRoutes } from "./user.routes.js";

export const routes = (app) => {
  authRoutes(app);
  userRoutes(app);
};

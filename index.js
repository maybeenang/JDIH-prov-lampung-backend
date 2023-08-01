import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";

import beritaRoutes from "./routes/berita.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

import db from "./models/index.js";

// const init = async () => {
//   try {
//     await db.sequelize.authenticate();
//     console.log("Connection has been established successfully");

//     const Role = db.role;
//     await db.sequelize.sync({ force: true });
//     await Role.create({
//       id: 1,
//       name: "user",
//     });
//     await Role.create({
//       id: 2,
//       name: "admin",
//     });

//     console.log("Drop and re-sync db.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error.message);
//   }
// };

// init();

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
);

app.use("/berita", beritaRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {
  res.status(404).send("<h1>404, Page Not Found!</h1>");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
